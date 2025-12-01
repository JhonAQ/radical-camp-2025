import type { Metadata } from "next";
import { Montserrat, Poppins } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/ui/CustomCursor";
import Preloader from "@/components/ui/Preloader";
import MobileBlocker from "@/components/ui/MobileBlocker";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

const montserrat = Montserrat({
  variable: "--font-title",
  weight: ["400", "700", "900"],
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-main",
  weight: ["300", "400", "600"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Radical Camp 2026",
  description:
    "Campamento juvenil Radical Camp 2025 - 2026, es un campamento anual organizado por la Iglesia Evangelica Luterana - Peru, dirigido a jóvenes y adolescentes para fortalecer su fe y fomentar la comunión cristiana a través de actividades recreativas, talleres y momentos de adoración.",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          rel="stylesheet"
        />
      </head>
      <body className={`${montserrat.variable} ${poppins.variable}`}>
        <Preloader />
        <MobileBlocker />
        <CustomCursor />
        <WhatsAppButton />
        {children}
      </body>
    </html>
  );
}
