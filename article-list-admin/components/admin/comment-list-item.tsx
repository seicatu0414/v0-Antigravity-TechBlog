"use client"

import type { Comment } from "@/lib/types/admin"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils/format"
import { EyeOff, Eye, Trash2 } from "lucide-react"
import { useState } from "react"
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
import { DELETED_USER } from "@/lib/data/mock-admin-data"

interface CommentListItemProps {
  comment: Comment
  onTogglePublish: (commentId: string) => void
  onDelete: (commentId: string) => void
}

export function CommentListItem({ comment, onTogglePublish, onDelete }: CommentListItemProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const isDeletedUser = comment.authorId === DELETED_USER.id

  return (
    <>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="text-xs text-muted-foreground mb-2">記事: {comment.articleTitle}</div>
              {isDeletedUser && (
                <Badge variant="outline" className="mb-2 text-muted-foreground">
                  作成者: 削除済みユーザー
                </Badge>
              )}
              <p className="text-sm leading-relaxed">{comment.content}</p>
            </div>
            <Badge variant={comment.isPublished ? "default" : "secondary"} className="ml-4">
              {comment.isPublished ? "公開" : "非公開"}
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground">投稿日: {formatDate(comment.createdAt)}</div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onTogglePublish(comment.id)}>
            {comment.isPublished ? (
              <>
                <EyeOff className="h-4 w-4 mr-1" />
                非公開
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-1" />
                公開
              </>
            )}
          </Button>
          <Button variant="destructive" size="sm" onClick={() => setShowDeleteDialog(true)}>
            <Trash2 className="h-4 w-4 mr-1" />
            削除
          </Button>
        </CardFooter>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>コメントを削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>このコメントを削除します。この操作は取り消せません。</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onDelete(comment.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              削除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
