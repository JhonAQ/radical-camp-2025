import type { Metadata } from "next";
import { Montserrat, Poppins } from "next/font/google";
import "./globals.css";

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
  title: "Campamento Radical - Año Nuevo 2026",
  description:
    "Un movimiento de jóvenes apasionados por Jesús, dispuestos a transformar su entorno y vivir una vida sin límites.",
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
        {children}
      </body>
    </html>
  );
}
