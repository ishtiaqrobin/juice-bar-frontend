import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { getServerSession } from "next-auth/next";
import sharp from "sharp";

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const kind = (formData.get("kind") as string) || "generic"; // 'banner' | 'product' | 'generic'

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Basic validations
    const allowedTypes = new Set([
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
    ]);
    if (!allowedTypes.has(file.type)) {
      return NextResponse.json(
        { error: "Unsupported media type" },
        { status: 415 }
      );
    }
    const maxBytes = 15 * 1024 * 1024; // 15MB
    if (file.size && file.size > maxBytes) {
      return NextResponse.json({ error: "Payload too large" }, { status: 413 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Decide destination directory based on kind
    const baseUploads = join(process.cwd(), "public", "uploads");
    const subDir =
      kind === "banner"
        ? "banners"
        : kind === "product"
        ? "products"
        : kind === "profile"
        ? "profiles"
        : "";
    const uploadDir = subDir ? join(baseUploads, subDir) : baseUploads;

    try {
      await mkdir(uploadDir, { recursive: true });
    } catch {
      // Directory might already exist, ignore error
    }

    // Generate base name (without extension) with proper sanitization
    const timestamp = Date.now();
    const originalName = file.name.replace(/\s+/g, "-");
    const baseName = originalName.replace(/\.[^.]+$/, "");
    const safeBase = `${timestamp}-${baseName}`;

    // Helper to build paths/urls
    const makePath = (name: string) => join(uploadDir, name);
    const makeUrl = (name: string) =>
      `/uploads${subDir ? `/${subDir}` : ""}/${name}`;

    // Process with sharp based on kind (no crop, single file, keep aspect ratio)
    const webpOpts = { quality: 90, effort: 6 } as const;

    if (kind === "banner") {
      // Optional sanity check (keep very small banners out)
      const meta = await sharp(buffer, { failOn: "none" }).metadata();
      if ((meta.width ?? 0) < 900 || (meta.height ?? 0) < 300) {
        return NextResponse.json(
          { error: "Image too small for banner (min 900x300)" },
          { status: 400 }
        );
      }

      const fileName = `${safeBase}.webp`;
      const outBuf = await sharp(buffer, { failOn: "none" })
        .rotate()
        // limit max width to keep size reasonable, preserve aspect, no crop
        .resize({ width: 2400, fit: "inside", withoutEnlargement: true })
        .webp(webpOpts)
        .toBuffer();
      await writeFile(makePath(fileName), outBuf);

      return NextResponse.json({
        success: true,
        url: makeUrl(fileName),
        filename: fileName,
        kind,
      });
    }

    if (kind === "product") {
      const meta = await sharp(buffer, { failOn: "none" }).metadata();
      if ((meta.width ?? 0) < 600 || (meta.height ?? 0) < 400) {
        return NextResponse.json(
          { error: "Image too small for product (min 600x400)" },
          { status: 400 }
        );
      }

      const fileName = `${safeBase}.webp`;
      const outBuf = await sharp(buffer, { failOn: "none" })
        .rotate()
        // limit max width, keep aspect, no crop
        .resize({ width: 1500, fit: "inside", withoutEnlargement: true })
        .webp(webpOpts)
        .toBuffer();
      await writeFile(makePath(fileName), outBuf);

      return NextResponse.json({
        success: true,
        url: makeUrl(fileName),
        filename: fileName,
        kind,
      });
    }

    if (kind === "profile") {
      const fileName = `${safeBase}.webp`;
      const outBuf = await sharp(buffer, { failOn: "none" })
        .rotate()
        .resize({ width: 800, fit: "inside", withoutEnlargement: true })
        .webp(webpOpts)
        .toBuffer();
      await writeFile(makePath(fileName), outBuf);

      return NextResponse.json({
        success: true,
        url: makeUrl(fileName),
        filename: fileName,
        kind,
      });
    }

    // Fallback generic: single webp, no crop
    const normalizedName = `${safeBase}.webp`;
    const normalizedBuf = await sharp(buffer, { failOn: "none" })
      .rotate()
      .resize({ width: 1920, fit: "inside", withoutEnlargement: true })
      .webp(webpOpts)
      .toBuffer();
    await writeFile(makePath(normalizedName), normalizedBuf);

    return NextResponse.json({
      success: true,
      url: makeUrl(normalizedName),
      filename: normalizedName,
      kind,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
