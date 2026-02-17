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

export async function createArticle(formData: FormData) {
    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const rawTags = formData.get('tags') as string // Json string or comma separated? Form in page.tsx needed

    // Hardcoded for now for MVP - ideally get from session
    const authorEmail = 'admin@example.com'

    if (!title || !content) {
        return { error: 'Validate failed' }
    }

    try {
        const user = await prisma.user.findUnique({ where: { email: authorEmail } })
        if (!user) throw new Error('User not found')

        // Parse tags: assumed to be passed as JSON string or handled otherwise
        // In post/page.tsx, we need to adjust how we send tags
        const tagsList = rawTags.split(',').map(t => t.trim()).filter(Boolean)

        // Handle tags (find or create)
        const tagConnects = []
        for (const tagName of tagsList) {
            // Simple logic: find existing tag or ignore/create
            // For simplicity, let's assume we read ID or name. 
            // If we use names, we use upsert logic or findFirst.
            let tag = await prisma.tag.findUnique({ where: { name: tagName } })
            if (!tag) {
                tag = await prisma.tag.create({ data: { name: tagName } })
            }
            tagConnects.push({ tag: { connect: { id: tag.id } } })
        }

        await prisma.article.create({
            data: {
                title,
                content,
                excerpt: content.substring(0, 100) + '...',
                authorId: user.id,
                status: 'published', // Publish immediately for MVP
                publishedAt: new Date(),
                tags: {
                    create: tagConnects
                }
            }
        })

        revalidatePath('/')
    } catch (e) {
        console.error(e)
        return { error: 'Failed to create' }
    }

    redirect('/')
}
