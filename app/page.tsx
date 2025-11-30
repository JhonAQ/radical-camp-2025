import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import Info from "@/components/sections/Info";
import Experience from "@/components/sections/Experience";
import Speakers from "@/components/sections/Speakers";
import FAQ from "@/components/sections/FAQ";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-dark-bg text-white overflow-x-hidden">
      <Navbar />
      <Hero />
      <Info />
      <Experience />
      <Speakers />
      <FAQ />
      <Footer />
    </main>
  );
}
