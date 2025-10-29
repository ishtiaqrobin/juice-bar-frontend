import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// List users with filters: role, search, pagination
export async function GET(request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
        }

        const { searchParams } = new URL(request.url)
        const role = searchParams.get("role")
        const search = searchParams.get("search")
        const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10))
        const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)))
        const skip = (page - 1) * limit

        const where = {}
        if (role === "ADMIN" || role === "USER") {
            where.role = role
        }
        if (search) {
            const or = [
                { name: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
            ]
            const numeric = Number(search)
            if (!Number.isNaN(numeric)) {
                // If phone is numeric in schema, this will work (equals)
                // If phone is string, Prisma will cast number to string implicitly for equals
                or.push({ phone: numeric })
            }
            where.OR = or
        }

        const [total, users] = await Promise.all([
            prisma.user.count({ where }),
            prisma.user.findMany({
                where,
                orderBy: { createdAt: "desc" },
                skip,
                take: limit,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    role: true,
                    image: true,
                    createdAt: true,
                    updatedAt: true,
                },
            }),
        ])

        const totalPages = Math.max(1, Math.ceil(total / limit))

        return NextResponse.json({
            users,
            pagination: {
                page,
                limit,
                total,
                totalPages,
            },
        })
    } catch (err) {
        console.error("GET /api/admin/users error:", err)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}


