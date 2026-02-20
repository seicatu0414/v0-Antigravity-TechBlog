'use client'

import { useState, useTransition } from 'react'
import { toggleBookmark } from '@/app/actions'
import { useRouter } from 'next/navigation'

interface BookmarkButtonProps {
    articleId: string
    initialIsBookmarked?: boolean
    initialCount?: number
}

export function BookmarkButton({ articleId, initialIsBookmarked = false, initialCount = 0 }: BookmarkButtonProps) {
    const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked)
    const [count, setCount] = useState(initialCount)
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const handleToggle = async () => {
        // Optimistic update
        const previousState = isBookmarked
        const previousCount = count

        setIsBookmarked(!previousState)
        setCount(previousState ? previousCount - 1 : previousCount + 1)

        startTransition(async () => {
            try {
                const result = await toggleBookmark(articleId)
                if (result.error) {
                    throw new Error(result.error)
                }
            } catch (error: unknown) {
                // Revert on error
                setIsBookmarked(previousState)
                setCount(previousCount)

                // If unauthorized (checked by error message or logic), redirect to login
                // For now, assuming standard error strings
                if (error instanceof Error && (error.message === 'Unauthorized' || error.message === 'Invalid token')) {
                    router.push('/login')
                } else {
                    alert('ブックマークの更新に失敗しました。')
                }
            }
        })
    }

    return (
        <button
            onClick={handleToggle}
            disabled={isPending}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${isBookmarked
                ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            aria-label={isBookmarked ? "ブックマークを解除" : "ブックマークに追加"}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill={isBookmarked ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
            </svg>
            <span className="font-medium">{count}</span>
        </button>
    )
}
