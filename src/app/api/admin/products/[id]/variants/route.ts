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
    const body = await request.json();

    const name = String(body.name || "").trim();

    const sku = body.sku
      ? String(body.sku).trim()
      : null;

    const price = Number(body.price);

    const compareAtPrice =
      body.compareAtPrice === null ||
      body.compareAtPrice === undefined ||
      body.compareAtPrice === ""
        ? null
        : Number(body.compareAtPrice);

    const stock = Number(body.stock);

    const size = body.size
      ? String(body.size).trim()
      : null;

    const sizeType = String(
      body.sizeType || "STANDARD"
    );

    const gauge = body.gauge
      ? String(body.gauge).trim()
      : null;

    const finish = body.finish
      ? String(body.finish).trim()
      : null;

    const customAvailable = Boolean(
      body.customAvailable
    );

    if (!name) {
      return Response.json(
        {
          error: "Variant name is required.",
        },
        { status: 400 }
      );
    }

    if (
      !Number.isFinite(price) ||
      price < 0
    ) {
      return Response.json(
        {
          error: "Invalid variant price.",
        },
        { status: 400 }
      );
    }

    if (
      !Number.isInteger(stock) ||
      stock < 0
    ) {
      return Response.json(
        {
          error:
            "Stock must be a whole number of 0 or greater.",
        },
        { status: 400 }
      );
    }

    if (
      !["STANDARD", "CUSTOM"].includes(
        sizeType
      )
    ) {
      return Response.json(
        {
          error: "Invalid size type.",
        },
        { status: 400 }
      );
    }

    const product =
      await prisma.product.findUnique({
        where: {
          id: productId,
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

    if (sku) {
      const existingSku =
        await prisma.productVariant.findUnique({
          where: {
            sku,
          },
        });

      if (existingSku) {
        return Response.json(
          {
            error:
              "A variant with this SKU already exists.",
          },
          { status: 409 }
        );
      }
    }

    const variant =
      await prisma.productVariant.create({
        data: {
          name,
          sku,
          price,
          compareAtPrice,
          stock,
          size,
          sizeType:
            sizeType as
              | "STANDARD"
              | "CUSTOM",
          gauge,
          finish,
          customAvailable,
          productId,
        },
      });

    return Response.json(
      {
        success: true,
        variant,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "ADMIN VARIANT CREATE ERROR:",
      error
    );

    return Response.json(
      {
        error: "Unable to create variant.",
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

    const variantId = String(
      body.variantId || ""
    ).trim();

    if (!variantId) {
      return Response.json(
        {
          error: "Variant ID is required.",
        },
        { status: 400 }
      );
    }

    const variant =
      await prisma.productVariant.findFirst({
        where: {
          id: variantId,
          productId,
        },
      });

    if (!variant) {
      return Response.json(
        {
          error: "Variant not found.",
        },
        { status: 404 }
      );
    }

    const name = String(
      body.name ?? variant.name
    ).trim();

    const sku =
      body.sku === null ||
      body.sku === undefined ||
      body.sku === ""
        ? null
        : String(body.sku).trim();

    const price =
      body.price === undefined
        ? Number(variant.price)
        : Number(body.price);

    const stock =
      body.stock === undefined
        ? variant.stock
        : Number(body.stock);

    const size =
      body.size === null ||
      body.size === undefined ||
      body.size === ""
        ? null
        : String(body.size).trim();

    const gauge =
      body.gauge === null ||
      body.gauge === undefined ||
      body.gauge === ""
        ? null
        : String(body.gauge).trim();

    const finish =
      body.finish === null ||
      body.finish === undefined ||
      body.finish === ""
        ? null
        : String(body.finish).trim();

    const customAvailable =
      body.customAvailable === undefined
        ? variant.customAvailable
        : Boolean(body.customAvailable);

    if (!name) {
      return Response.json(
        {
          error: "Variant name is required.",
        },
        { status: 400 }
      );
    }

    if (
      !Number.isFinite(price) ||
      price < 0
    ) {
      return Response.json(
        {
          error: "Invalid price.",
        },
        { status: 400 }
      );
    }

    if (
      !Number.isInteger(stock) ||
      stock < 0
    ) {
      return Response.json(
        {
          error: "Invalid stock.",
        },
        { status: 400 }
      );
    }

    if (sku) {
      const duplicate =
        await prisma.productVariant.findFirst({
          where: {
            sku,
            NOT: {
              id: variantId,
            },
          },
        });

      if (duplicate) {
        return Response.json(
          {
            error:
              "Another variant already uses this SKU.",
          },
          { status: 409 }
        );
      }
    }

    const updated =
      await prisma.productVariant.update({
        where: {
          id: variantId,
        },
        data: {
          name,
          sku,
          price,
          stock,
          size,
          gauge,
          finish,
          customAvailable,
        },
      });

    return Response.json({
      success: true,
      variant: updated,
    });
  } catch (error) {
    console.error(
      "ADMIN VARIANT UPDATE ERROR:",
      error
    );

    return Response.json(
      {
        error: "Unable to update variant.",
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

    const variantId =
      url.searchParams.get("variantId");

    if (!variantId) {
      return Response.json(
        {
          error: "Variant ID is required.",
        },
        { status: 400 }
      );
    }

    const variant =
      await prisma.productVariant.findFirst({
        where: {
          id: variantId,
          productId,
        },
      });

    if (!variant) {
      return Response.json(
        {
          error: "Variant not found.",
        },
        { status: 404 }
      );
    }

    const orderItemCount =
      await prisma.orderItem.count({
        where: {
          variantId,
        },
      });

    if (orderItemCount > 0) {
      return Response.json(
        {
          error:
            "This variant has already been used in an order and cannot be deleted.",
        },
        { status: 409 }
      );
    }

    await prisma.productVariant.delete({
      where: {
        id: variantId,
      },
    });

    return Response.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "ADMIN VARIANT DELETE ERROR:",
      error
    );

    return Response.json(
      {
        error: "Unable to delete variant.",
      },
      { status: 500 }
    );
  }
}