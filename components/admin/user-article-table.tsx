'use client'

import { useState, useTransition } from 'react'
import { deleteAdminArticle } from '@/lib/actions/admin-article'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MoreVertical, Trash2, Calendar, Eye, Heart, MessageSquare, Bookmark } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'

type ArticleData = {
    id: string
    title: string
    status: string
    createdAt: Date
    views: number
    likes: number
    _count: {
        comments: number
        bookmarks: number
    }
}

export function UserArticleTable({ initialArticles, userId }: { initialArticles: ArticleData[], userId: string }) {
    const [articles, setArticles] = useState<ArticleData[]>(initialArticles)
    const [isPending, startTransition] = useTransition()

    const handleDelete = (articleId: string) => {
        if (!confirm('本当にこの記事を削除しますか？\n(注: 元に戻すことはできません)')) return

        startTransition(async () => {
            try {
                await deleteAdminArticle(articleId, userId)
                setArticles(articles.filter(a => a.id !== articleId))
            } catch (error: any) {
                alert(error.message)
            }
        })
    }

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    }

    if (articles.length === 0) {
        return (
            <div className="text-center py-16 border rounded-md border-dashed bg-muted/10 text-muted-foreground">
                <p>この記事はありません。</p>
            </div>
        )
    }

    return (
        <Card className="rounded-md border shadow-none">
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/10 pb-2 text-muted-foreground font-semibold uppercase text-xs border-b">
                            <tr>
                                <th className="px-6 py-4">タイトル</th>
                                <th className="px-6 py-4">ステータス</th>
                                <th className="px-6 py-4">エンゲージメント</th>
                                <th className="px-6 py-4">作成日時</th>
                                <th className="px-6 py-4 text-right">アクション</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {articles.map(article => (
                                <tr key={article.id} className={`hover:bg-muted/50 transition-colors ${isPending ? 'opacity-50' : ''}`}>
                                    <td className="px-6 py-4 font-medium text-foreground max-w-[300px] truncate">
                                        <a href={`/articles/${article.id}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                            {article.title}
                                        </a>
                                    </td>
                                    <td className="px-6 py-4">
                                        {article.status === 'published' ? (
                                            <Badge variant="outline" className="bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800 border-green-200">公開中</Badge>
                                        ) : (
                                            <Badge variant="outline" className="bg-muted text-muted-foreground font-normal">下書き</Badge>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-4 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {article.views}</span>
                                            <span className="flex items-center gap-1"><Heart className="h-3 w-3" /> {article.likes}</span>
                                            <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" /> {article._count.comments}</span>
                                            <span className="flex items-center gap-1"><Bookmark className="h-3 w-3" /> {article._count.bookmarks}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 opacity-50" />
                                            {formatDate(article.createdAt)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0 rounded-md" disabled={isPending}>
                                                    <span className="sr-only">メニューを開く</span>
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>アクション</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() => handleDelete(article.id)}
                                                    className="text-red-600 focus:bg-red-50 focus:text-red-600"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" /> 記事を削除
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    )
}
