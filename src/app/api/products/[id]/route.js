import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'

// GET /api/products/[id] - Get single product
export async function GET(request, { params }) {
    try {
        const product = await prisma.product.findUnique({
            where: {
                id: params.id
            },
            include: {
                category: true
            }
        })

        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            )
        }

        return NextResponse.json(product)
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch product' },
            { status: 500 }
        )
    }
}

// PUT /api/products/[id] - Update product (Admin only)
export async function PUT(request, { params }) {
    try {
        const session = await getServerSession()

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const body = await request.json()
        const { name, description, price, image, categoryId, stock, isFeatured, isActive } = body

        const product = await prisma.product.update({
            where: {
                id: params.id
            },
            data: {
                name,
                description,
                price: price ? parseFloat(price) : undefined,
                image,
                categoryId,
                stock: stock ? parseInt(stock) : undefined,
                isFeatured,
                isActive
            },
            include: {
                category: true
            }
        })

        return NextResponse.json(product)
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to update product' },
            { status: 500 }
        )
    }
}

// DELETE /api/products/[id] - Delete product (Admin only)
export async function DELETE(request, { params }) {
    try {
        const session = await getServerSession()

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        await prisma.product.delete({
            where: {
                id: params.id
            }
        })

        return NextResponse.json({ message: 'Product deleted successfully' })
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to delete product' },
            { status: 500 }
        )
    }
}
