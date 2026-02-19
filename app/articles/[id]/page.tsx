import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, Bookmark, Share2 } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { getArticle } from "@/app/actions"
import { BookmarkButton } from "@/components/bookmark-button"

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const article = await getArticle(id)

  if (!article) {
    notFound()
  }

  return (
    <div className="container max-w-4xl py-8">
      <article className="space-y-6">
        <div className="rounded-lg border bg-card p-8 space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-balance">{article.title}</h1>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={article.author.avatar || "/placeholder.svg"} alt={article.author.name} />
                  <AvatarFallback>{article.author.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{article.author.name}</p>
                  <p className="text-xs text-muted-foreground">{article.createdAt}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Heart className="h-4 w-4 mr-1" />
                  {article.likes}
                </Button>
                <Button variant="outline" size="sm">
                  <Heart className="h-4 w-4 mr-1" />
                  {article.likes}
                </Button>
                <BookmarkButton
                  articleId={article.id}
                  initialIsBookmarked={article.isBookmarked}
                  initialCount={article.bookmarks}
                />
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="border-t pt-6">
            <div className="prose prose-slate max-w-none dark:prose-invert">
              <ReactMarkdown>{article.content}</ReactMarkdown>
            </div>
          </div>
        </div>
      </article>
    </div>
  )
}
