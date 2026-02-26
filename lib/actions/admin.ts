'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/actions/admin-helpers'

export async function getDashboardStats() {
    await requireAdmin()

    const [
        totalUsers,
        adminUsers,
        totalArticles,
        publishedArticles,
        totalTags,
        totalComments
    ] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { role: 'admin' } }),
        prisma.article.count(),
        prisma.article.count({ where: { status: 'published' } }),
        prisma.tag.count(),
        prisma.comment.count()
    ])

    const recentUsers = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
            id: true,
            email: true,
            nickname: true,
            firstName: true,
            lastName: true,
            role: true,
            createdAt: true,
            avatarUrl: true
        }
    })

    return {
        stats: {
            totalUsers,
            adminUsers,
            totalArticles,
            publishedArticles,
            totalTags,
            totalComments
        },
        recentUsers
    }
}

// ユーザー管理機能
export async function getUsers() {
    await requireAdmin()

    return await prisma.user.findMany({
        where: { isDeleted: false },
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            nickname: true,
            role: true,
            createdAt: true,
            _count: {
                select: { articles: true, comments: true }
            }
        }
    })
}

export async function updateUserRole(userId: string, newRole: 'admin' | 'general') {
    const currentUser = await requireAdmin()

    // Prevent changing your own role (to avoid locking out the last admin)
    if (userId === currentUser.id) {
        throw new Error('自身の権限は変更できません')
    }

    await prisma.user.update({
        where: { id: userId },
        data: { role: newRole }
    })

    revalidatePath('/admin/users')
    return { success: true }
}

export async function deleteUser(userId: string) {
    const currentUser = await requireAdmin()

    if (userId === currentUser.id) {
        throw new Error('自身のアカウントは削除できません')
    }

    // 論理削除と匿名化
    const timestamp = Date.now()
    await prisma.user.update({
        where: { id: userId },
        data: {
            isDeleted: true,
            email: `deleted_${timestamp}_${userId.slice(0, 8)}@example.com`,
            password: 'deleted_user', // Hash values shouldn't matter since login checks isDeleted
            firstName: 'Unknown',
            lastName: 'User',
            nickname: 'Unknown User',
            avatarUrl: null,
            bio: null,
            githubUrl: null,
            role: 'general' // 削除されるため一般ユーザーに戻す
        }
    })

    revalidatePath('/admin/users')
    return { success: true }
}
