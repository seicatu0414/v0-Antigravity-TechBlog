"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Tag } from "@/lib/types/admin"
import { TagIcon, EyeOff, Eye, Trash2, Pencil } from "lucide-react"
import { formatDate } from "@/lib/utils/format"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface TagCardProps {
  tag: Tag
  onTogglePublish: (tagId: string) => void
  onDelete: (tagId: string) => void
  onEdit: (tagId: string, newName: string) => void
}

export function TagCard({ tag, onTogglePublish, onDelete, onEdit }: TagCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editedName, setEditedName] = useState(tag.name)

  const handleEdit = () => {
    if (editedName.trim() && editedName !== tag.name) {
      onEdit(tag.id, editedName.trim())
    }
    setShowEditDialog(false)
  }

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <TagIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{tag.name}</h3>
                <p className="text-sm text-muted-foreground">{tag.articlesCount}件の記事</p>
              </div>
            </div>
            <Badge variant={tag.isPublished ? "default" : "secondary"}>{tag.isPublished ? "公開" : "非公開"}</Badge>
          </div>
          <div className="text-xs text-muted-foreground">作成日: {formatDate(tag.createdAt)}</div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 bg-transparent"
            onClick={() => {
              setEditedName(tag.name)
              setShowEditDialog(true)
            }}
          >
            <Pencil className="h-4 w-4 mr-1" />
            編集
          </Button>
          <Button variant="outline" size="sm" onClick={() => onTogglePublish(tag.id)}>
            {tag.isPublished ? (
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
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>タグを削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>「{tag.name}」を削除します。この操作は取り消せません。</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onDelete(tag.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              削除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>タグを編集</DialogTitle>
            <DialogDescription>タグ名を変更します。</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="tagName">タグ名</Label>
              <Input
                id="tagName"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                placeholder="タグ名を入力"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              キャンセル
            </Button>
            <Button onClick={handleEdit} disabled={!editedName.trim()}>
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
