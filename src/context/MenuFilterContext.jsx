"use client";

import { createContext, useContext, useState } from "react";

const MenuFilterContext = createContext(null);

export function MenuFilterProvider({ children }) {
  const [appliedShowOnlyAvailable, setAppliedShowOnlyAvailable] =
    useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const openMobileFilter = () => setIsMobileFilterOpen(true);
  const closeMobileFilter = () => setIsMobileFilterOpen(false);

  return (
    <MenuFilterContext.Provider
      value={{
        appliedShowOnlyAvailable,
        setAppliedShowOnlyAvailable,
        isMobileFilterOpen,
        openMobileFilter,
        closeMobileFilter,
      }}
    >
      {children}
    </MenuFilterContext.Provider>
  );
}

export function useMenuFilter() {
  const ctx = useContext(MenuFilterContext);
  if (!ctx)
    throw new Error("useMenuFilter must be used within MenuFilterProvider");
  return ctx;
}
