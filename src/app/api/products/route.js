import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'

// GET /api/products - Get all products
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const category = searchParams.get('category')
        const featured = searchParams.get('featured')
        const page = parseInt(searchParams.get('page')) || 1
        const limit = parseInt(searchParams.get('limit')) || 10
        const skip = (page - 1) * limit

        const where = {
            isActive: true,
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

        return NextResponse.json({
            products,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        })
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch products' },
            { status: 500 }
        )
    }
}

// POST /api/products - Create new product (Admin only)
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
        const { name, description, price, image, categoryId, stock, isFeatured } = body

        const product = await prisma.product.create({
            data: {
                name,
                description,
                price: parseFloat(price),
                image,
                categoryId,
                stock: parseInt(stock) || 0,
                isFeatured: isFeatured || false
            },
            include: {
                category: true
            }
        })

        return NextResponse.json(product, { status: 201 })
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to create product' },
            { status: 500 }
        )
    }
}
