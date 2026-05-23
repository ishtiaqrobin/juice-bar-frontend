"use client";

import { MenuFilterProvider } from "@/context/MenuFilterContext";
import MobileFilterDropdown from "@/components/layout/mobile/MobileFilterDropdown";

/**
 * Client-side shell for the common layout.
 * Wraps everything in MenuFilterProvider so that MobileNavbar
 * and MenuClient can share filter state via context.
 */
export default function HomeLayoutShell({ children }) {
  return (
    <MenuFilterProvider>
      {children}
      {/* MobileFilterDropdown sheet is rendered here (at layout level)
          so it works regardless of which page is active.
          The actual bottom sheet UI is triggered via context from MobileNavbar. */}
      <MobileFilterDropdown />
    </MenuFilterProvider>
  );
}
