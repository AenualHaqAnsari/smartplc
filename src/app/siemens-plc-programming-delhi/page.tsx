import type { Metadata } from "next";
import LocalPlcLandingPage, { type LocalPlcPageData } from "@/components/seo/LocalPlcLandingPage";

const page: LocalPlcPageData = {
  brand: "Siemens", location: "Delhi / New Delhi",
  title: "Siemens PLC Programming and S7-1200 Services in Delhi",
  h1: "Siemens PLC Programming and S7-1200 Services in Delhi",
  description: "Siemens PLC programming and S7-1200 service enquiries in Delhi and New Delhi for machine sequences, diagnostics, HMI/SCADA integration and automation changes, scoped to the installed hardware and software.",
  intro: "For Siemens PLC programming in Delhi and New Delhi, share the installed CPU, engineering software version, project backup and the behavior you need. Enquiries may cover S7-1200 diagnostics or logic changes, operator interface work and machine automation, subject to a review of the actual system.",
  focus: [
    "Siemens PLC programming: review the control narrative, I/O list, modes and interlocks before defining new logic or modifying an existing sequence.",
    "S7-1200 service enquiries: provide the CPU and module details, TIA Portal version where known, project archive and fault symptoms for a compatibility and scope review.",
    "HMI and SCADA integration: identify the Siemens controller, operator platform, tags, alarms and communication requirements to plan a practical interface.",
    "Machine automation and troubleshooting: document the cycle, abnormal behavior, connected drives and sensors, and recovery expectations so the issue can be narrowed down.",
  ],
  faq: [
    { question: "Are Siemens S7-1200 services available for Delhi projects?", answer: "Submit the CPU and system details with your requirement. We review the installed hardware, software version, access and whether remote or site work is appropriate before confirming scope." },
    { question: "What is needed to estimate Siemens PLC programming work?", answer: "A project backup, CPU and I/O details, electrical drawings, written machine sequence and a description of the requested change help establish scope." },
    { question: "Can you troubleshoot an S7-1200 fault remotely?", answer: "Some issues can be assessed remotely when safe access, project files and diagnostic information are available. Site attendance, if needed, depends on the agreed scope and scheduling." },
    { question: "Can Siemens PLCs be integrated with HMI or SCADA?", answer: "Integration is evaluated against the PLC and HMI/SCADA models, firmware and software versions, network setup, required tags and alarm behavior." },
    { question: "Do you supply Siemens PLC products in Delhi?", answer: "Use the PLC product catalogue or send the exact Siemens part number and quantity through the enquiry form. Product specification and availability are checked for each request." },
  ],
};

export const metadata: Metadata = { title: page.title, description: page.description, alternates: { canonical: "/siemens-plc-programming-delhi" } };
export default function SiemensPlcDelhiPage() { return <LocalPlcLandingPage page={page} />; }
