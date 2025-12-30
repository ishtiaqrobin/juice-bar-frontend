// Middleware disabled - using client-side AuthContext for authentication
// If you need server-side protection, implement JWT verification here

import { NextResponse } from 'next/server'

export async function middleware(request) {
    // Currently disabled - authentication handled by AuthContext on client side
    return NextResponse.next()
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/dashboard/:path*',
    ]
}
