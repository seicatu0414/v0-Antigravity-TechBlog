'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const prisma = new PrismaClient()

// UI-compatible Article type (matching mock-data.ts structure approx)
export type UIArticle = {
    id: string
    title: string
    content: string
    excerpt: string
    coverImageUrl?: string | null
    author: {
        name: string
        avatar: string
    }
    tags: string[]
    likes: number
    bookmarks: number
    views: number
    createdAt: string
    updatedAt: string
}

export async function getArticles(): Promise<UIArticle[]> {
    try {
        const articles = await prisma.article.findMany({
            where: {
                status: 'published',
            },
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                author: true,
                tags: {
                    include: {
                        tag: true
                    }
                }
            },
        })

        return articles.map((article) => ({
            id: article.id,
            title: article.title,
            content: article.content, // content might be long, but UI seems to expect it? simple listing maybe doesn't need full content
            excerpt: article.excerpt || '',
            coverImageUrl: article.coverImageUrl,
            author: {
                name: article.author.nickname || `${article.author.firstName} ${article.author.lastName}`,
                avatar: article.author.avatarUrl || '/diverse-avatars.png',
            },
            tags: article.tags.map((at) => at.tag.name),
            likes: article.likes,
            bookmarks: 0, // Mock for now, or fetch count
            views: article.views,
            createdAt: article.publishedAt ? article.publishedAt.toISOString().split('T')[0] : article.createdAt.toISOString().split('T')[0],
            updatedAt: article.updatedAt.toISOString().split('T')[0],
        }))
    } catch (error) {
        console.error('Failed to fetch articles:', error)
        return []
    }
}
