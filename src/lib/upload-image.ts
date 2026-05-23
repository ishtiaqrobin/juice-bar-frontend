import { toast } from "sonner";
import { API_ENDPOINTS } from "@/lib/api-endpoints";

// ─── Validation constants ──────────────────────────────────────────────────────
// These MUST stay in sync with Backend/src/config/index.ts → upload section.
// Backend (Multer) is the real gate; frontend validation is UX-only (fast feedback).

export const UPLOAD_CONSTRAINTS = {
  /** Max file size in bytes — matches config.upload.maxSize (5 MB) */
  MAX_SIZE_BYTES: 5 * 1024 * 1024,
  /** Max file size in MB — human-readable version of the above */
  MAX_SIZE_MB: 5,
  /** Allowed MIME types — matches config.upload.allowedTypes */
  ALLOWED_TYPES: [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ] as const,
  /** Accept string for <input type="file"> */
  ACCEPT: "image/jpeg,image/jpg,image/png,image/webp",
} as const;

// ─── Types ─────────────────────────────────────────────────────────────────────

export type UploadEndpoint = "product" | "banner" | "profile";

export interface UploadImageOptions {
  /** Which backend endpoint to upload to */
  endpoint: UploadEndpoint;
  /** Called with the uploaded image URL on success */
  onSuccess: (url: string) => void;
  /** Optional: pass e.target to auto-reset the file input on error */
  inputRef?: HTMLInputElement | null;
}

// ─── Endpoint map ──────────────────────────────────────────────────────────────

const ENDPOINT_MAP: Record<UploadEndpoint, string> = {
  product: API_ENDPOINTS.UPLOAD.PRODUCT,
  banner: API_ENDPOINTS.UPLOAD.BANNER,
  profile: API_ENDPOINTS.UPLOAD.PROFILE,
};

// ─── Utility ───────────────────────────────────────────────────────────────────

export async function uploadImage(
  file: File | null | undefined,
  options: UploadImageOptions,
): Promise<void> {
  const { endpoint, onSuccess, inputRef } = options;

  const resetInput = () => {
    if (inputRef) inputRef.value = "";
  };

  if (!file) return;

  // ── UX validation (instant feedback before network request) ───────────────
  if (
    !(UPLOAD_CONSTRAINTS.ALLOWED_TYPES as readonly string[]).includes(file.type)
  ) {
    const readable = UPLOAD_CONSTRAINTS.ALLOWED_TYPES.map((t) =>
      t.replace("image/", "").toUpperCase(),
    ).join(", ");
    toast.error(`Only ${readable} images are allowed`);
    resetInput();
    return;
  }

  if (file.size > UPLOAD_CONSTRAINTS.MAX_SIZE_BYTES) {
    const currentMB = (file.size / 1024 / 1024).toFixed(1);
    toast.error(
      `Image must be smaller than ${UPLOAD_CONSTRAINTS.MAX_SIZE_MB} MB (current: ${currentMB})`,
    );
    resetInput();
    return;
  }

  // ── Upload ────────────────────────────────────────────────────────────────
  const fd = new FormData();
  fd.append("image", file);

  try {
    const response = await fetch(ENDPOINT_MAP[endpoint], {
      method: "POST",
      credentials: "include", // browser sends auth cookies automatically
      body: fd,
    });

    const data = await response.json();

    if (!response.ok) {
      toast.error(data?.message || "Image upload failed");
      resetInput();
      return;
    }

    const url: string | undefined = data?.data?.url;
    if (!url) {
      toast.error("Upload succeeded but no URL was returned");
      resetInput();
      return;
    }

    onSuccess(url);
    toast.success("Image uploaded!");
  } catch {
    toast.error("Image upload failed — check your connection");
    resetInput();
  }
}
