import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

export const authOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                phone: { label: "Phone", type: "tel" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email && !credentials?.phone) {
                    return null
                }

                if (!credentials?.password) {
                    return null
                }

                const user = await prisma.user.findFirst({
                    where: {
                        OR: [
                            credentials.email ? { email: credentials.email } : null,
                            credentials.phone ? { phone: credentials.phone } : null
                        ].filter(Boolean)
                    }
                })

                if (!user || !user.password) {
                    return null
                }

                const isPasswordValid = await bcrypt.compare(
                    credentials.password,
                    user.password
                )

                if (!isPasswordValid) {
                    return null
                }

                return {
                    id: user.id,
                    email: user.email,
                    phone: user.phone,
                    name: user.name,
                    role: user.role,
                    image: user.image,
                }
            }
        })
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.role = user.role
                token.phone = user.phone
            }
            return token
        },
        async session({ session, token, trigger, newSession }) {
            console.log("Session callback called with:", {
                trigger,
                tokenData: {
                    id: token.id,
                    name: token.name,
                    email: token.email,
                    phone: token.phone,
                    image: token.image,
                    role: token.role
                },
                newSession
            });

            if (token) {
                session.user.id = token.id || token.sub
                session.user.role = token.role
                session.user.phone = token.phone
                session.user.name = token.name
                session.user.email = token.email
                session.user.image = token.image
            }

            // If session is being updated, use the new session data
            if (trigger === "update" && newSession) {
                session.user.name = newSession.name || session.user.name
                session.user.email = newSession.email || session.user.email
                session.user.phone = newSession.phone || session.user.phone
                session.user.image = newSession.image || session.user.image
            }

            console.log("Final session data:", session.user);
            return session
        },
        async jwt({ token, user, trigger, session }) {
            // If user is being updated, fetch fresh data from database
            if (trigger === "update" && session) {
                try {
                    console.log("JWT update trigger called with session:", session);
                    const freshUser = await prisma.user.findUnique({
                        where: { id: token.id || token.sub }
                    });

                    if (freshUser) {
                        console.log("Fresh user data from database:", freshUser);
                        token.name = freshUser.name
                        token.email = freshUser.email
                        token.phone = freshUser.phone
                        token.image = freshUser.image
                        token.role = freshUser.role
                    }
                } catch (error) {
                    console.error("Error fetching fresh user data:", error);
                }
            }

            if (user) {
                token.id = user.id
                token.role = user.role
                token.phone = user.phone
                token.name = user.name
                token.email = user.email
                token.image = user.image
                console.log("JWT token created with user data:", {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    image: user.image,
                    role: user.role
                });
            }
            return token
        },
    },
    pages: {
        signIn: "/login",
    },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
