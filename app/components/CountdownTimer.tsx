"use client";

import { useEffect, useState } from "react";

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const targetDate = new Date("Dec 30, 2025 00:00:00").getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference < 0) {
        setIsExpired(true);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  const format = (num: number) => (num < 10 ? `0${num}` : num);

  if (isExpired) {
    return (
      <h2 style={{ fontSize: "2rem", color: "white", width: "100%" }}>
        ¡Llegó el día!
      </h2>
    );
  }

  return (
    <>
      <div className="countdown-box">
        <span className="countdown-number">{format(timeLeft.days)}</span>
        <span className="countdown-label">Días</span>
      </div>
      <div className="countdown-box">
        <span className="countdown-number">{format(timeLeft.hours)}</span>
        <span className="countdown-label">Hs</span>
      </div>
      <div className="countdown-box">
        <span className="countdown-number">{format(timeLeft.minutes)}</span>
        <span className="countdown-label">Min</span>
      </div>
      <div className="countdown-box">
        <span className="countdown-number">{format(timeLeft.seconds)}</span>
        <span className="countdown-label">Seg</span>
      </div>
    </>
  );
}
