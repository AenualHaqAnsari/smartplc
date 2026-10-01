import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductCardPrice from "@/components/home/ProductCardPrice";
import StoreHeader from "@/components/layout/StoreHeader";
import SiteFooter from "@/components/site/SiteFooter";
import CollectionJsonLd from "@/components/seo/CollectionJsonLd";
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug }, select: { name: true, description: true, active: true } });
  if (!category?.active) return { title: "Product Category | Industrial Automation" };
  const title = `${category.name} | Industrial Automation Products`;
  const description = category.description || `Browse ${category.name.toLowerCase()} for industrial automation applications. Contact us to confirm product specifications and availability.`;
  return { title, description, alternates: { canonical: `/products/category/${slug}` }, openGraph: { title, description, type: "website", siteName: "Smart PLC Solutions", images: [{ url: "/og-smart-plc.png", width: 1200, height: 630, alt: "Smart PLC Solutions — industrial automation products and services" }] }, twitter: { card: "summary_large_image", title, description, images: ["/og-smart-plc.png"] } };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category?.active) notFound();
  const products = await prisma.product.findMany({
    where: { status: "ACTIVE", categoryId: category.id },
    include: { images: { where: { isPrimary: true }, take: 1 }, variants: { orderBy: { price: "asc" }, take: 1 } },
    orderBy: { createdAt: "desc" },
  });
  const description = category.description || `Products for ${category.name.toLowerCase()} applications. Contact us to confirm model and specifications.`;
  const items = products.map((p) => ({ name: p.name, slug: p.slug, image: p.images[0]?.url ?? null }));
  return <>
    <CollectionJsonLd name={category.name} description={description} products={items} />
    <main className="min-h-screen bg-white text-slate-900"><StoreHeader />
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <Link href="/products" className="text-sm font-medium text-sky-700">← All products</Link>
        <p className="mt-7 text-xs font-semibold uppercase tracking-[.2em] text-sky-700">Product category</p>
        <h1 className="mt-2 text-4xl font-bold">{category.name}</h1>
        <p className="mt-4 max-w-2xl text-slate-600">{description}</p>
        {products.length === 0 ? <div className="mt-9 border border-dashed border-slate-300 bg-slate-50 p-9 text-center"><p className="font-semibold">Products in this category are being prepared.</p><p className="mt-2 text-sm text-slate-600">Contact us with your requirements and we can check availability.</p><Link href={`/request-quote?type=product&category=${encodeURIComponent(category.name)}`} className="mt-5 inline-flex bg-sky-600 px-5 py-3 text-sm font-semibold text-white">Request a Quote</Link></div>
        : <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{products.map((p) => { const image = p.images[0]; const price = p.variants[0]?.price ?? p.basePrice; const compareAtPrice = p.variants.length > 0 ? p.variants[0].compareAtPrice : p.compareAtPrice; return <Link key={p.id} href={`/products/${p.slug}`} className="border border-slate-200 hover:border-sky-400 hover:shadow-md"><div className="aspect-[4/3] bg-slate-100">{image ? <img src={image.url} alt={image.altText || p.name} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-xs font-semibold uppercase tracking-widest text-slate-400">{category.name}</div>}</div><div className="p-4"><h2 className="font-semibold">{p.name}</h2><ProductCardPrice priceUSD={Number(price)} compareAtPriceUSD={compareAtPrice === null ? null : Number(compareAtPrice)} /></div></Link>; })}</div>}
      </section><SiteFooter /></main>
  </>;
}

