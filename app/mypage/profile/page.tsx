import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ProfileForm } from '@/components/ProfileForm'
import { getUserFromSession } from '@/lib/utils/cookie-auth'

export const metadata = {
    title: 'プロフィール編集 | TechBlog',
}

export default async function EditProfilePage() {
    const payload = await getUserFromSession()
    if (!payload) redirect('/login')

    const user = await prisma.user.findUnique({
        where: { id: payload.userId },
    })

    if (!user) redirect('/login')

    return (
        <div className="bg-card rounded-xl p-6 shadow-sm border">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">プロフィール編集</h1>
                <p className="text-muted-foreground text-sm mt-1">
                    他のユーザーに表示されるプロフィール情報を更新します。
                </p>
            </div>

            <ProfileForm user={user} />
        </div>
    )
}
