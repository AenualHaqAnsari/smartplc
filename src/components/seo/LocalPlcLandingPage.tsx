import Link from "next/link";
import StoreHeader from "@/components/layout/StoreHeader";
import SiteFooter from "@/components/site/SiteFooter";

export type LocalPlcPageData = {
  brand: "Delta" | "Siemens";
  location: "Delhi / New Delhi" | "Haridwar";
  title: string;
  h1: string;
  description: string;
  intro: string;
  focus: string[];
  faq: { question: string; answer: string }[];
};

export default function LocalPlcLandingPage({ page }: { page: LocalPlcPageData }) {
  const service = `${page.brand} PLC programming and automation services — ${page.location}`;
  const quoteHref = `/request-quote?type=service&service=${encodeURIComponent(service)}&subject=${encodeURIComponent(page.h1)}`;
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <StoreHeader />
      <header className="bg-[#101c2b] px-5 py-14 text-white sm:px-8 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-sky-300">{page.brand} PLC engineering · {page.location}</p>
          <h1 className="mt-3 max-w-4xl text-4xl font-bold sm:text-5xl">{page.h1}</h1>
          <p className="mt-6 max-w-3xl text-base leading-7 text-slate-300">{page.intro}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href={quoteHref} className="bg-sky-500 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-400">Request a Quote</Link>
            <Link href="/contact" className="border border-white/40 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">Contact SmartPLC Solutions</Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <h2 className="text-2xl font-bold">Plan the control work around your equipment</h2>
        <p className="mt-4 max-w-4xl leading-7 text-slate-600">{page.description} SmartPLC Solutions can discuss requirements for businesses in {page.location} and surrounding service areas. Work is scoped from the installed controller, machine sequence, drawings and site or remote support needs; service availability and travel arrangements are confirmed during enquiry.</p>
        <div className="mt-7 grid gap-5 md:grid-cols-2">
          {page.focus.map((item) => <article key={item} className="border border-slate-200 bg-slate-50 p-5"><h3 className="font-semibold">{item}</h3><p className="mt-2 text-sm leading-6 text-slate-600">Scope is confirmed against the actual PLC, connected equipment, available documentation and operating requirements before work is agreed.</p></article>)}
        </div>
      </section>

      <section className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
          <h2 className="text-2xl font-bold">Related products and engineering services</h2>
          <p className="mt-3 max-w-3xl leading-7 text-slate-600">Browse the current PLC catalogue or review related automation capabilities. Catalogue listings can change; send the exact part number when asking about supply so model, specification and availability can be checked.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/products?category=plc" className="border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-sky-800 hover:border-sky-500">PLC products</Link>
            <Link href="/plc" className="border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-sky-800 hover:border-sky-500">PLC systems</Link>
            <Link href="/plc-programming" className="border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-sky-800 hover:border-sky-500">PLC programming</Link>
            <Link href="/hmi-programming" className="border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-sky-800 hover:border-sky-500">HMI programming</Link>
            <Link href="/scada-programming" className="border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-sky-800 hover:border-sky-500">SCADA programming</Link>
            <Link href="/industrial-automation" className="border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-sky-800 hover:border-sky-500">Industrial automation</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <h2 className="text-2xl font-bold">Frequently asked questions</h2>
        <div className="mt-4 divide-y divide-slate-200">{page.faq.map((item) => <article key={item.question} className="py-5"><h3 className="font-semibold">{item.question}</h3><p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">{item.answer}</p></article>)}</div>
      </section>

      <section className="bg-[#101c2b] px-5 py-12 text-white sm:px-8"><div className="mx-auto flex max-w-6xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-2xl font-bold">Discuss your {page.brand} PLC requirement</h2><p className="mt-2 text-slate-300">Share the controller model, application, symptoms or supply part number and your location.</p></div><Link href={quoteHref} className="inline-flex w-fit bg-sky-500 px-5 py-3 text-sm font-semibold hover:bg-sky-400">Request a Quote</Link></div></section>
      <SiteFooter />
    </main>
  );
}
