import { getHeroImages } from '@/lib/actions/admin-hero'
import { HeroTable } from '@/components/admin/hero-table'
import { getUserFromSession } from '@/lib/utils/cookie-auth'

export const metadata = {
    title: 'ヒーロー画像管理 | TechBlog Admin'
}

export default async function AdminHeroPage() {
    const images = await getHeroImages()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">ヒーロー画像管理</h1>
                <p className="text-muted-foreground mt-2">トップページのカルーセルに表示される画像を管理します。</p>
            </div>

            <HeroTable initialImages={images} />
        </div>
    )
}
