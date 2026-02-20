"use client"

import { useState, useTransition } from "react"
import { ArticleCard } from "@/components/article-card"
import { Search, Loader2 } from "lucide-react"
import { popularTags } from "@/lib/mock-data"
import { getArticles } from "@/app/actions"
import type { GetArticlesResult, UIArticle } from "@/app/actions"

export function ArticleList({ initialResult }: { initialResult: GetArticlesResult }) {
    const [articles, setArticles] = useState<UIArticle[]>(initialResult.articles)
    const [hasMore, setHasMore] = useState(initialResult.hasMore)
    const [totalCount, setTotalCount] = useState(initialResult.totalCount)
    const [activeTab, setActiveTab] = useState<"latest" | "ranking">("latest")
    const [selectedTag, setSelectedTag] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [isPending, startTransition] = useTransition()

    // Reload articles from server with current filters
    const fetchArticles = (options: {
        tag?: string | null
        search?: string | null
        sort?: "latest" | "ranking"
        append?: boolean
        skip?: number
    }) => {
        startTransition(async () => {
            const result = await getArticles({
                tag: options.tag,
                search: options.search || null,
                sort: options.sort ?? activeTab,
                skip: options.skip ?? 0,
            })

            if (options.append) {
                setArticles((prev) => [...prev, ...result.articles])
            } else {
                setArticles(result.articles)
            }
            setHasMore(result.hasMore)
            setTotalCount(result.totalCount)
        })
    }

    const handleTabChange = (tab: "latest" | "ranking") => {
        setActiveTab(tab)
        fetchArticles({ tag: selectedTag, search: searchQuery, sort: tab })
    }

    const handleTagSelect = (tag: string | null) => {
        setSelectedTag(tag)
        fetchArticles({ tag, search: searchQuery })
    }

    const handleSearch = () => {
        fetchArticles({ tag: selectedTag, search: searchQuery })
    }

    const handleSearchKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch()
        }
    }

    const handleLoadMore = () => {
        fetchArticles({
            tag: selectedTag,
            search: searchQuery,
            skip: articles.length,
            append: true,
        })
    }

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
                            onKeyDown={handleSearchKeyDown}
                        />
                    </div>

                    {/* Material Tabs */}
                    <div className="flex items-center justify-between">
                        <div className="flex gap-1 bg-muted/50 p-1 rounded-2xl w-fit">
                            <button
                                onClick={() => handleTabChange("latest")}
                                className={`px-5 py-2 text-sm font-semibold rounded-xl transition-all ${activeTab === "latest"
                                        ? "bg-white text-foreground shadow-sm"
                                        : "text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                🔥 新着
                            </button>
                            <button
                                onClick={() => handleTabChange("ranking")}
                                className={`px-5 py-2 text-sm font-semibold rounded-xl transition-all ${activeTab === "ranking"
                                        ? "bg-white text-foreground shadow-sm"
                                        : "text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                👑 ランキング
                            </button>
                        </div>
                        {totalCount > 0 && (
                            <span className="text-xs text-muted-foreground hidden sm:block">
                                {totalCount} 件の記事
                            </span>
                        )}
                    </div>

                    {/* Active Filters */}
                    {(selectedTag || searchQuery) && (
                        <div className="flex items-center gap-2 flex-wrap">
                            {selectedTag && (
                                <button
                                    className="chip bg-primary/10 text-primary text-sm hover:bg-primary/20"
                                    onClick={() => handleTagSelect(null)}
                                >
                                    {selectedTag} ✕
                                </button>
                            )}
                            {searchQuery && (
                                <button
                                    className="chip bg-muted text-foreground/70 text-sm hover:bg-muted/80"
                                    onClick={() => {
                                        setSearchQuery("")
                                        fetchArticles({ tag: selectedTag, search: null })
                                    }}
                                >
                                    「{searchQuery}」 ✕
                                </button>
                            )}
                        </div>
                    )}

                    {/* Loading indicator */}
                    {isPending && articles.length === 0 && (
                        <div className="flex justify-center py-12">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        </div>
                    )}

                    {/* Articles */}
                    <div className="space-y-5">
                        {articles.length > 0 ? (
                            <>
                                {articles.map((article, index) => (
                                    <div key={article.id} className="relative">
                                        {activeTab === "ranking" && (
                                            <div className={`absolute -left-10 top-6 text-xl font-black ${index === 0 ? "text-yellow-500" : index === 1 ? "text-gray-400" : index === 2 ? "text-amber-700" : "text-muted-foreground/30"
                                                }`}>
                                                {index + 1}
                                            </div>
                                        )}
                                        <ArticleCard article={article} rank={activeTab === "ranking" ? index + 1 : undefined} />
                                    </div>
                                ))}

                                {/* Load More Button */}
                                {hasMore && (
                                    <div className="flex justify-center pt-4">
                                        <button
                                            onClick={handleLoadMore}
                                            disabled={isPending}
                                            className="px-8 py-3 rounded-full bg-white text-foreground font-semibold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50 elevation-1 hover:elevation-2"
                                        >
                                            {isPending ? (
                                                <span className="flex items-center gap-2">
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                    読み込み中...
                                                </span>
                                            ) : (
                                                `さらに表示 (残り ${totalCount - articles.length} 件)`
                                            )}
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : !isPending ? (
                            <div className="card-elevated p-16 text-center">
                                <p className="text-muted-foreground text-lg">記事が見つかりませんでした</p>
                                <p className="text-muted-foreground/60 text-sm mt-2">別のキーワードやタグで検索してみてください</p>
                            </div>
                        ) : null}
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
                                        onClick={() => handleTagSelect(selectedTag === tag ? null : tag)}
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
