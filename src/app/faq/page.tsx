import type { Metadata } from "next";
import Link from "next/link";
import StoreHeader from "@/components/layout/StoreHeader";
import SiteFooter from "@/components/site/SiteFooter";
export const metadata: Metadata = { title: "Industrial Automation FAQ", description: "Answers to common questions about product quotations, specifications, shipping, checkout, orders and automation services.", alternates: { canonical: "/faq" } };
const sections = [
  { title: "Products and quotations", items: [
    ["How do I request product pricing?", "Submit the quote form with the product or part number, quantity and application details. Availability and pricing are confirmed during review."],
    ["Are product specifications listed?", "Specifications are added when verified product data is available. Contact us with the model number to confirm ratings, I/O configuration or communications."],
    ["Which manufacturers do you support?", "Enquiries may cover Siemens, Delta, Rockwell Automation, Schneider Electric, Mitsubishi Electric, Omron, INVT, Fuji Electric, Panasonic, ABB, Autonics and Weintek. Product availability and supply status are confirmed per enquiry."],
    ["Are you an authorized distributor?", "Distributor or partner status is not stated on this website. Contact us about a specific product enquiry."],
  ]},
  { title: "Engineering services", items: [
    ["What services can I enquire about?", "PLC and HMI programming, SCADA, VFD and servo setup, troubleshooting, industrial communication, commissioning, machine automation and control panel engineering."],
    ["What information should I provide?", "Include the machine or process, installed PLC/HMI/drive models, drawings or I/O lists if available, site location and requested work."],
  ]},
  { title: "Orders and support", items: [
    ["How do I place an order?", "Available products can be added to your cart and ordered through checkout. For products that need confirmation, request a quote first."],
    ["How do I check an order?", "Sign in to your customer account to view order details and tracking information when available."],
    ["What payment methods are accepted?", "Payment methods available to you are displayed during checkout."],
    ["Where can I find shipping and returns information?", "Shipping and returns policies are linked in the site footer."],
  ]},
];
export default function FAQPage() { return <main className="min-h-screen bg-white text-slate-900"><StoreHeader/><section className="bg-[#101c2b] px-5 py-14 text-white sm:px-8"><div className="mx-auto max-w-5xl"><p className="text-xs font-semibold uppercase tracking-[.2em] text-sky-300">Help center</p><h1 className="mt-3 text-4xl font-bold">Frequently Asked Questions</h1><p className="mt-4 text-slate-300">Product, quotation, service and order information.</p></div></section><section className="mx-auto max-w-5xl space-y-10 px-5 py-12 sm:px-8">{sections.map(section=><div key={section.title}><h2 className="text-2xl font-bold">{section.title}</h2><div className="mt-4 divide-y divide-slate-200 border-y border-slate-200">{section.items.map(([question,answer])=><details key={question} className="py-4"><summary className="cursor-pointer font-semibold">{question}</summary><p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">{answer}</p></details>)}</div></div>)}<Link href="/request-quote" className="inline-flex bg-sky-600 px-5 py-3 text-sm font-semibold text-white">Request a Quote</Link></section><SiteFooter/></main> }

