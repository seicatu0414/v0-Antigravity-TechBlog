'use server'

import { prisma } from '../prisma'
import { revalidatePath } from 'next/cache'
import { getUserFromSession } from '../utils/cookie-auth'
import path from 'path'
import { randomUUID } from 'crypto'
import { mkdir, writeFile, unlink } from 'fs/promises'
import { Prisma } from '@prisma/client'
import { Logger } from '../logger'

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

export async function uploadImage(file: File): Promise<{ url?: string; error?: string }> {
    try {
        const payload = await getUserFromSession()
        if (!payload) return { error: 'Unauthorized' }

        if (file.size === 0) {
            return { error: 'Empty file' }
        }

        if (!file.type.startsWith('image/')) {
            return { error: 'Invalid file type. Please upload an image.' }
        }

        if (file.size > 5 * 1024 * 1024) {
            return { error: 'File size must be less than 5MB.' }
        }

        const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
        const extension = path.extname(file.name).toLowerCase()
        if (!ALLOWED_EXTENSIONS.includes(extension)) {
            return { error: '許可されていないファイル形式です。(jpg, jpeg, png, gif, webp)' }
        }

        const buffer = Buffer.from(await file.arrayBuffer())
        const filename = `${payload.userId}-${randomUUID()}${extension}`
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'articles')
        const filepath = path.join(uploadDir, filename)

        await mkdir(uploadDir, { recursive: true })
        await writeFile(filepath, buffer)

        return { url: `/uploads/articles/${filename}` }
    } catch (e) {
        Logger.error('Failed to upload image:', e)
        return { error: 'Internal server error while uploading image' }
    }
}

export async function createArticle(formData: FormData) {
    try {
        const payload = await getUserFromSession()
        if (!payload) return { error: 'Unauthorized' }

        const title = formData.get('title') as string
        const content = formData.get('content') as string
        const rawTags = formData.get('tags') as string
        const coverImage = formData.get('coverImage') as File | null
        const status = formData.get('status') as string || 'published'

        if (!title || !content) {
            return { error: 'Title and content are required' }
        }

        let coverImageUrl: string | null = null

        if (coverImage && coverImage.size > 0) {
            const uploadResult = await uploadImage(coverImage)
            if (uploadResult.error) {
                return { error: uploadResult.error }
            }
            if (uploadResult.url) {
                coverImageUrl = uploadResult.url
            }
        }

        const tagsList = rawTags ? rawTags.split(',').map(t => t.trim()).filter(Boolean) : []
        const tagConnects = []
        for (const tagName of tagsList) {
            let tag = await prisma.tag.findUnique({ where: { name: tagName } })
            if (!tag) {
                tag = await prisma.tag.create({ data: { name: tagName } })
            }
            tagConnects.push({ tag: { connect: { id: tag.id } } })
        }

        const article = await prisma.article.create({
            data: {
                title,
                content,
                excerpt: content.substring(0, 100) + '...',
                coverImageUrl,
                authorId: payload.userId,
                status,
                publishedAt: status === 'published' ? new Date() : null,
                tags: {
                    create: tagConnects
                }
            }
        })

        revalidatePath('/')
        revalidatePath('/mypage')
        revalidatePath(`/profile/${payload.userId}`)

        return { success: true, articleId: article.id }
    } catch (e) {
        Logger.error('Failed to create article:', e)
        return { error: 'Internal server error' }
    }
}

export async function updateArticle(id: string, formData: FormData) {
    try {
        const payload = await getUserFromSession()
        if (!payload) return { error: 'Unauthorized' }

        const existingArticle = await prisma.article.findUnique({ where: { id } })
        if (!existingArticle) return { error: 'Article not found' }
        if (existingArticle.authorId !== payload.userId) return { error: 'Permission denied' }

        const title = formData.get('title') as string
        const content = formData.get('content') as string
        const rawTags = formData.get('tags') as string
        const coverImage = formData.get('coverImage') as File | null
        const status = formData.get('status') as string || existingArticle.status

        if (!title || !content) {
            return { error: 'Title and content are required' }
        }

        let coverImageUrl = existingArticle.coverImageUrl

        if (coverImage && coverImage.size > 0) {
            const uploadResult = await uploadImage(coverImage)
            if (uploadResult.error) {
                return { error: uploadResult.error }
            }
            if (uploadResult.url) {
                // Remove old cover image if it exists
                if (coverImageUrl) {
                    try {
                        const oldFilename = path.basename(coverImageUrl)
                        const oldFilepath = path.join(process.cwd(), 'public', 'uploads', 'articles', oldFilename)
                        await unlink(oldFilepath)
                    } catch (err) {
                        Logger.warn('Failed to delete old article cover', err)
                    }
                }
                coverImageUrl = uploadResult.url
            }
        }

        const dataToUpdate: Prisma.ArticleUpdateInput = {
            title,
            content,
            excerpt: content.substring(0, 100) + '...',
            coverImageUrl,
            status,
        }

        if (status === 'published' && existingArticle.status === 'draft') {
            dataToUpdate.publishedAt = new Date()
        }

        await prisma.article.update({
            where: { id },
            data: dataToUpdate,
        })

        // Handle tags separately to simplify updates
        const tagsList = rawTags ? rawTags.split(',').map(t => t.trim()).filter(Boolean) : []
        await prisma.articleTag.deleteMany({ where: { articleId: id } })

        for (const tagName of tagsList) {
            let tag = await prisma.tag.findUnique({ where: { name: tagName } })
            if (!tag) {
                tag = await prisma.tag.create({ data: { name: tagName } })
            }
            await prisma.articleTag.create({
                data: {
                    articleId: id,
                    tagId: tag.id
                }
            })
        }

        revalidatePath('/')
        revalidatePath(`/articles/${id}`)
        revalidatePath('/mypage')
        revalidatePath(`/profile/${payload.userId}`)

        return { success: true, articleId: id }
    } catch (e) {
        Logger.error('Failed to update article:', e)
        return { error: 'Internal server error' }
    }
}

export async function deleteArticle(id: string) {
    try {
        const payload = await getUserFromSession()
        if (!payload) return { error: 'Unauthorized' }

        const existingArticle = await prisma.article.findUnique({ where: { id } })
        if (!existingArticle) return { error: 'Article not found' }
        if (existingArticle.authorId !== payload.userId) return { error: 'Permission denied' }

        if (existingArticle.coverImageUrl) {
            try {
                const oldFilename = path.basename(existingArticle.coverImageUrl)
                const oldFilepath = path.join(process.cwd(), 'public', 'uploads', 'articles', oldFilename)
                await unlink(oldFilepath)
            } catch (err) {
                Logger.warn('Failed to delete article cover', err)
            }
        }

        await prisma.article.delete({ where: { id } })

        revalidatePath('/')
        revalidatePath('/mypage')
        revalidatePath(`/profile/${payload.userId}`)

        return { success: true }
    } catch (e) {
        Logger.error('Failed to delete article:', e)
        return { error: 'Internal server error' }
    }
}
