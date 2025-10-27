import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

// GET /api/featured-options - Get all featured options
export async function GET() {
    try {
        const featuredOptions = await prisma.featuredOption.findMany({
            where: {
                isActive: true
            },
            orderBy: {
                name: 'asc'
            }
        })

        return NextResponse.json(featuredOptions)
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch featured options' },
            { status: 500 }
        )
    }
}

// POST /api/featured-options - Create new featured option (Admin only)
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
        const { name, description } = body

        // Validate required fields
        if (!name || !name.trim()) {
            return NextResponse.json(
                { error: 'Featured option name is required' },
                { status: 400 }
            )
        }

        const featuredOption = await prisma.featuredOption.create({
            data: {
                name: name.trim(),
                description: description?.trim() || null
            }
        })

        return NextResponse.json(featuredOption, { status: 201 })
    } catch (error) {
        if (error.code === 'P2002') {
            return NextResponse.json(
                { error: 'Featured option with this name already exists' },
                { status: 400 }
            )
        }
        return NextResponse.json(
            { error: 'Failed to create featured option' },
            { status: 500 }
        )
    }
}
