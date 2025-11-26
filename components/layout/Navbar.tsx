"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Rocket } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Inicio", href: "#hero" },
  { name: "Info", href: "#info" },
  { name: "Experiencia", href: "#experience" },
  { name: "Speakers", href: "#speakers" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Top Bar */}
      <div className="bg-black py-3 px-5 flex flex-col md:flex-row justify-between items-center text-sm border-b border-white/10 relative z-50">
        <div className="flex items-center gap-6 text-gray-400">
          <span className="flex items-center gap-2">
            <span className="text-secondary">📅</span> 30 Dic - 03 Ene
          </span>
          <span className="flex items-center gap-2">
            <span className="text-secondary">📍</span> Campel, Arequipa
          </span>
        </div>
        <div className="flex gap-4 mt-2 md:mt-0">
          {/* Social placeholders */}
          {["Facebook", "Twitter", "Instagram", "LinkedIn"].map((social) => (
            <a
              key={social}
              href="#"
              className="text-white hover:text-secondary transition-colors text-xs uppercase tracking-wider"
            >
              {social}
            </a>
          ))}
        </div>
      </div>

      {/* Floating Navbar */}
      <header className="fixed top-[60px] left-0 w-full px-[5%] z-40 pointer-events-none">
        <motion.nav
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={cn(
            "pointer-events-auto mx-auto max-w-7xl rounded-full px-6 md:px-8 py-3 flex justify-between items-center transition-all duration-300",
            isScrolled
              ? "bg-white/95 backdrop-blur-md shadow-lg py-2 mt-[-40px]" // Move up when scrolled
              : "bg-white/90 backdrop-blur-sm mt-0"
          )}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Rocket className="w-6 h-6 text-secondary group-hover:rotate-12 transition-transform" />
            <span
              className="font-black text-xl md:text-2xl text-primary tracking-tighter"
              style={{ fontFamily: "var(--font-title)" }}
            >
              RADICAL<span className="text-secondary">CAMP</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-800 font-semibold px-4 py-2 rounded-full text-sm hover:bg-primary hover:text-white transition-all hover:shadow-lg hover:shadow-primary/30"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <button className="bg-dark-bg text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-primary hover:scale-105 transition-all border-2 border-transparent cursor-pointer">
              Regístrate
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-800 p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </motion.nav>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-30 bg-black/95 backdrop-blur-xl pt-32 px-8 md:hidden flex flex-col gap-6 items-center"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-2xl font-bold text-white hover:text-secondary"
              >
                {link.name}
              </Link>
            ))}
            <button className="mt-8 bg-primary text-white px-8 py-3 rounded-full font-bold text-lg w-full max-w-xs">
              Regístrate Ahora
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
