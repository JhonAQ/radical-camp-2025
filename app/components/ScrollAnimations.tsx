"use client";

import { useEffect } from "react";

export default function ScrollAnimations() {
  useEffect(() => {
    const revealElements = document.querySelectorAll(".reveal");
    const revealOnScroll = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.1 }
    );

    revealElements.forEach((el) => revealOnScroll.observe(el));

    const handleScroll = () => {
      const navbar = document.querySelector(".navbar");
      if (navbar) {
        if (window.scrollY > 50) {
          (navbar as HTMLElement).style.padding = "10px 25px";
          (navbar as HTMLElement).style.background = "rgba(255, 255, 255, 1)";
        } else {
          (navbar as HTMLElement).style.padding = "12px 30px";
          (navbar as HTMLElement).style.background =
            "rgba(255, 255, 255, 0.95)";
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      revealElements.forEach((el) => revealOnScroll.unobserve(el));
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return null;
}
