import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'

// GET /api/categories - Get all categories
export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            where: {
                isActive: true
            },
            include: {
                products: {
                    where: {
                        isActive: true
                    },
                    select: {
                        id: true,
                        name: true,
                        price: true,
                        image: true
                    }
                }
            },
            orderBy: {
                name: 'asc'
            }
        })

        return NextResponse.json(categories)
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch categories' },
            { status: 500 }
        )
    }
}

// POST /api/categories - Create new category (Admin only)
export async function POST(request) {
    try {
        const session = await getServerSession()

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
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to create category' },
            { status: 500 }
        )
    }
}
