import type { Metadata } from "next";
import AiServicePage from "@/components/ai/AiServicePage";
import { aiMetadata, aiServiceBySlug } from "@/lib/ai-automation";
const service = aiServiceBySlug.get("school-ai-agents")!;
export const metadata: Metadata = aiMetadata(service);
export default function Page() { return <AiServicePage service={service} />; }
