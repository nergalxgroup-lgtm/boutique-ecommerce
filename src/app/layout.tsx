import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Boutique — Mode Homme, Femme & Enfant",
  description: "Boutique en ligne de prêt-à-porter mixte et enfant",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-white text-gray-900 antialiased">
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
