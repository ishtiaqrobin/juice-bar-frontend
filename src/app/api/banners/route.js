import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

// GET /api/banners - Get all banners (public, but only active ones)
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const includeInactive = searchParams.get('includeInactive') === 'true'
        const adminOnly = searchParams.get('adminOnly') === 'true'

        // Check if this is an admin request
        const session = await getServerSession(authOptions)
        const isAdmin = session?.user?.role === 'ADMIN'

        const banners = await prisma.banner.findMany({
            where: (includeInactive || adminOnly) && isAdmin ? {} : { isActive: true },
            orderBy: [
                { order: 'asc' },
                { createdAt: 'desc' }
            ]
        })

        return NextResponse.json(banners)
    } catch (error) {
        console.error('Error fetching banners:', error)
        return NextResponse.json(
            { error: 'Failed to fetch banners' },
            { status: 500 }
        )
    }
}

// POST /api/banners - Create new banner (Admin only)
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
        const { image, text, description, isActive, order } = body

        // Validate required fields
        if (!image || !image.trim()) {
            return NextResponse.json(
                { error: 'Banner image is required' },
                { status: 400 }
            )
        }

        const banner = await prisma.banner.create({
            data: {
                image: image.trim(),
                text: text?.trim() || null,
                description: description?.trim() || null,
                isActive: isActive !== undefined ? isActive : true,
                order: order !== undefined ? parseInt(order) : 0
            }
        })

        return NextResponse.json(banner, { status: 201 })
    } catch (error) {
        console.error('Error creating banner:', error)
        return NextResponse.json(
            { error: 'Failed to create banner' },
            { status: 500 }
        )
    }
}

