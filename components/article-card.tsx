import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, Bookmark, Eye, Crown } from "lucide-react"
import type { Article } from "@/lib/mock-data"

interface ArticleCardProps {
  article: Article
  rank?: number
}

export function ArticleCard({ article, rank }: ArticleCardProps) {
  const getCrownColor = () => {
    if (rank === 1) return "text-yellow-500"
    if (rank === 2) return "text-gray-400"
    if (rank === 3) return "text-amber-700"
    return null
  }

  const crownColor = getCrownColor()

  return (
    <div className="card-material p-0 overflow-hidden">
      <div className="p-6 space-y-4">
        {/* Author Row */}
        <div className="flex items-center gap-3">
          {crownColor && (
            <div className="flex-shrink-0">
              <Crown className={`h-7 w-7 ${crownColor} fill-current drop-shadow-sm`} />
            </div>
          )}
          <Avatar className="h-10 w-10 ring-2 ring-background shadow-sm">
            <AvatarImage src={article.author.avatar || "/placeholder.svg"} alt={article.author.name} />
            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 text-primary font-semibold">
              {article.author.name[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{article.author.name}</p>
            <p className="text-xs text-muted-foreground">{article.createdAt}</p>
          </div>
        </div>

        {/* Title */}
        <Link href={`/articles/${article.id}`} className="block group">
          <h3 className="text-lg font-bold group-hover:text-[#E2703A] transition-colors line-clamp-2 leading-snug">
            {article.title}
          </h3>
        </Link>

        {/* Excerpt */}
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{article.excerpt}</p>

        {/* Footer: Tags + Stats */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex flex-wrap gap-1.5">
            {article.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="chip text-xs !px-2.5 !py-0.5 bg-primary/8 text-primary/80 hover:bg-primary/15 cursor-pointer"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3.5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1 hover:text-red-400 transition-colors cursor-pointer">
              <Heart className="h-3.5 w-3.5" />
              {article.likes}
            </span>
            <span className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer">
              <Bookmark className="h-3.5 w-3.5" />
              {article.bookmarks}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {article.views}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
