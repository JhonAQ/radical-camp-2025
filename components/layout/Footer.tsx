"use client";

import Link from "next/link";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaWhatsapp,
  FaTiktok,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-black pt-5 pb-5 px-4 lg:pt-15 lg:pb-6 lg:px-5 border-t border-white/10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 mb-4 lg:mb-10">
        {/* Brand */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left order-3 lg:order-1">
          <Link href="/" className="flex items-center gap-4 mb-4 lg:mb-6 group">
            <img
              src="/RADICAL-white.png"
              alt="Radical Camp"
              className="h-10 lg:h-12 object-contain"
            />
            <div className="h-6 lg:h-8 w-px bg-white/20"></div>
            <img
              src="/IELP-logo.png"
              alt="IELP"
              className="h-10 lg:h-12 object-contain"
            />
          </Link>
          <p className="text-[10px] lg:text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">
            IEL-P · Ministerio Nacional de Jóvenes
          </p>
          <p className="text-gray-400 leading-relaxed mb-4 lg:mb-6 text-sm lg:text-base max-w-sm mx-auto lg:mx-0">
            Trabajamos con los jóvenes de la IELP para brindar formación,
            acompañamiento y espacios de crecimiento en la fe.
          </p>
          <div className="hidden lg:flex gap-4 justify-center lg:justify-start">
            {[FaFacebook, FaInstagram, FaTiktok].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-secondary hover:text-black transition-all duration-300"
              >
                <Icon className="w-4 h-4 lg:w-5 lg:h-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="hidden lg:block text-center lg:text-left order-2 lg:order-2">
          <h4
            className="text-lg font-bold text-white mb-4 lg:mb-6"
            style={{ fontFamily: "var(--font-title)" }}
          >
            Enlaces Rápidos
          </h4>
          <ul className="grid grid-cols-2 gap-2 lg:block lg:space-y-2">
            {[
              { name: "Inicio", href: "/#hero" },
              { name: "Acerca de", href: "/#experience" },
              { name: "Speakers", href: "/#speakers" },
              { name: "Registro", href: "/registro" },
            ].map((item) => (
              <li
                key={item.name}
                className="flex justify-center lg:justify-start"
              >
                <Link
                  href={item.href}
                  className="text-gray-400 hover:text-secondary transition-colors flex items-center gap-2 text-sm lg:text-base"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary/50 hidden lg:block" />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="lg:col-span-1 text-center lg:text-left order-1 lg:order-3">
          <h4
            className="text-lg font-bold text-white mb-4 lg:mb-6"
            style={{ fontFamily: "var(--font-title)" }}
          >
            Contacto - Promotores Zonales
          </h4>
          <ul className="grid grid-cols-3 gap-2 text-sm">
            <li className="flex flex-col gap-1 items-center lg:items-start">
              <span className="text-secondary font-bold text-xs lg:text-sm uppercase tracking-wider">
                Arequipa
              </span>
              <span className="text-white font-medium text-xs lg:text-sm">
                Ronald Inquilla
              </span>
              <a
                href="https://wa.me/51947237843"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors text-xs lg:text-sm"
              >
                <FaWhatsapp className="w-4 h-4 lg:w-5 lg:h-5" />
                <span>947 237 843</span>
              </a>
            </li>
            <li className="flex flex-col gap-1 items-center lg:items-start">
              <span className="text-secondary font-bold text-xs lg:text-sm uppercase tracking-wider">
                Juliaca
              </span>
              <span className="text-white font-medium text-xs lg:text-sm">
                Fernando Cutipa
              </span>
              <a
                href="https://wa.me/51976024040"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors text-xs lg:text-sm"
              >
                <FaWhatsapp className="w-4 h-4 lg:w-5 lg:h-5" />
                <span>976 024 040</span>
              </a>
            </li>
            <li className="flex flex-col gap-1 items-center lg:items-start">
              <span className="text-secondary font-bold text-xs lg:text-sm uppercase tracking-wider">
                Tacna
              </span>
              <span className="text-white font-medium text-xs lg:text-sm">
                Wilber Arivilca
              </span>
              <a
                href="https://wa.me/51931697951"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors text-xs lg:text-sm"
              >
                <FaWhatsapp className="w-4 h-4 lg:w-5 lg:h-5" />
                <span>931 697 951</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10 pt-2 lg:pt-5 text-center text-gray-300 font-bold text-xs lg:text-sm">
        <p>
          &copy; {new Date().getFullYear()}{" "}
          <a
            href="https://github.com/JhonAQ"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-secondary transition-colors"
          >
            Jhonatan Arias (JhonAQ)
          </a>
          . Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
