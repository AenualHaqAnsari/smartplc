import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import AddVariantForm from "./AddVariantForm";
import VariantManager from "./VariantManager";
import ImageManager from "./ImageManager";
import StatusManager from "./StatusManager";
import ProductEditor from "./ProductEditor";
import VideoManager from "./VideoManager";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const authenticated = await requireAdmin();

  if (!authenticated) {
    redirect("/admin/login");
  }

  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: {
      id,
    },
    include: {
      category: true,
      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },
      videos: { orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] },
      variants: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!product) {
    notFound();
  }
  const categories =
  await prisma.category.findMany({
    where: {
      active: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  const totalStock = product.variants.reduce(
    (total, variant) =>
      total + variant.stock,
    0
  );

  return (
    <main className="min-h-screen bg-[#f8fafc] text-[#17212b]">
      <header className="border-b border-[#e2e8f0]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#0369a1]">
              Store Administration
            </p>

            <h1 className="mt-1 font-serif text-2xl font-bold tracking-[0.08em]">
              INDUSTRIAL AUTOMATION
            </h1>
          </div>

          <Link
            href="/admin/products"
            className="text-sm uppercase tracking-[0.15em] text-[#0877b9] hover:text-[#075985]"
          >
            Back to Products
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-[1400px] px-6 py-8">
        {/* Product heading */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#0369a1]">
              Product
            </p>

            <h2 className="mt-2 font-serif text-4xl font-bold tracking-wide">
              {product.name}
            </h2>

            <p className="mt-3 text-sm text-[#475569]">
              SKU: {product.sku || "Not assigned"}
            </p>
          </div>

          <div className="flex gap-4">
            <Link
              href={`/products/${product.slug}`}
              target="_blank"
              className="border border-[#cbd5e1] px-6 py-3 text-sm uppercase tracking-[0.15em] hover:border-[#0877b9] hover:text-[#0877b9]"
            >
              View Product
            </Link>

            <Link
              href="/admin/products"
              className="border border-[#cbd5e1] px-6 py-3 text-sm uppercase tracking-[0.15em] hover:border-[#0877b9] hover:text-[#0877b9]"
            >
              All Products
            </Link>
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-7 grid gap-3 sm:grid-cols-4">
          <StatCard
            label="Status"
            value={String(product.status)}
          />

          <StatCard
            label="Base Price"
            value={`$${Number(
              product.basePrice
            ).toFixed(2)}`}
          />

          <StatCard
            label="Variants"
            value={product.variants.length.toString()}
          />

          <StatCard
            label="Total Stock"
            value={totalStock.toString()}
          />
        </div>

        {/* Basic information */}
        <section className="mt-7 border border-[#e2e8f0] bg-[#ffffff] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[#0369a1]">
                Catalog
              </p>

              <h3 className="mt-1.5 font-serif text-xl font-bold tracking-wide">
                BASIC INFORMATION
              </h3>
            </div>

            <span className="border border-[#cbd5e1] px-3 py-1 text-[10px] uppercase tracking-[0.15em] text-[#0877b9]">
              {product.category.name}
            </span>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Info
              label="Product Name"
              value={product.name}
            />

            <Info
              label="Slug"
              value={product.slug}
            />

            <Info
              label="SKU"
              value={product.sku || ""}
            />

            <Info
              label="Category"
              value={product.category.name}
            />

            <Info
              label="Base Price"
              value={`$${Number(
                product.basePrice
              ).toFixed(2)}`}
            />

            <Info
              label="Compare-at Price"
              value={
                product.compareAtPrice
                  ? `$${Number(
                      product.compareAtPrice
                    ).toFixed(2)}`
                  : "Not set"
              }
            />
          </div>

          {product.shortDescription && (
            <div className="mt-7">
              <p className="text-xs uppercase tracking-[0.15em] text-[#475569]">
                Short Description
              </p>

              <p className="mt-2 text-sm leading-7 text-[#b7afa3]">
                {product.shortDescription}
              </p>
            </div>
          )}

          <div className="mt-6"><div className="flex items-center justify-between"><p className="text-xs uppercase tracking-[0.15em] text-[#475569]">Long Description</p><span className="text-[10px] uppercase tracking-[0.12em] text-[#514838]">Preview</span></div><div className="mt-2 max-h-48 overflow-y-auto border border-[#e2e8f0] bg-[#ffffff] px-4 py-3"><p className="whitespace-pre-wrap text-sm leading-6 text-[#aaa194]">{product.description}</p></div></div>
        </section>
{/* Product Information */}
<section className="mt-7 border border-[#e2e8f0] bg-[#ffffff] p-6">
  <p className="text-xs uppercase tracking-[0.25em] text-[#0369a1]">
    Product
  </p>

  <h3 className="mt-1.5 font-serif text-xl font-bold tracking-wide">
    PRODUCT INFORMATION
  </h3>

  <ProductEditor
  product={{
    id: product.id,
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    brand: product.brand,
    model: product.model,
    specifications: product.specifications,
    description: product.description,
    shortDescription: product.shortDescription,
    seoTitle: product.seoTitle,
    seoDescription: product.seoDescription,
    basePrice: Number(product.basePrice),
    compareAtPrice:
      product.compareAtPrice !== null
        ? Number(product.compareAtPrice)
        : null,

    gauge16Extra: Number(product.gauge16Extra),
    gauge14Extra: Number(product.gauge14Extra),
    gauge12Extra: Number(product.gauge12Extra),

    categoryId: product.categoryId,
    featured: product.featured,
  }}
  categories={categories}
/>
</section>
        {/* Images */}
        {/* Images */}
<section className="mt-7 border border-[#e2e8f0] bg-[#ffffff] p-6">
  <div>
    <p className="text-xs uppercase tracking-[0.25em] text-[#0369a1]">
      Media
    </p>

    <h3 className="mt-1.5 font-serif text-xl font-bold tracking-wide">
      PRODUCT IMAGES
    </h3>
  </div>

  <ImageManager
    productId={product.id}
    images={product.images.map(
      (image) => ({
        id: image.id,
        url: image.url,
        altText: image.altText,
        sortOrder: image.sortOrder,
        isPrimary: image.isPrimary,
      })
    )}
  />
</section>
<section className="mt-7 border border-[#e2e8f0] bg-[#ffffff] p-6">
  <div>
    <p className="text-xs uppercase tracking-[0.25em] text-[#0369a1]">Media</p>
    <h3 className="mt-1.5 font-serif text-xl font-bold tracking-wide">PRODUCT VIDEOS</h3>
    <p className="mt-2 text-sm text-[#475569]">Upload working machine and product demonstration videos.</p>
  </div>
  <VideoManager productId={product.id} videos={product.videos.map((video) => ({ ...video, createdAt: video.createdAt.toISOString() }))} />
</section>
        {/* Variants */}
        {/* Variants */}
<section className="mt-7 border border-[#e2e8f0] bg-[#ffffff] p-6">
  <div className="flex items-end justify-between">
    <div>
      <p className="text-xs uppercase tracking-[0.25em] text-[#0369a1]">
        Inventory
      </p>

      <h3 className="mt-1.5 font-serif text-xl font-bold tracking-wide">
        VARIANTS
      </h3>
      <p className="mt-2 text-sm text-[#475569]">
  Total inventory:{" "}
  <span className="font-semibold text-[#0877b9]">
    {totalStock}
  </span>{" "}
  units
</p>
    </div>

    <span className="text-sm text-[#475569]">
      {product.variants.length} variants
    </span>
  </div>

  <VariantManager
    productId={product.id}
    variants={product.variants.map(
      (variant) => ({
        id: variant.id,
        name: variant.name,
        sku: variant.sku,
        price: Number(variant.price),
        stock: variant.stock,
        size: variant.size,
        gauge: variant.gauge,
        finish: variant.finish,
        customAvailable:
          variant.customAvailable,
      })
    )}
  />

  <AddVariantForm
    productId={product.id}
  />
</section>

        {/* Publishing */}
<div className="mt-7 border border-[#e2e8f0] bg-[#ffffff] p-6">
  <p className="text-xs uppercase tracking-[0.25em] text-[#0369a1]">
    Publishing
  </p>

  <h3 className="mt-1.5 font-serif text-xl font-bold tracking-wide">
    PRODUCT STATUS
  </h3>

  <StatusManager
    productId={product.id}
    currentStatus={product.status}
  />
</div>
      </section>
    </main>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="border border-[#e2e8f0] bg-[#ffffff] p-6">
      <p className="text-xs uppercase tracking-[0.2em] text-[#475569]">
        {label}
      </p>

      <p className="mt-2 font-serif text-xl font-bold text-[#0877b9]">
        {value}
      </p>
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.15em] text-[#475569]">
        {label}
      </p>

      <p className="mt-2 text-sm text-[#d0c8bb]">
        {value}
      </p>
    </div>
  );
}
