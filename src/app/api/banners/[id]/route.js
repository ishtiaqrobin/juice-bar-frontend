import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { unlink } from 'fs/promises'
import { join } from 'path'

// Helper function to delete image file
async function deleteImageFile(imageUrl) {
    try {
        if (!imageUrl || !imageUrl.startsWith('/uploads/')) {
            return // Skip if it's not a local file or external URL
        }

        const filename = imageUrl.replace('/uploads/', '')
        const filePath = join(process.cwd(), 'public', 'uploads', filename)

        try {
            await unlink(filePath)
            console.log(`Deleted image file: ${filePath}`)
        } catch {
            // File might not exist, which is okay
            console.log(`File not found or already deleted: ${filePath}`)
        }
    } catch (error) {
        console.error('Error deleting image file:', error)
        // Don't throw - we'll continue even if file deletion fails
    }
}

// GET /api/banners/[id] - Get single banner
export async function GET(request, { params }) {
    try {
        const { id } = await params
        const banner = await prisma.banner.findUnique({
            where: { id }
        })

        if (!banner) {
            return NextResponse.json(
                { error: 'Banner not found' },
                { status: 404 }
            )
        }

        return NextResponse.json(banner)
    } catch (error) {
        console.error('Error fetching banner:', error)
        return NextResponse.json(
            { error: 'Failed to fetch banner' },
            { status: 500 }
        )
    }
}

// PUT /api/banners/[id] - Update banner (Admin only)
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
        const { image, text, description, isActive, order } = body

        // Get the existing banner to check for old image
        const existingBanner = await prisma.banner.findUnique({
            where: { id }
        })

        if (!existingBanner) {
            return NextResponse.json(
                { error: 'Banner not found' },
                { status: 404 }
            )
        }

        // Validate required fields
        if (!image || !image.trim()) {
            return NextResponse.json(
                { error: 'Banner image is required' },
                { status: 400 }
            )
        }

        // If image is changed, delete the old image file
        if (existingBanner.image && existingBanner.image !== image.trim()) {
            await deleteImageFile(existingBanner.image)
        }

        const banner = await prisma.banner.update({
            where: { id },
            data: {
                image: image.trim(),
                text: text?.trim() || null,
                description: description?.trim() || null,
                isActive: isActive !== undefined ? isActive : true,
                order: order !== undefined ? parseInt(order) : existingBanner.order
            }
        })

        return NextResponse.json(banner)
    } catch (error) {
        console.error('Error updating banner:', error)
        if (error.code === 'P2025') {
            return NextResponse.json(
                { error: 'Banner not found' },
                { status: 404 }
            )
        }
        return NextResponse.json(
            { error: 'Failed to update banner' },
            { status: 500 }
        )
    }
}

// DELETE /api/banners/[id] - Delete banner (Admin only)
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

        // Get the banner first to delete its image file
        const banner = await prisma.banner.findUnique({
            where: { id }
        })

        if (!banner) {
            return NextResponse.json(
                { error: 'Banner not found' },
                { status: 404 }
            )
        }

        // Delete the image file
        if (banner.image) {
            await deleteImageFile(banner.image)
        }

        // Delete the banner from database
        await prisma.banner.delete({
            where: { id }
        })

        return NextResponse.json({ message: 'Banner deleted successfully' })
    } catch (error) {
        console.error('Error deleting banner:', error)
        if (error.code === 'P2025') {
            return NextResponse.json(
                { error: 'Banner not found' },
                { status: 404 }
            )
        }
        return NextResponse.json(
            { error: 'Failed to delete banner' },
            { status: 500 }
        )
    }
}

