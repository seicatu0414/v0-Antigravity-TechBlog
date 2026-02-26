'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/actions/admin-helpers'

export async function getAdminUserArticles(userId: string) {
    await requireAdmin()

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            nickname: true,
            isDeleted: true
        }
    })

    if (!user) {
        throw new Error('User not found')
    }

    const articles = await prisma.article.findMany({
        where: { authorId: userId },
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            title: true,
            status: true,
            createdAt: true,
            views: true,
            likes: true,
            _count: {
                select: { comments: true, bookmarks: true }
            }
        }
    })

    return { user, articles }
}

export async function deleteAdminArticle(articleId: string, userId: string) {
    await requireAdmin()

    await prisma.article.delete({
        where: { id: articleId }
    })

    // Revalidate the user's article page and ranking/top page
    revalidatePath(`/admin/users/${userId}/articles`)
    revalidatePath('/admin')
    revalidatePath('/')

    return { success: true }
}
