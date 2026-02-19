"use client"

import { useState } from "react"
import { ArticleCard } from "@/components/article-card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
// We use a type that matches the shape we expect. 
// Since we can't easily import from server action file if it has 'use server' and imports Node-only stuff in some configs, 
// we might define interface here or assume it passes.
// For now, let's define the prop type interface directly to avoid import issues.
interface Article {
    id: string
    title: string
    content: string
    excerpt: string
    author: {
        name: string
        avatar: string
    }
    tags: string[]
    likes: number
    bookmarks: number
    views: number
    createdAt: string
    updatedAt: string
}

export function ArticleList({ initialArticles, popularTags }: { initialArticles: Article[], popularTags: string[] }) {
    const [activeTab, setActiveTab] = useState<"latest" | "ranking">("latest")
    const [selectedTag, setSelectedTag] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState("")

    const sortedArticles = activeTab === "ranking" ? [...initialArticles].sort((a, b) => b.views - a.views) : initialArticles

    const filteredArticles = sortedArticles.filter((article) => {
        const matchesTag = !selectedTag || article.tags.includes(selectedTag)
        const matchesSearch =
            !searchQuery ||
            article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesTag && matchesSearch
    })

    return (
        <div className="container py-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold">記事一覧</h1>
                        <div className="relative w-64 md:hidden">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="記事を検索..."
                                className="pl-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex gap-2 border-b">
                        <button
                            onClick={() => setActiveTab("latest")}
                            className={`px-4 py-2 font-medium transition-colors relative ${activeTab === "latest" ? "text-[#E2703A]" : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            新着
                            {activeTab === "latest" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E2703A]" />}
                        </button>
                        <button
                            onClick={() => setActiveTab("ranking")}
                            className={`px-4 py-2 font-medium transition-colors relative ${activeTab === "ranking" ? "text-[#E2703A]" : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            ランキング
                            {activeTab === "ranking" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E2703A]" />}
                        </button>
                    </div>

                    {selectedTag && (
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">フィルター:</span>
                            <Badge
                                variant="secondary"
                                className="bg-[#EEB76B]/20 cursor-pointer"
                                onClick={() => setSelectedTag(null)}
                            >
                                {selectedTag} ×
                            </Badge>
                        </div>
                    )}

                    <div className="space-y-4">
                        {filteredArticles.length > 0 ? (
                            filteredArticles.map((article, index) => (
                                <div key={article.id} className="relative">
                                    {activeTab === "ranking" && (
                                        <div className="absolute -left-12 top-8 text-2xl font-bold text-[#EEB76B]">{index + 1}</div>
                                    )}
                                    <ArticleCard article={article} rank={activeTab === "ranking" ? index + 1 : undefined} />
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground">記事が見つかりませんでした</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <aside className="space-y-6">
                    <div className="sticky top-20 space-y-6">
                        <div className="rounded-lg border bg-card p-6">
                            <h2 className="text-lg font-semibold mb-4">人気のタグ</h2>
                            <div className="flex flex-wrap gap-2">
                                {popularTags.map((tag) => (
                                    <Badge
                                        key={tag}
                                        variant={selectedTag === tag ? "default" : "secondary"}
                                        className={`cursor-pointer transition-colors ${selectedTag === tag ? "bg-[#E2703A] hover:bg-[#E2703A]/90" : "hover:bg-[#EEB76B]/20"
                                            }`}
                                        onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                                    >
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-lg border bg-card p-6">
                            <h2 className="text-lg font-semibold mb-4">TechBlogについて</h2>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                TechBlogは、エンジニアのための技術記事共有プラットフォームです。
                                最新の技術情報やノウハウを共有し、学び合いましょう。
                            </p>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    )
}
