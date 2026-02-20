'use server'

import { prisma } from '@/lib/prisma'
import { getUserFromSession } from '@/lib/utils/cookie-auth'

import { requireAdmin } from '@/lib/actions/admin-helpers'
import { revalidatePath } from 'next/cache'

export async function getAdminTags() {
    await requireAdmin()

    return await prisma.tag.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            name: true,
            color: true,
            status: true,
            createdAt: true,
            _count: {
                select: { articles: true }
            }
        }
    })
}

export async function createTag(name: string, color: string) {
    await requireAdmin()

    // check if it exists
    const existing = await prisma.tag.findUnique({ where: { name } })
    if (existing) {
        throw new Error('同じ名前のタグが既に存在します')
    }

    await prisma.tag.create({
        data: {
            name,
            color,
            status: 'published'
        }
    })

    revalidatePath('/admin/tags')
    return { success: true }
}

export async function updateTag(id: string, name: string, color: string) {
    await requireAdmin()

    const existing = await prisma.tag.findUnique({ where: { name } })
    if (existing && existing.id !== id) {
        throw new Error('同じ名前のタグが既に存在します')
    }

    await prisma.tag.update({
        where: { id },
        data: { name, color }
    })

    revalidatePath('/admin/tags')
    return { success: true }
}

export async function deleteTag(id: string) {
    await requireAdmin()

    await prisma.tag.delete({
        where: { id }
    })

    return { success: true }
}
