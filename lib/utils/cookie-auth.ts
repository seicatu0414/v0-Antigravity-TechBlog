import { cookies } from 'next/headers'
import { verifyToken, JwtPayload } from '../auth-system'
import { prisma } from '../prisma'

const COOKIE_NAME = 'auth-token'

export async function setAuthCookie(token: string) {
    const cookieStore = await cookies()
    cookieStore.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
    })
}

export async function removeAuthCookie() {
    const cookieStore = await cookies()
    cookieStore.delete(COOKIE_NAME)
}

export async function getAuthCookie(): Promise<string | undefined> {
    const cookieStore = await cookies()
    return cookieStore.get(COOKIE_NAME)?.value
}

export async function getUserFromSession(): Promise<JwtPayload | null> {
    const token = await getAuthCookie()
    if (!token) return null
    const payload = await verifyToken(token)
    if (!payload) return null

    // DB上で存在するか・論理削除されていないかチェック
    const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: { isDeleted: true }
    })

    if (!user || user.isDeleted) return null

    return payload
}
