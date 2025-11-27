"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  FaUser,
  FaIdCard,
  FaPhone,
  FaChurch,
  FaMoneyBillWave,
  FaQrcode,
  FaFileUpload,
  FaCheckCircle,
  FaArrowRight,
  FaArrowLeft,
  FaSuitcase,
  FaBook,
  FaTshirt,
  FaSun,
  FaHeart,
  FaShower,
} from "react-icons/fa";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const recommendations = [
  { icon: FaBook, text: "Biblia y cuaderno", sub: "Tus armas espirituales" },
  {
    icon: FaSuitcase,
    text: "Sleeping bag / Frazada",
    sub: "Noches de campamento",
  },
  {
    icon: FaShower,
    text: "Artículos de aseo",
    sub: "Personal e intransferible",
  },
  { icon: FaTshirt, text: "Ropa cómoda", sub: "Deportiva y para ensuciar" },
  { icon: FaSun, text: "Protección", sub: "Repelente y bloqueador" },
  { icon: FaHeart, text: "Corazón dispuesto", sub: "Lo más importante" },
];

export default function RegistroPage() {
  const [step, setStep] = useState(1);
  const [paymentType, setPaymentType] = useState<"full" | "reservation">(
    "full"
  );
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    edad: "",
    dni: "",
    celular: "",
    iglesia: "",
    ciudad: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <main className="min-h-screen bg-dark-bg text-white font-sans selection:bg-secondary selection:text-black overflow-x-hidden">
      <Navbar />

      <div className="flex flex-col lg:flex-row min-h-screen pt-20">
        {/* LEFT PANEL: Visuals & Info */}
        <div className="lg:w-1/2 relative p-8 lg:p-16 flex flex-col justify-center overflow-hidden bg-[#050505]">
          {/* Background Image with Blend Mode */}
          <div className="absolute inset-0 z-0 opacity-30 mix-blend-screen pointer-events-none">
            <Image
              src="/RADICAL-white.png"
              alt="Background"
              fill
              className="object-cover object-center opacity-50"
            />
          </div>

          {/* Animated Gradient Blob */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-[120px] -z-10 animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] -z-10 animate-pulse delay-1000" />

          {/* Content */}
          <div className="relative z-10 mt-10 lg:mt-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1
                className="text-6xl lg:text-8xl font-black tracking-tighter mb-2 leading-[0.9] glitch-text"
                data-text="REGISTRO"
              >
                REGISTRO
              </h1>
              <h1 className="text-6xl lg:text-8xl font-black tracking-tighter mb-6 leading-[0.9]">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary via-white to-primary animate-text-shine bg-[length:200%_auto]">
                  2025
                </span>
              </h1>
              <p className="text-xl text-gray-400 max-w-md mb-12 font-light tracking-wide">
                No es solo un evento, es el inicio de tu nueva historia. <br />
                <span className="text-secondary font-bold">¿Estás listo?</span>
              </p>
            </motion.div>

            {/* Recommendations List (Desktop) */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="hidden lg:block bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl"
            >
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-secondary uppercase tracking-widest">
                <FaSuitcase /> Kit de Supervivencia
              </h3>
              <div className="grid grid-cols-2 gap-6">
                {recommendations.map((item, i) => (
                  <div key={i} className="flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-800 to-black flex items-center justify-center text-secondary group-hover:scale-110 group-hover:text-white transition-all duration-300 border border-white/5 shadow-lg">
                      <item.icon />
                    </div>
                    <div>
                      <p className="font-bold text-gray-200 text-sm group-hover:text-secondary transition-colors">
                        {item.text}
                      </p>
                      <p className="text-xs text-gray-500">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* RIGHT PANEL: Form */}
        <div className="lg:w-1/2 bg-[#080808] p-6 lg:p-12 flex flex-col justify-center relative border-l border-white/5">
          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-size-[2rem_2rem] opacity-20 pointer-events-none"></div>

          <div className="max-w-xl mx-auto w-full relative z-10">
            {/* Progress Steps */}
            <div className="flex justify-between items-center mb-12 relative">
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-800 -z-10"></div>
              <div
                className="absolute top-1/2 left-0 h-0.5 bg-secondary -z-10 transition-all duration-500"
                style={{
                  width: step === 1 ? "0%" : step === 2 ? "50%" : "100%",
                }}
              ></div>

              {[1, 2, 3].map((s) => (
                <div key={s} className="flex flex-col items-center gap-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-2 ${
                      step >= s
                        ? "bg-black border-secondary text-secondary shadow-[0_0_15px_rgba(0,212,255,0.5)]"
                        : "bg-black border-gray-700 text-gray-600"
                    }`}
                  >
                    {step > s ? <FaCheckCircle /> : s}
                  </div>
                  <span
                    className={`text-xs font-bold uppercase tracking-wider ${
                      step >= s ? "text-white" : "text-gray-600"
                    }`}
                  >
                    {s === 1 ? "Datos" : s === 2 ? "Pago" : "Fin"}
                  </span>
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {/* Step 1: Personal Info */}
              {step === 1 && (
                <motion.form
                  key="step1"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  onSubmit={(e) => {
                    e.preventDefault();
                    nextStep();
                  }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group">
                      <label className="block text-xs text-gray-500 uppercase font-bold mb-2 group-focus-within:text-secondary transition-colors">
                        Nombres
                      </label>
                      <input
                        type="text"
                        name="nombres"
                        required
                        value={formData.nombres}
                        onChange={handleInputChange}
                        className="w-full bg-white/5 border-b-2 border-gray-700 px-4 py-3 text-white focus:border-secondary focus:bg-white/10 outline-none transition-all rounded-t-lg"
                        placeholder="Tu nombre"
                      />
                    </div>
                    <div className="group">
                      <label className="block text-xs text-gray-500 uppercase font-bold mb-2 group-focus-within:text-secondary transition-colors">
                        Apellidos
                      </label>
                      <input
                        type="text"
                        name="apellidos"
                        required
                        value={formData.apellidos}
                        onChange={handleInputChange}
                        className="w-full bg-white/5 border-b-2 border-gray-700 px-4 py-3 text-white focus:border-secondary focus:bg-white/10 outline-none transition-all rounded-t-lg"
                        placeholder="Tus apellidos"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group">
                      <label className="block text-xs text-gray-500 uppercase font-bold mb-2 group-focus-within:text-secondary transition-colors">
                        Edad
                      </label>
                      <input
                        type="number"
                        name="edad"
                        required
                        // Removed min="17" restriction as requested
                        value={formData.edad}
                        onChange={handleInputChange}
                        className="w-full bg-white/5 border-b-2 border-gray-700 px-4 py-3 text-white focus:border-secondary focus:bg-white/10 outline-none transition-all rounded-t-lg"
                        placeholder="Tu edad"
                      />
                    </div>
                    <div className="group">
                      <label className="block text-xs text-gray-500 uppercase font-bold mb-2 group-focus-within:text-secondary transition-colors">
                        DNI / Documento
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="dni"
                          required
                          value={formData.dni}
                          onChange={handleInputChange}
                          className="w-full bg-white/5 border-b-2 border-gray-700 px-4 py-3 text-white focus:border-secondary focus:bg-white/10 outline-none transition-all rounded-t-lg pl-10"
                          placeholder="Número de documento"
                        />
                        <FaIdCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group">
                      <label className="block text-xs text-gray-500 uppercase font-bold mb-2 group-focus-within:text-secondary transition-colors">
                        Celular
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          name="celular"
                          required
                          value={formData.celular}
                          onChange={handleInputChange}
                          className="w-full bg-white/5 border-b-2 border-gray-700 px-4 py-3 text-white focus:border-secondary focus:bg-white/10 outline-none transition-all rounded-t-lg pl-10"
                          placeholder="WhatsApp"
                        />
                        <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                      </div>
                    </div>
                    <div className="group">
                      <label className="block text-xs text-gray-500 uppercase font-bold mb-2 group-focus-within:text-secondary transition-colors">
                        Iglesia / Ciudad
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="iglesia"
                          value={formData.iglesia}
                          onChange={handleInputChange}
                          className="w-full bg-white/5 border-b-2 border-gray-700 px-4 py-3 text-white focus:border-secondary focus:bg-white/10 outline-none transition-all rounded-t-lg pl-10"
                          placeholder="¿De dónde nos visitas?"
                        />
                        <FaChurch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 flex justify-end">
                    <button
                      type="submit"
                      className="group relative px-8 py-3 bg-white text-black font-black uppercase tracking-wider hover:bg-secondary transition-colors clip-path-button"
                      style={{
                        clipPath:
                          "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)",
                      }}
                    >
                      Siguiente
                      <span
                        className="absolute inset-0 border-2 border-black pointer-events-none"
                        style={{
                          clipPath:
                            "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)",
                        }}
                      ></span>
                    </button>
                  </div>
                </motion.form>
              )}

              {/* Step 2: Payment */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="space-y-8"
                >
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
                    <FaMoneyBillWave className="text-secondary" /> SELECCIONA TU
                    PLAN
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div
                      onClick={() => setPaymentType("full")}
                      className={`cursor-pointer p-6 border transition-all relative group ${
                        paymentType === "full"
                          ? "border-secondary bg-secondary/10"
                          : "border-gray-800 bg-black/40 hover:border-gray-600"
                      }`}
                    >
                      <div className="absolute top-0 right-0 w-0 h-0 border-t-[30px] border-r-[30px] border-t-transparent border-r-secondary/50 group-hover:border-r-secondary transition-colors"></div>
                      <h3 className="font-bold text-lg mb-1 text-gray-300 group-hover:text-white">
                        PAGO COMPLETO
                      </h3>
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-gray-500 line-through text-lg decoration-red-500 decoration-2">
                          S/ 190
                        </span>
                        <span className="text-4xl font-black text-white tracking-tighter">
                          S/ 150
                        </span>
                      </div>
                      <p className="text-xs text-secondary font-bold mb-2 animate-pulse">
                        ¡OFERTA HASTA EL 15 DIC!
                      </p>
                      <p className="text-xs text-gray-500 font-mono">
                        // ACCESO TOTAL
                      </p>
                    </div>

                    <div
                      onClick={() => setPaymentType("reservation")}
                      className={`cursor-pointer p-6 border transition-all relative group ${
                        paymentType === "reservation"
                          ? "border-secondary bg-secondary/10"
                          : "border-gray-800 bg-black/40 hover:border-gray-600"
                      }`}
                    >
                      <div className="absolute top-0 right-0 w-0 h-0 border-t-[30px] border-r-[30px] border-t-transparent border-r-secondary/50 group-hover:border-r-secondary transition-colors"></div>
                      <h3 className="font-bold text-lg mb-1 text-gray-300 group-hover:text-white">
                        RESERVA
                      </h3>
                      <p className="text-4xl font-black text-white mb-1 tracking-tighter">
                        S/ 50
                      </p>
                      <p className="text-xs text-secondary font-bold mb-2">
                        CONGELA EL PRECIO DE S/ 150
                      </p>
                      <p className="text-xs text-gray-500 font-mono">
                        // ASEGURA TU CUPO
                      </p>
                    </div>
                  </div>

                  {/* Yape Section */}
                  <div className="bg-[#1a1a1a] border border-gray-800 p-6 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#742298] to-[#5d1a7a]"></div>
                    <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                      <div className="bg-white p-2 shrink-0 shadow-[0_0_20px_rgba(116,34,152,0.3)]">
                        <div className="w-32 h-32 bg-gray-200 flex items-center justify-center border border-gray-300">
                          <FaQrcode className="text-gray-400 text-5xl" />
                        </div>
                      </div>
                      <div className="flex-1 text-center md:text-left">
                        <h3 className="text-xl font-bold mb-1 text-[#bc5be6]">
                          YAPE / PLIN
                        </h3>
                        <p className="text-3xl font-black mb-4 tracking-widest">
                          999 888 777
                        </p>
                        <div className="text-xs text-gray-400 font-mono bg-black/50 p-3 border border-gray-800">
                          MSG: {formData.nombres.split(" ")[0]}{" "}
                          {formData.apellidos.split(" ")[0]} -{" "}
                          {paymentType === "full" ? "FULL" : "RESERVA"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Upload Voucher */}
                  <div className="space-y-3">
                    <label className="text-xs text-gray-500 uppercase font-bold">
                      Comprobante de pago
                    </label>
                    <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-secondary hover:bg-secondary/5 transition-all cursor-pointer group">
                      <FaFileUpload className="mx-auto text-3xl text-gray-600 group-hover:text-secondary mb-3 transition-colors" />
                      <p className="text-gray-400 text-sm group-hover:text-white transition-colors">
                        Arrastra o haz clic para subir
                      </p>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*,application/pdf"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between items-center">
                    <button
                      onClick={prevStep}
                      className="text-gray-500 hover:text-white text-sm font-bold uppercase tracking-wider flex items-center gap-2 transition-colors"
                    >
                      <FaArrowLeft /> Volver
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="bg-secondary text-black px-8 py-3 font-black uppercase tracking-wider hover:bg-white hover:scale-105 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(0,212,255,0.4)]"
                      style={{
                        clipPath:
                          "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)",
                      }}
                    >
                      Finalizar
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Success */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-10"
                >
                  <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                    <FaCheckCircle className="text-green-500 text-5xl" />
                  </div>
                  <h2 className="text-4xl font-black mb-2 text-white tracking-tighter">
                    ¡REGISTRO EXITOSO!
                  </h2>
                  <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
                    Nos vemos en el campamento. Revisa tu WhatsApp para la
                    confirmación.
                  </p>

                  <div className="bg-black/50 p-6 border border-gray-800 mb-8 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary to-primary"></div>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">
                      ID DE ACCESO
                    </p>
                    <p className="text-3xl font-mono font-bold text-white tracking-widest group-hover:text-secondary transition-colors">
                      RC-{Math.floor(Math.random() * 10000)}
                    </p>
                  </div>

                  {/* Mobile Recommendations (Only visible on mobile step 3) */}
                  <div className="lg:hidden text-left bg-white/5 p-6 rounded-xl border border-white/10 mb-8">
                    <h3 className="text-sm font-bold text-secondary mb-4 uppercase">
                      No olvides traer:
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-300">
                      {recommendations.map((r, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <FaCheckCircle className="text-gray-600 text-xs" />{" "}
                          {r.text}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => (window.location.href = "/")}
                    className="text-white border border-white/20 px-8 py-3 font-bold hover:bg-white hover:text-black transition-all uppercase tracking-widest text-sm"
                  >
                    Volver al Inicio
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
