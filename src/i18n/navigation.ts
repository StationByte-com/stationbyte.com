import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/** Locale-aware drop-ins for next/link and next/navigation: hrefs stay "/services", the prefix is added for you. */
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
