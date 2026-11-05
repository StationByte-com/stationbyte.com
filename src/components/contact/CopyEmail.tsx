"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { site } from "@/content/site";

/** The studio address as text with a copy button; falls back to opening the mail app. */
export default function CopyEmail() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${site.email}`;
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <a href={`mailto:${site.email}`} className="text-[clamp(20px,1.8vw,24px)] font-medium tracking-[-0.02em] [overflow-wrap:anywhere] transition-colors hover:text-signal-deep">
        {site.email}
      </a>
      <motion.button
        layout
        type="button"
        onClick={copy}
        transition={{ layout: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }}
        className={`min-h-11 overflow-hidden rounded-full border px-4.5 py-2.5 text-[14px] font-medium transition-colors duration-300 ${
          copied ? "border-signal bg-signal text-white" : "border-line bg-white hover:border-ink"
        }`}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={copied ? "done" : "copy"}
            className="block"
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -14, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {copied ? "Copied ✓" : "Copy"}
          </motion.span>
        </AnimatePresence>
      </motion.button>
      <span role="status" className="sr-only">
        {copied ? "Email address copied" : ""}
      </span>
    </div>
  );
}
