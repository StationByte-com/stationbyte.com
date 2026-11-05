import { llmsIndex } from "@/content/llms";

export const dynamic = "force-static";

export async function GET() {
  return new Response(await llmsIndex("en"), { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
}
