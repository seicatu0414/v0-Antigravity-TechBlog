import { ArticleEditor } from '@/components/ArticleEditor'
import { getUserFromSession } from '@/lib/utils/cookie-auth'
import { redirect } from 'next/navigation'

export const metadata = {
  title: '記事を投稿 | TechBlog',
}

export default async function PostPage() {
  const payload = await getUserFromSession()
  if (!payload) {
    redirect('/login')
  }

  return (
    <div className="container max-w-6xl py-8">
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">新しい記事を書く</h1>
          <p className="text-muted-foreground mt-2">
            Markdown形式で記事を執筆し、公開することができます。
          </p>
        </div>

        <ArticleEditor />
      </div>
    </div>
  )
}
