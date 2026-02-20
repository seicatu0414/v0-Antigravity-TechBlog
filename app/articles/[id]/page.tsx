import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, Bookmark, Share2, Pencil } from "lucide-react"
import { MarkdownPreview } from "@/components/MarkdownPreview"
import { prisma } from "@/lib/prisma"
import { getUserFromSession } from "@/lib/utils/cookie-auth"
import Link from "next/link"
import Image from "next/image"

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const article = await prisma.article.findUnique({
    where: { id },
    include: {
      author: true,
      tags: { include: { tag: true } }
    }
  })

  if (!article || article.status !== 'published') {
    // We allow authors to view their own drafts, but for simplicity here we just check if it's published or if we're the author.
    // Let's get the standard user payload:
    const payload = await getUserFromSession()
    if (!article || (article.status !== 'published' && article.authorId !== payload?.userId)) {
      notFound()
    }
  }

  const payload = await getUserFromSession()
  const isAuthor = payload?.userId === article.authorId

  return (
    <div className="container max-w-4xl py-8">
      <article className="space-y-6">
        <div className="rounded-lg border bg-card p-6 md:p-10 space-y-8 shadow-sm">

          {/* Cover Image */}
          {article.coverImageUrl && (
            <div className="relative w-full aspect-video md:aspect-[21/9] rounded-lg overflow-hidden border">
              <Image
                src={article.coverImageUrl}
                alt={article.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-3xl md:text-5xl font-bold text-balance leading-tight">{article.title}</h1>
              {isAuthor && (
                <Button variant="outline" size="sm" asChild className="shrink-0 flex items-center gap-1">
                  <Link href={`/articles/${article.id}/edit`}>
                    <Pencil className="h-4 w-4" />
                    編集する
                  </Link>
                </Button>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
              <Link href={`/profile/${article.authorId}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <Avatar className="h-12 w-12 border">
                  <AvatarImage src={article.author.avatarUrl || "/diverse-avatars.png"} alt={article.author.nickname || article.author.firstName} />
                  <AvatarFallback>{(article.author.nickname || article.author.firstName)[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{article.author.nickname || `${article.author.firstName} ${article.author.lastName}`}</p>
                  <p className="text-sm text-muted-foreground">{article.publishedAt ? article.publishedAt.toLocaleDateString('ja-JP') : article.createdAt.toLocaleDateString('ja-JP')} に公開</p>
                </div>
              </Link>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="rounded-full">
                  <Heart className="h-4 w-4 mr-1.5" />
                  {article.likes}
                </Button>
                <Button variant="outline" size="sm" className="rounded-full">
                  <Bookmark className="h-4 w-4 mr-1.5" />
                  0
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {article.tags.map((articleTag) => (
                  <Badge key={articleTag.tag.id} variant="secondary" className="px-3 py-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground text-sm">
                    {articleTag.tag.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="border-t pt-8">
            <MarkdownPreview content={article.content} />
          </div>
        </div>
      </article>
    </div>
  )
}
