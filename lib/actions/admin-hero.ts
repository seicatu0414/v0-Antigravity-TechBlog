'use server'

import { prisma } from '@/lib/prisma'
import { getUserFromSession } from '@/lib/utils/cookie-auth'
import path from 'path'
import { randomUUID } from 'crypto'
import { mkdir, writeFile } from 'fs/promises'
import { Logger } from '@/lib/logger'

import { requireAdmin } from '@/lib/actions/admin-helpers'
import { revalidatePath } from 'next/cache'
import { unlink } from 'fs/promises'

export async function getHeroImages() {
    await requireAdmin()

    return await prisma.heroImage.findMany({
        orderBy: { order: 'asc' }
    })
}

export async function uploadHeroImage(formData: FormData) {
    try {
        await requireAdmin()

        const file = formData.get('image') as File | null
        if (!file || file.size === 0) {
            throw new Error('Image required')
        }

        if (file.size > 5 * 1024 * 1024) {
            throw new Error('File size must be less than 5MB.')
        }

        if (!file.type.startsWith('image/')) {
            throw new Error('Invalid file type. Please upload an image.')
        }

        const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
        const extension = path.extname(file.name).toLowerCase()
        if (!ALLOWED_EXTENSIONS.includes(extension)) {
            throw new Error('許可されていないファイル形式です。')
        }

        const buffer = Buffer.from(await file.arrayBuffer())
        const filename = `hero-${randomUUID()}${extension}`
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'hero')
        const filepath = path.join(uploadDir, filename)

        await mkdir(uploadDir, { recursive: true })
        await writeFile(filepath, buffer)

        const url = `/uploads/hero/${filename}`

        // get current max order
        const maxOrderItem = await prisma.heroImage.findFirst({
            orderBy: { order: 'desc' }
        })
        const newOrder = maxOrderItem ? maxOrderItem.order + 1 : 0

        await prisma.heroImage.create({
            data: {
                url,
                order: newOrder,
                isActive: true
            }
        })

        revalidatePath('/admin/hero-images')
        return { success: true }
    } catch (e: any) {
        Logger.error('Failed to upload hero image:', e)
        return { error: e.message || 'Internal server error' }
    }
}

export async function deleteHeroImage(id: string) {
    await requireAdmin()

    const image = await prisma.heroImage.findUnique({ where: { id } })
    if (image) {
        try {
            // Delete file from disk
            const filepath = path.join(process.cwd(), 'public', image.url)
            await unlink(filepath)
        } catch (e) {
            Logger.warn('Failed to delete hero image file from disk:', e)
        }
    }

    await prisma.heroImage.delete({
        where: { id }
    })

    revalidatePath('/admin/hero-images')
    return { success: true }
}

export async function toggleHeroImageActive(id: string, isActive: boolean) {
    await requireAdmin()

    await prisma.heroImage.update({
        where: { id },
        data: { isActive }
    })

    return { success: true }
}

export async function updateHeroImagesOrder(updates: { id: string, order: number }[]) {
    await requireAdmin()

    // Prisma doesn't support bulk update with different values easily, so we use transaction
    const updatePromises = updates.map(update =>
        prisma.heroImage.update({
            where: { id: update.id },
            data: { order: update.order }
        })
    )

    await prisma.$transaction(updatePromises)

    revalidatePath('/admin/hero-images')
    return { success: true }
}
