"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, PenSquare, User, BookMarked } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E2703A]">
              <span className="text-lg font-bold text-white">T</span>
            </div>
            <span className="text-xl font-bold text-foreground">TechBlog</span>
          </Link>

          <div className="hidden md:flex relative w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="記事を検索..." className="pl-10" />
          </div>
        </div>

        <nav className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <BookMarked className="h-4 w-4 mr-2" />
              記事一覧
            </Link>
          </Button>

          <Button size="sm" className="bg-[#E2703A] hover:bg-[#E2703A]/90 text-white" asChild>
            <Link href="/post">
              <PenSquare className="h-4 w-4 mr-2" />
              投稿する
            </Link>
          </Button>

          <Button variant="ghost" size="icon" asChild>
            <Link href="/mypage">
              <User className="h-5 w-5" />
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}
