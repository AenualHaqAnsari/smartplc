import path from "path";
import { mkdir, writeFile } from "fs/promises";
import sharp from "sharp";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function POST(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const authenticated = await requireAdmin();

    if (!authenticated) {
      return Response.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const { id: productId } = await params;

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return Response.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const altTextValue = formData.get("altText");
    const altText =
      altTextValue
        ? String(altTextValue).trim()
        : null;

    if (!(file instanceof File)) {
      return Response.json(
        { error: "Please select an image file." },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return Response.json(
        { error: "Only image files are allowed." },
        { status: 400 }
      );
    }

    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      return Response.json(
        { error: "Image must be smaller than 10 MB." },
        { status: 400 }
      );
    }

    const bytes = Buffer.from(
      await file.arrayBuffer()
    );

    /*
     * IMPORTANT:
     * Do not trust the uploaded filename extension.
     *
     * Browsers and image applications can upload modern formats
     * such as WebP or AVIF while keeping a .jpg/.jpeg filename.
     *
     * Sharp detects the actual image format from the file contents.
     */
    let metadata;

    try {
      metadata = await sharp(bytes).metadata();
    } catch (error) {
      console.error(
        "IMAGE FORMAT DETECTION ERROR:",
        error
      );

      return Response.json(
        {
          error:
            "The uploaded file is not a valid or supported image.",
        },
        { status: 400 }
      );
    }

    let detectedFormatKey: string = metadata.format;

    // Sharp/libvips reports AVIF files as "heif".
    // Check the actual ISO-BMFF file signature so genuine AVIF
    // files are accepted without accepting arbitrary HEIF files.
    if (metadata.format === "heif") {
      const isAvif =
        bytes.length >= 12 &&
        bytes.subarray(4, 8).toString("ascii") === "ftyp" &&
        bytes.subarray(8, 12).toString("ascii") === "avif";

      if (isAvif) {
        detectedFormatKey = "avif";
      }
    }

    const formatMap: Record<
      string,
      {
        extension: string;
        mimeType: string;
      }
    > = {
      jpeg: {
        extension: ".jpg",
        mimeType: "image/jpeg",
      },
      png: {
        extension: ".png",
        mimeType: "image/png",
      },
      webp: {
        extension: ".webp",
        mimeType: "image/webp",
      },
      avif: {
        extension: ".avif",
        mimeType: "image/avif",
      },
      gif: {
        extension: ".gif",
        mimeType: "image/gif",
      },
    };

    const detectedFormat =
      formatMap[detectedFormatKey];

    if (!detectedFormat) {
      return Response.json(
        {
          error:
            "Unsupported image format. Please use JPG, PNG, WebP, AVIF, or GIF.",
        },
        { status: 400 }
      );
    }

    const imageCount =
      await prisma.productImage.count({
        where: { productId },
      });

    const uploadDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "products",
      productId
    );

    await mkdir(uploadDir, {
      recursive: true,
    });

    const fileName =
      `${Date.now()}-${crypto.randomUUID()}${detectedFormat.extension}`;

    const filePath = path.join(
      uploadDir,
      fileName
    );

    await writeFile(
      filePath,
      bytes
    );

    const url =
      `/uploads/products/${productId}/${fileName}`;

    const image =
      await prisma.$transaction(
        async (tx) => {
          const shouldBePrimary =
            imageCount === 0;

          if (shouldBePrimary) {
            await tx.productImage.updateMany({
              where: { productId },
              data: { isPrimary: false },
            });
          }

          return tx.productImage.create({
            data: {
              url,
              altText,
              sortOrder: imageCount,
              isPrimary: shouldBePrimary,
              productId,
            },
          });
        }
      );

    console.log(
      `ADMIN IMAGE UPLOAD: detected=${detectedFormatKey}, saved=${fileName}`
    );

    return Response.json(
      {
        success: true,
        image,
        format: detectedFormatKey,
        mimeType: detectedFormat.mimeType,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "ADMIN IMAGE UPLOAD ERROR:",
      error
    );

    return Response.json(
      {
        error: "Unable to upload image.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const authenticated = await requireAdmin();

    if (!authenticated) {
      return Response.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const { id: productId } = await params;
    const body = await request.json();

    const imageId = String(
      body.imageId || ""
    ).trim();

    if (!imageId) {
      return Response.json(
        {
          error: "Image ID is required.",
        },
        { status: 400 }
      );
    }

    const image =
      await prisma.productImage.findFirst({
        where: {
          id: imageId,
          productId,
        },
      });

    if (!image) {
      return Response.json(
        {
          error: "Image not found.",
        },
        { status: 404 }
      );
    }

    const url =
      body.url !== undefined
        ? String(body.url).trim()
        : image.url;

    const altText =
      body.altText !== undefined
        ? body.altText
          ? String(body.altText).trim()
          : null
        : image.altText;

    const sortOrder =
      body.sortOrder !== undefined
        ? Number(body.sortOrder)
        : image.sortOrder;

    const isPrimary =
      body.isPrimary !== undefined
        ? Boolean(body.isPrimary)
        : image.isPrimary;

    if (!url) {
      return Response.json(
        {
          error: "Image URL is required.",
        },
        { status: 400 }
      );
    }

    const updated =
      await prisma.$transaction(
        async (tx) => {
          if (isPrimary) {
            await tx.productImage.updateMany({
              where: {
                productId,
              },
              data: {
                isPrimary: false,
              },
            });
          }

          return tx.productImage.update({
            where: {
              id: imageId,
            },
            data: {
              url,
              altText,
              sortOrder: Number.isFinite(
                sortOrder
              )
                ? sortOrder
                : image.sortOrder,
              isPrimary,
            },
          });
        }
      );

    return Response.json({
      success: true,
      image: updated,
    });
  } catch (error) {
    console.error(
      "ADMIN IMAGE UPDATE ERROR:",
      error
    );

    return Response.json(
      {
        error: "Unable to update image.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const authenticated = await requireAdmin();

    if (!authenticated) {
      return Response.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const { id: productId } = await params;

    const url = new URL(request.url);

    const imageId =
      url.searchParams.get("imageId");

    if (!imageId) {
      return Response.json(
        {
          error: "Image ID is required.",
        },
        { status: 400 }
      );
    }

    const image =
      await prisma.productImage.findFirst({
        where: {
          id: imageId,
          productId,
        },
      });

    if (!image) {
      return Response.json(
        {
          error: "Image not found.",
        },
        { status: 404 }
      );
    }

    await prisma.productImage.delete({
      where: {
        id: imageId,
      },
    });

    if (image.isPrimary) {
      const nextImage =
        await prisma.productImage.findFirst({
          where: {
            productId,
          },
          orderBy: {
            sortOrder: "asc",
          },
        });

      if (nextImage) {
        await prisma.productImage.update({
          where: {
            id: nextImage.id,
          },
          data: {
            isPrimary: true,
          },
        });
      }
    }

    return Response.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "ADMIN IMAGE DELETE ERROR:",
      error
    );

    return Response.json(
      {
        error: "Unable to delete image.",
      },
      { status: 500 }
    );
  }
}
