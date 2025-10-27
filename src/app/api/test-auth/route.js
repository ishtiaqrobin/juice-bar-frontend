import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        return NextResponse.json({
            session: session,
            user: session?.user,
            role: session?.user?.role,
            isAdmin: session?.user?.role === 'ADMIN'
        })
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to get session', details: error.message },
            { status: 500 }
        )
    }
}
