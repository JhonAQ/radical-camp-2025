"use client";

import Link from "next/link";
import {
  Rocket,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black pt-20 pb-10 px-5 border-t border-white/10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        {/* Brand */}
        <div>
          <Link href="/" className="flex items-center gap-4 mb-6 group">
            <img src="/RADICAL-white.png" alt="Radical Camp" className="h-12 object-contain" />
            <div className="h-8 w-px bg-white/20"></div>
            <img src="/IELP-logo.png" alt="IELP" className="h-12 object-contain" />
          </Link>
          <p className="text-gray-400 leading-relaxed mb-6">
            Un movimiento dedicado a despertar una generación apasionada por
            transformar su entorno a través de la fe y la acción.
          </p>
          <div className="flex gap-4">
            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
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
          <ul className="space-y-3">
            {[
              "Inicio",
              "Acerca de",
              "Speakers",
              "Agenda",
              "Registro",
              "Contacto",
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
        <div>
          <h4
            className="text-lg font-bold text-white mb-6"
            style={{ fontFamily: "var(--font-title)" }}
          >
            Contacto
          </h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-gray-400">
              <MapPin className="w-5 h-5 text-secondary shrink-0 mt-1" />
              <span>Av. Reforma 123, Col. Centro, Ciudad de México</span>
            </li>
            <li className="flex items-center gap-3 text-gray-400">
              <Phone className="w-5 h-5 text-secondary shrink-0" />
              <span>+52 (55) 1234 5678</span>
            </li>
            <li className="flex items-center gap-3 text-gray-400">
              <Mail className="w-5 h-5 text-secondary shrink-0" />
              <span>contacto@radicalcamp.com</span>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4
            className="text-lg font-bold text-white mb-6"
            style={{ fontFamily: "var(--font-title)" }}
          >
            Newsletter
          </h4>
          <p className="text-gray-400 mb-4 text-sm">
            Suscríbete para recibir noticias y actualizaciones exclusivas.
          </p>
          <form className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="Tu correo electrónico"
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-secondary transition-colors"
            />
            <button className="bg-secondary text-black font-bold py-3 rounded-lg hover:bg-white transition-colors cursor-pointer">
              Suscribirse
            </button>
          </form>
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
