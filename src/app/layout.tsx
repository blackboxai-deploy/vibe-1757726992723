import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { SafetyButton } from "@/components/safety-button";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Scarborn Temple - Ritual de Transformación",
  description: "Un espacio sagrado para mujeres que buscan poder, rendición y transformación a través de rituales guiados.",
  keywords: ["ritual", "transformación", "mindfulness", "autoconocimiento", "poder femenino"],
  authors: [{ name: "Scarborn" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  themeColor: "#000000",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Scarborn Temple",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "application-name": "Scarborn Temple",
    "msapplication-TileColor": "#000000",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body 
        className={cn(
          "min-h-screen bg-black text-white font-sans antialiased",
          "selection:bg-amber-500/30 selection:text-amber-200",
          inter.variable,
          playfair.variable
        )}
      >
        {/* Global Safety Button - Always Accessible */}
        <SafetyButton />

        {/* Main Content */}
        <main className="relative min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}