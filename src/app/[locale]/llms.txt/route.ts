import { llmsIndex } from "@/content/llms";
import { defaultLocale, isLocale, locales } from "@/i18n/locales";

// English is served at /llms.txt; every other language at /<locale>/llms.txt.
export const dynamic = "force-static";
export const dynamicParams = false;
export const generateStaticParams = () => locales.filter((l) => l !== defaultLocale).map((locale) => ({ locale }));

export async function GET(_: Request, { params }: RouteContext<"/[locale]/llms.txt">) {
  const { locale } = await params;
  if (!isLocale(locale)) return new Response("Not found", { status: 404 });
  return new Response(await llmsIndex(locale), { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
}
