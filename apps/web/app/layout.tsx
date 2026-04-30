import "./globals.css";
import type { ReactNode } from "react";
import { Instrument_Sans, Playfair_Display } from "next/font/google";

import { getLocale } from "./lib/locale";

export const metadata = {
  title: "Trust Leaf",
  description: "Web2.5 medicinal cannabis trust network on Stellar",
};

const bodyFont = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

const displayFont = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "700"],
});

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  return (
    <html lang={locale}>
      <body className={`${bodyFont.variable} ${displayFont.variable}`}>{children}</body>
    </html>
  );
}
