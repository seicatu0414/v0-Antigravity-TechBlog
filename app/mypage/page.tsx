import { redirect } from 'next/navigation'
import { logout } from '@/lib/actions/auth'
import { getArticles, getBookmarkedArticles } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import { getUserFromSession } from '@/lib/utils/cookie-auth'
import { PenSquare, User, LogOut } from 'lucide-react'
import { MypageTabs } from '@/components/mypage-tabs'
import { Badge } from '@/components/ui/badge'

export const metadata = {
  title: 'マイページダッシュボード | TechBlog',
}
export default async function MyPage() {
  const payload = await getUserFromSession()
  if (!payload) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    include: {
      _count: {
        select: { articles: true, bookmarks: true }
      }
    }
  })

  if (!user) redirect('/login')

  const bookmarkedArticles = await getBookmarkedArticles()
  const { articles: userArticles } = await getArticles({ authorId: payload.userId })

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold tracking-tight">ダッシュボード</h1>

      {/* Profile Summary Card */}
      <section className="rounded-sm border border-border bg-card overflow-hidden shadow-none">
        {/* Flat banner */}
        <div className="h-24 bg-zinc-100 dark:bg-zinc-900 border-b border-border relative">
          <div className="absolute -bottom-12 left-8">
            <Avatar className="h-24 w-24 border border-border shadow-none rounded-sm">
              <AvatarImage src={user.avatarUrl || undefined} alt={user.nickname || user.firstName} className="object-cover" />
              <AvatarFallback className="text-3xl font-mono font-bold bg-muted">
                {user.nickname?.[0] || user.firstName[0]}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className="pt-16 pb-8 px-8 space-y-4">
          <div>
            <h2 className="text-xl font-bold">{user.nickname || `${user.firstName} ${user.lastName}`}</h2>
            <p className="text-sm font-mono text-muted-foreground mt-1">{user.email}</p>
            <div className="mt-2">
              <Badge variant="outline" className="bg-zinc-100 dark:bg-zinc-900 border-border">
                {user.role === 'admin' ? '管理者' : '一般ユーザー'}
              </Badge>
            </div>
          </div>

          <div className="flex gap-6 pt-2">
            <div className="text-center">
              <span className="block text-2xl font-mono font-bold text-foreground">{user._count.articles}</span>
              <span className="text-[10px] sm:text-xs text-muted-foreground font-mono font-medium uppercase tracking-wider">投稿記事</span>
            </div>
            <div className="text-center">
              <span className="block text-2xl font-mono font-bold text-foreground">{user._count.bookmarks}</span>
              <span className="text-[10px] sm:text-xs text-muted-foreground font-mono font-medium uppercase tracking-wider">ブックマーク</span>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap gap-3">
            <Button size="sm" asChild className="shadow-none font-mono uppercase tracking-wider text-xs">
              <Link href={`/profile/${user.id}`}>公開プロフィールを見る</Link>
            </Button>
            <form action={logout}>
              <Button size="sm" type="submit" variant="outline" className="shadow-none font-mono uppercase tracking-wider text-xs border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive">
                <LogOut className="h-4 w-4 mr-2" />
                ログアウト
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/post" className="rounded-sm border border-border bg-card p-6 flex flex-col items-center justify-center text-center group cursor-pointer h-36 hover:bg-muted/50 transition-colors shadow-none">
          <div className="h-12 w-12 rounded-sm border border-border bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mb-3">
            <PenSquare className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          </div>
          <span className="text-sm font-mono uppercase tracking-wider font-medium text-muted-foreground group-hover:text-foreground transition-colors">新しい記事を投稿</span>
        </Link>
        <Link href="/mypage/profile" className="rounded-sm border border-border bg-card p-6 flex flex-col items-center justify-center text-center group cursor-pointer h-36 hover:bg-muted/50 transition-colors shadow-none">
          <div className="h-12 w-12 rounded-sm border border-border bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mb-3">
            <User className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          </div>
          <span className="text-sm font-mono uppercase tracking-wider font-medium text-muted-foreground group-hover:text-foreground transition-colors">プロフィールを編集</span>
        </Link>
      </section>

      {/* Tabs Section */}
      <section className="pt-6">
        <MypageTabs userArticles={userArticles} bookmarkedArticles={bookmarkedArticles} />
      </section>
    </div>
  )
}
