import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// GET /api/products/[id] - Get single product
export async function GET(request, { params }) {
    try {
        const { id } = await params
        const product = await prisma.product.findUnique({
            where: {
                id
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

        // Convert Decimal objects to plain numbers
        const serializedProduct = {
            ...product,
            price: product.price ? parseFloat(product.price.toString()) : 0,
            discountPrice: product.discountPrice ? parseFloat(product.discountPrice.toString()) : null,
            discountPercentage: product.discountPercentage ? parseFloat(product.discountPercentage.toString()) : null
        }

        return NextResponse.json(serializedProduct)
    } catch (error) {
        console.error('Error fetching product:', error)
        return NextResponse.json(
            { error: 'Failed to fetch product' },
            { status: 500 }
        )
    }
}

// PUT /api/products/[id] - Update product (Admin only)
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
        const { name, description, price, image, categoryId, stock, unitType, featured, addedDate, discountPrice, discountPercentage, isActive } = body

        // Validate required fields
        if (!name || !name.trim()) {
            return NextResponse.json(
                { error: 'Product name is required' },
                { status: 400 }
            )
        }

        if (!price || parseFloat(price) <= 0) {
            return NextResponse.json(
                { error: 'Valid price is required' },
                { status: 400 }
            )
        }

        if (!categoryId || categoryId.trim() === '') {
            return NextResponse.json(
                { error: 'Category is required' },
                { status: 400 }
            )
        }

        // Prepare update data
        const updateData = {
            name,
            description,
            price: parseFloat(price),
            image,
            categoryId,
            stock: stock ? parseInt(stock) : undefined,
            unitType: unitType || "piece",
            featured: featured === 'none' ? null : featured,
            addedDate: addedDate ? new Date(addedDate) : undefined,
            discountPrice: discountPrice ? parseFloat(discountPrice) : null,
            discountPercentage: discountPercentage ? parseFloat(discountPercentage) : null,
            isActive
        }

        const product = await prisma.product.update({
            where: {
                id
            },
            data: updateData,
            include: {
                category: true
            }
        })

        // Convert Decimal objects to plain numbers
        const serializedProduct = {
            ...product,
            price: product.price ? parseFloat(product.price.toString()) : 0,
            discountPrice: product.discountPrice ? parseFloat(product.discountPrice.toString()) : null,
            discountPercentage: product.discountPercentage ? parseFloat(product.discountPercentage.toString()) : null
        }

        return NextResponse.json(serializedProduct)
    } catch (error) {
        console.error('Error updating product:', error)
        return NextResponse.json(
            { error: 'Failed to update product' },
            { status: 500 }
        )
    }
}

// DELETE /api/products/[id] - Delete product (Admin only)
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
        await prisma.product.delete({
            where: {
                id
            }
        })

        return NextResponse.json({ message: 'Product deleted successfully' })
    } catch (error) {
        console.error('Error deleting product:', error)
        return NextResponse.json(
            { error: 'Failed to delete product' },
            { status: 500 }
        )
    }
}
