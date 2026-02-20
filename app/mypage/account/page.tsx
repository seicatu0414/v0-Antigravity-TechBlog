import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { AccountForm } from '@/components/AccountForm'
import { getUserFromSession } from '@/lib/utils/cookie-auth'

export const metadata = {
    title: 'アカウント設定 | TechBlog',
}

export default async function AccountSettingsPage() {
    const payload = await getUserFromSession()
    if (!payload) redirect('/login')

    const user = await prisma.user.findUnique({
        where: { id: payload.userId },
    })

    if (!user) redirect('/login')

    return (
        <div className="bg-card rounded-xl p-6 shadow-sm border">
            <div className="mb-6 border-b pb-4">
                <h1 className="text-2xl font-bold text-red-600">Danger Zone / アカウント設定</h1>
                <p className="text-muted-foreground text-sm mt-1">
                    メールアドレスやパスワードなど、認証に関わる重要な設定を変更します。
                </p>
            </div>

            <AccountForm email={user.email} />
        </div>
    )
}
