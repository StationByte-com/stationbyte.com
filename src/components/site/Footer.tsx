import Link from "next/link";
import Logo from "@/components/brand/Logo";
import GiantWordmark from "@/components/brand/GiantWordmark";
import { nav, services, site } from "@/content/site";

const linkClass = "text-paper transition-colors hover:text-signal-ink";

export default function Footer() {
  // A server component rendered at build time: the year updates with each deploy.
  // oxlint-disable-next-line react/purity
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-edge bg-ink text-fog">
      <div className="shell flex flex-col gap-14 pb-10 pt-16">
        <div className="flex flex-wrap justify-between gap-12">
          <div className="flex flex-col gap-6">
            <Link href="/" aria-label="StationByte home" className="group/logo block"><Logo shuffle className="h-7 w-auto text-paper" /></Link>
            <Link href="/contact" className="self-start rounded-full bg-paper px-5.5 py-3.5 text-[15px] font-medium text-ink transition-colors hover:bg-signal hover:text-white">
              Start a project
            </Link>
          </div>
          <div className="flex flex-wrap gap-x-18 gap-y-10 text-[15px]">
            <nav aria-label="Footer" className="flex flex-col gap-2.5">
              <p className="eyebrow text-[11px] text-fog/80">Studio</p>
              {nav.map((item) => (
                <Link key={item.href} href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              ))}
              <Link href="/contact" className={linkClass}>Contact</Link>
            </nav>
            <div className="flex flex-col gap-2.5">
              <p className="eyebrow text-[11px] text-fog/80">Services</p>
              {services.map((s) => (
                <Link key={s.slug} href={`/services/${s.slug}`} className={linkClass}>
                  {s.title}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-2.5">
              <p className="eyebrow text-[11px] text-fog/80">Products</p>
              <a href="https://skedez.com" target="_blank" rel="noopener" className={linkClass}>
                SkedEz ↗
              </a>
              <p className="eyebrow mt-6 text-[11px] text-fog/80">Contact</p>
              <a href={`mailto:${site.email}`} className={linkClass}>
                {site.email}
              </a>
            </div>
          </div>
        </div>
        <GiantWordmark />
        <div className="flex flex-wrap justify-between gap-4 border-t border-edge pt-6 text-[13px]">
          <span>
            © {year} {site.legalName}
          </span>
          <div className="flex flex-wrap gap-6">
            <Link href="/privacy" className="transition-colors hover:text-paper">Privacy</Link>
            <span aria-hidden="true" className="eyebrow text-[11px] text-fog/80">8 tiles · 1 open slot</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
