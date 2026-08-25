import React from "react";
import { SidebarNav } from "./SidebarNav";
import { MobileNav } from "./MobileNav";
import { Header } from "./Header";
import { getBankingCaRegistry } from "@/lib/banking-ca/data";

interface CaAppShellProps {
  children: React.ReactNode;
}

export function CaAppShell({ children }: CaAppShellProps) {
  const registry = getBankingCaRegistry();
  const summary = registry.summary;
  const changeAlertCount = registry.indexes.changeSensitiveTopicIds.length;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] antialiased font-sans">
      {/* Mobile Top Navigation */}
      <MobileNav
        totalTopics={summary.totalCanonicalTopics}
        p1Count={summary.activeP1Count}
        p1Minutes={summary.activeP1RevisionMinutes}
        changeAlertCount={changeAlertCount}
      />

      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <SidebarNav
          totalTopics={summary.totalCanonicalTopics}
          p1Count={summary.activeP1Count}
          p1Minutes={summary.activeP1RevisionMinutes}
          changeAlertCount={changeAlertCount}
        />

        {/* Main Application Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <Header
            activeP1Count={summary.activeP1Count}
            activeP1Minutes={summary.activeP1RevisionMinutes}
            changeAlertCount={changeAlertCount}
          />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
