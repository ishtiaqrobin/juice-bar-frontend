"use client";

import { compressImage, CompressOptions } from "@/lib/imageCompressor";
import { IMAGE_UPLOAD_CONFIG } from "@/constants/imageUpload";

/**
 * useImageUpload.ts
 *
 * Reusable React hook for image selection, compression, and preview.
 * ✓ Handles file validation (type, size)
 * ✓ Compresses images automatically
 * ✓ Generates previews
 * ✓ Manages cleanup
 *
 * Usage:
 *   const { file, preview, isCompressing, handleFileChange, reset } = useImageUpload({
 *     onCompressed: (info) => console.log(info)
 *   });
 *
 * Then:
 *   <input type="file" accept={IMAGE_UPLOAD_CONFIG.ACCEPT_TYPES} onChange={handleFileChange} />
 *   {preview && <img src={preview} alt="preview" />}
 *   // Pass `file` to FormData when uploading
 */

import { useState, useCallback, useRef } from "react";
import { toast } from "sonner";

export interface UseImageUploadOptions extends CompressOptions {
  /** Max file size in MB before compression. Default: 5 */
  maxSizeMB?: number;
  /** Show compression success toast. Default: true */
  showSuccessToast?: boolean;
  /** Called after successful compression with result info */
  onCompressed?: (info: {
    originalKB: number;
    compressedKB: number;
    savedPercent: number;
  }) => void;
}

export interface UseImageUploadReturn {
  /** The compressed File, ready for FormData */
  file: File | null;
  /** Object URL for preview (use as <img src={preview}>) */
  preview: string | null;
  /** True while compression is running */
  isCompressing: boolean;
  /** Pass directly to <input type="file" onChange={handleFileChange}> */
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  /** Reset all state (call on dialog close) */
  reset: () => void;
  /** Ref to attach to the <input> if you need imperative access */
  inputRef: React.RefObject<HTMLInputElement | null>;
}

const DEFAULT_MAX_SIZE_MB = IMAGE_UPLOAD_CONFIG.MAX_SIZE_MB;
const ALLOWED_TYPES = IMAGE_UPLOAD_CONFIG.ALLOWED_TYPES;

export function useImageUpload(
  options: UseImageUploadOptions = {},
): UseImageUploadReturn {
  const {
    maxSizeMB = DEFAULT_MAX_SIZE_MB,
    showSuccessToast = true,
    onCompressed,
    quality = IMAGE_UPLOAD_CONFIG.COMPRESSION_QUALITY,
    outputType = IMAGE_UPLOAD_CONFIG.OUTPUT_TYPE,
    ...compressOptions
  } = options;

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const reset = useCallback(() => {
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setFile(null);
    setIsCompressing(false);
    if (inputRef.current) inputRef.current.value = "";
  }, []);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files?.[0];
      if (!selected) return;

      // ──── Step 1: Validate file type ────
      if (!(ALLOWED_TYPES as readonly string[]).includes(selected.type)) {
        const readable = ALLOWED_TYPES.map((t) =>
          t.replace("image/", "").toUpperCase(),
        ).join(", ");
        toast.error(`Only ${readable} images are allowed`);
        e.target.value = "";
        return;
      }

      // ──── Step 2: Absolute limit to prevent browser crash ────
      const ABSOLUTE_LIMIT_MB = IMAGE_UPLOAD_CONFIG.ABSOLUTE_LIMIT_MB;
      if (selected.size > ABSOLUTE_LIMIT_MB * 1024 * 1024) {
        toast.error(
          `File is too large! Maximum limit for processing is ${ABSOLUTE_LIMIT_MB}MB.`,
        );
        e.target.value = "";
        return;
      }

      setIsCompressing(true);

      try {
        // ──── Step 3: Compress image ────
        const result = await compressImage(selected, {
          quality,
          outputType,
          ...compressOptions,
        });

        // ──── Step 4: Check size after compression ────
        if (result.file.size > maxSizeMB * 1024 * 1024) {
          toast.error(
            `File too large! Even after compression, it is ${(
              result.file.size /
              (1024 * 1024)
            ).toFixed(2)}MB. Maximum allowed size is ${maxSizeMB}MB.`,
          );
          reset();
          return;
        }

        // ──── Step 5: Revoke old preview URL to avoid memory leaks ────
        setPreview((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return URL.createObjectURL(result.file);
        });

        setFile(result.file);

        // ──── Step 6: Show success message if compression saved space ────
        if (result.savedPercent > 0 && showSuccessToast) {
          toast.success(
            // `Image compressed! Saved ${result.savedPercent}% (${result.originalSizeKB.toFixed(0)}KB → ${result.compressedSizeKB.toFixed(0)}KB)`,
            `Image compressed successfully!`,
          );
        }

        onCompressed?.({
          originalKB: result.originalSizeKB,
          compressedKB: result.compressedSizeKB,
          savedPercent: result.savedPercent,
        });
      } catch (error) {
        console.error("Image processing error:", error);
        toast.error("Failed to process image. Please try another file.");
        reset();
      } finally {
        setIsCompressing(false);
      }
    },
    [
      maxSizeMB,
      quality,
      outputType,
      compressOptions,
      onCompressed,
      reset,
      showSuccessToast,
    ],
  );

  return { file, preview, isCompressing, handleFileChange, reset, inputRef };
}
