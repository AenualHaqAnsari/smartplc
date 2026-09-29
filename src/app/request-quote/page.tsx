import type {Metadata} from "next";
import {Suspense} from "react";
import {notFound} from "next/navigation";
import StoreHeader from "@/components/layout/StoreHeader";
import SiteFooter from "@/components/site/SiteFooter";
import QuoteRequestForm from "./QuoteRequestForm";
export const dynamic="force-dynamic";
export const metadata:Metadata={title:"Request an Industrial Automation Quote",description:"Submit a product or industrial automation service enquiry for review.",alternates:{canonical:"/request-quote"}};
type Props={searchParams:Promise<{service?:string;type?:string;category?:string}>};
export default async function RequestQuotePage({searchParams}:Props){const params=await searchParams;return <main className="min-h-screen bg-slate-50 text-slate-900"><StoreHeader/><section className="bg-[#101c2b] px-5 py-12 text-white sm:px-8"><div className="mx-auto max-w-3xl"><p className="text-xs font-semibold uppercase tracking-[.22em] text-sky-300">Product and engineering enquiries</p><h1 className="mt-3 text-4xl font-bold">Request a Quote</h1><p className="mt-4 leading-7 text-slate-300">Provide the equipment, quantity and application details you have. Product specifications, availability and service scope are confirmed during review.</p></div></section><section className="mx-auto max-w-3xl px-5 py-10 sm:px-8"><QuoteRequestForm service={params.service||params.category||""} type={params.type||""}/></section><SiteFooter/></main>}

