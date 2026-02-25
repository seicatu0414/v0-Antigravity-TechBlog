import { getDashboardStats } from '@/lib/actions/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, FileText, Tags, MessageSquare, Calendar } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default async function AdminDashboard() {
    const { stats, recentUsers } = await getDashboardStats()

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">ダッシュボード</h1>
                <p className="text-muted-foreground mt-2">当サイトの運用状況と統計情報</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="rounded-md border">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">総ユーザー数</CardTitle>
                        <Users className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-extrabold tracking-tight">{stats.totalUsers}</div>
                        <p className="text-xs text-muted-foreground mt-2 font-medium">
                            うち管理者: {stats.adminUsers}人
                        </p>
                    </CardContent>
                </Card>

                <Card className="rounded-md border">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">総記事数</CardTitle>
                        <FileText className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-extrabold tracking-tight">{stats.totalArticles}</div>
                        <p className="text-xs text-muted-foreground mt-2 font-medium">
                            公開済み: {stats.publishedArticles}件 / 下書き: {stats.totalArticles - stats.publishedArticles}件
                        </p>
                    </CardContent>
                </Card>

                <Card className="rounded-md border">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">タグ数</CardTitle>
                        <Tags className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-extrabold tracking-tight">{stats.totalTags}</div>
                    </CardContent>
                </Card>

                <Card className="rounded-md border">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">コメント数</CardTitle>
                        <MessageSquare className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-extrabold tracking-tight">{stats.totalComments}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card className="col-span-1 rounded-md border">
                    <CardHeader className="border-b bg-muted/30">
                        <CardTitle className="text-base">最近の登録ユーザー</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            {recentUsers.map(user => (
                                <div key={user.id} className="flex items-center p-3 rounded-md hover:bg-muted/30 transition-colors border">
                                    <Avatar className="h-10 w-10 border rounded-md">
                                        <AvatarImage src={user.avatarUrl || undefined} alt="Avatar" />
                                        <AvatarFallback>{user.nickname?.[0] || user.firstName[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            {user.nickname || `${user.firstName} ${user.lastName}`}
                                            {user.role === 'admin' && (
                                                <span className="ml-2 inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                                    Admin
                                                </span>
                                            )}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {user.email}
                                        </p>
                                    </div>
                                    <div className="ml-auto font-medium text-xs text-muted-foreground flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {formatDate(user.createdAt)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    )
}
