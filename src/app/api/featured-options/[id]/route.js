import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

// GET /api/featured-options/[id] - Get single featured option
export async function GET(request, { params }) {
    try {
        const featuredOption = await prisma.featuredOption.findUnique({
            where: {
                id: params.id
            }
        })

        if (!featuredOption) {
            return NextResponse.json(
                { error: 'Featured option not found' },
                { status: 404 }
            )
        }

        return NextResponse.json(featuredOption)
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch featured option' },
            { status: 500 }
        )
    }
}

// PUT /api/featured-options/[id] - Update featured option (Admin only)
export async function PUT(request, { params }) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const body = await request.json()
        const { name, description, isActive } = body

        // Validate required fields
        if (!name || !name.trim()) {
            return NextResponse.json(
                { error: 'Featured option name is required' },
                { status: 400 }
            )
        }

        const featuredOption = await prisma.featuredOption.update({
            where: {
                id: params.id
            },
            data: {
                name: name.trim(),
                description: description?.trim() || null,
                isActive: isActive !== undefined ? isActive : true
            }
        })

        return NextResponse.json(featuredOption)
    } catch (error) {
        if (error.code === 'P2025') {
            return NextResponse.json(
                { error: 'Featured option not found' },
                { status: 404 }
            )
        }
        if (error.code === 'P2002') {
            return NextResponse.json(
                { error: 'Featured option with this name already exists' },
                { status: 400 }
            )
        }
        return NextResponse.json(
            { error: 'Failed to update featured option' },
            { status: 500 }
        )
    }
}

// DELETE /api/featured-options/[id] - Delete featured option (Admin only)
export async function DELETE(request, { params }) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // Check if any products are using this featured option
        const productsUsingOption = await prisma.product.count({
            where: {
                featured: {
                    not: null
                }
            }
        })

        // Instead of hard delete, we'll soft delete by setting isActive to false
        const featuredOption = await prisma.featuredOption.update({
            where: {
                id: params.id
            },
            data: {
                isActive: false
            }
        })

        return NextResponse.json({ message: 'Featured option deactivated successfully' })
    } catch (error) {
        if (error.code === 'P2025') {
            return NextResponse.json(
                { error: 'Featured option not found' },
                { status: 404 }
            )
        }
        return NextResponse.json(
            { error: 'Failed to delete featured option' },
            { status: 500 }
        )
    }
}
