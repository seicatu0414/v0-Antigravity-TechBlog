import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X, Tag } from "lucide-react"

interface SearchFilterBarProps {
    searchQuery: string
    setSearchQuery: (query: string) => void
    handleSearchKeyDown: (e: React.KeyboardEvent) => void
    fetchArticles: (options: { tag?: string | null; search?: string | null }) => void
    selectedTag: string | null
    setIsTagModalOpen: (open: boolean) => void
}

export function SearchFilterBar({
    searchQuery,
    setSearchQuery,
    handleSearchKeyDown,
    fetchArticles,
    selectedTag,
    setIsTagModalOpen,
}: SearchFilterBarProps) {
    return (
        <div className="border-b border-border bg-card">
            <div className="mx-auto max-w-7xl px-4 py-5">
                <div className="mx-auto flex max-w-2xl items-center gap-3">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleSearchKeyDown}
                            placeholder="キーワードで記事を検索..."
                            className="h-10 rounded-sm border border-border bg-background pl-10 pr-10 text-sm shadow-none transition-colors placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-primary/20"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => {
                                    setSearchQuery("")
                                    fetchArticles({ tag: selectedTag, search: "" })
                                }}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    {/* Tag Search Button */}
                    <Button
                        variant="outline"
                        onClick={() => setIsTagModalOpen(true)}
                        className="relative h-10 gap-2 rounded-sm border border-border px-4 text-[13px] font-mono font-bold uppercase tracking-wider text-muted-foreground shadow-none transition-colors hover:border-primary hover:text-primary"
                    >
                        <Tag className="h-4 w-4" />
                        <span className="hidden sm:inline">{'TAG SEARCH'}</span>
                        {selectedTag && (
                            <span className="flex h-5 w-5 items-center justify-center rounded-sm bg-primary text-[10px] font-bold text-primary-foreground">
                                1
                            </span>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    )
}
