import Hero from "@/components/home/Hero";
import Work from "@/components/home/Work";
import Services from "@/components/home/Services";
import Process from "@/components/home/Process";
import Studio from "@/components/home/Studio";
import Contact from "@/components/home/Contact";
import Marquee from "@/components/motion/Marquee";
import { stack } from "@/content/site";

export default function Home() {
  return (
    <main id="main">
        <Hero />
        <div className="mt-20 md:mt-24">
          <Marquee items={stack} label="Tools we build with" />
        </div>
        <div className="mt-28 md:mt-32">
          <Work />
        </div>
        <Services />
        <Process />
        <Studio />
        <Contact />
    </main>
  );
}
