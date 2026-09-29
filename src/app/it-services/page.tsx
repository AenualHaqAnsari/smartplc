import type { Metadata } from "next";
import Link from "next/link";
import StoreHeader from "@/components/layout/StoreHeader";
import SiteFooter from "@/components/site/SiteFooter";

export const metadata: Metadata = {
  title: "IT Services | Web and Android App Development",
  description:
    "Website, e-commerce, Android app and custom software development services. Share your requirements and request a project quote.",
  alternates: { canonical: "/it-services" },
};

const services = [
  {
    name: "Website Development",
    description:
      "Business websites and web applications designed around your goals, customers and workflows.",
    quoteService: "Website Development",
  },
  {
    name: "Android App Development",
    description:
      "Android applications for customer, field, operations and business use, from planning through release.",
    quoteService: "Android App Development",
  },
  {
    name: "E-commerce Development",
    description:
      "Online stores with product catalogs, checkout, payment integrations and order management.",
    quoteService: "E-commerce Development",
  },
  {
    name: "Custom Software & API Development",
    description:
      "Custom tools, backend systems and API integrations to connect your services and processes.",
    quoteService: "Custom Software and API Development",
  },
  {
    name: "App Support & Maintenance",
    description:
      "Updates, improvements, bug fixes and ongoing support for existing websites and applications.",
    quoteService: "App Support and Maintenance",
  },
];

export default function ITServicesPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <StoreHeader />
      <section className="bg-[#101c2b] px-5 py-16 text-white sm:px-8 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-[.25em] text-sky-300">
            IT Services
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold sm:text-5xl">
            Web, Android and Software Development
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300">
            Tell us what you want to build, who it is for and what it needs to do.
            We will review the scope and discuss a suitable solution.
          </p>
          <Link
            href="/request-quote?type=service"
            className="mt-8 inline-flex bg-sky-500 px-6 py-3 text-sm font-semibold text-white hover:bg-sky-400"
          >
            Discuss Your Project
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-5 py-14 sm:px-8 sm:py-16 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <article
            key={service.name}
            className="flex flex-col border border-slate-200 p-6 hover:border-sky-400 hover:shadow-md"
          >
            <h2 className="text-lg font-bold">{service.name}</h2>
            <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">
              {service.description}
            </p>
            <Link
              href={`/request-quote?type=service&service=${encodeURIComponent(service.quoteService)}`}
              className="mt-5 text-sm font-semibold text-sky-700 hover:text-sky-900"
            >
              Request a project quote →
            </Link>
          </article>
        ))}
      </section>
      <SiteFooter />
    </main>
  );
}
