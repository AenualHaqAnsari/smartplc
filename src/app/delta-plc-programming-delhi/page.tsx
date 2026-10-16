import type { Metadata } from "next";
import LocalPlcLandingPage, { type LocalPlcPageData } from "@/components/seo/LocalPlcLandingPage";

const page: LocalPlcPageData = {
  brand: "Delta", location: "Delhi / New Delhi",
  title: "Delta PLC Programming in Delhi and New Delhi",
  h1: "Delta PLC Programming, Supply and Automation in Delhi",
  description: "Delta PLC programming and automation services for machine builders and industrial operations in Delhi and New Delhi, including fault diagnosis, sequence changes, HMI integration and product supply enquiries.",
  intro: "Discuss Delta PLC programming in Delhi or New Delhi for a new machine, an existing production line or a control issue. We review the controller model, machine sequence, connected equipment and available drawings before defining programming, troubleshooting or supply enquiry scope.",
  focus: [
    "PLC programming and sequence changes: define operating modes, permissives, I/O behavior, alarms and restart conditions from the machine requirements.",
    "Troubleshooting and retrofit review: share fault symptoms, backups and electrical drawings so existing logic and field signals can be assessed before changes.",
    "HMI, SCADA and machine integration: discuss operator screens, alarm visibility, data exchange and interfaces with drives or other equipment where the installed hardware supports them.",
    "Delta PLC supplier or dealer enquiry: send the exact part number and quantity for a product availability and specification check. Supply status is confirmed per enquiry.",
  ],
  faq: [
    { question: "Do you provide Delta PLC programming in Delhi and New Delhi?", answer: "You can submit a programming or troubleshooting enquiry for equipment in Delhi or New Delhi. Scope, remote or site requirements, documentation and availability are reviewed before work is agreed." },
    { question: "Can I enquire about a Delta PLC supplier or dealer in Delhi?", answer: "Yes. Share the exact Delta model or part number, quantity and any required accessories. We will check the specific supply enquiry; this page does not represent authorized-dealer status." },
    { question: "What should I send for a Delta PLC troubleshooting request?", answer: "Include the controller model, fault description, when the issue occurs, relevant I/O or alarm details, recent changes and available program backup or electrical drawings." },
    { question: "Can a Delta PLC connect to an HMI or SCADA system?", answer: "Integration depends on the installed controller, HMI or SCADA platform, communication options and project requirements. Share device models and the signals or data to exchange for review." },
    { question: "Can you modify an existing machine program?", answer: "Potentially, after reviewing the current program, controller access, machine sequence and safety boundaries. Any change should include an agreed verification and backup approach." },
  ],
};

export const metadata: Metadata = { title: page.title, description: page.description, alternates: { canonical: "/delta-plc-programming-delhi" } };
export default function DeltaPlcDelhiPage() { return <LocalPlcLandingPage page={page} />; }
