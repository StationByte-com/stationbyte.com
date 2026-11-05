import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
    // Copy is written by hand; a missing key must fail loudly in development, and fall back to the key path in production.
    onError(error) {
      if (process.env.NODE_ENV !== "production") console.error(error.message);
    },
  };
});
