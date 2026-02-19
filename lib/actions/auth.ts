'use server'

import { prisma } from '@/lib/prisma'
import { hashPassword, comparePassword } from '@/lib/utils/password'
import { signToken } from '@/lib/auth-system'
import { setAuthCookie, removeAuthCookie } from '@/lib/utils/cookie-auth'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'



export async function login(prevState: any, formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
        return { message: 'メールアドレスとパスワードを入力してください。' }
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } })

        if (!user || !user.password) {
            return { message: 'メールアドレスまたはパスワードが正しくありません。' }
        }

        const isValid = await comparePassword(password, user.password)

        if (!isValid) {
            return { message: 'メールアドレスまたはパスワードが正しくありません。' }
        }

        const token = await signToken({ userId: user.id, email: user.email, role: user.role })
        await setAuthCookie(token)

    } catch (error) {
        console.error('Login error:', error)
        return { message: 'ログイン中にエラーが発生しました。' }
    }

    redirect('/mypage')
}

export async function register(prevState: any, formData: FormData) {
    const lastName = formData.get('lastName') as string
    const firstName = formData.get('firstName') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!lastName || !firstName || !email || !password) {
        return { message: 'すべての項目を入力してください。' }
    }

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } })

        if (existingUser) {
            return { message: 'このメールアドレスは既に登録されています。' }
        }

        const hashedPassword = await hashPassword(password)

        const newUser = await prisma.user.create({
            data: {
                lastName,
                firstName,
                email,
                password: hashedPassword,
                nickname: `${lastName} ${firstName}`,
            },
        })

        const token = await signToken({ userId: newUser.id, email: newUser.email, role: newUser.role })
        await setAuthCookie(token)

    } catch (error) {
        console.error('Register error:', error)
        return { message: '登録中にエラーが発生しました。' }
    }

    redirect('/mypage')
}

export async function logout() {
    await removeAuthCookie()
    revalidatePath('/')
    redirect('/login')
}
