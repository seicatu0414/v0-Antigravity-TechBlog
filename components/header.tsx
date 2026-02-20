"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search, PenSquare, User, BookMarked } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white elevation-2">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#E2703A] to-[#EEB76B] shadow-md group-hover:shadow-lg transition-shadow">
              <span className="text-lg font-bold text-white">T</span>
            </div>
            <span className="text-xl font-bold text-foreground tracking-tight">TechBlog</span>
          </Link>

          <div className="hidden md:flex relative w-80">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="記事を検索..."
              className="w-full h-10 pl-10 pr-4 rounded-full bg-muted/60 border-0 text-sm placeholder:text-muted-foreground focus:bg-muted focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>

        <nav className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild className="rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/80">
            <Link href="/">
              <BookMarked className="h-4 w-4 mr-2" />
              記事一覧
            </Link>
          </Button>

          <Button size="sm" className="rounded-full bg-gradient-to-r from-[#E2703A] to-[#d4612e] hover:from-[#d4612e] hover:to-[#c55525] text-white shadow-md hover:shadow-lg transition-all" asChild>
            <Link href="/post">
              <PenSquare className="h-4 w-4 mr-2" />
              投稿する
            </Link>
          </Button>

          <Link href="/mypage" className="flex items-center justify-center h-9 w-9 rounded-full bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-all">
            <User className="h-5 w-5" />
          </Link>
        </nav>
      </div>
    </header>
  )
}
