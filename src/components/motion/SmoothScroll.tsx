"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

/** Lenis smooth scrolling plus scroll reveals for [data-reveal] and .line-mask elements, re-armed on every page. */
export default function SmoothScroll() {
  const pathname = usePathname();
  const lenis = useRef<Lenis | null>(null);

  // Back and Forward return to where the visitor was; new navigations start at the top.
  const history = useRef<number | null>(null);
  const positions = useRef(new Map<string, number>());
  // True from an internal link click until the new page has settled: Next scrolls before the URL changes.
  const leaving = useRef(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    lenis.current = reduce ? null : new Lenis({ autoRaf: true, anchors: { offset: -72 }, lerp: 0.11 });
    // Read the target the moment Back or Forward fires: Next's own scroll afterwards would overwrite it.
    const onPop = () => (history.current = positions.current.get(window.location.pathname) ?? 0);
    // Remember how far down each page the visitor got; paused while a restore is pending.
    const onScroll = () => {
      if (history.current === null && !leaving.current) positions.current.set(window.location.pathname, window.scrollY);
    };
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href^='/']");
      if (a && !e.metaKey && !e.ctrlKey && !e.shiftKey && a.getAttribute("href")?.split("#")[0] !== window.location.pathname) leaving.current = true;
    };
    document.addEventListener("click", onClick, true);
    window.addEventListener("scroll", onScroll, { passive: true });
    // Overlays (the mobile menu) pause smooth scrolling so the wheel can't move the page behind them.
    const stop = () => lenis.current?.stop();
    const start = () => lenis.current?.start();
    window.addEventListener("popstate", onPop);
    window.addEventListener("scroll-lock", stop);
    window.addEventListener("scroll-unlock", start);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("scroll-lock", stop);
      window.removeEventListener("scroll-unlock", start);
      lenis.current?.destroy();
      lenis.current = null;
    };
  }, []);

  useEffect(() => {
    // A new page starts at the top; Lenis keeps its own scroll position, so reset it too.
    let restore = 0;
    if (history.current !== null) {
      // Next scrolls the new page segment into view first; put the visitor back a frame later.
      const y = history.current;
      restore = requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          if (lenis.current) lenis.current.scrollTo(y, { immediate: true, force: true });
          else window.scrollTo(0, y);
          history.current = null;
        }),
      );
    } else if (!window.location.hash) lenis.current?.scrollTo(0, { immediate: true });
    leaving.current = false;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          // Also reveal anything already above the viewport, e.g. after a jump with End or an anchor link.
          if (!entry.isIntersecting && entry.boundingClientRect.top > 0) continue;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 },
    );
    const SELECTOR = "[data-reveal]:not(.is-in), .line-mask:not(.is-in)";
    document.querySelectorAll(SELECTOR).forEach((el) => observer.observe(el));
    // Content that mounts later (a form's result, a client-only section) gets revealed too.
    const watcher = new MutationObserver((records) => {
      for (const r of records)
        r.addedNodes.forEach((n) => {
          if (!(n instanceof Element)) return;
          if (n.matches(SELECTOR)) observer.observe(n);
          n.querySelectorAll(SELECTOR).forEach((el) => observer.observe(el));
        });
    });
    watcher.observe(document.body, { childList: true, subtree: true });
    // A jump (End key, anchor, restored position) can carry elements past the viewport without an
    // intersection ever firing; reveal anything that is already above the fold.
    let pending = 0;
    const sweep = () => {
      pending = 0;
      document.querySelectorAll(SELECTOR).forEach((el) => {
        if (el.getBoundingClientRect().bottom < 0) {
          el.classList.add("is-in");
          observer.unobserve(el);
        }
      });
    };
    const onScroll = () => (pending ||= requestAnimationFrame(sweep));
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(pending);
      cancelAnimationFrame(restore);
      observer.disconnect();
      watcher.disconnect();
    };
    // pathname is the trigger, not a value read inside: the effect re-arms reveals on every route.
    // oxlint-disable-next-line react/exhaustive-effect-dependencies
  }, [pathname]);

  return null;
}
