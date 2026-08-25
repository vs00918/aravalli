import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mind of Aravalli — Personal Encyclopedia & Knowledge System",
  description: "A living personal encyclopedia that turns scattered information into structured, connected, durable understanding.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-aravalli-bg text-slate-200 antialiased selection:bg-emerald-500 selection:text-white flex flex-col min-h-screen">
        {/* Global Minimal Header */}
        <header className="sticky top-0 z-40 bg-aravalli-bg/90 backdrop-blur-md border-b border-aravalli-border px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-xl">🌲</span>
            <div>
              <span className="font-bold text-sm tracking-tight text-white">MIND OF ARAVALLI</span>
              <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Phase 0 Foundation
              </span>
            </div>
          </div>
          <nav className="flex items-center space-x-4 text-xs text-slate-400">
            <span className="font-mono text-[11px] text-slate-500">v1.0 Architecture</span>
          </nav>
        </header>

        {/* Content Body */}
        <main className="flex-1 flex flex-col">
          {children}
        </main>

        {/* Minimal Footer */}
        <footer className="border-t border-aravalli-border py-4 px-6 text-center text-xs text-slate-500 font-mono">
          Mind of Aravalli — Built for durable understanding.
        </footer>
      </body>
    </html>
  );
}
