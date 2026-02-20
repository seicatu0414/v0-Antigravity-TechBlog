"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArticleCard } from "@/components/article-card"
import type { UIArticle } from "@/lib/types"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface MypageTabsProps {
    userArticles: UIArticle[]
    bookmarkedArticles: UIArticle[]
}

export function MypageTabs({ userArticles, bookmarkedArticles }: MypageTabsProps) {
    return (
        <Tabs defaultValue="posts" className="w-full">
            <TabsList className="grid w-full md:w-[400px] grid-cols-2 mb-6">
                <TabsTrigger value="posts">投稿した記事 ({userArticles.length})</TabsTrigger>
                <TabsTrigger value="bookmarks">ブックマーク ({bookmarkedArticles.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold border-l-4 border-[#E2703A] pl-3">投稿した記事</h2>
                </div>
                {userArticles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {userArticles.map((article) => (
                            <ArticleCard key={article.id} article={article} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-muted/30 rounded-lg p-12 text-center border-dashed border-2">
                        <p className="text-muted-foreground">まだ投稿した記事はありません。</p>
                        <Button variant="outline" className="mt-4" asChild>
                            <Link href="/post">最初の記事を書く</Link>
                        </Button>
                    </div>
                )}
            </TabsContent>

            <TabsContent value="bookmarks" className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold border-l-4 border-primary pl-3">ブックマークした記事</h2>
                </div>
                {bookmarkedArticles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {bookmarkedArticles.map((article) => (
                            <ArticleCard key={article.id} article={article} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-muted/30 rounded-lg p-12 text-center border-dashed border-2">
                        <p className="text-muted-foreground">まだブックマークした記事はありません。</p>
                        <Button variant="outline" className="mt-4" asChild>
                            <Link href="/">記事を探す</Link>
                        </Button>
                    </div>
                )}
            </TabsContent>
        </Tabs>
    )
}
