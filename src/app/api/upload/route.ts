import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { getServerSession } from "next-auth/next";

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create uploads directory if it doesn't exist
    const uploadDir = join(process.cwd(), "public", "uploads");

    try {
      await mkdir(uploadDir, { recursive: true });
    } catch {
      // Directory might already exist, ignore error
    }

    // Generate unique filename with proper sanitization
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/\s+/g, "-");
    const filename = `${timestamp}-${sanitizedName}`;
    const filePath = join(uploadDir, filename);

    // Save the file
    await writeFile(filePath, buffer);

    const fileUrl = `/uploads/${filename}`;

    // Return comprehensive response
    return NextResponse.json({
      success: true,
      url: fileUrl,
      filename: filename,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
