import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { unlink } from 'fs/promises'
import { join } from 'path'

// Helper to delete product image variants saved by upload route
async function deleteProductImages(imageUrl) {
    try {
        if (!imageUrl || !imageUrl.startsWith('/uploads/')) return

        const withinUploads = imageUrl.replace('/uploads/', '')
        const baseUploadsPath = join(process.cwd(), 'public', 'uploads')
        const parts = withinUploads.split('/')
        const dirParts = parts.slice(0, parts.length - 1)
        const fileName = parts[parts.length - 1]
        const dirPath = join(baseUploadsPath, ...dirParts)

        const prefix = fileName
            .replace(/-\d+x\d+(?:-2x)?\.webp$/i, '')
            .replace(/-master-\d+x\d+\.webp$/i, '')

        const candidates = [
            `${prefix}-750x500.webp`,
            `${prefix}-1500x1000-2x.webp`,
            `${prefix}-master-1500x1000.webp`,
            fileName
        ]

        for (const candidate of candidates) {
            const candidatePath = join(dirPath, candidate)
            try {
                await unlink(candidatePath)
                console.log(`Deleted product image: ${candidatePath}`)
            } catch {
                // ignore missing
            }
        }
    } catch (err) {
        console.error('Error deleting product images:', err)
    }
}

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

        // Load existing product to handle image replacement
        const existing = await prisma.product.findUnique({ where: { id } })

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

        // If image changed and old existed, delete previous variants
        if (existing?.image && image && existing.image !== image) {
            await deleteProductImages(existing.image)
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

        const product = await prisma.product.findUnique({ where: { id } })

        await prisma.product.delete({
            where: {
                id
            }
        })

        if (product?.image) {
            await deleteProductImages(product.image)
        }

        return NextResponse.json({ message: 'Product deleted successfully' })
    } catch (error) {
        console.error('Error deleting product:', error)
        return NextResponse.json(
            { error: 'Failed to delete product' },
            { status: 500 }
        )
    }
}
