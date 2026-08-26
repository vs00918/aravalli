"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { SidebarNav } from "./SidebarNav";
import { MobileNav } from "./MobileNav";
import { ReadingToolbar } from "./ReadingToolbar";
import { BankingCaMasterRegistry } from "@/lib/banking-ca/schema";

interface CaAppShellClientProps {
  registry: BankingCaMasterRegistry;
  children: React.ReactNode;
}

export function CaAppShellClient({ registry, children }: CaAppShellClientProps) {
  const pathname = usePathname() || "";
  const isReadingRoute = pathname.startsWith("/briefing") || pathname.startsWith("/topics/");

  // Contextual default: Collapsed for monthly stream & topic reader, Expanded for dashboard & tools
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isReadingRoute);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Sync user preference from localStorage or apply contextual default
  useEffect(() => {
    try {
      const manualPref = localStorage.getItem("banking_ca_sidebar_state");
      if (manualPref === "expanded") {
        setIsSidebarOpen(true);
      } else if (manualPref === "collapsed") {
        setIsSidebarOpen(false);
      } else {
        // No explicit manual choice recorded yet: apply context-sensitive default
        setIsSidebarOpen(!isReadingRoute);
      }
    } catch {
      setIsSidebarOpen(!isReadingRoute);
    }
  }, [pathname, isReadingRoute]);

  const toggleSidebar = () => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setIsMobileDrawerOpen((prev) => !prev);
      return;
    }

    setIsSidebarOpen((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("banking_ca_sidebar_state", next ? "expanded" : "collapsed");
      } catch {}
      return next;
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] antialiased font-sans">
      {/* Top Reading & Control Toolbar */}
      <ReadingToolbar
        onToggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="flex flex-1">
        {/* Desktop Sidebar (Collapsible Icon Rail & Full Navigation) */}
        <SidebarNav
          registry={registry}
          isCollapsed={!isSidebarOpen}
          onToggleCollapse={toggleSidebar}
        />

        {/* Mobile Navigation Drawer */}
        <MobileNav
          registry={registry}
          isOpen={isMobileDrawerOpen}
          onClose={() => setIsMobileDrawerOpen(false)}
        />

        {/* Main Reading & Application Area */}
        <main className={`flex-1 min-w-0 p-4 sm:p-6 lg:p-8 w-full mx-auto reader-canvas transition-all duration-200 ${
          isSidebarOpen ? "max-w-6xl" : "max-w-7xl"
        }`}>
          {children}
        </main>
      </div>
    </div>
  );
}
