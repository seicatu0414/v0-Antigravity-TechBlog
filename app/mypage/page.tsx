"use client"
import { ArticleCard } from "@/components/article-card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Bookmark, Settings } from "lucide-react"
import { mockArticles } from "@/lib/mock-data"

export default function MyPage() {
  // Mock user data
  const user = {
    name: "山田太郎",
    username: "@yamada_taro",
    avatar: "/placeholder.svg?key=lb2bz",
    bio: "フロントエンドエンジニア。React、Next.js、TypeScriptが好きです。",
    articlesCount: 12,
    bookmarksCount: 45,
    followersCount: 234,
  }

  // Mock user's articles (first 2 from mock data)
  const myArticles = mockArticles.slice(0, 2)

  // Mock bookmarked articles (last 2 from mock data)
  const bookmarkedArticles = mockArticles.slice(2, 4)

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-20 space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback className="text-2xl">{user.name[0]}</AvatarFallback>
                  </Avatar>

                  <div className="space-y-1">
                    <h2 className="text-xl font-bold">{user.name}</h2>
                    <p className="text-sm text-muted-foreground">{user.username}</p>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed">{user.bio}</p>

                  <div className="flex items-center justify-around w-full pt-4 border-t">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-[#E2703A]">{user.articlesCount}</p>
                      <p className="text-xs text-muted-foreground">記事</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-[#EEB76B]">{user.bookmarksCount}</p>
                      <p className="text-xs text-muted-foreground">ブックマーク</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-[#9C3D54]">{user.followersCount}</p>
                      <p className="text-xs text-muted-foreground">フォロワー</p>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full bg-transparent">
                    <Settings className="h-4 w-4 mr-2" />
                    プロフィール編集
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </aside>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="articles" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="articles" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                投稿した記事
              </TabsTrigger>
              <TabsTrigger value="bookmarks" className="flex items-center gap-2">
                <Bookmark className="h-4 w-4" />
                ブックマーク
              </TabsTrigger>
            </TabsList>

            <TabsContent value="articles" className="space-y-4">
              {myArticles.length > 0 ? (
                myArticles.map((article) => <ArticleCard key={article.id} article={article} />)
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">まだ記事を投稿していません</p>
                    <Button className="bg-[#E2703A] hover:bg-[#E2703A]/90 text-white">最初の記事を書く</Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="bookmarks" className="space-y-4">
              {bookmarkedArticles.length > 0 ? (
                bookmarkedArticles.map((article) => <ArticleCard key={article.id} article={article} />)
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Bookmark className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">ブックマークした記事はありません</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
