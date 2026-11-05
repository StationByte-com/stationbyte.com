import { llmsFull } from "@/content/llms";

export const dynamic = "force-static";

export async function GET() {
  return new Response(await llmsFull("en"), { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
}
