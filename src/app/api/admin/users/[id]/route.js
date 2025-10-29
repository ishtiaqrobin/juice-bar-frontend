import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Update user (name, phone, role)
export async function PUT(request, { params }) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
        }

        const { id } = params
        const body = await request.json()
        const data = {}
        if (typeof body.name === "string") data.name = body.name
        if (typeof body.phone === "string") data.phone = body.phone
        if (body.role === "ADMIN" || body.role === "USER") data.role = body.role

        if (Object.keys(data).length === 0) {
            return NextResponse.json({ error: "No valid fields provided" }, { status: 400 })
        }

        const updated = await prisma.user.update({
            where: { id },
            data,
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
        })

        return NextResponse.json(updated)
    } catch (err) {
        console.error("PUT /api/admin/users/[id] error:", err)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

// Delete user
export async function DELETE(request, { params }) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
        }

        const { id } = params

        await prisma.user.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (err) {
        console.error("DELETE /api/admin/users/[id] error:", err)
        // If foreign key constraints prevent delete, return 409
        return NextResponse.json({ error: "Unable to delete user" }, { status: 409 })
    }
}


