import type { Metadata } from "next";
import { Zain } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import Footer from "@/components/layout/Footer";
import { I18nProvider } from "@/lib/i18n/provider";
import { ThemeProvider } from "@/lib/theme/provider";
import CapacitorBack from "@/components/layout/CapacitorBack";

const zain = Zain({
  subsets: ["latin", "arabic"],
  weight: ["200","300","400","700","800","900"],
  variable: "--font-zain",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TravGo — Discover. Compare. Travel. | KSA",
  description: "Marketplace touristique premium KSA : découvrez des offres AlUla, Jeddah, Riyad, NEOM vérifiées MOT.",
  keywords: ["voyage", "arabie saoudite", "KSA", "AlUla", "Jeddah", "Riyad", "NEOM", "travel", "marketplace", "SAR"],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-icon.png", type: "image/png", sizes: "180x180" },
      { url: "/apple-icon.svg", type: "image/svg+xml" },
    ],
  },
  openGraph: {
    title: "TravGo — Discover. Compare. Travel.",
    description: "Votre prochaine aventure commence ici. KSA • SAR",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" dir="ltr" className={`${zain.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-[#F8FAFB] text-[#0F172A] dark:bg-[#080C14] dark:text-[#E2E8F0]">
        <ThemeProvider>
          <I18nProvider>
            <CapacitorBack />
            <Header />
            <main className="flex-1 pb-[72px] lg:pb-0">{children}</main>
            <Footer />
            <MobileNav />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
