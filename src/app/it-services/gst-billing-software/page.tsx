import type { Metadata } from "next";
import Link from "next/link";
import StoreHeader from "@/components/layout/StoreHeader";
import SiteFooter from "@/components/site/SiteFooter";

export const metadata: Metadata = {
  title: "GST Billing Software & Android App Development | SmartPLC",
  description:
    "Custom GST billing software and Android apps for invoicing, quotations, inventory, customer management, business reports, backup and workflow automation.",
  alternates: { canonical: "/it-services/gst-billing-software" },
  openGraph: {
    title: "GST Billing Software & Android App Development | SmartPLC",
    description:
      "Explore custom billing software, Android billing apps, invoice workflows, reporting and business system integrations.",
    url: "/it-services/gst-billing-software",
    type: "website",
  },
};

const capabilities = [
  {
    title: "GST Invoice Management",
    items: [
      "Configurable invoice numbering and business details",
      "Customer billing information and item-level records",
      "Taxable values, applicable tax rates and invoice totals",
      "Support for relevant CGST, SGST and IGST workflows",
      "Credit notes, debit notes or other documents where included in scope",
    ],
  },
  {
    title: "Quotations and Proforma Invoices",
    items: [
      "Prepare and share customer quotations",
      "Maintain quotation status and validity information",
      "Create proforma invoices for applicable business workflows",
      "Convert approved quotations into invoices where supported",
      "Keep document numbering and records organized",
    ],
  },
  {
    title: "Product and Inventory Management",
    items: [
      "Product codes, descriptions, units and selling prices",
      "Product categories and reusable item records",
      "Stock movement and stock balance features where required",
      "Low-stock notifications where supported",
      "Integration with existing product or inventory systems",
    ],
  },
  {
    title: "Customer and Supplier Records",
    items: [
      "Customer names, addresses and relevant tax details",
      "Supplier records for purchasing workflows",
      "Transaction history and outstanding balance views",
      "Reusable customer and product information",
      "Role-based access to business records where implemented",
    ],
  },
  {
    title: "Reports and Business Insights",
    items: [
      "Sales summaries by date or customer",
      "Tax and invoice summaries for review",
      "Outstanding payment and receivables reports",
      "Product sales and stock reports where configured",
      "Export options based on the agreed application scope",
    ],
  },
  {
    title: "PDF, Printing and Document Sharing",
    items: [
      "Professional invoice and quotation layouts",
      "PDF generation and document printing",
      "Share documents using supported Android features",
      "Business branding and configurable document fields",
      "Consistent document presentation across supported devices",
    ],
  },
];

const businessTypes = [
  {
    title: "Retailers and Wholesalers",
    text: "Manage routine sales, customer billing, product records and invoice histories.",
  },
  {
    title: "Distributors and Traders",
    text: "Organize customer-specific pricing, product catalogs, quotations and sales records.",
  },
  {
    title: "Manufacturers",
    text: "Connect billing requirements with product information, dispatch workflows and business reporting.",
  },
  {
    title: "Service Businesses",
    text: "Prepare quotations and invoices for services, projects, maintenance and recurring work.",
  },
  {
    title: "Field Sales Teams",
    text: "Explore mobile billing workflows for representatives who need customer and product information away from the office.",
  },
  {
    title: "Growing Businesses",
    text: "Plan a maintainable application that can evolve as the number of users, transactions and reporting needs increases.",
  },
];

const deliverySteps = [
  ["1. Requirements", "Understand your current invoices, tax workflow, users, products and reporting needs."],
  ["2. Solution Design", "Define screens, document formats, numbering, permissions, backup strategy and integrations."],
  ["3. Development", "Implement the agreed features for the selected web, desktop or Android platform."],
  ["4. Testing", "Validate calculations, document outputs, permissions, data handling and representative business scenarios."],
  ["5. Deployment and Support", "Plan installation, user onboarding, backup procedures and ongoing maintenance."],
];

export default function GSTBillingSoftwarePage() {
  const quoteUrl =
    "/request-quote?type=service&service=" +
    encodeURIComponent("GST Billing Software and Android App Development");

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <StoreHeader />

      <section className="bg-[#101c2b] px-5 py-16 text-white sm:px-8 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-[.25em] text-sky-300">
            IT Services / Billing Software
          </p>
          <h1 className="mt-3 max-w-4xl text-4xl font-bold sm:text-5xl">
            GST Billing Software Development and Android Billing Apps
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-7 text-slate-300">
            Streamline invoicing, quotations, customer records and business
            reporting with billing software designed around your workflows.
            SmartPLC Solutions develops custom software and mobile applications
            based on your requirements, business processes and deployment needs.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href={quoteUrl}
              className="inline-flex bg-sky-500 px-6 py-3 text-sm font-semibold text-white hover:bg-sky-400">
              Discuss Your Billing Requirements
            </Link>
            <a href="#billing-features"
              className="inline-flex border border-slate-500 px-6 py-3 text-sm font-semibold text-white hover:border-sky-300">
              Explore Features
            </a>
          </div>
          <p className="mt-5 text-sm leading-6 text-slate-400">
            Custom development for retailers, wholesalers, distributors,
            manufacturers and service businesses.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
        <h2 className="text-2xl font-bold sm:text-3xl">
          Billing Software That Fits Your Business
        </h2>
        <p className="mt-4 max-w-3xl leading-7 text-slate-600">
          Manual invoice preparation, duplicate data entry and disconnected
          records can make everyday billing difficult to manage. A properly
          scoped billing application can bring important tasks into one
          workflow, reduce repetitive entry and make business information
          easier to review.
        </p>
        <div className="mt-7 grid gap-5 md:grid-cols-3">
          <article className="border border-slate-200 p-5">
            <h3 className="font-bold">Organized Transactions</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Keep invoices, quotations, customer records and document
              histories structured in one application.
            </p>
          </article>
          <article className="border border-slate-200 p-5">
            <h3 className="font-bold">Faster Routine Work</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Reuse product and customer details to reduce repetitive
              information entry in supported workflows.
            </p>
          </article>
          <article className="border border-slate-200 p-5">
            <h3 className="font-bold">Clearer Reporting</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Review configured sales, invoice, tax and receivables summaries
              without relying solely on manually maintained records.
            </p>
          </article>
        </div>
      </section>

      <section id="billing-features" className="bg-slate-50 px-5 py-14 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold sm:text-3xl">
            GST Billing Software Features
          </h2>
          <p className="mt-4 max-w-3xl leading-7 text-slate-600">
            Select the modules your business needs. Final features depend on
            the project scope, platform, applicable tax requirements and
            integrations confirmed during discovery.
          </p>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((group) => (
              <article key={group.title} className="border border-slate-200 bg-white p-6">
                <h3 className="text-lg font-bold">{group.title}</h3>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600">
                  {group.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
        <h2 className="text-2xl font-bold sm:text-3xl">
          Android Billing App Development
        </h2>
        <p className="mt-4 max-w-3xl leading-7 text-slate-600">
          For businesses that invoice customers on the move, an Android
          application can provide a mobile interface for supported billing
          tasks. The design can be planned around the devices, connectivity
          conditions, user roles and business processes involved.
        </p>
        <div className="mt-7 grid gap-5 md:grid-cols-2">
          <article className="border border-slate-200 p-6">
            <h3 className="text-lg font-bold">Mobile Workflows</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600">
              <li>Customer and product lookup</li>
              <li>Invoice and quotation preparation</li>
              <li>PDF sharing and supported printing workflows</li>
              <li>Recent transaction history</li>
              <li>Role-appropriate screens and controls</li>
            </ul>
          </article>
          <article className="border border-slate-200 p-6">
            <h3 className="text-lg font-bold">Data and Synchronization Options</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600">
              <li>Local database storage where appropriate</li>
              <li>Server-based backup and restoration design</li>
              <li>Multi-device synchronization where implemented</li>
              <li>Authentication and controlled access</li>
              <li>Documented recovery and maintenance procedures</li>
            </ul>
          </article>
        </div>
        <p className="mt-5 text-sm leading-6 text-slate-500">
          Offline operation, real-time synchronization and remote recovery
          require explicit design and testing; they are not assumed to be
          available in every application.
        </p>
      </section>

      <section className="bg-slate-50 px-5 py-14 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Solutions for Different Business Types
          </h2>
          <div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {businessTypes.map((item) => (
              <article key={item.title} className="border border-slate-200 bg-white p-5">
                <h3 className="font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-14 sm:px-8 sm:py-16">
        <h2 className="text-2xl font-bold sm:text-3xl">
          Customization, Integration and Deployment
        </h2>
        <p className="mt-4 leading-7 text-slate-600">
          Depending on requirements, a project may include custom invoice
          layouts, data import, report development, application programming
          interfaces, existing software integration, user permissions and
          deployment planning. We assess the current workflow before
          recommending an implementation.
        </p>
        <div className="mt-8 space-y-5">
          {deliverySteps.map(([title, text]) => (
            <article key={title} className="border-l-4 border-sky-500 pl-5">
              <h3 className="font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 px-5 py-14 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-7 space-y-6">
            <div>
              <h3 className="font-semibold">Can you develop custom GST billing software?</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Yes. We can assess your invoicing, reporting, user access and
                integration requirements before proposing a custom solution.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Can quotations be converted into invoices?</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                This workflow can be included in the specification, with
                appropriate document numbering and status handling.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Can billing data be recovered if a device fails?</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Recovery depends on the backup design and whether backups
                have been configured and tested. A project can include a
                documented backup and restoration strategy.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Does the software automatically file GST returns?</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Portal filing and government integrations require separate
                assessment and implementation. No certification or filing
                capability is implied unless specifically verified.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Can you customize the software for our business?</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Yes. Share your existing billing process, required reports,
                platform preference and integration needs for a scope review.
              </p>
            </div>
          </div>
          <div className="mt-10 border border-slate-200 p-6">
            <h2 className="text-xl font-bold">Discuss Your GST Billing Project</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Tell us about your business, current billing process, required
              features and preferred platform.
            </p>
            <Link href={quoteUrl}
              className="mt-5 inline-flex bg-sky-600 px-6 py-3 text-sm font-semibold text-white hover:bg-sky-700">
              Request a Project Quote
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
