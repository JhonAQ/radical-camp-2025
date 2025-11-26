"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaBars,
  FaTimes,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaArrowRight,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Inicio", href: "#hero" },
  { name: "Información", href: "#info" },
  { name: "Experiencia", href: "#experience" },
  { name: "Invitados", href: "#speakers" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("Inicio");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Simple scroll spy
      const sections = navLinks.map((link) => link.href.substring(1));
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top >= 0 && rect.top <= 300) {
            setActiveSection(
              navLinks.find((link) => link.href === `#${section}`)?.name ||
                "Inicio"
            );
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Top Bar */}
      <div className="bg-black py-4 px-8 flex flex-col md:flex-row justify-between items-center text-xs md:text-sm relative z-50 font-sans">
        <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 md:gap-6 text-gray-300">
          <span className="flex items-center gap-2">
            <FaCalendarAlt className="text-cyan-400" /> 30 Dic - 03 Ene
          </span>
          <span className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-cyan-400" /> Campel, Arequipa
          </span>
          <span className="flex items-center gap-2">
            <FaPhoneAlt className="text-cyan-400" /> +51 999 888 777
          </span>
        </div>
        <div className="flex gap-4 mt-2 md:mt-0">
          <a
            href="#"
            className="text-white hover:text-cyan-400 transition-colors"
          >
            <FaInstagram size={16} />
          </a>
          <a
            href="#"
            className="text-white hover:text-cyan-400 transition-colors"
          >
            <FaTiktok size={16} />
          </a>
          <a
            href="#"
            className="text-white hover:text-cyan-400 transition-colors"
          >
            <FaYoutube size={16} />
          </a>
        </div>
      </div>

      {/* Floating Navbar */}
      <header className="fixed top-[70px] left-0 w-full z-40 px-4 pointer-events-none">
        <motion.nav
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={cn(
            "pointer-events-auto mx-auto max-w-6xl rounded-full px-2 pl-6 pr-2 py-2 flex justify-between items-center transition-all duration-300 bg-white shadow-lg",
            isScrolled ? "mt-[-40px] py-2" : "mt-0"
          )}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group mr-8">
            <img
              src="/RADICAL-logotipo.png"
              alt="Radical Camp"
              className="h-8 md:h-10 object-contain"
            />
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center justify-center flex-1 gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "px-5 py-2 rounded-full text-sm font-bold transition-all",
                  activeSection === link.name
                    ? "bg-[#6200ea] text-white shadow-md"
                    : "text-gray-600 hover:text-[#6200ea] hover:bg-gray-50"
                )}
                onClick={() => setActiveSection(link.name)}
                style={{ fontFamily: "var(--font-title)" }}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block ml-8">
            <button className="bg-black text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-gray-800 transition-all flex items-center gap-2 cursor-pointer shadow-lg">
              Inscribirme <FaArrowRight />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-800 p-2 ml-auto"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
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
                style={{ fontFamily: "var(--font-title)" }}
              >
                {link.name}
              </Link>
            ))}
            <button className="mt-8 bg-[#6200ea] text-white px-8 py-3 rounded-full font-bold text-lg w-full max-w-xs flex items-center justify-center gap-2">
              Inscribirme <FaArrowRight />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
