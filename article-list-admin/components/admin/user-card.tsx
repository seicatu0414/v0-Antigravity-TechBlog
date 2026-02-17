"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { User } from "@/lib/types/admin"
import { Shield, UserIcon, Trash2 } from "lucide-react"
import { formatDate } from "@/lib/utils/format"
import Link from "next/link"
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

interface UserCardProps {
  user: User
  onRoleChange: (userId: string, newRole: "admin" | "user") => void
  onDelete: (userId: string) => void
}

export function UserCard({ user, onRoleChange, onDelete }: UserCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <Link href={`/admin/users/${user.id}`}>
          <CardHeader className="cursor-pointer">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <UserIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{user.email}</h3>
                  <p className="text-sm text-muted-foreground">登録日: {formatDate(user.createdAt)}</p>
                </div>
              </div>
              <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                {user.role === "admin" ? "管理者" : "一般"}
              </Badge>
            </div>
          </CardHeader>
        </Link>

        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">{user.articlesCount}</p>
              <p className="text-xs text-muted-foreground">記事</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{user.commentsCount}</p>
              <p className="text-xs text-muted-foreground">コメント</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{user.bookmarksCount}</p>
              <p className="text-xs text-muted-foreground">ブックマーク</p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex gap-2">
          <Button
            variant={user.role === "admin" ? "default" : "outline"}
            size="sm"
            className="flex-1"
            onClick={(e) => {
              e.preventDefault()
              onRoleChange(user.id, "admin")
            }}
            disabled={user.role === "admin"}
          >
            <Shield className="h-4 w-4 mr-1" />
            管理者
          </Button>
          <Button
            variant={user.role === "user" ? "default" : "outline"}
            size="sm"
            className="flex-1"
            onClick={(e) => {
              e.preventDefault()
              onRoleChange(user.id, "user")
            }}
            disabled={user.role === "user"}
          >
            <UserIcon className="h-4 w-4 mr-1" />
            一般
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={(e) => {
              e.preventDefault()
              setShowDeleteDialog(true)
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ユーザーを削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>{user.email}を削除します。この操作は取り消せません。</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onDelete(user.id)}
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
