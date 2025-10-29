import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

// GET /api/products - Get all products
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const category = searchParams.get('category')
        const featured = searchParams.get('featured')
        const status = searchParams.get('status') // 'active' | 'inactive' | 'all'
        const page = parseInt(searchParams.get('page')) || 1
        const limit = parseInt(searchParams.get('limit')) || 10
        const skip = (page - 1) * limit

        // Default behavior preserved: only active unless status=all or status=inactive
        const where = {
            ...(status === 'inactive' ? { isActive: false } : status === 'all' ? {} : { isActive: true }),
            ...(category && { categoryId: category }),
            ...(featured === 'true' && { isFeatured: true })
        }

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                include: {
                    category: true
                },
                skip,
                take: limit,
                orderBy: {
                    createdAt: 'desc'
                }
            }),
            prisma.product.count({ where })
        ])

        // Convert Decimal objects to plain numbers
        const serializedProducts = products.map(product => ({
            ...product,
            price: product.price ? parseFloat(product.price.toString()) : 0,
            discountPrice: product.discountPrice ? parseFloat(product.discountPrice.toString()) : null,
            discountPercentage: product.discountPercentage ? parseFloat(product.discountPercentage.toString()) : null
        }))

        return NextResponse.json({
            products: serializedProducts,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        })
    } catch (error) {
        console.error('Error fetching products:', error)
        return NextResponse.json(
            { error: 'Failed to fetch products' },
            { status: 500 }
        )
    }
}

// POST /api/products - Create new product (Admin only)
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
        const { name, description, price, image, categoryId, stock, unitType, featured, addedDate, discountPrice, discountPercentage } = body

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

        const product = await prisma.product.create({
            data: {
                name,
                description,
                price: parseFloat(price),
                image,
                categoryId,
                stock: parseInt(stock) || 0,
                unitType: unitType || "piece",
                featured: featured === 'none' ? null : featured,
                addedDate: addedDate ? new Date(addedDate) : new Date(),
                discountPrice: discountPrice ? parseFloat(discountPrice) : null,
                discountPercentage: discountPercentage ? parseFloat(discountPercentage) : null
            },
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

        return NextResponse.json(serializedProduct, { status: 201 })
    } catch (error) {
        console.error('Error creating product:', error)
        return NextResponse.json(
            { error: 'Failed to create product' },
            { status: 500 }
        )
    }
}
