"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { mockUsers, mockArticles, mockComments, mockBookmarks } from "@/lib/data/mock-admin-data"
import type { Article, Comment } from "@/lib/types/admin"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, UserIcon, Trash2, Mail } from "lucide-react"
import { formatDate } from "@/lib/utils/format"
import { ArticleListItem } from "@/components/admin/article-list-item"
import { CommentListItem } from "@/components/admin/comment-list-item"
import { BookmarkListItem } from "@/components/admin/bookmark-list-item"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"

export function UserDetailClient({ userId }: { userId: string }) {
  const router = useRouter()
  const { toast } = useToast()

  const user = mockUsers.find((u) => u.id === userId)
  const [userArticles, setUserArticles] = useState<Article[]>(mockArticles.filter((a) => a.authorId === userId))
  const [userComments, setUserComments] = useState<Comment[]>(mockComments.filter((c) => c.authorId === userId))
  const userBookmarks = mockBookmarks.filter((b) => b.userId === userId)

  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false)
  const [showResetPasswordDialog, setShowResetPasswordDialog] = useState(false)
  const [isResetting, setIsResetting] = useState(false)

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">ユーザーが見つかりません</h2>
          <Button onClick={() => router.push("/admin/users")}>ユーザー一覧に戻る</Button>
        </div>
      </div>
    )
  }

  const handleToggleArticlePublish = (articleId: string) => {
    setUserArticles(
      userArticles.map((article) =>
        article.id === articleId ? { ...article, isPublished: !article.isPublished } : article,
      ),
    )
  }

  const handleDeleteArticle = (articleId: string) => {
    setUserArticles(userArticles.filter((article) => article.id !== articleId))
  }

  const handleToggleCommentPublish = (commentId: string) => {
    setUserComments(
      userComments.map((comment) =>
        comment.id === commentId ? { ...comment, isPublished: !comment.isPublished } : comment,
      ),
    )
  }

  const handleDeleteComment = (commentId: string) => {
    setUserComments(userComments.filter((comment) => comment.id !== commentId))
  }

  const handleBulkDeleteUnpublished = () => {
    setUserArticles(userArticles.filter((article) => article.isPublished))
    setShowBulkDeleteDialog(false)
  }

  const handleResetPassword = async () => {
    setIsResetting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: "パスワードリセットメール送信完了",
      description: `${user.email} にワンタイムパスワードを送信しました。`,
    })

    setIsResetting(false)
    setShowResetPasswordDialog(false)
  }

  const unpublishedArticlesCount = userArticles.filter((a) => !a.isPublished).length

  return (
    <>
      <div className="min-h-screen bg-background">
        <div className="border-b">
          <div className="container mx-auto px-4 py-6">
            <Button variant="ghost" size="sm" onClick={() => router.push("/admin/users")} className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              ユーザー一覧に戻る
            </Button>

            <div className="flex items-start gap-6">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <UserIcon className="h-10 w-10 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{user.email}</h1>
                  <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                    {user.role === "admin" ? "管理者" : "一般ユーザー"}
                  </Badge>
                </div>
                <p className="text-muted-foreground">登録日: {formatDate(user.createdAt)}</p>
              </div>
              <div>
                <Button variant="outline" onClick={() => setShowResetPasswordDialog(true)}>
                  <Mail className="h-4 w-4 mr-2" />
                  パスワードリセット
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-3xl font-bold">{userArticles.length}</p>
                <p className="text-sm text-muted-foreground">記事</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-3xl font-bold">{userComments.length}</p>
                <p className="text-sm text-muted-foreground">コメント</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-3xl font-bold">{userBookmarks.length}</p>
                <p className="text-sm text-muted-foreground">ブックマーク</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <Tabs defaultValue="articles" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="articles">記事 ({userArticles.length})</TabsTrigger>
              <TabsTrigger value="comments">コメント ({userComments.length})</TabsTrigger>
              <TabsTrigger value="bookmarks">ブックマーク ({userBookmarks.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="articles" className="space-y-6 mt-6">
              {unpublishedArticlesCount > 0 && (
                <div className="flex justify-end">
                  <Button variant="destructive" onClick={() => setShowBulkDeleteDialog(true)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    非公開記事を一括削除 ({unpublishedArticlesCount}件)
                  </Button>
                </div>
              )}

              {userArticles.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">記事がありません</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {userArticles.map((article) => (
                    <ArticleListItem
                      key={article.id}
                      article={article}
                      onTogglePublish={handleToggleArticlePublish}
                      onDelete={handleDeleteArticle}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="comments" className="space-y-4 mt-6">
              {userComments.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">コメントがありません</p>
                </div>
              ) : (
                userComments.map((comment) => (
                  <CommentListItem
                    key={comment.id}
                    comment={comment}
                    onTogglePublish={handleToggleCommentPublish}
                    onDelete={handleDeleteComment}
                  />
                ))
              )}
            </TabsContent>

            <TabsContent value="bookmarks" className="space-y-4 mt-6">
              {userBookmarks.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">ブックマークがありません</p>
                </div>
              ) : (
                userBookmarks.map((bookmark) => <BookmarkListItem key={bookmark.id} bookmark={bookmark} />)
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <AlertDialog open={showBulkDeleteDialog} onOpenChange={setShowBulkDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>非公開記事を一括削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              {unpublishedArticlesCount}件の非公開記事を削除します。この操作は取り消せません。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDeleteUnpublished}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              一括削除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showResetPasswordDialog} onOpenChange={setShowResetPasswordDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>パスワードリセットメールを送信しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              {user.email}{" "}
              にワンタイムパスワードを送信します。ユーザーはこのパスワードでログインし、新しいパスワードを設定できます。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isResetting}>キャンセル</AlertDialogCancel>
            <AlertDialogAction onClick={handleResetPassword} disabled={isResetting}>
              {isResetting ? "送信中..." : "送信"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
