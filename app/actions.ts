'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getAuthCookie } from '@/lib/utils/cookie-auth'
import { verifyToken } from '@/lib/auth-system'
import { Logger } from '@/lib/logger'

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
    isBookmarked?: boolean
    views: number
    createdAt: string
    updatedAt: string
}

export async function getArticles(options?: {
    tag?: string | null
    search?: string | null
    sort?: "latest" | "ranking"
    skip?: number
}): Promise<{ articles: UIArticle[]; hasMore: boolean; totalCount: number }> {
    try {
        const take = 9
        const skip = options?.skip || 0

        const where: any = {
            status: 'published',
            ...(options?.tag ? { tags: { some: { tag: { name: options.tag } } } } : {}),
            ...(options?.search ? {
                OR: [
                    { title: { contains: options.search, mode: 'insensitive' } },
                    { content: { contains: options.search, mode: 'insensitive' } }
                ]
            } : {})
        }

        const [articles, totalCount] = await Promise.all([
            prisma.article.findMany({
                where,
                orderBy: options?.sort === 'ranking'
                    ? { bookmarks: { _count: 'desc' } }
                    : { createdAt: 'desc' },
                skip,
                take,
                include: {
                    author: true,
                    tags: {
                        include: {
                            tag: true
                        }
                    },
                    _count: {
                        select: { bookmarks: true }
                    }
                },
            }),
            prisma.article.count({ where })
        ])

        return {
            articles: articles.map((article) => ({
                id: article.id,
                title: article.title,
                content: article.content,
                excerpt: article.excerpt || '',
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
            hasMore: skip + articles.length < totalCount,
            totalCount
        }
    } catch (error) {
        Logger.error('Failed to fetch articles:', error)
        return { articles: [], hasMore: false, totalCount: 0 }
    }
}

export async function getArticle(id: string): Promise<UIArticle | null> {
    try {
        const token = await getAuthCookie()
        let userId: string | null = null
        if (token) {
            const payload = await verifyToken(token)
            if (payload) userId = payload.userId as string
        }

        const article = await prisma.article.findUnique({
            where: { id },
            include: {
                author: true,
                tags: {
                    include: {
                        tag: true
                    }
                },
                _count: {
                    select: { bookmarks: true }
                },
                bookmarks: userId ? {
                    where: { userId }
                } : false
            },
        })

        if (!article) return null

        return {
            id: article.id,
            title: article.title,
            content: article.content,
            excerpt: article.excerpt || '',
            author: {
                name: article.author.nickname || `${article.author.firstName} ${article.author.lastName}`,
                avatar: article.author.avatarUrl || '/diverse-avatars.png',
            },
            tags: article.tags.map((at) => at.tag.name),
            likes: article.likes,
            bookmarks: article._count.bookmarks,
            isBookmarked: userId ? article.bookmarks.length > 0 : false,
            views: article.views,
            createdAt: article.publishedAt ? article.publishedAt.toISOString().split('T')[0] : article.createdAt.toISOString().split('T')[0],
            updatedAt: article.updatedAt.toISOString().split('T')[0],
        }
    } catch (error) {
        Logger.error('Failed to fetch article:', error)
        return null
    }
}

export async function createArticle(formData: FormData) {
    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const rawTags = formData.get('tags') as string

    if (!title || !content) {
        return { error: 'Validate failed' }
    }

    // Auth Check
    const token = await getAuthCookie()
    if (!token) {
        return { error: 'Unauthorized' }
    }

    const payload = await verifyToken(token)
    if (!payload || !payload.userId) {
        return { error: 'Invalid token' }
    }

    try {
        const user = await prisma.user.findUnique({ where: { id: payload.userId } })
        if (!user) throw new Error('User not found')

        const tagsList = rawTags.split(',').map(t => t.trim()).filter(Boolean)

        // Optimizing tag handling using connectOrCreate inside the create call
        // Prisma supports nested writes.
        const tagsOperation = tagsList.map(tag => ({
            tag: {
                connectOrCreate: {
                    where: { name: tag },
                    create: { name: tag }
                }
            }
        }))

        await prisma.article.create({
            data: {
                title,
                content,
                excerpt: content.substring(0, 100) + '...',
                authorId: user.id,
                status: 'published',
                publishedAt: new Date(),
                tags: {
                    create: tagsOperation
                }
            }
        })

        revalidatePath('/')
    } catch (e) {
        Logger.error('Failed to create article:', e)
        return { error: 'Failed to create' }
    }

    redirect('/')
}

export async function getPopularTags(): Promise<string[]> {
    try {
        const tags = await prisma.tag.findMany({
            take: 10,
            orderBy: {
                articles: {
                    _count: 'desc'
                }
            }
        })
        return tags.map(tag => tag.name)
    } catch (error) {
        Logger.error('Failed to fetch tags:', error)
        return []
    }
}

export async function toggleBookmark(articleId: string) {
    try {
        const token = await getAuthCookie()
        if (!token) return { error: 'Unauthorized' }

        const payload = await verifyToken(token)
        if (!payload || !payload.userId) return { error: 'Invalid token' }

        const userId = payload.userId as string

        const existingBookmark = await prisma.bookmark.findUnique({
            where: {
                userId_articleId: {
                    userId,
                    articleId
                }
            }
        })

        if (existingBookmark) {
            await prisma.bookmark.delete({
                where: {
                    id: existingBookmark.id
                }
            })
        } else {
            await prisma.bookmark.create({
                data: {
                    userId,
                    articleId
                }
            })
        }

        revalidatePath(`/articles/${articleId}`)
        revalidatePath('/mypage')
        return { success: true }
    } catch (error) {
        Logger.error('Failed to toggle bookmark:', error)
        return { error: 'Failed to update bookmark' }
    }
}

export async function getBookmarkedArticles(): Promise<UIArticle[]> {
    try {
        const token = await getAuthCookie()
        if (!token) return []

        const payload = await verifyToken(token)
        if (!payload || !payload.userId) return []

        const userId = payload.userId as string

        const bookmarks = await prisma.bookmark.findMany({
            where: {
                userId
            },
            include: {
                article: {
                    include: {
                        author: true,
                        tags: {
                            include: {
                                tag: true
                            }
                        },
                        _count: {
                            select: { bookmarks: true }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return bookmarks.map((b) => ({
            id: b.article.id,
            title: b.article.title,
            content: b.article.content,
            excerpt: b.article.excerpt || '',
            author: {
                name: b.article.author.nickname || `${b.article.author.firstName} ${b.article.author.lastName}`,
                avatar: b.article.author.avatarUrl || '/diverse-avatars.png',
            },
            tags: b.article.tags.map((at) => at.tag.name),
            likes: b.article.likes,
            bookmarks: b.article._count.bookmarks,
            isBookmarked: true,
            views: b.article.views,
            createdAt: b.article.publishedAt ? b.article.publishedAt.toISOString().split('T')[0] : b.article.createdAt.toISOString().split('T')[0],
            updatedAt: b.article.updatedAt.toISOString().split('T')[0],
        }))
    } catch (error) {
        Logger.error('Failed to fetch bookmarked articles:', error)
        return []
    }
}
