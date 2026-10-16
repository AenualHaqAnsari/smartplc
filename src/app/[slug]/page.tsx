import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AutomationContentPage from "@/components/seo/AutomationContentPage";
import { capabilityBySlug, capabilitySlugs } from "@/lib/seo-content";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return capabilitySlugs.map((slug) => ({ slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params; const page = capabilityBySlug.get(slug); if (!page) return {};
  return { title: page.title, description: page.description, alternates: { canonical: `/${page.slug}` }, openGraph: { type: "website", title: `${page.title} | SmartPLC Solutions`, description: page.description, url: `/${page.slug}`, images: [{ url: "/og-smart-plc.png", width: 1200, height: 630, alt: `${page.h1} | SmartPLC Solutions` }] }, twitter: { card: "summary_large_image", title: page.title, description: page.description, images: ["/og-smart-plc.png"] }, robots: { index: true, follow: true } };
}
const localPlcPages = [
  ["/delta-plc-programming-delhi", "Delta PLC programming in Delhi and New Delhi"],
  ["/siemens-plc-programming-delhi", "Siemens PLC programming in Delhi"],
  ["/delta-plc-programming-haridwar", "Delta PLC automation services in Haridwar"],
  ["/siemens-plc-programming-haridwar", "Siemens PLC programming in Haridwar"],
] as const;
export default async function CapabilityPage({ params }: Props) {
  const { slug } = await params; const page = capabilityBySlug.get(slug); if (!page) notFound();
  const showLocalPages = ["plc", "plc-programming", "hmi", "hmi-programming", "scada-programming", "industrial-automation"].includes(slug);
  return <><AutomationContentPage page={page} family="capability"/>{showLocalPages && <section className="bg-slate-50"><div className="mx-auto max-w-6xl px-5 py-10 sm:px-8"><h2 className="text-xl font-bold">PLC programming and service areas</h2><p className="mt-2 text-sm leading-6 text-slate-600">Explore brand-specific programming and automation enquiries for Delhi, New Delhi and Haridwar.</p><div className="mt-4 flex flex-wrap gap-3">{localPlcPages.map(([href, label])=><Link key={href} href={href} className="border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-sky-800 hover:border-sky-500">{label}</Link>)}</div></div></section>}</>;
}
