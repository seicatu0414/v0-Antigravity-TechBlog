'use server'

import { prisma } from '@/lib/prisma'
import { getUserFromSession } from '@/lib/utils/cookie-auth'
import { revalidatePath } from 'next/cache'
import { Logger } from '@/lib/logger'

export type CommentWithAuthor = {
    id: string
    content: string
    createdAt: string
    author: {
        id: string
        name: string
        avatar: string | null
    }
}

export async function getComments(articleId: string): Promise<CommentWithAuthor[]> {
    try {
        const comments = await prisma.comment.findMany({
            where: {
                articleId,
                status: 'published',
            },
            orderBy: { createdAt: 'asc' },
            include: {
                author: true,
            },
        })

        return comments.map((c) => ({
            id: c.id,
            content: c.content,
            createdAt: c.createdAt.toISOString(),
            author: {
                id: c.author.id,
                name: c.author.nickname || `${c.author.firstName} ${c.author.lastName}`,
                avatar: c.author.avatarUrl,
            },
        }))
    } catch (e) {
        Logger.error('Failed to fetch comments:', e)
        return []
    }
}

export async function createComment(articleId: string, content: string) {
    try {
        const payload = await getUserFromSession()
        if (!payload) return { error: 'ログインが必要です' }

        if (!content.trim()) {
            return { error: 'コメント内容を入力してください' }
        }

        if (content.length > 2000) {
            return { error: 'コメントは2000文字以内で入力してください' }
        }

        const article = await prisma.article.findUnique({ where: { id: articleId } })
        if (!article) return { error: '記事が見つかりません' }

        await prisma.comment.create({
            data: {
                content: content.trim(),
                articleId,
                authorId: payload.userId,
            },
        })

        revalidatePath(`/articles/${articleId}`)
        return { success: true }
    } catch (e) {
        Logger.error('Failed to create comment:', e)
        return { error: 'コメントの投稿に失敗しました' }
    }
}

export async function deleteComment(commentId: string) {
    try {
        const payload = await getUserFromSession()
        if (!payload) return { error: 'ログインが必要です' }

        const comment = await prisma.comment.findUnique({ where: { id: commentId } })
        if (!comment) return { error: 'コメントが見つかりません' }

        // Only the author or an admin can delete
        if (comment.authorId !== payload.userId) {
            const user = await prisma.user.findUnique({ where: { id: payload.userId } })
            if (!user || user.role !== 'admin') {
                return { error: '削除権限がありません' }
            }
        }

        await prisma.comment.delete({ where: { id: commentId } })

        revalidatePath(`/articles/${comment.articleId}`)
        return { success: true }
    } catch (e) {
        Logger.error('Failed to delete comment:', e)
        return { error: 'コメントの削除に失敗しました' }
    }
}
