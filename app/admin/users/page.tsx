import { getUsers } from '@/lib/actions/admin'
import { UserTable } from '@/components/admin/user-table'
import { getUserFromSession } from '@/lib/utils/cookie-auth'
import { redirect } from 'next/navigation'

export const metadata = {
    title: 'ユーザー管理 | TechBlog Admin'
}

export default async function AdminUsersPage() {
    const payload = await getUserFromSession()
    if (!payload) redirect('/login')

    const users = await getUsers()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">ユーザー管理</h1>
                <p className="text-muted-foreground mt-2">登録ユーザーの権限変更やアカウントの削除を行います。</p>
            </div>

            <UserTable initialUsers={users} currentUserId={payload.userId} />
        </div>
    )
}
