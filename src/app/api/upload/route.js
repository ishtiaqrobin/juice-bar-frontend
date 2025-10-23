import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'
import { getServerSession } from 'next-auth/next'

export async function POST(request) {
    try {
        const session = await getServerSession()

        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const data = await request.formData()
        const file = data.get('file')

        if (!file) {
            return NextResponse.json(
                { error: 'No file uploaded' },
                { status: 400 }
            )
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Create uploads directory if it doesn't exist
        const uploadDir = path.join(process.cwd(), 'public', 'uploads')

        // Generate unique filename
        const timestamp = Date.now()
        const filename = `${timestamp}-${file.name}`
        const filepath = path.join(uploadDir, filename)

        await writeFile(filepath, buffer)

        const fileUrl = `/uploads/${filename}`

        return NextResponse.json({
            success: true,
            url: fileUrl,
            filename: filename
        })
    } catch (error) {
        console.error('Upload error:', error)
        return NextResponse.json(
            { error: 'Failed to upload file' },
            { status: 500 }
        )
    }
}
