import { getAuthCookie } from '@/lib/utils/cookie-auth'
import { verifyToken } from '@/lib/auth-system'
import { redirect } from 'next/navigation'
import { logout } from '@/lib/actions/auth'
import { getBookmarkedArticles } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'
import { ArticleCard } from '@/components/article-card'

export default async function MyPage() {
  const token = await getAuthCookie()
  if (!token) {
    redirect('/login')
  }

  const payload = await verifyToken(token) as any
  if (!payload || !payload.userId) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
  })

  if (!user) {
    redirect('/login')
  }

  const bookmarkedArticles = await getBookmarkedArticles()

  return (
    <div className="container py-8 bg-background min-h-screen">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Profile Section */}
        <section className="bg-card rounded-xl p-8 shadow-sm border text-center space-y-4">
          <div className="w-24 h-24 rounded-full bg-primary/10 mx-auto flex items-center justify-center text-3xl font-bold text-primary">
            {user.nickname?.[0] || user.firstName[0]}
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">{user.nickname || `${user.firstName} ${user.lastName}`}</h1>
            <p className="text-muted-foreground">{user.email}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">{user.role}</p>
          </div>

          <form action={logout} className="pt-4">
            <Button type="submit" variant="destructive" className="w-full sm:w-auto">
              ログアウト
            </Button>
          </form>
        </section>

        {/* Bookmarks Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold border-l-4 border-primary pl-4">ブックマークした記事</h2>
          {bookmarkedArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bookmarkedArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="bg-muted/30 rounded-lg p-12 text-center border-dashed border-2">
              <p className="text-muted-foreground">まだブックマークした記事はありません。</p>
              <Button variant="link" className="mt-2" asChild>
                <a href="/">記事を探す</a>
              </Button>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
