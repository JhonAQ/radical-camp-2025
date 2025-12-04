import type { Metadata } from "next";
import { Montserrat, Poppins } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/ui/CustomCursor";
import Preloader from "@/components/ui/Preloader";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { Analytics } from "@vercel/analytics/next";

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
  title: "Radical Camp 2025",
  description:
    "Campamento juvenil Radical Camp 2025 - 2026. Únete a nosotros en Campel Arequipa para un tiempo inolvidable de fe, diversión y comunión. Organizado por la Iglesia Evangélica Luterana - Perú (IEL-P).",
  keywords: [
    "campamento cristiano",
    "radical camp 2025",
    "ielp",
    "campel arequipa",
    "ministerio de jovenes arequipa",
    "iglesia evangelica luterana peru",
  ],
  authors: [
    { name: "Radical Camp Team" },
    { name: "JhonAQ", url: "https://github.com/jhonaq" },
  ],
  openGraph: {
    title: "Radical Camp 2025 | ¡Es tiempo de volver!",
    description:
      "Prepárate para el mejor inicio de año. Campamento juvenil en Campel Arequipa, del 30 de Dic al 02 de Ene.",
    url: "https://radicalcamp.vercel.app",
    siteName: "IEL-P · Ministerio Nacional de Jovenes",
    locale: "es_PE",
    type: "website",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "IEL-P · Ministerio Nacional de Jovenes",
              alternateName: ["Radical Camp", "Radical Camp 2025"],
              url: "https://radicalcamp.vercel.app",
            }),
          }}
        />
      </head>
      <body className={`${montserrat.variable} ${poppins.variable}`}>
        <Preloader />
        <CustomCursor />
        <WhatsAppButton />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
