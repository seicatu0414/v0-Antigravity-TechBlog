"use client"

import type { Article } from "@/lib/types/admin"
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

interface ArticleListItemProps {
  article: Article
  onTogglePublish: (articleId: string) => void
  onDelete: (articleId: string) => void
}

export function ArticleListItem({ article, onTogglePublish, onDelete }: ArticleListItemProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const isDeletedUser = article.authorId === DELETED_USER.id

  return (
    <>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">{article.title}</h3>
              {isDeletedUser && (
                <Badge variant="outline" className="mb-2 text-muted-foreground">
                  作成者: 削除済みユーザー
                </Badge>
              )}
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{article.content}</p>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <Badge variant={article.isPublished ? "default" : "secondary"} className="ml-4">
              {article.isPublished ? "公開" : "非公開"}
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground">
            作成: {formatDate(article.createdAt)} / 更新: {formatDate(article.updatedAt)}
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onTogglePublish(article.id)}>
            {article.isPublished ? (
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
            <AlertDialogTitle>記事を削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>「{article.title}」を削除します。この操作は取り消せません。</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onDelete(article.id)}
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
