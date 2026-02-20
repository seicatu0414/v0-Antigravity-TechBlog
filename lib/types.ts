export type UIArticle = {
    id: string
    title: string
    content: string
    excerpt: string
    coverImageUrl?: string | null
    author: {
        name: string
        avatar: string
    }
    tags: string[]
    likes: number
    bookmarks: number
    isBookmarked?: boolean
    views: number
    createdAt: string
    updatedAt: string
}
