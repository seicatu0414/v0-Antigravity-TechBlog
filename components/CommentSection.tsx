'use client'

import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { MessageCircle, Trash2, Loader2, Send } from 'lucide-react'
import { createComment, deleteComment } from '@/lib/actions/comment'
import type { CommentWithAuthor } from '@/lib/actions/comment'
import Link from 'next/link'

type CommentSectionProps = {
    articleId: string
    initialComments: CommentWithAuthor[]
    currentUserId?: string | null
    isAdmin?: boolean
}

export function CommentSection({ articleId, initialComments, currentUserId, isAdmin }: CommentSectionProps) {
    const router = useRouter()
    const [comments, setComments] = useState<CommentWithAuthor[]>(initialComments)
    const [content, setContent] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (!content.trim()) {
            setError('コメント内容を入力してください')
            return
        }

        startTransition(async () => {
            const result = await createComment(articleId, content)
            if (result.error) {
                setError(result.error)
            } else {
                setContent('')
                router.refresh()
            }
        })
    }

    const handleDelete = (commentId: string) => {
        startTransition(async () => {
            const result = await deleteComment(commentId)
            if (result.error) {
                setError(result.error)
            } else {
                setComments((prev) => prev.filter((c) => c.id !== commentId))
            }
        })
    }

    const formatDate = (iso: string) => {
        const d = new Date(iso)
        return d.toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-2.5">
                <MessageCircle className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-bold">コメント ({comments.length})</h2>
            </div>

            {/* Comment Form */}
            {currentUserId ? (
                <form onSubmit={handleSubmit} className="space-y-3">
                    <Textarea
                        placeholder="コメントを入力..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="min-h-[100px] rounded-xl bg-muted/30 border-0 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                        maxLength={2000}
                    />
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                            {content.length} / 2000
                        </span>
                        <Button
                            type="submit"
                            disabled={isPending || !content.trim()}
                            className="rounded-full bg-gradient-to-r from-[#E2703A] to-[#d4612e] hover:from-[#d4612e] hover:to-[#c55525] text-white shadow-md hover:shadow-lg transition-all"
                            size="sm"
                        >
                            {isPending ? (
                                <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                            ) : (
                                <Send className="h-4 w-4 mr-1.5" />
                            )}
                            投稿する
                        </Button>
                    </div>
                    {error && (
                        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100">
                            {error}
                        </div>
                    )}
                </form>
            ) : (
                <div className="card-elevated rounded-xl p-6 text-center space-y-3">
                    <p className="text-muted-foreground text-sm">コメントを投稿するにはログインが必要です</p>
                    <Button asChild variant="outline" className="rounded-full" size="sm">
                        <Link href="/login">ログインする</Link>
                    </Button>
                </div>
            )}

            {/* Comment List */}
            {comments.length > 0 ? (
                <div className="space-y-4">
                    {comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3 group">
                            <Link href={`/profile/${comment.author.id}`} className="flex-shrink-0">
                                <Avatar className="h-9 w-9 ring-2 ring-background shadow-sm">
                                    <AvatarImage src={comment.author.avatar || '/diverse-avatars.png'} alt={comment.author.name} />
                                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 text-primary text-xs font-semibold">
                                        {comment.author.name[0]}
                                    </AvatarFallback>
                                </Avatar>
                            </Link>
                            <div className="flex-1 min-w-0">
                                <div className="bg-muted/40 rounded-2xl px-4 py-3 space-y-1">
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <Link href={`/profile/${comment.author.id}`} className="text-sm font-semibold hover:text-primary transition-colors">
                                                {comment.author.name}
                                            </Link>
                                            <span className="text-xs text-muted-foreground">
                                                {formatDate(comment.createdAt)}
                                            </span>
                                        </div>
                                        {(currentUserId === comment.author.id || isAdmin) && (
                                            <button
                                                onClick={() => handleDelete(comment.id)}
                                                disabled={isPending}
                                                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all p-1 rounded-lg hover:bg-destructive/10"
                                                title="削除"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap break-words">
                                        {comment.content}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8">
                    <p className="text-muted-foreground text-sm">まだコメントはありません。最初のコメントを投稿しましょう！</p>
                </div>
            )}
        </div>
    )
}
