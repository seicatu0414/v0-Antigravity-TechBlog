import { getAdminUserArticles } from '@/lib/actions/admin-article'
import { UserArticleTable } from '@/components/admin/user-article-table'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function AdminUserArticlesPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params
    const { user, articles } = await getAdminUserArticles(resolvedParams.id)

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild className="h-8 w-8 rounded-sm">
                    <Link href="/admin/users">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="sr-only">戻る</span>
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">ユーザー記事管理</h1>
                    <p className="text-muted-foreground text-sm">ユーザーが投稿した記事の確認と削除を行います。</p>
                </div>
            </div>

            <Card className="rounded-md border shadow-none bg-muted/20">
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12 border border-border">
                            <AvatarImage src={user.avatarUrl || undefined} alt="Avatar" className="object-cover" />
                            <AvatarFallback className="bg-muted text-foreground">
                                {user.nickname?.[0] || user.firstName[0]}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-lg">{user.nickname || `${user.firstName} ${user.lastName}`}</CardTitle>
                            <CardDescription className="font-mono text-xs mt-1">{user.email}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            <div>
                <h2 className="text-lg font-bold mb-4">投稿記事一覧 ({articles.length}件)</h2>
                <UserArticleTable initialArticles={articles} userId={user.id} />
            </div>
        </div>
    )
}
