import { getAdminTags } from '@/lib/actions/admin-tags'
import { TagTable } from '@/components/admin/tag-table'
import { getUserFromSession } from '@/lib/utils/cookie-auth'
import { redirect } from 'next/navigation'

export const metadata = {
    title: 'タグ管理 | TechBlog Admin'
}

export default async function AdminTagsPage() {
    const tags = await getAdminTags()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">タグ管理</h1>
                <p className="text-muted-foreground mt-2">記事に付与するタグの作成・編集・削除を行います。</p>
            </div>

            <TagTable initialTags={tags} />
        </div>
    )
}
