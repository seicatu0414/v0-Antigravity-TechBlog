"use client"

import { useState } from "react"
import { ArticleCard } from "@/components/article-card"
import { Search } from "lucide-react"
import { popularTags } from "@/lib/mock-data"

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

export function ArticleList({ initialArticles }: { initialArticles: Article[] }) {
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
                    {/* Mobile search */}
                    <div className="relative w-full md:hidden">
                        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                            placeholder="記事を検索..."
                            className="w-full h-10 pl-10 pr-4 rounded-full bg-muted/60 border-0 text-sm placeholder:text-muted-foreground focus:bg-muted focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Material Tabs */}
                    <div className="flex gap-1 bg-muted/50 p-1 rounded-2xl w-fit">
                        <button
                            onClick={() => setActiveTab("latest")}
                            className={`px-5 py-2 text-sm font-semibold rounded-xl transition-all ${activeTab === "latest"
                                    ? "bg-white text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            🔥 新着
                        </button>
                        <button
                            onClick={() => setActiveTab("ranking")}
                            className={`px-5 py-2 text-sm font-semibold rounded-xl transition-all ${activeTab === "ranking"
                                    ? "bg-white text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            👑 ランキング
                        </button>
                    </div>

                    {/* Active Tag Filter */}
                    {selectedTag && (
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">フィルター:</span>
                            <button
                                className="chip bg-primary/10 text-primary text-sm hover:bg-primary/20"
                                onClick={() => setSelectedTag(null)}
                            >
                                {selectedTag} ✕
                            </button>
                        </div>
                    )}

                    {/* Articles */}
                    <div className="space-y-5">
                        {filteredArticles.length > 0 ? (
                            filteredArticles.map((article, index) => (
                                <div key={article.id} className="relative">
                                    {activeTab === "ranking" && (
                                        <div className={`absolute -left-10 top-6 text-xl font-black ${index === 0 ? "text-yellow-500" : index === 1 ? "text-gray-400" : index === 2 ? "text-amber-700" : "text-muted-foreground/30"
                                            }`}>
                                            {index + 1}
                                        </div>
                                    )}
                                    <ArticleCard article={article} rank={activeTab === "ranking" ? index + 1 : undefined} />
                                </div>
                            ))
                        ) : (
                            <div className="card-elevated p-16 text-center">
                                <p className="text-muted-foreground text-lg">記事が見つかりませんでした</p>
                                <p className="text-muted-foreground/60 text-sm mt-2">別のキーワードやタグで検索してみてください</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <aside className="space-y-6">
                    <div className="sticky top-20 space-y-6">
                        <div className="card-elevated p-6">
                            <h2 className="text-base font-bold mb-4 flex items-center gap-2">
                                <span className="inline-block w-1 h-5 rounded-full bg-gradient-to-b from-[#E2703A] to-[#EEB76B]"></span>
                                人気のタグ
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {popularTags.map((tag) => (
                                    <button
                                        key={tag}
                                        className={`chip text-xs cursor-pointer transition-all ${selectedTag === tag
                                                ? "bg-[#E2703A] text-white shadow-md !hover:bg-[#d4612e]"
                                                : "bg-muted hover:bg-muted/80 text-foreground/70 hover:text-foreground"
                                            }`}
                                        onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="card-elevated p-6 surface-tint">
                            <h2 className="text-base font-bold mb-3 flex items-center gap-2">
                                <span className="inline-block w-1 h-5 rounded-full bg-gradient-to-b from-[#E2703A] to-[#EEB76B]"></span>
                                TechBlogについて
                            </h2>
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
