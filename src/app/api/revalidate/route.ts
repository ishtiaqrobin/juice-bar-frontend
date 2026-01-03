import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";

/**
 * Cache Revalidation API Route
 *
 * This endpoint is called by the backend after admin updates
 * to instantly clear Next.js cache
 *
 * Usage from backend:
 * POST /api/revalidate
 * Body: { tag: 'products' } or { path: '/menu' }
 * Headers: { 'x-revalidate-secret': process.env.REVALIDATE_SECRET }
 */

export async function POST(request: NextRequest) {
  try {
    // Verify secret token for security
    const secret = request.headers.get("x-revalidate-secret");

    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json(
        { success: false, message: "Invalid secret" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { tag, path } = body;

    // Revalidate by tag (recommended)
    // Using "max" profile for stale-while-revalidate semantics (Next.js 16+)
    if (tag) {
      revalidateTag(tag, "max");
      console.log(`✅ Cache revalidated for tag: ${tag}`);

      return NextResponse.json({
        success: true,
        message: `Cache revalidated for tag: ${tag}`,
        timestamp: new Date().toISOString(),
      });
    }

    // Revalidate by path (alternative)
    if (path) {
      revalidatePath(path);
      console.log(`✅ Cache revalidated for path: ${path}`);

      return NextResponse.json({
        success: true,
        message: `Cache revalidated for path: ${path}`,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      { success: false, message: "Missing tag or path parameter" },
      { status: 400 }
    );
  } catch (error) {
    console.error("❌ Revalidation error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Revalidation failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint to check if revalidation API is working
export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Revalidation API is active",
    timestamp: new Date().toISOString(),
  });
}
