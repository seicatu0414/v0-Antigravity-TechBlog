import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, Bookmark, Eye, Crown } from "lucide-react"
import type { Article } from "@/lib/mock-data"

interface ArticleCardProps {
  article: Article
  rank?: number
}

export function ArticleCard({ article, rank }: ArticleCardProps) {
  const getCrownColor = () => {
    if (rank === 1) return "text-yellow-500" // Gold
    if (rank === 2) return "text-gray-400" // Silver
    if (rank === 3) return "text-amber-700" // Bronze
    return null
  }

  const crownColor = getCrownColor()

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="space-y-3">
        <div className="flex items-center gap-3">
          {crownColor && (
            <div className="flex-shrink-0">
              <Crown className={`h-8 w-8 ${crownColor} fill-current`} />
            </div>
          )}
          <Avatar className="h-10 w-10">
            <AvatarImage src={article.author.avatar || "/placeholder.svg"} alt={article.author.name} />
            <AvatarFallback>{article.author.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{article.author.name}</p>
            <p className="text-xs text-muted-foreground">{article.createdAt}</p>
          </div>
        </div>

        <Link href={`/articles/${article.id}`} className="block group">
          <h3 className="text-xl font-bold group-hover:text-[#E2703A] transition-colors line-clamp-2">
            {article.title}
          </h3>
        </Link>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{article.excerpt}</p>
      </CardContent>

      <CardFooter className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {article.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs hover:bg-[#EEB76B]/20 cursor-pointer">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Heart className="h-4 w-4" />
            {article.likes}
          </span>
          <span className="flex items-center gap-1">
            <Bookmark className="h-4 w-4" />
            {article.bookmarks}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {article.views}
          </span>
        </div>
      </CardFooter>
    </Card>
  )
}
