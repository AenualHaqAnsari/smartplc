import path from "node:path";
import { createReadStream } from "node:fs";
import { mkdir, stat, unlink, writeFile } from "node:fs/promises";
import { Readable } from "node:stream";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { getProductImageStorageRoot } from "@/lib/product-image-storage";
import { revalidatePath } from "next/cache";

export const runtime = "nodejs";

const MAX_VIDEO_SIZE = 100 * 1024 * 1024;
const videoFormats = {
  "video/mp4": { extension: ".mp4", contentType: "video/mp4" },
  "video/webm": { extension: ".webm", contentType: "video/webm" },
} as const;

function safeTitle(value: FormDataEntryValue | unknown): string | null {
  if (typeof value !== "string") return null;
  const title = value.replace(/[\u0000-\u001f\u007f]/g, "").trim().slice(0, 200);
  return title || null;
}

function validSignature(bytes: Buffer, mimeType: string): boolean {
  if (mimeType === "video/mp4") return bytes.length >= 12 && bytes.subarray(4, 8).toString("ascii") === "ftyp";
  return bytes.length >= 4 && bytes.subarray(0, 4).equals(Buffer.from([0x1a, 0x45, 0xdf, 0xa3]));
}

function revalidateProduct(slug: string) {
  revalidatePath("/", "page");
  revalidatePath("/products", "page");
  revalidatePath(`/products/${slug}`, "page");
  revalidatePath("/products/category/[slug]", "page");
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: productId } = await params;
  const fileName = new URL(request.url).searchParams.get("file") ?? "";
  if (!/^[a-zA-Z0-9_-]{1,100}$/.test(productId) || !/^\d+-[0-9a-f-]{36}\.(mp4|webm)$/.test(fileName)) return new Response("Not found", { status: 404 });
  const videoUrl = `/api/admin/products/${productId}/videos?file=${encodeURIComponent(fileName)}`;
  const video = await prisma.productVideo.findFirst({ where: { productId, url: videoUrl }, select: { id: true } });
  if (!video) return new Response("Not found", { status: 404 });

  const videoRoot = path.resolve(getProductImageStorageRoot(), productId, "videos");
  const filePath = path.resolve(videoRoot, fileName);
  if (!filePath.startsWith(`${videoRoot}${path.sep}`)) return new Response("Not found", { status: 404 });
  try {
    const fileStat = await stat(filePath);
    if (!fileStat.isFile()) return new Response("Not found", { status: 404 });
    const headers = new Headers({
      "Content-Type": fileName.endsWith(".webm") ? "video/webm" : "video/mp4",
      "Accept-Ranges": "bytes",
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    });
    const rangeHeader = request.headers.get("range");
    if (rangeHeader) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(rangeHeader.trim());
      if (!match || (!match[1] && !match[2])) {
        headers.set("Content-Range", `bytes */${fileStat.size}`);
        return new Response(null, { status: 416, headers });
      }
      let start: number;
      let end: number;
      if (!match[1]) {
        const suffixLength = Number(match[2]);
        if (!Number.isSafeInteger(suffixLength) || suffixLength <= 0) {
          headers.set("Content-Range", `bytes */${fileStat.size}`);
          return new Response(null, { status: 416, headers });
        }
        start = Math.max(0, fileStat.size - suffixLength);
        end = fileStat.size - 1;
      } else {
        start = Number(match[1]);
        end = match[2] ? Number(match[2]) : fileStat.size - 1;
      }
      if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start >= fileStat.size || end < start) {
        headers.set("Content-Range", `bytes */${fileStat.size}`);
        return new Response(null, { status: 416, headers });
      }
      end = Math.min(end, fileStat.size - 1);
      headers.set("Content-Length", String(end - start + 1));
      headers.set("Content-Range", `bytes ${start}-${end}/${fileStat.size}`);
      return new Response(Readable.toWeb(createReadStream(filePath, { start, end })) as ReadableStream, { status: 206, headers });
    }
    headers.set("Content-Length", String(fileStat.size));
    return new Response(Readable.toWeb(createReadStream(filePath)) as ReadableStream, { status: 200, headers });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return Response.json({ error: "Unauthorized." }, { status: 401 });
  const declaredLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_VIDEO_SIZE + 1024 * 1024) {
    return Response.json({ error: "Video must be no more than 100 MB." }, { status: 413 });
  }
  const { id: productId } = await params;
  if (!/^[a-zA-Z0-9_-]{1,100}$/.test(productId)) return Response.json({ error: "Invalid product ID." }, { status: 400 });
  const product = await prisma.product.findUnique({ where: { id: productId }, select: { slug: true } });
  if (!product) return Response.json({ error: "Product not found." }, { status: 404 });
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) return Response.json({ error: "Please select a video file." }, { status: 400 });
    if (!Object.hasOwn(videoFormats, file.type)) return Response.json({ error: "Only MP4 and WebM videos are supported." }, { status: 400 });
    if (file.size <= 0 || file.size > MAX_VIDEO_SIZE) return Response.json({ error: "Video must be larger than 0 bytes and no more than 100 MB." }, { status: 400 });
    const mimeType = file.type as keyof typeof videoFormats;
    const bytes = Buffer.from(await file.arrayBuffer());
    if (!validSignature(bytes, mimeType)) return Response.json({ error: "The video content does not match its declared format." }, { status: 400 });

    const uploadDir = path.join(getProductImageStorageRoot(), productId, "videos");
    await mkdir(uploadDir, { recursive: true });
    const fileName = `${Date.now()}-${crypto.randomUUID()}${videoFormats[mimeType].extension}`;
    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, bytes, { flag: "wx" });
    const url = `/api/admin/products/${productId}/videos?file=${encodeURIComponent(fileName)}`;
    try {
      const sortOrder = await prisma.productVideo.count({ where: { productId } });
      const video = await prisma.productVideo.create({ data: { productId, url, title: safeTitle(formData.get("title")), sortOrder } });
      revalidateProduct(product.slug);
      return Response.json({ success: true, video, size: file.size, contentType: videoFormats[mimeType].contentType }, { status: 201 });
    } catch (error) {
      await unlink(filePath).catch(() => undefined);
      throw error;
    }
  } catch (error) {
    console.error("ADMIN PRODUCT VIDEO UPLOAD ERROR:", error);
    return Response.json({ error: "Unable to upload video." }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return Response.json({ error: "Unauthorized." }, { status: 401 });
  const { id: productId } = await params;
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object") return Response.json({ error: "Invalid request." }, { status: 400 });
    const values = body as { videoId?: unknown; title?: unknown; sortOrder?: unknown };
    const videoId = typeof values.videoId === "string" ? values.videoId.trim() : "";
    if (!/^[a-zA-Z0-9_-]{1,100}$/.test(videoId)) return Response.json({ error: "Valid video ID is required." }, { status: 400 });
    if (values.title === undefined && values.sortOrder === undefined) return Response.json({ error: "A title or sort order is required." }, { status: 400 });
    const existing = await prisma.productVideo.findFirst({ where: { id: videoId, productId }, include: { product: { select: { slug: true } } } });
    if (!existing) return Response.json({ error: "Video not found." }, { status: 404 });
    let sortOrder: number | undefined;
    if (values.sortOrder !== undefined) {
      sortOrder = Number(values.sortOrder);
      if (!Number.isSafeInteger(sortOrder) || sortOrder < 0) return Response.json({ error: "Sort order must be a non-negative whole number." }, { status: 400 });
    }
    if (values.title !== undefined && values.title !== null && typeof values.title !== "string") return Response.json({ error: "Title must be text." }, { status: 400 });
    const video = await prisma.productVideo.update({ where: { id: videoId }, data: {
      ...(values.title !== undefined ? { title: safeTitle(values.title) } : {}),
      ...(sortOrder !== undefined ? { sortOrder } : {}),
    } });
    revalidateProduct(existing.product.slug);
    return Response.json({ success: true, video });
  } catch (error) {
    console.error("ADMIN PRODUCT VIDEO UPDATE ERROR:", error);
    return Response.json({ error: "Unable to update video." }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return Response.json({ error: "Unauthorized." }, { status: 401 });
  const { id: productId } = await params;
  const videoId = new URL(request.url).searchParams.get("videoId") ?? "";
  if (!/^[a-zA-Z0-9_-]{1,100}$/.test(productId) || !/^[a-zA-Z0-9_-]{1,100}$/.test(videoId)) return Response.json({ error: "Valid product and video IDs are required." }, { status: 400 });
  const video = await prisma.productVideo.findFirst({ where: { id: videoId, productId }, include: { product: { select: { slug: true } } } });
  if (!video) return Response.json({ error: "Video not found." }, { status: 404 });
  await prisma.productVideo.delete({ where: { id: video.id } });
  const fileName = new URL(video.url, "http://local").searchParams.get("file") ?? "";
  if (/^\d+-[0-9a-f-]{36}\.(mp4|webm)$/.test(fileName)) {
    const root = path.resolve(getProductImageStorageRoot(), productId, "videos");
    const filePath = path.resolve(root, fileName);
    if (filePath.startsWith(`${root}${path.sep}`)) {
      await unlink(filePath).catch((error: NodeJS.ErrnoException) => {
        if (error.code !== "ENOENT") console.error("PRODUCT VIDEO FILE CLEANUP FAILED", { productId, videoId, code: error.code });
      });
    }
  }
  revalidateProduct(video.product.slug);
  return Response.json({ success: true });
}
