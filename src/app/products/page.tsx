export const dynamic = "force-dynamic";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import StoreHeader from "@/components/layout/StoreHeader";
import SiteFooter from "@/components/site/SiteFooter";
import CollectionJsonLd from "@/components/seo/CollectionJsonLd";
import ProductCardPrice from "@/components/home/ProductCardPrice";

export async function generateMetadata({
  searchParams,
}: ProductsPageProps): Promise<Metadata> {
  const { category } = await searchParams;

  if (!category) {
    return {
      title: "Industrial Automation Products | PLC, HMI, Drives & Sensors",
      description:
        "Browse PLC, HMI, VFD, servo, sensor, control panel and industrial communication products. Confirm specifications and availability with our team.",
    };
  }

  const categoryData = await prisma.category.findUnique({
    where: {
      slug: category,
    },
    select: {
      name: true,
      description: true,
      image: true,
      active: true,
    },
  });

  if (!categoryData || !categoryData.active) {
    return {
      title: "Automation Products | Industrial Automation",
      description:
        "Browse automation products and contact us to confirm specifications and availability.",
    };
  }

  const categorySeo: Record<string, {title: string; description: string}> = {
    plc: { title: "PLC Controllers & I/O Modules | Industrial Automation", description: "Browse PLC CPUs, controllers and expansion I/O. Confirm model specifications, availability and pricing by enquiry." },
    hmi: { title: "Industrial HMI Panels | Industrial Automation", description: "Browse HMI operator panels and related accessories for industrial automation applications." },
    "vfd-drives": { title: "VFDs & AC Drives | Industrial Automation", description: "Enquire about variable frequency drives and motor control products for your application." },
    "servo-systems": { title: "Servo Drives & Motors | Industrial Automation", description: "Enquire about servo systems, motors, drives and compatible accessories." },
    sensors: { title: "Industrial Sensors & Encoders | Industrial Automation", description: "Browse industrial sensing products for temperature, pressure, proximity, photoelectric and encoder applications." },
    "control-panels": { title: "Control Panel Components | Industrial Automation", description: "Explore electrical and automation components for industrial control panels." },
    "industrial-communication": { title: "Industrial Communication Products | Industrial Automation", description: "Enquire about industrial Ethernet, RS485, Modbus and communication products." },
    "automation-components": { title: "Automation Components | Industrial Automation", description: "Browse automation components including relays, contactors, circuit protection and power supplies." },
  };

  const seo = categorySeo[category];

  const title =
    seo?.title || `${categoryData.name} | Industrial Automation`;

  const rawDescription =
    seo?.description ||
    categoryData.description?.trim() ||
    `Browse ${categoryData.name.toLowerCase()} for industrial automation applications. Contact us to confirm model specifications and availability.`;

  const description =
    rawDescription.length > 160
      ? `${rawDescription.slice(0, 157).trimEnd()}...`
      : rawDescription;

  return {
    title,
    description,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "Industrial Automation",
      images: categoryData.image
        ? [
            {
              url: categoryData.image,
              alt: categoryData.name,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: categoryData.image
        ? [categoryData.image]
        : undefined,
    },
  };
}
type ProductsPageProps = {
  searchParams: Promise<{
    category?: string;
  }>;
};

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const { category } = await searchParams;

  if (category) {
    redirect(`/products/category/${encodeURIComponent(category)}`);
  }
  const products = await prisma.product.findMany({
    where: {
  status: "ACTIVE",
  ...(category
    ? {
        category: {
          slug: category,
        },
      }
    : {}),
},
    include: {
      category: true,
      images: {
        where: {
          isPrimary: true,
        },
        take: 1,
      },
      variants: {
        orderBy: {
          price: "asc",
        },
        take: 1,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

    const categoryContent: Record<string, {heading: string; description: string}> = {
    plc: { heading: "PLC Controllers & I/O", description: "PLC CPUs, controllers and digital or analog expansion I/O. Confirm the exact model and specifications by enquiry." },
    hmi: { heading: "Industrial HMI", description: "Operator panels and HMI accessories for industrial control applications." },
    "vfd-drives": { heading: "VFD & AC Drives", description: "Variable frequency drives and motor control products. Enquire to confirm ratings and compatibility." },
    "servo-systems": { heading: "Servo Systems", description: "Servo drives, motors and accessories for motion control applications." },
    sensors: { heading: "Industrial Sensors", description: "Temperature, pressure, proximity, photoelectric sensors and encoders." },
    "control-panels": { heading: "Control Panel Components", description: "Electrical and control components for industrial panels." },
    "industrial-communication": { heading: "Industrial Communication", description: "Industrial Ethernet, RS485, Modbus and communication products." },
    "automation-components": { heading: "Automation Components", description: "Relays, contactors, circuit protection and industrial power supplies." },
  };

  const collectionName =
    categoryContent[category ?? ""]?.heading ||
    "Industrial Automation Products Collection";

  const collectionDescription =
    categoryContent[category ?? ""]?.description ||
    "Browse industrial automation products for control, motion, sensing, communication and panel applications.";
  const collectionProducts = products.map((product) => ({ name: product.name, slug: product.slug, image: product.images[0]?.url ?? null }));

  return (
    <>
      <CollectionJsonLd name={collectionName} description={collectionDescription} products={collectionProducts} />
      <main className="min-h-screen bg-[#f8fafc] text-[#17212b]">
      <StoreHeader />

      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="text-xs uppercase tracking-[0.35em] text-[#0369a1]">
          The Collection
        </p>

        <h1 className="mt-3 font-serif text-5xl font-bold">
  {category
    ? category.replace("-", " ").toUpperCase()
    : "ALL PRODUCTS"}
</h1>

        <p className="mt-5 max-w-2xl text-[#475569]">
          Browse controllers, operator interfaces, drives, sensors and industrial communication products. Product specifications and availability are confirmed by enquiry.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/products" className="border border-sky-600 bg-sky-600 px-5 py-3 text-xs font-bold uppercase tracking-[0.15em] text-white">All Products</Link>
          {[['PLC','plc'],['HMI','hmi'],['VFD & Drives','vfd-drives'],['Servo Systems','servo-systems'],['Sensors','sensors'],['Control Panels','control-panels'],['Communication','industrial-communication']].map(([name, slug]) => <Link key={slug} href={`/products?category=${slug}`} className="border border-slate-300 px-5 py-3 text-xs font-bold uppercase tracking-[0.15em] text-slate-700 hover:border-sky-500 hover:text-sky-700">{name}</Link>)}
        </div>

        {products.length === 0 ? (
          <div className="mt-12 border border-[#cbd5e1] bg-[#ffffff] p-10 text-center">
            <p className="text-[#475569]">
              No products are currently available.
            </p>
          </div>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => {
              const image = product.images[0];
              const price =
                product.variants[0]?.price ??
                product.basePrice;
              const compareAtPrice =
                product.variants.length > 0
                  ? product.variants[0].compareAtPrice
                  : product.compareAtPrice;

              return (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group block"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#191714]">
                    {image ? (
                      <img
                        src={image.url}
                        alt={
                          image.altText ||
                          product.name
                        }
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="font-serif text-2xl text-[#4d463b]">
                          INDUSTRIAL AUTOMATION
                        </span>
                      </div>
                    )}

                    {product.featured && (
                      <div className="absolute left-4 top-4 border border-[#6b5b3e] bg-[#f8fafc]/90 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[#0877b9]">
                        Featured
                      </div>
                    )}
                  </div>

                  <div className="pt-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#8e8578]">
                      {product.category.name}
                    </p>

                    <h2 className="mt-2 font-serif text-xl font-semibold group-hover:text-[#075985]">
                      {product.name}
                    </h2>

                    <ProductCardPrice
                      priceUSD={Number(price)}
                      compareAtPriceUSD={
                        compareAtPrice === null
                          ? null
                          : Number(compareAtPrice)
                      }
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
      <SiteFooter />
      </main>
    </>
  );
}
