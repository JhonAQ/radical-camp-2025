import Hero from "@/components/sections/Hero";
import Info from "@/components/sections/Info";
import Speakers from "@/components/sections/Speakers";
import Experience from "@/components/sections/Experience";
import FAQ from "@/components/sections/FAQ";

export default function DesktopLanding() {
  return (
    <div className="flex flex-col w-full">
      <Hero />
      <Info />
      <Speakers />
      <Experience />
      <FAQ />
    </div>
  );
}