import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request) {
    try {
        const { name, email, phone, password, confirmPassword } = await request.json()

        // Validation
        if (!name || !password || !confirmPassword) {
            return NextResponse.json(
                { error: 'Name, password, and confirm password are required' },
                { status: 400 }
            )
        }

        if (!email && !phone) {
            return NextResponse.json(
                { error: 'Either email or phone number is required' },
                { status: 400 }
            )
        }

        if (password !== confirmPassword) {
            return NextResponse.json(
                { error: 'Passwords do not match' },
                { status: 400 }
            )
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: 'Password must be at least 6 characters long' },
                { status: 400 }
            )
        }

        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    email ? { email } : null,
                    phone ? { phone } : null
                ].filter(Boolean)
            }
        })

        if (existingUser) {
            return NextResponse.json(
                { error: 'User with this email or phone number already exists' },
                { status: 400 }
            )
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12)

        // Create user
        const user = await prisma.user.create({
            data: {
                name,
                email: email || null,
                phone: phone || null,
                password: hashedPassword,
                role: 'USER'
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                createdAt: true
            }
        })

        return NextResponse.json(
            {
                message: 'User registered successfully',
                user
            },
            { status: 201 }
        )

    } catch (error) {
        console.error('Registration error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
