import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

/**
 * Maps URLs to locales: "/" and "/services" are English (rewritten internally to /en/...), "/es/..." is Spanish,
 * and "/en/..." redirects to the unprefixed URL so English has one address. No language detection, no cookie.
 */
export default createMiddleware(routing);

export const config = {
  // Skip Next internals and anything with a file extension (images, video, sitemap.xml, robots.txt, llms.txt).
  matcher: ["/((?!_next|_vercel|.*\\..*).*)"],
};
