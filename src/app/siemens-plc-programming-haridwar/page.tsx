import type { Metadata } from "next";
import LocalPlcLandingPage, { type LocalPlcPageData } from "@/components/seo/LocalPlcLandingPage";

const page: LocalPlcPageData = {
  brand: "Siemens", location: "Haridwar",
  title: "Siemens PLC Programming and S7-1200 Services in Haridwar",
  h1: "Siemens PLC Programming and S7-1200 Services in Haridwar",
  description: "Siemens PLC programming in Haridwar for S7-1200 service enquiries, fault diagnosis, sequence updates, HMI/SCADA integration and machine automation, subject to review of installed equipment and project scope.",
  intro: "Plan Siemens PLC programming in Haridwar around the specific controller and machine. For S7-1200 services, diagnostics or an automation change, include CPU and module references, the project archive and a clear description of the operating issue or required sequence.",
  focus: [
    "Siemens S7-1200 diagnostics: assess available project files, CPU and module references, software version and fault information before defining next steps.",
    "Programming and sequence changes: establish machine states, operating modes, permissives, alarms and recovery behavior from the documented process.",
    "HMI/SCADA integration: plan tags, alarm handling and operator functions around the existing controller, panel, network and software versions.",
    "Industrial automation support: review connected drives, sensors and upstream or downstream equipment when they affect the PLC sequence or machine fault.",
  ],
  faq: [
    { question: "Can I request Siemens PLC programming in Haridwar?", answer: "Yes. Send the controller details, project files if available, machine sequence and required result. We will review whether the work can be handled remotely or needs a site assessment." },
    { question: "Do you provide Siemens S7-1200 services in Haridwar?", answer: "S7-1200 service enquiries are reviewed based on the CPU, firmware and software environment, installed I/O, backup availability and the requested troubleshooting or programming scope." },
    { question: "What if I do not have the Siemens program backup?", answer: "Mention that in your enquiry and provide the CPU reference, access conditions, drawings and fault details. Feasibility depends on controller access and the available project information." },
    { question: "Can you coordinate PLC, HMI and SCADA changes?", answer: "Related changes can be scoped together when the controller, operator platform, tags, alarms and communication links are documented. Compatibility and testing needs must be confirmed." },
    { question: "How do I request a Siemens PLC product quote?", answer: "Send the exact part number, quantity and any required modules or accessories through the quote form. The catalogue and availability are checked against the specific request." },
  ],
};

export const metadata: Metadata = { title: page.title, description: page.description, alternates: { canonical: "/siemens-plc-programming-haridwar" } };
export default function SiemensPlcHaridwarPage() { return <LocalPlcLandingPage page={page} />; }
