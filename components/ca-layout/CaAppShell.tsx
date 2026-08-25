import React from "react";
import { CaAppShellClient } from "./CaAppShellClient";
import { getBankingCaRegistry } from "@/lib/banking-ca/data";

interface CaAppShellProps {
  children: React.ReactNode;
}

export function CaAppShell({ children }: CaAppShellProps) {
  const registry = getBankingCaRegistry();

  return (
    <CaAppShellClient registry={registry}>
      {children}
    </CaAppShellClient>
  );
}
