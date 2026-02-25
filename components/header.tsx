"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search, PenSquare, User, BookMarked } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { useRouter } from "next/navigation"
import { useState } from "react"

export function Header({ user }: { user: { id: string; name: string; avatar: string | null } | null }) {
  const router = useRouter()
  const [query, setQuery] = useState("")

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim()) {
      router.push(`/?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b border-border">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary text-primary-foreground shadow-none">
              <span className="text-lg font-mono font-bold">T</span>
            </div>
            <span className="text-xl font-mono font-bold text-foreground tracking-tight">TechBlog</span>
          </Link>

          <div className="hidden md:flex relative w-80">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="記事を検索..."
              className="w-full h-9 pl-10 pr-4 rounded-sm border border-input bg-zinc-100 dark:bg-zinc-900 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>
        </div>

        <nav className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild className="rounded-sm text-muted-foreground hover:text-foreground hover:bg-accent font-mono uppercase tracking-wider text-xs">
            <Link href="/">
              <BookMarked className="h-4 w-4 mr-2" />
              記事一覧
            </Link>
          </Button>

          {user ? (
            <>
              <Button size="sm" className="rounded-sm bg-primary text-primary-foreground hover:bg-primary/90 font-mono uppercase tracking-wider text-xs shadow-none border border-transparent" asChild>
                <Link href="/post">
                  <PenSquare className="h-4 w-4 mr-2" />
                  投稿する
                </Link>
              </Button>

              <Link href="/mypage" className="flex items-center justify-center h-9 w-9 rounded-sm border border-border bg-zinc-100 dark:bg-zinc-900 hover:bg-accent text-muted-foreground hover:text-foreground transition-all overflow-hidden relative">
                {user.avatar ? (
                  <Avatar className="h-full w-full rounded-none">
                    <AvatarImage src={user.avatar} alt={user.name} className="object-cover" />
                    <AvatarFallback className="rounded-none bg-muted text-xs font-mono font-bold uppercase">
                      {user.name?.[0] || '?'}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <User className="h-4 w-4" />
                )}
              </Link>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" className="rounded-sm text-muted-foreground hover:text-foreground font-mono uppercase tracking-wider text-xs" asChild>
                <Link href="/login">ログイン</Link>
              </Button>
              <Button size="sm" className="rounded-sm bg-primary text-primary-foreground hover:bg-primary/90 font-mono uppercase tracking-wider text-xs shadow-none" asChild>
                <Link href="/register">新規登録</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
