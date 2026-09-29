import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function POST(request: Request) {
  try {
    const authenticated = await requireAdmin();

    if (!authenticated) {
      return Response.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const name = String(body.name || "").trim();
    const slug = String(body.slug || "").trim();
    const description = String(
      body.description || ""
    ).trim();

    const shortDescription = body.shortDescription
      ? String(body.shortDescription).trim()
      : null;

    const seoTitle = body.seoTitle
      ? String(body.seoTitle).trim()
      : null;

    const seoDescription = body.seoDescription
      ? String(body.seoDescription).trim()
      : null;

    const sku = body.sku
      ? String(body.sku).trim()
      : null;
    const brand = body.brand ? String(body.brand).trim() : null;
    const model = body.model ? String(body.model).trim() : null;
    let specifications: object | undefined;
    if (body.specifications) {
      try {
        const parsed: unknown = JSON.parse(String(body.specifications));
        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed) || Object.values(parsed).some((v) => !["string", "number", "boolean"].includes(typeof v))) throw new Error();
        specifications = parsed as object;
      } catch { return Response.json({ error: "Specifications must be a JSON object with text, number or boolean values." }, { status: 400 }); }
    }

    const categoryId = String(
      body.categoryId || ""
    ).trim();

    const basePrice = Number(body.basePrice);

    const compareAtPrice =
      body.compareAtPrice === null ||
      body.compareAtPrice === undefined ||
      body.compareAtPrice === ""
        ? null
        : Number(body.compareAtPrice);

    const status = String(
      body.status || "DRAFT"
    );

    const featured = Boolean(body.featured);

    if (!name) {
      return Response.json(
        {
          error: "Product name is required.",
        },
        { status: 400 }
      );
    }

    if (!slug) {
      return Response.json(
        {
          error: "Product slug is required.",
        },
        { status: 400 }
      );
    }

    if (!description) {
      return Response.json(
        {
          error:
            "Product description is required.",
        },
        { status: 400 }
      );
    }

    if (
      !Number.isFinite(basePrice) ||
      basePrice < 0
    ) {
      return Response.json(
        {
          error: "Invalid product price.",
        },
        { status: 400 }
      );
    }

    if (
      compareAtPrice !== null &&
      (!Number.isFinite(compareAtPrice) ||
        compareAtPrice < 0)
    ) {
      return Response.json(
        {
          error:
            "Invalid compare-at price.",
        },
        { status: 400 }
      );
    }

    if (!categoryId) {
      return Response.json(
        {
          error: "Category is required.",
        },
        { status: 400 }
      );
    }

    if (
      !["DRAFT", "ACTIVE", "ARCHIVED"].includes(
        status
      )
    ) {
      return Response.json(
        {
          error: "Invalid product status.",
        },
        { status: 400 }
      );
    }

    const category =
      await prisma.category.findUnique({
        where: {
          id: categoryId,
        },
      });

    if (!category) {
      return Response.json(
        {
          error: "Category not found.",
        },
        { status: 400 }
      );
    }

    const existingSlug =
      await prisma.product.findUnique({
        where: {
          slug,
        },
      });

    if (existingSlug) {
      return Response.json(
        {
          error:
            "A product with this slug already exists.",
        },
        { status: 409 }
      );
    }

    if (sku) {
      const existingSku =
        await prisma.product.findUnique({
          where: {
            sku,
          },
        });

      if (existingSku) {
        return Response.json(
          {
            error:
              "A product with this SKU already exists.",
          },
          { status: 409 }
        );
      }
    }

    const product =
      await prisma.product.create({
        data: {
          name,
          slug,
          description,
          shortDescription,
          seoTitle,
          seoDescription,
          sku,
          brand,
          model,
          specifications,
          basePrice,
          compareAtPrice,
          status:
            status as
              | "DRAFT"
              | "ACTIVE"
              | "ARCHIVED",
          featured,
          categoryId,
        },
      });

    return Response.json(
      {
        success: true,
        product: {
          id: product.id,
          name: product.name,
          slug: product.slug,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "ADMIN PRODUCT CREATE ERROR:",
      error
    );

    return Response.json(
      {
        error: "Unable to create product.",
      },
      { status: 500 }
    );
  }
}
