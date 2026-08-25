import type { Metadata } from "next";
import { Inter, Lora, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-serif",
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mind of Aravalli — A Living Map of Knowledge",
  description:
    "A living personal encyclopedia that turns scattered information into structured, connected, durable understanding.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${lora.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col antialiased selection:bg-emerald-600 selection:text-white bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-200">
        <ThemeProvider>
          {/* Subtle Topographic Background Texture */}
          <div className="fixed inset-0 pointer-events-none z-[-1] opacity-[0.03] dark:opacity-[0.04] bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]" />

          {/* Global Header */}
          <Header />

          {/* Main Reading Canvas */}
          <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            {children}
          </main>

          {/* Global Footer */}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
