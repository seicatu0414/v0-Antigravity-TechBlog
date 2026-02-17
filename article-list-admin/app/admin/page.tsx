import { ActivityFeed } from "@/components/admin/activity-feed"
import { StatsCard } from "@/components/admin/stats-card"
import { Button } from "@/components/ui/button"
import { mockUsers, mockArticles, mockTags, mockActivities, mockComments } from "@/lib/data/mock-admin-data"
import { Users, FileText, Tag, MessageSquare } from "lucide-react"
import Link from "next/link"

export default function AdminDashboardPage() {
  const totalUsers = mockUsers.length
  const totalArticles = mockArticles.length
  const publishedArticles = mockArticles.filter((a) => a.isPublished).length
  const totalTags = mockTags.filter((t) => t.isPublished).length
  const totalComments = mockComments.length
  const adminUsers = mockUsers.filter((u) => u.role === "admin").length

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">管理ダッシュボード</h1>
          <p className="text-muted-foreground mt-2">Article list screenの管理画面</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatsCard title="総ユーザー数" value={totalUsers} description={`管理者: ${adminUsers}名`} icon={Users} />
          <StatsCard
            title="総記事数"
            value={totalArticles}
            description={`公開中: ${publishedArticles}件`}
            icon={FileText}
          />
          <StatsCard title="タグ数" value={totalTags} icon={Tag} />
          <StatsCard title="総コメント数" value={totalComments} icon={MessageSquare} />
        </div>

        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          <Link href="/admin/users" className="block">
            <Button variant="outline" className="w-full h-24 text-lg bg-transparent" size="lg">
              <Users className="mr-2 h-6 w-6" />
              ユーザー管理
            </Button>
          </Link>
          <Link href="/admin/tags" className="block">
            <Button variant="outline" className="w-full h-24 text-lg bg-transparent" size="lg">
              <Tag className="mr-2 h-6 w-6" />
              タグ管理
            </Button>
          </Link>
          <Link href="/admin/users/new" className="block">
            <Button variant="outline" className="w-full h-24 text-lg bg-transparent" size="lg">
              <Users className="mr-2 h-6 w-6" />
              ユーザー新規登録
            </Button>
          </Link>
        </div>

        <ActivityFeed activities={mockActivities} />
      </div>
    </div>
  )
}
