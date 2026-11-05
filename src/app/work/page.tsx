import type { Metadata } from "next";
import { pageMetadata } from "@/content/seo";
import PageHero from "@/components/site/PageHero";
import NextStep from "@/components/site/NextStep";
import Work from "@/components/home/Work";
import DeviceDuo from "@/components/visuals/DeviceDuo";
import JsonLd from "@/components/site/JsonLd";
import { workPage } from "@/content/schema";

export const metadata: Metadata = pageMetadata({
  title: "Work",
  description:
    "Selected work by StationByte: SkedEz, our own booking platform in production, and client projects we walk through on a call.",
  path: "/work",
  og: "work",
  ogAlt: "SkedEz on a desktop browser beside the words Products we build and run",
});

export default function WorkPage() {
  return (
    <main id="main">
      <JsonLd data={workPage} />
      <PageHero
        current="Work"
        eyebrow="Selected work"
        title={["Products we build", "and run."]}
        lede="We show what we can open up completely: our own product, live in production. For client work, we walk you through the projects closest to yours on a call."
        visual={<DeviceDuo />}
      />
      <Work intro={false} />
      <NextStep title={["Want to see work", "like yours?"]} />
    </main>
  );
}
