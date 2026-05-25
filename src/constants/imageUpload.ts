/**
 * Image Upload Constants
 *
 * Centralized configuration for image uploads across the application
 */

export const IMAGE_UPLOAD_CONFIG = {
  ALLOWED_TYPES: [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ] as const,
  ACCEPT_TYPES: "image/jpeg,image/jpg,image/png,image/webp",
  MAX_SIZE_MB: 5,
  MAX_SIZE_BYTES: 5 * 1024 * 1024,
  COMPRESSION_QUALITY: 0.85,
  OUTPUT_TYPE: "image/webp" as const,
  ABSOLUTE_LIMIT_MB: 50, // Prevent browser crash
};

export type AllowedImageType =
  (typeof IMAGE_UPLOAD_CONFIG.ALLOWED_TYPES)[number];
