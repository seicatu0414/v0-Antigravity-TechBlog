'use server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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

export type GetArticlesResult = {
    articles: UIArticle[]
    totalCount: number
    hasMore: boolean
}

const PAGE_SIZE = 20

export async function getArticles(options?: {
    skip?: number
    take?: number
    tag?: string | null
    search?: string | null
    sort?: 'latest' | 'ranking'
}): Promise<GetArticlesResult> {
    try {
        const skip = options?.skip ?? 0
        const take = options?.take ?? PAGE_SIZE
        const tag = options?.tag || null
        const search = options?.search || null
        const sort = options?.sort ?? 'latest'

        // Build where clause
        const where: Record<string, unknown> = {
            status: 'published',
        }

        if (tag) {
            where.tags = {
                some: {
                    tag: { name: tag },
                },
            }
        }

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { excerpt: { contains: search, mode: 'insensitive' } },
            ]
        }

        const [articles, totalCount] = await Promise.all([
            prisma.article.findMany({
                where,
                orderBy: sort === 'ranking'
                    ? { views: 'desc' as const }
                    : { createdAt: 'desc' as const },
                skip,
                take,
                include: {
                    author: true,
                    tags: {
                        include: {
                            tag: true,
                        },
                    },
                    _count: {
                        select: { bookmarks: true },
                    },
                },
            }),
            prisma.article.count({ where }),
        ])

        return {
            articles: articles.map((article) => ({
                id: article.id,
                title: article.title,
                content: article.content,
                excerpt: article.excerpt || '',
                coverImageUrl: (article as Record<string, unknown>).coverImageUrl as string | null | undefined,
                author: {
                    name: article.author.nickname || `${article.author.firstName} ${article.author.lastName}`,
                    avatar: article.author.avatarUrl || '/diverse-avatars.png',
                },
                tags: article.tags.map((at) => at.tag.name),
                likes: article.likes,
                bookmarks: article._count.bookmarks,
                views: article.views,
                createdAt: article.publishedAt ? article.publishedAt.toISOString().split('T')[0] : article.createdAt.toISOString().split('T')[0],
                updatedAt: article.updatedAt.toISOString().split('T')[0],
            })),
            totalCount,
            hasMore: skip + take < totalCount,
        }
    } catch (error) {
        console.error('Failed to fetch articles:', error)
        return { articles: [], totalCount: 0, hasMore: false }
    }
}
