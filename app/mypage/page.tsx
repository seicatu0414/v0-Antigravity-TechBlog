import { redirect } from 'next/navigation'
import { logout } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import { getUserFromSession } from '@/lib/utils/cookie-auth'
import { PenSquare, User, LogOut } from 'lucide-react'

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
      <h1 className="text-2xl font-bold tracking-tight">ダッシュボード</h1>

      {/* Profile Summary Card */}
      <section className="card-elevated rounded-2xl overflow-hidden">
        {/* Gradient banner */}
        <div className="h-24 bg-gradient-to-r from-[#E2703A] to-[#EEB76B] relative">
          <div className="absolute -bottom-12 left-8">
            <Avatar className="h-24 w-24 ring-4 ring-white shadow-lg">
              <AvatarImage src={user.avatarUrl || undefined} alt={user.nickname || user.firstName} className="object-cover" />
              <AvatarFallback className="text-3xl text-primary font-bold bg-gradient-to-br from-primary/20 to-primary/5">
                {user.nickname?.[0] || user.firstName[0]}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className="pt-16 pb-8 px-8 space-y-4">
          <div>
            <h2 className="text-xl font-bold">{user.nickname || `${user.firstName} ${user.lastName}`}</h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <div className="mt-2">
              <span className="chip text-xs bg-primary/10 text-primary">
                {user.role === 'admin' ? '管理者' : '一般ユーザー'}
              </span>
            </div>
          </div>

          <div className="flex gap-6 pt-2">
            <div className="text-center">
              <span className="block text-2xl font-bold text-foreground">{user._count.articles}</span>
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">投稿記事</span>
            </div>
            <div className="text-center">
              <span className="block text-2xl font-bold text-foreground">{user._count.bookmarks}</span>
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">ブックマーク</span>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap gap-3">
            <Button asChild className="rounded-full bg-foreground hover:bg-foreground/90 text-background shadow-md">
              <Link href={`/profile/${user.id}`}>公開プロフィールを見る</Link>
            </Button>
            <form action={logout}>
              <Button type="submit" variant="outline" className="rounded-full border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive">
                <LogOut className="h-4 w-4 mr-2" />
                ログアウト
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/post" className="card-material p-8 flex flex-col items-center justify-center text-center group cursor-pointer h-36">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
            <PenSquare className="h-6 w-6 text-primary" />
          </div>
          <span className="font-semibold text-base group-hover:text-primary transition-colors">新しい記事を投稿する</span>
        </Link>
        <Link href="/mypage/profile" className="card-material p-8 flex flex-col items-center justify-center text-center group cursor-pointer h-36">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
            <User className="h-6 w-6 text-primary" />
          </div>
          <span className="font-semibold text-base group-hover:text-primary transition-colors">プロフィールを編集する</span>
        </Link>
      </section>
    </div>
  )
}
