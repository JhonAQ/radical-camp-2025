"use client";

import Link from "next/link";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaWhatsapp,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-black pt-20 pb-10 px-5 border-t border-white/10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
        {/* Brand */}
        <div>
          <Link href="/" className="flex items-center gap-4 mb-6 group">
            <img
              src="/RADICAL-white.png"
              alt="Radical Camp"
              className="h-12 object-contain"
            />
            <div className="h-8 w-px bg-white/20"></div>
            <img
              src="/IELP-logo.png"
              alt="IELP"
              className="h-12 object-contain"
            />
          </Link>
          <p className="text-gray-400 leading-relaxed mb-6">
            Un movimiento dedicado a despertar una generación apasionada por
            transformar su entorno a través de la fe y la acción.
          </p>
          <div className="flex gap-4">
            {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-secondary hover:text-black transition-all duration-300"
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4
            className="text-lg font-bold text-white mb-6"
            style={{ fontFamily: "var(--font-title)" }}
          >
            Enlaces Rápidos
          </h4>
          <ul className="space-y-2">
            {[
              "Inicio",
              "Acerca de",
              "Speakers",
              "Registro",
            ].map((item) => (
              <li key={item}>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-secondary transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary/50" />
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="lg:col-span-1">
          <h4
            className="text-lg font-bold text-white mb-6"
            style={{ fontFamily: "var(--font-title)" }}
          >
            Contacto - Promotores Zonales
          </h4>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-4 text-sm">
            <li className="flex flex-col gap-1">
              <span className="text-secondary font-bold text-sm uppercase tracking-wider">
                Arequipa
              </span>
              <span className="text-white font-medium">Ronald Inquilla</span>
              <a
                href="https://wa.me/51947237843"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors"
              >
                <FaWhatsapp className="w-5 h-5" />
                <span>947 237 843</span>
              </a>
            </li>
            <li className="flex flex-col gap-1">
              <span className="text-secondary font-bold text-sm uppercase tracking-wider">
                Juliaca
              </span>
              <span className="text-white font-medium">Fernando Cutipa</span>
              <a
                href="https://wa.me/51976024040"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors"
              >
                <FaWhatsapp className="w-5 h-5" />
                <span>976 024 040</span>
              </a>
            </li>
            <li className="flex flex-col gap-1">
              <span className="text-secondary font-bold text-sm uppercase tracking-wider">
                Tacna
              </span>
              <span className="text-white font-medium">Wilber Arivilca</span>
              <a
                href="https://wa.me/51931697951"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors"
              >
                <FaWhatsapp className="w-5 h-5" />
                <span>931 697 951</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10 pt-8 text-center text-gray-500 text-sm">
        <p>
          &copy; {new Date().getFullYear()} Radical Camp. Todos los derechos
          reservados.
        </p>
      </div>
    </footer>
  );
}
