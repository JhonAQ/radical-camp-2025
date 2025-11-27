"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaUser, FaIdCard, FaPhone, FaChurch, FaMoneyBillWave, FaQrcode, FaFileUpload, FaCheckCircle, FaArrowRight, FaArrowLeft } from "react-icons/fa";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function RegistroPage() {
  const [step, setStep] = useState(1);
  const [paymentType, setPaymentType] = useState<"full" | "reservation">("full");
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
    <main className="min-h-screen bg-dark-bg text-white overflow-x-hidden font-sans">
      <Navbar />
      
      <section className="relative pt-32 pb-20 px-5 min-h-screen flex flex-col justify-center items-center">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#6200ea]/20 to-transparent opacity-50" />
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#00d4ff] rounded-full blur-[120px] opacity-20" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#ff0055] rounded-full blur-[100px] opacity-20" />
        </div>

        <div className="relative z-10 w-full max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h1 
              className="text-4xl md:text-6xl font-black uppercase mb-4"
              style={{ fontFamily: "var(--font-title)" }}
            >
              Registro <span className="text-secondary">2025</span>
            </h1>
            <p className="text-gray-400 text-lg">Asegura tu lugar en la experiencia que cambiará tu vida.</p>
          </div>

          {/* Progress Bar */}
          <div className="flex justify-between items-center mb-12 max-w-xl mx-auto relative">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-800 -z-10 rounded-full"></div>
            <div 
              className="absolute top-1/2 left-0 h-1 bg-secondary -z-10 rounded-full transition-all duration-500"
              style={{ width: step === 1 ? "0%" : step === 2 ? "50%" : "100%" }}
            ></div>
            
            {[1, 2, 3].map((s) => (
              <div 
                key={s} 
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                  step >= s ? "bg-secondary text-black scale-110 shadow-[0_0_15px_rgba(0,212,255,0.5)]" : "bg-gray-800 text-gray-500"
                }`}
              >
                {s}
              </div>
            ))}
          </div>

          {/* Form Container */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#111827] border border-gray-800 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden"
          >
            {/* Step 1: Personal Info */}
            {step === 1 && (
              <motion.form
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={(e) => { e.preventDefault(); nextStep(); }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
                  <FaUser className="text-secondary" /> Datos Personales
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400 uppercase tracking-wider font-bold">Nombres</label>
                    <input 
                      type="text" 
                      name="nombres"
                      required
                      value={formData.nombres}
                      onChange={handleInputChange}
                      className="w-full bg-black/30 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all"
                      placeholder="Ej. Juan Carlos"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400 uppercase tracking-wider font-bold">Apellidos</label>
                    <input 
                      type="text" 
                      name="apellidos"
                      required
                      value={formData.apellidos}
                      onChange={handleInputChange}
                      className="w-full bg-black/30 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all"
                      placeholder="Ej. Pérez López"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400 uppercase tracking-wider font-bold">Edad</label>
                    <input 
                      type="number" 
                      name="edad"
                      required
                      min="17"
                      value={formData.edad}
                      onChange={handleInputChange}
                      className="w-full bg-black/30 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all"
                      placeholder="17+"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400 uppercase tracking-wider font-bold">DNI / Documento</label>
                    <div className="relative">
                      <FaIdCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input 
                        type="text" 
                        name="dni"
                        required
                        value={formData.dni}
                        onChange={handleInputChange}
                        className="w-full bg-black/30 border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all"
                        placeholder="Número de documento"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400 uppercase tracking-wider font-bold">Celular (WhatsApp)</label>
                    <div className="relative">
                      <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input 
                        type="tel" 
                        name="celular"
                        required
                        value={formData.celular}
                        onChange={handleInputChange}
                        className="w-full bg-black/30 border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all"
                        placeholder="999 999 999"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400 uppercase tracking-wider font-bold">Iglesia / Ciudad</label>
                    <div className="relative">
                      <FaChurch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input 
                        type="text" 
                        name="iglesia"
                        value={formData.iglesia}
                        onChange={handleInputChange}
                        className="w-full bg-black/30 border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all"
                        placeholder="Nombre de tu iglesia o ciudad"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button 
                    type="submit"
                    className="bg-white text-black px-8 py-3 rounded-full font-bold text-lg hover:bg-secondary hover:scale-105 transition-all flex items-center gap-2 shadow-lg"
                  >
                    Siguiente <FaArrowRight />
                  </button>
                </div>
              </motion.form>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
                  <FaMoneyBillWave className="text-green-400" /> Método de Pago
                </h2>

                {/* Payment Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div 
                    onClick={() => setPaymentType("full")}
                    className={`cursor-pointer p-6 rounded-2xl border-2 transition-all relative overflow-hidden ${
                      paymentType === "full" 
                        ? "border-secondary bg-secondary/10" 
                        : "border-gray-700 bg-black/20 hover:border-gray-500"
                    }`}
                  >
                    {paymentType === "full" && (
                      <div className="absolute top-2 right-2 text-secondary">
                        <FaCheckCircle size={20} />
                      </div>
                    )}
                    <h3 className="font-bold text-lg mb-1">Pago Completo</h3>
                    <p className="text-3xl font-black text-white mb-2">S/ 150.00</p>
                    <p className="text-xs text-gray-400">Precio promocional hasta el 15 Dic</p>
                  </div>

                  <div 
                    onClick={() => setPaymentType("reservation")}
                    className={`cursor-pointer p-6 rounded-2xl border-2 transition-all relative overflow-hidden ${
                      paymentType === "reservation" 
                        ? "border-secondary bg-secondary/10" 
                        : "border-gray-700 bg-black/20 hover:border-gray-500"
                    }`}
                  >
                    {paymentType === "reservation" && (
                      <div className="absolute top-2 right-2 text-secondary">
                        <FaCheckCircle size={20} />
                      </div>
                    )}
                    <h3 className="font-bold text-lg mb-1">Reserva Cupo</h3>
                    <p className="text-3xl font-black text-white mb-2">S/ 50.00</p>
                    <p className="text-xs text-gray-400">Asegura tu lugar y paga el resto después</p>
                  </div>
                </div>

                {/* Yape Section */}
                <div className="bg-gradient-to-br from-[#742298] to-[#5d1a7a] p-6 rounded-2xl text-white flex flex-col md:flex-row items-center gap-8 shadow-lg">
                  <div className="bg-white p-3 rounded-xl shrink-0">
                    {/* Placeholder for QR */}
                    <div className="w-40 h-40 bg-gray-200 flex items-center justify-center rounded-lg">
                      <FaQrcode className="text-gray-400 text-6xl" />
                    </div>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl font-bold mb-2">Yapear a: Radical Camp</h3>
                    <p className="text-2xl font-black mb-4">999 888 777</p>
                    <div className="bg-black/20 p-4 rounded-lg text-sm">
                      <p className="font-bold text-yellow-300 mb-1">⚠️ IMPORTANTE:</p>
                      <p>En el mensaje del Yape escribe:</p>
                      <p className="font-mono bg-black/30 p-1 rounded mt-1 inline-block">
                        {formData.nombres || "TU_NOMBRE"} {formData.apellidos || "APELLIDO"} - {paymentType === "full" ? "COMPLETO" : "RESERVA"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Upload Voucher */}
                <div className="space-y-3">
                  <label className="text-sm text-gray-400 uppercase tracking-wider font-bold">Subir Captura del Yape</label>
                  <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center hover:border-secondary transition-colors cursor-pointer bg-black/20 group">
                    <FaFileUpload className="mx-auto text-4xl text-gray-500 group-hover:text-secondary mb-3 transition-colors" />
                    <p className="text-gray-300 font-medium">Haz clic para subir tu comprobante</p>
                    <p className="text-xs text-gray-500 mt-1">Formatos: JPG, PNG, PDF</p>
                    <input type="file" className="hidden" accept="image/*,application/pdf" />
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <button 
                    onClick={prevStep}
                    className="text-gray-400 hover:text-white px-6 py-3 font-bold flex items-center gap-2 transition-colors"
                  >
                    <FaArrowLeft /> Atrás
                  </button>
                  <button 
                    onClick={handleSubmit}
                    className="bg-secondary text-black px-8 py-3 rounded-full font-bold text-lg hover:bg-white hover:scale-105 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(0,212,255,0.4)]"
                  >
                    Finalizar Inscripción <FaCheckCircle />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Success */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10"
              >
                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,197,94,0.5)]">
                  <FaCheckCircle className="text-white text-5xl" />
                </div>
                <h2 className="text-3xl md:text-4xl font-black mb-4 text-white">¡Registro Enviado!</h2>
                <p className="text-gray-300 text-lg mb-8 max-w-md mx-auto">
                  Hemos recibido tus datos y comprobante. Validaremos tu inscripción y te enviaremos la confirmación a tu WhatsApp en las próximas 24 horas.
                </p>
                <div className="bg-[#161f32] p-6 rounded-xl max-w-sm mx-auto mb-8 border border-gray-700">
                  <p className="text-sm text-gray-400 mb-2">Tu código de seguimiento:</p>
                  <p className="text-2xl font-mono font-bold text-secondary tracking-widest">RC-2025-{Math.floor(Math.random() * 1000)}</p>
                </div>
                <button 
                  onClick={() => window.location.href = "/"}
                  className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-all"
                >
                  Volver al Inicio
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}
