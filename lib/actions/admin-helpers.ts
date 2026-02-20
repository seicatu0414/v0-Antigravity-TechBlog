import { prisma } from '@/lib/prisma'
import { getUserFromSession } from '@/lib/utils/cookie-auth'

export async function requireAdmin() {
    const payload = await getUserFromSession()
    if (!payload) throw new Error('Unauthorized')

    const user = await prisma.user.findUnique({ where: { id: payload.userId } })
    if (user?.role !== 'admin') throw new Error('Forbidden')

    return user
}
