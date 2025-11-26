"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date("2025-12-30T00:00:00").getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const timeUnits = [
    { label: "Días", value: timeLeft.days },
    { label: "Horas", value: timeLeft.hours },
    { label: "Minutos", value: timeLeft.minutes },
    { label: "Segundos", value: timeLeft.seconds },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-3 md:gap-4 my-8 md:my-10">
      {timeUnits.map((unit, index) => (
        <motion.div
          key={unit.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-black/40 backdrop-blur-md border border-white/15 rounded-xl py-3 md:py-4 w-20 md:w-28 text-center shadow-2xl"
        >
          <span
            className="block text-2xl md:text-4xl font-black bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent tabular-nums"
            style={{ fontFamily: "var(--font-title)" }}
          >
            {String(unit.value).padStart(2, "0")}
          </span>
          <span className="block text-[10px] md:text-xs uppercase tracking-widest text-secondary mt-1">
            {unit.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
