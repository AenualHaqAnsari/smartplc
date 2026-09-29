import type { Metadata } from "next";
import Link from "next/link";
import StoreHeader from "@/components/layout/StoreHeader";
import SiteFooter from "@/components/site/SiteFooter";

export const metadata: Metadata = {
  title: "About Industrial Automation",
  description:
    "Explore industrial automation products and engineering support for PLC, HMI, SCADA, drives, motion control, sensors and industrial networks.",
  alternates: { canonical: "/about" },
};

const capabilities = [
  {
    title: "PLC and machine control",
    text: "Programmable logic controllers coordinate machine sequences, inputs, outputs, interlocks and process logic. We support product enquiries and project scopes involving PLC selection, programming, modifications, fault finding and control-system upgrades.",
  },
  {
    title: "HMI and SCADA",
    text: "Human-machine interfaces and supervisory control systems give operators a way to monitor equipment, view alarms, adjust permitted settings and understand process status. Enquiries can include screen design, communications, data display and integration with existing controllers.",
  },
  {
    title: "Drives and motion control",
    text: "Variable frequency drives regulate AC motor speed and torque for applications such as pumps, fans and conveyors. Servo systems provide controlled positioning and motion. Product and engineering enquiries can cover drive selection, setup, parameter changes and troubleshooting.",
  },
  {
    title: "Sensors and instrumentation",
    text: "Sensors and measurement devices provide the signals automation systems use to detect position, presence, level, pressure, temperature and other operating conditions. Correct selection depends on the material, environment, range, mounting and controller interface.",
  },
  {
    title: "Industrial communication",
    text: "Industrial networks connect controllers, operator panels, drives, remote I/O and supervisory systems. We can review communication requirements, device compatibility, network interfaces and integration needs, including common industrial protocols.",
  },
  {
    title: "Control panels and components",
    text: "Control panels bring protection, switching, power distribution, control and indication equipment together. Enquiries may cover panel components, design and documentation requirements, upgrades, or manufacturing scope for a specific machine or process.",
  },
];

const projectStages = [
  ["Understand the application", "Describe the machine or process, operating conditions, required outcome and current control equipment."],
  ["Review equipment and scope", "Share model numbers, drawings, photos, I/O lists, network details or fault symptoms that help define the requirement."],
  ["Plan the solution", "Product selection and engineering work are discussed against compatibility, functionality, project constraints and site needs."],
  ["Support implementation", "Depending on the agreed scope, work may include configuration, programming, integration, commissioning or troubleshooting."],
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <StoreHeader />
      <section className="bg-[#101c2b] px-5 py-16 text-white sm:px-8 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[.25em] text-sky-300">
            About Industrial Automation
          </p>
          <h1 className="mt-3 max-w-4xl text-4xl font-bold leading-tight sm:text-5xl">
            Practical automation products and engineering for machines and processes
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-7 text-slate-300">
            Industrial automation brings electrical equipment, control logic, software and communication together to make machines and processes operate as intended. We help customers explore automation products and define engineering enquiries around the actual application.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/products" className="bg-sky-500 px-6 py-3 text-sm font-semibold text-white hover:bg-sky-400">
              Explore Products
            </Link>
            <Link href="/request-quote?type=service" className="border border-white/40 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10">
              Discuss a Project
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-sky-700">
            Industrial automation, explained
          </p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            Connecting equipment, control and people
          </h2>
          <p className="mt-5 text-base leading-7 text-slate-600">
            An automation system uses sensors and field devices to observe a process, controllers to make decisions, and outputs such as motors, valves and actuators to affect it. HMIs and SCADA systems help operators see what is happening, while industrial networks let devices exchange information. The right combination depends on the machine, operating environment, production goals and equipment already installed.
          </p>
        </div>
        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((item) => (
            <article key={item.title} className="border border-slate-200 bg-white p-6">
              <h3 className="text-lg font-bold">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 px-5 py-14 sm:px-8 sm:py-16">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[.85fr_1.15fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.2em] text-sky-700">
              How we approach enquiries
            </p>
            <h2 className="mt-3 text-3xl font-bold">Start with the application</h2>
            <p className="mt-5 text-sm leading-7 text-slate-600">
              Automation work is shaped by the process, installed hardware, operating conditions and desired result. Useful details at the enquiry stage help clarify compatibility, identify missing information and establish a realistic scope for quotation.
            </p>
            <Link href="/request-quote?type=service" className="mt-7 inline-flex bg-sky-600 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-700">
              Request a Project Quote
            </Link>
          </div>
          <ol className="space-y-3">
            {projectStages.map(([title, text], index) => (
              <li key={title} className="flex gap-4 border border-slate-200 bg-white p-5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sm font-bold text-sky-800">
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-bold">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold">Products and engineering support</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              The product range covers PLCs, HMIs, drives, servo systems, sensors, control-panel components and industrial communication equipment. Engineering enquiries can include programming, integration, commissioning, troubleshooting, retrofit and machine modification work. Product availability, specifications and service scope are confirmed during review.
            </p>
          </div>
          <div className="border-l-2 border-sky-600 pl-6">
            <h2 className="text-2xl font-bold">What to include in your enquiry</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Tell us what the equipment does, what you need it to do, and what is currently installed. Include manufacturer and model numbers, photos, drawings, error messages, timelines and site or remote-support requirements where available. We will use those details to understand the request and follow up about the next steps.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#101c2b] px-5 py-12 text-white sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold">Have an automation requirement?</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Share your product needs, equipment details or project scope for review.
            </p>
          </div>
          <Link href="/request-quote" className="shrink-0 bg-sky-500 px-6 py-3 text-sm font-semibold text-white hover:bg-sky-400">
            Request a Quote
          </Link>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}