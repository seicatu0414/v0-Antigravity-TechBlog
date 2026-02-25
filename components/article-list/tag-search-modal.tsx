import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, X, Tag } from "lucide-react"

interface TagSearchModalProps {
    isTagModalOpen: boolean
    setIsTagModalOpen: (open: boolean) => void
    tagSearch: string
    setTagSearch: (search: string) => void
    selectedTag: string | null
    handleTagSelect: (tag: string | null) => void
    filteredTags: string[]
    popularTagsLength: number
}

export function TagSearchModal({
    isTagModalOpen,
    setIsTagModalOpen,
    tagSearch,
    setTagSearch,
    selectedTag,
    handleTagSelect,
    filteredTags,
    popularTagsLength,
}: TagSearchModalProps) {
    if (!isTagModalOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 sm:pt-32">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => {
                    setIsTagModalOpen(false)
                    setTagSearch("")
                }}
            />

            {/* Modal */}
            <div className="relative z-10 mx-4 w-full max-w-lg rounded-sm border border-border bg-card shadow-xl animate-in fade-in slide-in-from-top-4 duration-200">
                {/* Modal Header */}
                <div className="flex items-center justify-between border-b border-border px-5 py-4">
                    <h3 className="flex items-center gap-2 text-[13px] font-mono font-bold uppercase tracking-wider text-foreground">
                        <Tag className="h-4 w-4 text-primary" />
                        {'タグを検索'}
                    </h3>
                    <button
                        onClick={() => {
                            setIsTagModalOpen(false)
                            setTagSearch("")
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Tag Search Input */}
                <div className="border-b border-border px-5 py-3 bg-muted/30">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={tagSearch}
                            onChange={(e) => setTagSearch(e.target.value)}
                            placeholder="タグ名を入力して絞り込み..."
                            className="h-9 rounded-sm border border-border pl-9 text-sm shadow-none placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-primary/20 bg-background"
                            autoFocus
                        />
                    </div>
                </div>

                {/* Tag List */}
                <div className="max-h-72 overflow-y-auto px-5 py-4">
                    {selectedTag && (
                        <div className="mb-4 pb-4 border-b border-border">
                            <p className="mb-3 text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">{'Selected'}</p>
                            <Badge
                                className="cursor-pointer rounded-sm border border-primary bg-primary px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-primary-foreground hover:bg-primary/90 transition-colors"
                                onClick={() => handleTagSelect(selectedTag)}
                            >
                                {selectedTag}
                                <X className="ml-1.5 h-3.5 w-3.5" />
                            </Badge>
                        </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                        {filteredTags.length > 0 ? (
                            filteredTags.map((tag) => (
                                <Badge
                                    key={tag}
                                    variant="outline"
                                    className={`cursor-pointer rounded-sm px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider transition-all shadow-none ${selectedTag === tag
                                        ? "border-primary bg-primary/10 text-primary font-bold"
                                        : "border-border bg-background text-muted-foreground hover:border-primary hover:bg-primary/5 hover:text-primary"
                                        }`}
                                    onClick={() => handleTagSelect(tag)}
                                >
                                    {tag}
                                </Badge>
                            ))
                        ) : (
                            <p className="w-full py-6 text-center text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                                {`"${tagSearch}" に一致するタグはありません`}
                            </p>
                        )}
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-between border-t border-border bg-muted/30 px-5 py-3">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                        {`${popularTagsLength} tags total`}
                    </span>
                    {selectedTag && (
                        <button
                            onClick={() => handleTagSelect(null)}
                            className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary hover:underline"
                        >
                            {'フィルターをリセット'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
