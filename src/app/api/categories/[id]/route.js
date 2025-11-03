import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

// GET /api/categories/[id] - Get single category
export async function GET(request, { params }) {
    try {
        const { id } = await params
        const category = await prisma.category.findUnique({
            where: {
                id: id
            },
            select: {
                id: true,
                name: true,
                description: true,
                image: true,
                isActive: true
            }
        })

        if (!category) {
            return NextResponse.json(
                { error: 'Category not found' },
                { status: 404 }
            )
        }

        return NextResponse.json(category)
    } catch {
        return NextResponse.json(
            { error: 'Failed to fetch category' },
            { status: 500 }
        )
    }
}

// PUT /api/categories/[id] - Update category (Admin only)
export async function PUT(request, { params }) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const { id } = await params
        const body = await request.json()
        const { name, description, image, isActive } = body

        // Validate required fields
        if (!name || !name.trim()) {
            return NextResponse.json(
                { error: 'Category name is required' },
                { status: 400 }
            )
        }

        const category = await prisma.category.update({
            where: {
                id: id
            },
            data: {
                name: name.trim(),
                description: description?.trim() || null,
                image: image || null,
                isActive: isActive !== undefined ? isActive : true
            }
        })

        return NextResponse.json(category)
    } catch (error) {
        if (error.code === 'P2025') {
            return NextResponse.json(
                { error: 'Category not found' },
                { status: 404 }
            )
        }
        if (error.code === 'P2002') {
            return NextResponse.json(
                { error: 'Category with this name already exists' },
                { status: 400 }
            )
        }
        return NextResponse.json(
            { error: 'Failed to update category' },
            { status: 500 }
        )
    }
}

// DELETE /api/categories/[id] - Delete category (Admin only)
export async function DELETE(request, { params }) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const { id } = await params

        // Check if any products are using this category
        const productCount = await prisma.product.count({
            where: {
                categoryId: id
            }
        })

        if (productCount > 0) {
            return NextResponse.json(
                { error: `Cannot delete category. ${productCount} products are using this category.` },
                { status: 400 }
            )
        }

        // Hard delete the category
        await prisma.category.delete({
            where: {
                id: id
            }
        })

        return NextResponse.json({ message: 'Category deleted successfully' })
    } catch (error) {
        if (error.code === 'P2025') {
            return NextResponse.json(
                { error: 'Category not found' },
                { status: 404 }
            )
        }
        return NextResponse.json(
            { error: 'Failed to delete category' },
            { status: 500 }
        )
    }
}

