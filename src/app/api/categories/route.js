import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

// GET /api/categories - Get all categories
export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            where: {
                isActive: true
            },
            select: {
                id: true,
                name: true,
                // description: true,
                // image: true,
                // isActive: true
            },
            orderBy: {
                name: 'asc'
            }
        })

        return NextResponse.json(categories)
    } catch {
        return NextResponse.json(
            { error: 'Failed to fetch categories' },
            { status: 500 }
        )
    }
}

// POST /api/categories - Create new category (Admin only)
export async function POST(request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const body = await request.json()
        const { name, description, image } = body

        const category = await prisma.category.create({
            data: {
                name,
                description,
                image
            }
        })

        return NextResponse.json(category, { status: 201 })
    } catch {
        return NextResponse.json(
            { error: 'Failed to create category' },
            { status: 500 }
        )
    }
}
