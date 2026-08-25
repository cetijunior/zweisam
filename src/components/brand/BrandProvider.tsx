"use client";

import { createContext, useContext } from "react";
import type { SiteSettings } from "@/lib/data/types";

const BrandContext = createContext<SiteSettings | null>(null);

export function BrandProvider({
  settings,
  children,
}: {
  settings: SiteSettings;
  children: React.ReactNode;
}) {
  return (
    <BrandContext.Provider value={settings}>{children}</BrandContext.Provider>
  );
}

export function useBrand() {
  const ctx = useContext(BrandContext);
  if (!ctx) {
    throw new Error("useBrand must be used within BrandProvider");
  }
  return ctx;
}
