export type UserRole = "admin" | "general"

export type User = {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  nickname: string
  bio: string
  githubUrl: string
  avatarUrl: string
  createdAt: Date
  updatedAt: Date
}

export type Article = {
  id: string
  title: string
  content: string
  authorId: string
  status: "published" | "draft"
  publishedAt: Date | null
  updatedAt: Date
}

export type Comment = {
  id: string
  content: string
  articleId: string
  authorId: string
  status: "published" | "draft"
  createdAt: Date
}

export type Tag = {
  id: string
  name: string
  color: string
  status: "published" | "draft"
  createdAt: Date
  updatedAt: Date
}

export type Bookmark = {
  userId: string
  articleId: string
  createdAt: Date
}

export type ActivityType =
  | "promote_user"
  | "demote_user"
  | "delete_user"
  | "delete_article"
  | "delete_comment"
  | "delete_tag"
  | "reset_password"
  | "create_user"
  | "update_article"
  | "update_comment"
  | "update_tag"
  | "bulk_delete_articles"

export type Activity = {
  id: string
  adminId: string
  actionType: ActivityType
  targetType: "user" | "article" | "comment" | "tag"
  targetId: string
  targetName: string
  description: string
  timestamp: Date
}

export type UserWithStats = User & {
  articlesCount: number
  commentsCount: number
  bookmarksCount: number
}

export type ArticleWithDetails = Article & {
  authorEmail: string
  authorName: string
  tags: string[]
}

export type CommentWithDetails = Comment & {
  articleTitle: string
  authorEmail: string
  authorName: string
}

export type BookmarkWithDetails = Bookmark & {
  articleTitle: string
}
