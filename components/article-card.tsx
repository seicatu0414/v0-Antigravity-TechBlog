"use client"

import Link from "next/link"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Crown, Bookmark, Eye, Heart } from "lucide-react"
import type { UIArticle } from "@/lib/types"

interface ArticleCardProps {
  article: UIArticle
  rank?: number
}

function RankBadge({ rank }: { rank: number }) {
  if (rank > 3) return null

  const config = {
    1: {
      bg: "bg-zinc-100 dark:bg-zinc-800",
      border: "border-zinc-400 dark:border-zinc-500",
      text: "text-zinc-900 dark:text-zinc-100",
      iconColor: "text-amber-500",
    },
    2: {
      bg: "bg-zinc-50 dark:bg-zinc-900",
      border: "border-zinc-300 dark:border-zinc-700",
      text: "text-zinc-600 dark:text-zinc-400",
      iconColor: "text-zinc-400",
    },
    3: {
      bg: "bg-zinc-50 dark:bg-zinc-900",
      border: "border-zinc-300 dark:border-zinc-700",
      text: "text-zinc-600 dark:text-zinc-400",
      iconColor: "text-amber-700",
    },
  }[rank]!

  return (
    <div
      className={`absolute -top-2 -left-2 z-10 flex h-10 w-10 items-center justify-center rounded-sm border-[2px] ${config.bg} ${config.border}`}
    >
      <div className="flex flex-col items-center leading-none">
        <Crown className={`h-3 w-3 ${config.iconColor} fill-current`} />
        <span className={`text-[10px] font-mono font-bold mt-0.5 ${config.text}`}>{rank}</span>
      </div>
    </div>
  )
}

export function ArticleCard({ article, rank }: ArticleCardProps) {
  return (
    <Link href={`/articles/${article.id}`} className="group block h-full">
      <div className="relative flex h-full flex-col overflow-hidden rounded-sm border border-border bg-card transition-all hover:-translate-y-1 hover:border-zinc-400 dark:hover:border-zinc-500">
        {rank !== undefined && rank <= 3 && <RankBadge rank={rank} />}

        {/* Thumbnail */}
        <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-muted border-b border-border">
          <Image
            src={article.coverImageUrl || "/placeholder.svg"}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            unoptimized
          />
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-4">
          <h3 className="text-[13px] font-medium leading-snug text-foreground line-clamp-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
            {article.title}
          </h3>

          <div className="mt-auto flex items-center justify-between pt-4">
            <div className="flex items-center gap-1.5 min-w-0">
              <Avatar className="h-5 w-5 shrink-0 border border-border rounded-sm">
                <AvatarImage src={article.author.avatar || "/placeholder.svg"} alt={article.author.name} />
                <AvatarFallback className="text-[10px] font-mono uppercase bg-muted text-muted-foreground rounded-sm">
                  {article.author.name?.[0] || '?'}
                </AvatarFallback>
              </Avatar>
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground truncate max-w-[90px]">
                {article.author.name}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] font-mono text-muted-foreground tabular-nums tracking-wider">
                {article.createdAt.replace(/-/g, ".")}
              </span>
              <div className="flex items-center gap-2.5 text-[10px] font-mono text-muted-foreground">
                <span className="flex items-center gap-0.5">
                  <Heart className="h-3 w-3" />
                  <span className="tabular-nums">{article.likes}</span>
                </span>
                <span className="flex items-center gap-0.5">
                  <Bookmark className="h-3 w-3" />
                  <span className="tabular-nums">{article.bookmarks}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export function RankingArticleCard({ article, rank }: ArticleCardProps) {
  return (
    <Link href={`/articles/${article.id}`} className="group block">
      <div className="relative flex overflow-hidden rounded-sm border border-border bg-card transition-all hover:-translate-y-0.5 hover:border-zinc-400 dark:hover:border-zinc-500">
        {rank !== undefined && rank <= 3 && <RankBadge rank={rank} />}

        {/* Thumbnail (left) */}
        <div className="relative h-28 w-36 shrink-0 overflow-hidden bg-muted border-r border-border">
          <Image
            src={article.coverImageUrl || "/placeholder.svg"}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            unoptimized
          />
        </div>

        {/* Content (right) */}
        <div className="flex flex-1 flex-col justify-between p-4 min-w-0">
          <div>
            <h3 className="text-[13px] font-medium leading-snug text-foreground line-clamp-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
              {article.title}
            </h3>
            <div className="mt-2 flex flex-wrap gap-1">
              {article.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="rounded-sm bg-muted px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground border border-border"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <Avatar className="h-5 w-5 shrink-0 border border-border rounded-sm">
                <AvatarImage src={article.author.avatar || "/placeholder.svg"} alt={article.author.name} />
                <AvatarFallback className="text-[10px] font-mono uppercase bg-muted text-muted-foreground rounded-sm">
                  {article.author.name?.[0] || '?'}
                </AvatarFallback>
              </Avatar>
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground truncate max-w-[80px]">
                {article.author.name}
              </span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground">
                <Eye className="h-3.5 w-3.5" />
                <span className="tabular-nums">{article.views.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground">
                <Bookmark className="h-3.5 w-3.5" />
                <span className="tabular-nums">{article.bookmarks}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

