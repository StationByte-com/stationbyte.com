import Image from "next/image";

/** Minimal browser chrome around a real screenshot: three dots and the address, nothing invented. */
export function BrowserFrame({
  src,
  alt,
  url,
  sizes,
  className = "",
  aspect = "aspect-[1440/756]",
  priority,
  tone = "dark",
}: {
  src: string;
  alt: string;
  url: string;
  sizes: string;
  className?: string;
  aspect?: string;
  priority?: boolean;
  tone?: "dark" | "light";
}) {
  const dark = tone === "dark";
  return (
    <div className={`overflow-hidden rounded-[18px] border ${dark ? "border-edge bg-graphite" : "border-line bg-white"} shadow-[0_40px_80px_-40px_rgb(10_10_11/0.45)] ${className}`}>
      <div className={`flex items-center gap-3 border-b px-4 py-3 ${dark ? "border-edge" : "border-line"}`}>
        <span aria-hidden="true" className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span key={i} className={`size-2.5 rounded-full ${dark ? "bg-edge" : "bg-line"}`} />
          ))}
        </span>
        <span className={`mx-auto max-w-[60%] truncate rounded-md px-3 py-1 font-mono text-[11px] ${dark ? "bg-ink text-fog" : "bg-paper text-steel"}`}>{url}</span>
        <span aria-hidden="true" className="w-[38px]" />
      </div>
      <div className={`relative ${aspect}`}>
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover object-top" />
      </div>
    </div>
  );
}

/** A phone outline around a real phone screenshot; `aspect` matches the screenshot so nothing is cropped. */
export function PhoneFrame({
  src,
  alt,
  sizes,
  className = "",
  aspect = "aspect-[390/640]",
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  aspect?: string;
}) {
  return (
    <div className={`relative rounded-[38px] border-[9px] border-ink bg-ink shadow-[0_40px_80px_-30px_rgb(10_10_11/0.5)] ${className}`}>
      <span aria-hidden="true" className="absolute left-1/2 top-2 z-10 h-[18px] w-[30%] -translate-x-1/2 rounded-full bg-ink" />
      <div className={`relative ${aspect} overflow-hidden rounded-[29px] bg-ink`}>
        <Image src={src} alt={alt} fill sizes={sizes} className="object-cover object-top" />
      </div>
    </div>
  );
}
