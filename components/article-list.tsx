"use client"

import { useState, useTransition, useEffect } from "react"

import { ArticleCard, RankingArticleCard } from "@/components/article-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, X, TrendingUp, Newspaper } from "lucide-react"
import { getArticles, getUsers } from "@/app/actions"
import { UIArticle } from "@/lib/types"

import { HeroBanner } from "./article-list/hero-banner"
import { SearchFilterBar } from "./article-list/search-filter-bar"
import { TagSearchModal } from "./article-list/tag-search-modal"
import { Sidebar } from "./article-list/sidebar"

type UserProfile = {
    id: string
    name: string
    avatar: string
    bio: string
    articlesCount: number
}

export function ArticleList({ initialArticles, popularTags }: { initialArticles: UIArticle[], popularTags: string[] }) {
    const [activeTab, setActiveTab] = useState<"latest" | "ranking">("latest")
    const [selectedTag, setSelectedTag] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [articles, setArticles] = useState<UIArticle[]>(initialArticles)
    const [hasMore, setHasMore] = useState(true)
    const [isPending, startTransition] = useTransition()

    // Tag Modal States
    const [isTagModalOpen, setIsTagModalOpen] = useState(false)
    const [tagSearch, setTagSearch] = useState("")

    // User Search States
    const [userSearch, setUserSearch] = useState("")
    const [debouncedUserSearch, setDebouncedUserSearch] = useState("")
    const [users, setUsers] = useState<UserProfile[]>([])
    const [isUsersPending, startUsersTransition] = useTransition()

    // Debounce logic
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedUserSearch(userSearch)
        }, 300)

        return () => clearTimeout(timer)
    }, [userSearch])

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
        })
    }

    const handleTabChange = (tab: "latest" | "ranking") => {
        setActiveTab(tab)
        fetchArticles({ tag: selectedTag, search: searchQuery, sort: tab })
    }

    const handleTagSelect = (tag: string | null) => {
        const newTag = selectedTag === tag ? null : tag
        setSelectedTag(newTag)
        setIsTagModalOpen(false)
        setTagSearch("")
        fetchArticles({ tag: newTag, search: searchQuery })
    }

    const handleSearch = () => {
        fetchArticles({ tag: selectedTag, search: searchQuery })
    }

    const handleSearchKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch()
        }
    }

    const handleUserSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserSearch(e.target.value)
    }

    // Effect to fetch users based on debounced search
    useEffect(() => {
        let active = true

        if (debouncedUserSearch.trim() === '') {
            setUsers([])
            return
        }

        startUsersTransition(async () => {
            const results = await getUsers(debouncedUserSearch)
            if (active) {
                setUsers(results)
            }
        })

        return () => {
            active = false
        }
    }, [debouncedUserSearch])

    const handleLoadMore = () => {
        fetchArticles({
            tag: selectedTag,
            search: searchQuery,
            skip: articles.length,
            append: true,
        })
    }

    const filteredTags = popularTags.filter((t) =>
        t.toLowerCase().includes(tagSearch.toLowerCase())
    )

    return (
        <div>
            <HeroBanner />

            <SearchFilterBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                handleSearchKeyDown={handleSearchKeyDown}
                fetchArticles={fetchArticles}
                selectedTag={selectedTag}
                setIsTagModalOpen={setIsTagModalOpen}
            />

            <TagSearchModal
                isTagModalOpen={isTagModalOpen}
                setIsTagModalOpen={setIsTagModalOpen}
                tagSearch={tagSearch}
                setTagSearch={setTagSearch}
                selectedTag={selectedTag}
                handleTagSelect={handleTagSelect}
                filteredTags={filteredTags}
                popularTagsLength={popularTags.length}
            />

            {/* Main Content */}
            <div className="mx-auto max-w-7xl px-4 py-6">
                {/* Active filter indicator */}
                {(selectedTag || searchQuery) && (
                    <div className="mb-6 flex items-center gap-3">
                        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">{'Active Filters:'}</span>
                        {selectedTag && (
                            <Badge
                                variant="secondary"
                                className="cursor-pointer rounded-sm border border-border bg-muted px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-foreground hover:bg-muted/80 shadow-none"
                                onClick={() => handleTagSelect(null)}
                            >
                                {selectedTag} <X className="ml-1.5 h-3.5 w-3.5" />
                            </Badge>
                        )}
                        {searchQuery && (
                            <Badge
                                variant="secondary"
                                className="cursor-pointer rounded-sm border border-border bg-muted px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-foreground hover:bg-muted/80 shadow-none"
                                onClick={() => {
                                    setSearchQuery("")
                                    fetchArticles({ tag: selectedTag, search: "" })
                                }}
                            >
                                QUERY: {`${searchQuery}`} <X className="ml-1.5 h-3.5 w-3.5" />
                            </Badge>
                        )}
                    </div>
                )}

                {/* Tab Navigation */}
                <div className="mb-8 flex items-center border-b-[2px] border-border">
                    <button
                        onClick={() => handleTabChange("latest")}
                        className={`relative flex items-center gap-2 px-5 py-3 text-[13px] font-mono font-bold uppercase tracking-wider transition-colors ${activeTab === "latest"
                            ? "text-primary"
                            : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        <Newspaper className="h-4 w-4" />
                        {'LATEST'}
                        {activeTab === "latest" && (
                            <span className="absolute bottom-[-2px] left-0 right-0 h-[2px] bg-primary" />
                        )}
                    </button>
                    <button
                        onClick={() => handleTabChange("ranking")}
                        className={`relative flex items-center gap-2 px-5 py-3 text-[13px] font-mono font-bold uppercase tracking-wider transition-colors ${activeTab === "ranking"
                            ? "text-primary"
                            : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        <TrendingUp className="h-4 w-4" />
                        {'RANKING'}
                        {activeTab === "ranking" && (
                            <span className="absolute bottom-[-2px] left-0 right-0 h-[2px] bg-primary" />
                        )}
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                    {/* Main content */}
                    <div className="lg:col-span-3 pb-16">
                        {activeTab === "latest" ? (
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                {articles.length > 0 ? (
                                    articles.map((article) => (
                                        <ArticleCard key={article.id} article={article} />
                                    ))
                                ) : (
                                    <div className="col-span-full rounded-sm border border-dashed border-border py-16 text-center">
                                        <p className="text-[12px] font-mono uppercase tracking-wider text-muted-foreground">{'No articles found'}</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {articles.length > 0 ? (
                                    articles.map((article, index) => (
                                        <RankingArticleCard
                                            key={article.id}
                                            article={article}
                                            rank={index + 1}
                                        />
                                    ))
                                ) : (
                                    <div className="rounded-sm border border-dashed border-border py-16 text-center">
                                        <p className="text-[12px] font-mono uppercase tracking-wider text-muted-foreground">{'No articles found'}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Load More Button */}
                        {hasMore && (
                            <div className="pt-12 flex justify-center">
                                <Button
                                    onClick={handleLoadMore}
                                    disabled={isPending}
                                    variant="outline"
                                    className="rounded-sm border border-border px-8 py-2 text-[12px] font-mono font-bold uppercase tracking-wider text-foreground shadow-none transition-colors hover:border-primary hover:text-primary hover:bg-transparent"
                                >
                                    {isPending ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            LOADING...
                                        </>
                                    ) : (
                                        "LOAD MORE"
                                    )}
                                </Button>
                            </div>
                        )}
                    </div>

                    <Sidebar
                        userSearch={userSearch}
                        handleUserSearch={handleUserSearch}
                        setUserSearch={setUserSearch}
                        setUsers={setUsers}
                        isUsersPending={isUsersPending}
                        users={users}
                        popularTags={popularTags}
                        selectedTag={selectedTag}
                        handleTagSelect={handleTagSelect}
                    />
                </div>
            </div>
        </div>
    )
}

