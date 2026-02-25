import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Users, Search, X, Tag, FileText } from "lucide-react"

type UserProfile = {
    id: string
    name: string
    avatar: string
    bio: string
    articlesCount: number
}

interface SidebarProps {
    userSearch: string
    handleUserSearch: (e: React.ChangeEvent<HTMLInputElement>) => void
    setUserSearch: (search: string) => void
    setUsers: (users: UserProfile[]) => void
    isUsersPending: boolean
    users: UserProfile[]
    popularTags: string[]
    selectedTag: string | null
    handleTagSelect: (tag: string | null) => void
}

export function Sidebar({
    userSearch,
    handleUserSearch,
    setUserSearch,
    setUsers,
    isUsersPending,
    users,
    popularTags,
    selectedTag,
    handleTagSelect,
}: SidebarProps) {
    return (
        <aside className="space-y-6">
            <div className="sticky top-20 space-y-6">
                {/* User Search widget */}
                <div className="rounded-sm border border-border bg-card p-5 shadow-none">
                    <h2 className="mb-4 flex items-center gap-1.5 border-b border-border pb-3 text-[13px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                        <Users className="h-4 w-4" />
                        {'ユーザー検索'}
                    </h2>

                    {/* Search input */}
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={userSearch}
                            onChange={handleUserSearch}
                            placeholder="ユーザー名で検索..."
                            className="h-9 rounded-sm border border-border bg-muted pl-8 pr-8 text-xs placeholder:text-muted-foreground shadow-none focus-visible:border-primary focus-visible:ring-primary/20"
                        />
                        {userSearch && (
                            <button
                                onClick={() => {
                                    setUserSearch("")
                                    setUsers([])
                                }}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        )}
                    </div>

                    {/* User list */}
                    <div className="flex flex-col gap-2">
                        {isUsersPending ? (
                            <p className="py-4 text-center text-[10px] font-mono uppercase tracking-wider text-muted-foreground animate-pulse">
                                SEARCHING...
                            </p>
                        ) : users.length > 0 ? (
                            users.map((user) => (
                                <a
                                    key={user.id}
                                    href={`/profile/${user.id}`}
                                    className="group flex items-center gap-3 rounded-sm border border-transparent p-2 transition-all hover:bg-muted/50"
                                >
                                    <Avatar className="h-9 w-9 flex-shrink-0 border border-border rounded-sm shadow-none">
                                        <AvatarImage src={user.avatar} alt={user.name} className="object-cover" />
                                        <AvatarFallback className="bg-muted text-[10px] font-mono uppercase font-bold text-muted-foreground rounded-sm">
                                            {user.name?.[0] || '?'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[13px] font-bold text-foreground truncate group-hover:text-primary transition-colors">
                                            {user.name}
                                        </p>
                                        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider truncate leading-relaxed">
                                            {user.bio || "No bio"}
                                        </p>
                                        <div className="flex items-center gap-1 mt-0.5">
                                            <FileText className="h-2.5 w-2.5 text-muted-foreground" />
                                            <span className="text-[10px] font-mono text-muted-foreground tabular-nums tracking-wider">
                                                {user.articlesCount} ARTICLE{user.articlesCount !== 1 ? 'S' : ''}
                                            </span>
                                        </div>
                                    </div>
                                </a>
                            ))
                        ) : userSearch ? (
                            <p className="py-4 text-center text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                                {'NO USERS FOUND'}
                            </p>
                        ) : (
                            <p className="py-2 text-center text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                                {'ENTER A USERNAME'}
                            </p>
                        )}
                    </div>
                </div>

                {/* Popular Tags widget */}
                <div className="rounded-sm border border-border bg-card p-5 shadow-none">
                    <h2 className="mb-4 flex items-center gap-1.5 border-b border-border pb-3 text-[13px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                        <Tag className="h-4 w-4" />
                        {'人気のタグ'}
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {popularTags.map((tag) => (
                            <Badge
                                key={tag}
                                variant="outline"
                                className={`cursor-pointer rounded-sm px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider transition-all border-border text-foreground hover:bg-muted bg-background shadow-none`}
                                onClick={() => handleTagSelect(tag === selectedTag ? null : tag)}
                            >
                                {tag}
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* About */}
                <div className="rounded-sm border border-border bg-card p-5 shadow-none">
                    <h2 className="mb-3 border-b border-border pb-3 text-[13px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                        {'TechBlogについて'}
                    </h2>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                        {'TechBlogは、エンジニアのための技術記事共有プラットフォームです。最新の技術情報やノウハウを共有し、学び合いましょう。'}
                    </p>
                </div>
            </div>
        </aside>
    )
}
