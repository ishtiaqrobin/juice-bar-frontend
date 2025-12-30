import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format price to remove trailing .00 but keep actual decimals
export const formatPrice = (
  price: string | number | null | undefined
): string => {
  if (!price && price !== 0) return "";

  const numPrice = typeof price === "string" ? parseFloat(price) : price;

  // Check if it's a whole number
  if (numPrice % 1 === 0) {
    return numPrice.toString();
  }

  // Has decimals, return with decimals (remove trailing zeros)
  return numPrice.toFixed(2).replace(/\.?0+$/, "");
};

// Format currency with Taka symbol
export const formatCurrency = (
  price: string | number | null | undefined
): string => {
  const formatted = formatPrice(price);
  return formatted ? `৳${formatted}` : "";
};
