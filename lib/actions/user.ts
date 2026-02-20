'use server'

import { prisma } from '../prisma'
import { revalidatePath } from 'next/cache'
import path from 'path'
import { randomUUID } from 'crypto'
import bcrypt from 'bcryptjs'
import { Logger } from '../logger'
import { Prisma } from '@prisma/client'
import { unlink, mkdir, writeFile } from 'fs/promises'
import { getUserFromSession } from '../utils/cookie-auth'

export async function updateProfile(formData: FormData) {
    try {
        const payload = await getUserFromSession()
        if (!payload) return { error: 'Unauthorized' }

        const nickname = formData.get('nickname') as string
        const bio = formData.get('bio') as string
        const githubUrl = formData.get('githubUrl') as string
        const avatar = formData.get('avatar') as File | null

        let avatarUrl: string | undefined

        if (avatar && avatar.size > 0) {
            // Validate file type
            if (!avatar.type.startsWith('image/')) {
                return { error: 'Invalid file type. Please upload an image.' }
            }

            // Max 5MB
            if (avatar.size > 5 * 1024 * 1024) {
                return { error: 'File size must be less than 5MB.' }
            }

            const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
            const extension = path.extname(avatar.name).toLowerCase()
            if (!ALLOWED_EXTENSIONS.includes(extension)) {
                return { error: '許可されていないファイル形式です。(jpg, jpeg, png, gif, webp)' }
            }

            const buffer = Buffer.from(await avatar.arrayBuffer())
            const filename = `${payload.userId}-${randomUUID()}${extension}`
            const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'avatars')
            const filepath = path.join(uploadDir, filename)

            await mkdir(uploadDir, { recursive: true })
            await writeFile(filepath, buffer)
            avatarUrl = `/uploads/avatars/${filename}`
        }

        if (githubUrl && !githubUrl.startsWith('https://github.com/')) {
            return { error: 'GitHub URLはhttps://github.com/で始まる必要があります' }
        }

        const dataToUpdate: Prisma.UserUpdateInput = {
            nickname: nickname || null,
            bio: bio || null,
            githubUrl: githubUrl || null,
        }

        if (avatarUrl) {
            dataToUpdate.avatarUrl = avatarUrl
        }

        const oldUser = await prisma.user.findUnique({ where: { id: payload.userId } })

        await prisma.user.update({
            where: { id: payload.userId },
            data: dataToUpdate,
        })

        // Delete old avatar
        if (avatarUrl && oldUser?.avatarUrl) {
            try {
                const oldFilename = path.basename(oldUser.avatarUrl)
                const oldFilepath = path.join(process.cwd(), 'public', 'uploads', 'avatars', oldFilename)
                await unlink(oldFilepath)
            } catch (err) {
                Logger.warn('Failed to delete old avatar file', err)
            }
        }

        revalidatePath('/mypage')
        revalidatePath('/mypage/profile')
        revalidatePath(`/profile/${payload.userId}`)

        return { success: true }
    } catch (error) {
        Logger.error('Failed to update profile:', error)
        return { error: 'Internal server error' }
    }
}

export async function updateAccount(formData: FormData) {
    try {
        const payload = await getUserFromSession()
        if (!payload) return { error: 'Unauthorized' }

        const email = formData.get('email') as string
        const currentPassword = formData.get('currentPassword') as string
        const newPassword = formData.get('newPassword') as string
        const confirmPassword = formData.get('confirmPassword') as string

        if (!email) {
            return { error: 'Email is required' }
        }

        const user = await prisma.user.findUnique({
            where: { id: payload.userId }
        })

        if (!user) return { error: 'User not found' }

        const dataToUpdate: Prisma.UserUpdateInput = { email }

        if (newPassword) {
            if (newPassword !== confirmPassword) {
                return { error: '新しいパスワードと確認用パスワードが一致しません' }
            }
            if (!currentPassword) {
                return { error: '現在のパスワードを入力してください' }
            }

            const isPasswordValid = await bcrypt.compare(currentPassword, user.password)
            if (!isPasswordValid) {
                return { error: 'Invalid current password' }
            }

            if (newPassword.length < 8) {
                return { error: 'New password must be at least 8 characters long' }
            }

            dataToUpdate.password = await bcrypt.hash(newPassword, 10)
        }

        // Check if email is already taken by another user
        if (email !== user.email) {
            const existingUser = await prisma.user.findUnique({ where: { email } })
            if (existingUser) {
                return { error: 'Email is already in use' }
            }
        }

        await prisma.user.update({
            where: { id: payload.userId },
            data: dataToUpdate,
        })

        revalidatePath('/mypage')
        revalidatePath('/mypage/account')

        return { success: true }
    } catch (error) {
        Logger.error('Failed to update account:', error)
        return { error: 'Internal server error' }
    }
}
