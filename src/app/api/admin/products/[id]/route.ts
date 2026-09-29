import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

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

    const { id } = await params;
    const body = await request.json();

    const product =
      await prisma.product.findUnique({
        where: {
          id,
        },
      });

    if (!product) {
      return Response.json(
        {
          error: "Product not found.",
        },
        { status: 404 }
      );
    }

    const updatedProduct =
      await prisma.product.update({
        where: {
          id,
        },
        data: {
          name:
            body.name !== undefined
              ? String(body.name).trim()
              : undefined,

          slug:
            body.slug !== undefined
              ? String(body.slug).trim()
              : undefined,

          description:
            body.description !== undefined
              ? String(body.description).trim()
              : undefined,

          shortDescription:
  body.shortDescription !== undefined
    ? body.shortDescription
      ? String(
          body.shortDescription
        ).trim()
      : null
    : undefined,

seoTitle:
  body.seoTitle !== undefined
    ? body.seoTitle
      ? String(body.seoTitle).trim()
      : null
    : undefined,

seoDescription:
  body.seoDescription !== undefined
    ? body.seoDescription
      ? String(body.seoDescription).trim()
      : null
    : undefined,

sku:
            body.sku !== undefined
              ? body.sku
                ? String(body.sku).trim()
                : null
              : undefined,
brand: body.brand !== undefined ? (body.brand ? String(body.brand).trim() : null) : undefined,
model: body.model !== undefined ? (body.model ? String(body.model).trim() : null) : undefined,
specifications: body.specifications ? (() => {
  const parsed: unknown = JSON.parse(String(body.specifications));
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed) || Object.values(parsed).some((v) => !["string", "number", "boolean"].includes(typeof v))) throw new Error("Invalid product specifications JSON.");
  return parsed as object;
})() : undefined,

          basePrice:
            body.basePrice !== undefined
              ? Number(body.basePrice)
              : undefined,

          compareAtPrice:
            body.compareAtPrice !== undefined
              ? body.compareAtPrice === null ||
                body.compareAtPrice === ""
                ? null
                : Number(
                    body.compareAtPrice
                  )
              : undefined,
gauge16Extra:
  body.gauge16Extra !== undefined
    ? Number(body.gauge16Extra)
    : undefined,

gauge14Extra:
  body.gauge14Extra !== undefined
    ? Number(body.gauge14Extra)
    : undefined,

gauge12Extra:
  body.gauge12Extra !== undefined
    ? Number(body.gauge12Extra)
    : undefined,

          status:
            body.status !== undefined
              ? body.status
              : undefined,

          featured:
            body.featured !== undefined
              ? Boolean(body.featured)
              : undefined,

          categoryId:
            body.categoryId !== undefined
              ? String(body.categoryId)
              : undefined,
        },
      });


    return Response.json({
      success: true,
      product: updatedProduct,
    });
  } catch (error) {
    console.error(
      "ADMIN PRODUCT UPDATE ERROR:",
      error
    );

    return Response.json(
      {
        error: "Unable to update product.",
      },
      { status: 500 }
    );
  }
}