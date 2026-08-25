"use client";

import React, { useState } from "react";
import { SidebarNav } from "./SidebarNav";
import { MobileNav } from "./MobileNav";
import { ReadingToolbar } from "./ReadingToolbar";
import { BankingCaMasterRegistry } from "@/lib/banking-ca/schema";

interface CaAppShellClientProps {
  registry: BankingCaMasterRegistry;
  children: React.ReactNode;
}

export function CaAppShellClient({ registry, children }: CaAppShellClientProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
    setIsMobileDrawerOpen((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] antialiased font-sans">
      {/* Top Reading & Control Toolbar */}
      <ReadingToolbar
        onToggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="flex flex-1">
        {/* Desktop Sidebar (Collapsible) */}
        <SidebarNav
          registry={registry}
          isCollapsed={!isSidebarOpen}
        />

        {/* Mobile Navigation Drawer */}
        <MobileNav
          registry={registry}
          isOpen={isMobileDrawerOpen}
          onClose={() => setIsMobileDrawerOpen(false)}
        />

        {/* Main Reading & Application Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto reader-canvas transition-all duration-200">
          {children}
        </main>
      </div>
    </div>
  );
}
