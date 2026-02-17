"use client"

import { useState } from "react"
import { UserCard } from "@/components/admin/user-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { mockUsers, mockArticles, mockComments, DELETED_USER } from "@/lib/data/mock-admin-data"
import type { User } from "@/lib/types/admin"
import { Search, ArrowLeft, UserPlus } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function UsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "user">("all")

  const handleRoleChange = (userId: string, newRole: "admin" | "user") => {
    setUsers(users.map((user) => (user.id === userId ? { ...user, role: newRole } : user)))
    // In a real app, this would call an API
    console.log(`[v0] User ${userId} role changed to ${newRole}`)
  }

  const handleDelete = (userId: string) => {
    mockArticles.forEach((article) => {
      if (article.authorId === userId) {
        article.authorId = DELETED_USER.id
        article.authorEmail = "削除済みユーザー"
      }
    })

    mockComments.forEach((comment) => {
      if (comment.authorId === userId) {
        comment.authorId = DELETED_USER.id
        comment.authorEmail = "削除済みユーザー"
      }
    })

    setUsers(users.filter((user) => user.id !== userId))
    // In a real app, this would call an API
    console.log(`[v0] User ${userId} deleted`)
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/admin")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              ダッシュボードに戻る
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">ユーザー管理</h1>
              <p className="text-muted-foreground mt-2">全{users.length}名のユーザー</p>
            </div>
            <Link href="/admin/users/new">
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                新規登録
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="メールアドレスで検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={roleFilter} onValueChange={(value: any) => setRoleFilter(value)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="役割で絞り込み" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              <SelectItem value="admin">管理者</SelectItem>
              <SelectItem value="user">一般ユーザー</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">ユーザーが見つかりませんでした</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredUsers.map((user) => (
              <UserCard key={user.id} user={user} onRoleChange={handleRoleChange} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
