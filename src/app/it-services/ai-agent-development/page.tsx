import type { Metadata } from "next";
import Link from "next/link";
import StoreHeader from "@/components/layout/StoreHeader";
import SiteFooter from "@/components/site/SiteFooter";

export const metadata: Metadata = {
  title: "AI Agent Development & Business Automation | SmartPLC",
  description:
    "Custom AI agent development for customer support, lead qualification, WhatsApp workflows, appointment handling, document search and business integrations.",
  alternates: { canonical: "/it-services/ai-agent-development" },
  openGraph: {
    title: "AI Agent Development & Business Automation | SmartPLC",
    description:
      "Explore custom AI agents, business workflow automation and integrations with existing software and authorized data sources.",
    url: "/it-services/ai-agent-development",
    type: "website",
  },
};

const useCases = [
  {
    title: "AI Website Assistants",
    text: "Answer common questions, explain services, guide visitors to relevant information and collect enquiry details for follow-up.",
    items: ["Approved website content", "Service discovery", "Enquiry collection"],
  },
  {
    title: "Lead Qualification and Sales Support",
    text: "Help organize incoming leads and identify which enquiries need attention from your sales team.",
    items: ["Enquiry classification", "Requirement summaries", "Follow-up routing"],
  },
  {
    title: "WhatsApp and Messaging Workflows",
    text: "Explore approved messaging integrations for customer enquiries, notifications and selected support workflows.",
    items: ["Supported messaging APIs", "Message templates where required", "Escalation to staff"],
  },
  {
    title: "Appointment and Reminder Agents",
    text: "Connect conversational workflows with authorized calendars or booking systems to assist with scheduling.",
    items: ["Availability checks", "Booking requests", "Reminders and follow-ups"],
  },
  {
    title: "E-commerce AI Assistants",
    text: "Help shoppers discover products and get answers using authorized catalog, policy and order information.",
    items: ["Product discovery", "Policy questions", "Order assistance with permission"],
  },
  {
    title: "Document and Knowledge Assistants",
    text: "Make approved internal documentation easier to search and summarize, with access limited to permitted sources.",
    items: ["Document retrieval", "Knowledge search", "Source-grounded responses"],
  },
  {
    title: "Business Process Agents",
    text: "Coordinate selected routine tasks across supported business tools and APIs with appropriate validation.",
    items: ["Workflow triggers", "Data transfer", "Task status reporting"],
  },
  {
    title: "Custom Industry Solutions",
    text: "Assess AI applications for clinics, industrial service businesses, e-commerce operations and other specialized workflows.",
    items: ["Industry-specific requirements", "Existing system integration", "Human review where needed"],
  },
];

const developmentStages = [
  ["Discovery and feasibility", "Identify the business problem, users, expected benefits, constraints and measurable success criteria."],
  ["Data and integration design", "Identify approved knowledge sources, APIs, permissions, model options and data handling requirements."],
  ["Prototype and evaluation", "Test realistic user requests, difficult cases, incorrect assumptions and escalation behavior."],
  ["Controlled implementation", "Add authentication, authorization, input validation, logging, rate controls and human approval where appropriate."],
  ["Deployment and monitoring", "Deploy the agreed solution, monitor quality and errors, and establish a process for maintenance and updates."],
];

export default function AIAgentDevelopmentPage() {
  const quoteUrl =
    "/request-quote?type=service&service=" +
    encodeURIComponent("AI Agent Development and Business Automation");

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <StoreHeader />

      <section className="bg-[#101c2b] px-5 py-16 text-white sm:px-8 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-[.25em] text-sky-300">
            IT Services / Artificial Intelligence
          </p>
          <h1 className="mt-3 max-w-4xl text-4xl font-bold sm:text-5xl">
            Custom AI Agent Development and Business Automation
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-7 text-slate-300">
            Build AI-powered workflows that help your business respond to
            enquiries, retrieve information, assist customers and connect
            approved software systems. SmartPLC Solutions can assess your
            requirements and develop a solution around your existing processes.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href={quoteUrl}
              className="inline-flex bg-sky-500 px-6 py-3 text-sm font-semibold text-white hover:bg-sky-400">
              Discuss an AI Project
            </Link>
            <a href="#ai-use-cases"
              className="inline-flex border border-slate-500 px-6 py-3 text-sm font-semibold text-white hover:border-sky-300">
              Explore AI Use Cases
            </a>
          </div>
          <p className="mt-5 text-sm leading-6 text-slate-400">
            Custom development, integrations and workflow automation subject
            to technical feasibility and access permissions.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
        <h2 className="text-2xl font-bold sm:text-3xl">
          What Is an AI Agent?
        </h2>
        <p className="mt-4 max-w-3xl leading-7 text-slate-600">
          An AI agent is a software system that can interpret a request,
          consult permitted information and use approved tools to help complete
          a defined task. Depending on the design, it may answer questions,
          summarize documents, classify enquiries or coordinate actions through
          business APIs. The appropriate level of automation depends on the
          risk and complexity of the task.
        </p>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {[
            ["1. Understand", "Receive a question, request, event or workflow trigger."],
            ["2. Retrieve", "Find relevant information from authorized sources."],
            ["3. Process", "Use an AI model and defined business rules to determine a response or next step."],
            ["4. Act or Escalate", "Call approved tools, return a result or ask a person to review the action."],
          ].map(([title, text]) => (
            <article key={title} className="border border-slate-200 p-5">
              <h3 className="font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="ai-use-cases" className="bg-slate-50 px-5 py-14 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold sm:text-3xl">
            AI Agent Development Services
          </h2>
          <p className="mt-4 max-w-3xl leading-7 text-slate-600">
            Select a specific workflow or combine multiple capabilities in a
            larger project. Each solution is scoped according to data access,
            business rules, integration availability and expected outcomes.
          </p>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {useCases.map((item) => (
              <article key={item.title} className="border border-slate-200 bg-white p-6">
                <h3 className="text-lg font-bold">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.text}</p>
                <ul className="mt-4 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-600">
                  {item.items.map((point) => <li key={point}>{point}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
        <h2 className="text-2xl font-bold sm:text-3xl">
          Integration with Your Existing Systems
        </h2>
        <p className="mt-4 max-w-3xl leading-7 text-slate-600">
          An AI agent is most useful when it fits into an existing workflow.
          Depending on available interfaces and permissions, a project may
          integrate with websites, business databases, CRM tools, calendars,
          product catalogs, support systems or other software APIs.
        </p>
        <div className="mt-7 grid gap-5 md:grid-cols-3">
          <article className="border border-slate-200 p-5">
            <h3 className="font-bold">Websites and Customer Portals</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Add a conversational interface, guide visitors and route
              enquiries to an appropriate team.
            </p>
          </article>
          <article className="border border-slate-200 p-5">
            <h3 className="font-bold">Business APIs and Databases</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Retrieve or update permitted information through validated
              interfaces rather than unrestricted database access.
            </p>
          </article>
          <article className="border border-slate-200 p-5">
            <h3 className="font-bold">Messaging and Scheduling</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Assess supported messaging, notification, calendar and
              appointment integrations for your workflow.
            </p>
          </article>
        </div>
        <p className="mt-5 text-sm leading-6 text-slate-500">
          Integrations depend on vendor APIs, account permissions, platform
          policies, security review and any applicable service costs.
        </p>
      </section>

      <section className="bg-slate-50 px-5 py-14 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Our AI Agent Development Process
          </h2>
          <div className="mt-8 space-y-5">
            {developmentStages.map(([title, text]) => (
              <article key={title} className="border-l-4 border-sky-500 pl-5">
                <h3 className="font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-14 sm:px-8 sm:py-16">
        <h2 className="text-2xl font-bold sm:text-3xl">
          Security, Reliability and Human Oversight
        </h2>
        <p className="mt-4 leading-7 text-slate-600">
          AI systems can produce incorrect or incomplete responses. A
          production implementation should account for those limitations
          instead of assuming every output is correct.
        </p>
        <ul className="mt-6 list-disc space-y-3 pl-6 text-sm leading-7 text-slate-600">
          <li>Restrict access to approved data and tools.</li>
          <li>Keep API credentials on the server and protect sensitive information.</li>
          <li>Validate tool inputs and outputs before taking actions.</li>
          <li>Use timeouts, error handling, monitoring and usage limits.</li>
          <li>Require human approval for sensitive, financial or consequential actions where appropriate.</li>
          <li>Test representative scenarios and provide a path to human support.</li>
        </ul>
      </section>

      <section className="bg-slate-50 px-5 py-14 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-7 space-y-6">
            <div>
              <h3 className="font-semibold">Can you build a custom AI agent for my business?</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Yes. We can review your workflow, intended users, information
                sources, integrations and desired outcomes to assess a suitable solution.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Can an AI agent use our existing database?</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                It may access approved information through a controlled API or
                another suitable interface, subject to security and technical review.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Can you automate WhatsApp customer enquiries?</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                This can be assessed using supported integrations, authorized
                accounts and applicable platform policies.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Will an AI agent work without human involvement?</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Some low-risk tasks can be automated, while sensitive actions
                may need approval, review or escalation. The design depends on the workflow.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Can the solution be connected to our website or application?</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Integration can be considered where suitable interfaces,
                access permissions and technical requirements are available.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">What information is needed for a project quote?</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Describe the task to automate, who will use it, which systems
                it should connect to and what a successful outcome looks like.
              </p>
            </div>
          </div>
          <div className="mt-10 border border-slate-200 p-6">
            <h2 className="text-xl font-bold">Discuss Your AI Automation Project</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Share your current workflow and the tasks you want to automate.
              We can assess feasibility, integrations and a suitable implementation plan.
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
