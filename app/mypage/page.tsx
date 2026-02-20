import { redirect } from 'next/navigation'
import { logout } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import { getUserFromSession } from '@/lib/utils/cookie-auth'

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

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-3xl font-bold tracking-tight">ダッシュボード</h1>

      {/* Profile Summary Card */}
      <section className="bg-card rounded-xl p-8 shadow-sm border flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="flex-shrink-0">
          <Avatar className="h-32 w-32 border-4 border-background shadow-md">
            <AvatarImage src={user.avatarUrl || undefined} alt={user.nickname || user.firstName} className="object-cover" />
            <AvatarFallback className="text-4xl text-primary font-bold bg-primary/10">
              {user.nickname?.[0] || user.firstName[0]}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex-1 space-y-4 text-center md:text-left">
          <div>
            <h2 className="text-2xl font-bold">{user.nickname || `${user.firstName} ${user.lastName}`}</h2>
            <p className="text-muted-foreground">{user.email}</p>
            <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
              {user.role === 'admin' ? '管理者' : '一般ユーザー'}
            </div>
          </div>

          <div className="flex gap-4 justify-center md:justify-start pt-2">
            <div className="text-center">
              <span className="block text-2xl font-bold">{user._count.articles}</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">投稿記事</span>
            </div>
            <div className="text-center">
              <span className="block text-2xl font-bold">{user._count.bookmarks}</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">ブックマーク</span>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap gap-3 justify-center md:justify-start">
            <Button asChild variant="default">
              <Link href={`/profile/${user.id}`}>公開プロフィールを見る</Link>
            </Button>
            <form action={logout}>
              <Button type="submit" variant="outline" className="text-destructive hover:bg-destructive/10 hover:text-destructive">
                ログアウト
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/post" className="bg-card p-6 rounded-xl shadow-sm border hover:border-primary transition-colors flex flex-col items-center justify-center text-center group cursor-pointer h-32">
          <span className="font-semibold text-lg group-hover:text-primary transition-colors">📄 新しい記事を投稿する</span>
        </Link>
        <Link href="/mypage/profile" className="bg-card p-6 rounded-xl shadow-sm border hover:border-primary transition-colors flex flex-col items-center justify-center text-center group cursor-pointer h-32">
          <span className="font-semibold text-lg group-hover:text-primary transition-colors">👤 プロフィールを編集する</span>
        </Link>
      </section>
    </div>
  )
}
