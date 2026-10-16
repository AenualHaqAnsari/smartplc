import type { Metadata } from "next";
import LocalPlcLandingPage, { type LocalPlcPageData } from "@/components/seo/LocalPlcLandingPage";

const page: LocalPlcPageData = {
  brand: "Delta", location: "Haridwar",
  title: "Delta PLC Automation Services in Haridwar",
  h1: "Delta PLC Programming and Automation Services in Haridwar",
  description: "Delta PLC automation services in Haridwar for programming, machine troubleshooting, sequence updates and HMI/SCADA integration, based on the controller, process and available project documentation.",
  intro: "Delta PLC automation services in Haridwar can begin with a practical review of the machine or process: what the PLC controls, what has changed, and what outcome is required. Share the controller model, drawings, program backup and site constraints so programming or troubleshooting scope can be assessed.",
  focus: [
    "Machine sequence programming: map automatic and manual modes, interlocks, operator actions and fault recovery to the actual equipment sequence.",
    "Troubleshooting and control updates: use fault timing, alarm history, I/O status and recent modifications to guide diagnosis before proposing logic changes.",
    "HMI/SCADA and drive coordination: review screen requirements, alarms, data exchange and drive signals against the installed devices and communications.",
    "Retrofit planning: identify existing Delta hardware, wiring changes, backup status and commissioning requirements before changing a running machine.",
  ],
  faq: [
    { question: "Do you handle Delta PLC automation services in Haridwar?", answer: "You can enquire about programming, machine automation and troubleshooting for equipment in Haridwar. The required information, site or remote approach and scheduling are assessed before confirming the work." },
    { question: "Can you help when a Delta PLC machine stops intermittently?", answer: "Provide the operating conditions, time and pattern of failures, alarms, I/O observations and recent maintenance or program changes. Those details help focus diagnostics." },
    { question: "Can an existing Delta PLC be connected to a new HMI?", answer: "Possibly, depending on controller model, available communication interfaces, HMI choice, tags, alarms and required operator functions. The system needs a compatibility review." },
    { question: "What information should accompany a Haridwar site enquiry?", answer: "Share the plant or machine context, address area for travel planning, controller model, electrical drawings, fault or change description, access requirements and preferred timeline." },
    { question: "Can you modify logic while keeping the existing machine sequence?", answer: "A requested change can be assessed against the current program and operating sequence. Backups, change boundaries, test conditions and safe restart requirements should be agreed first." },
  ],
};

export const metadata: Metadata = { title: page.title, description: page.description, alternates: { canonical: "/delta-plc-programming-haridwar" } };
export default function DeltaPlcHaridwarPage() { return <LocalPlcLandingPage page={page} />; }
