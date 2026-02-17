"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { TagCard } from "@/components/admin/tag-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { mockTags } from "@/lib/data/mock-admin-data"
import type { Tag } from "@/lib/types/admin"
import { Search, ArrowLeft, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function TagsPage() {
  const router = useRouter()
  const [tags, setTags] = useState<Tag[]>(mockTags)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "unpublished">("all")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newTagName, setNewTagName] = useState("")

  const handleTogglePublish = (tagId: string) => {
    setTags(tags.map((tag) => (tag.id === tagId ? { ...tag, isPublished: !tag.isPublished } : tag)))
    console.log(`[v0] Tag ${tagId} publish status toggled`)
  }

  const handleDelete = (tagId: string) => {
    setTags(tags.filter((tag) => tag.id !== tagId))
    console.log(`[v0] Tag ${tagId} deleted`)
  }

  const handleEdit = (tagId: string, newName: string) => {
    setTags(tags.map((tag) => (tag.id === tagId ? { ...tag, name: newName } : tag)))
    console.log(`[v0] Tag ${tagId} renamed to ${newName}`)
  }

  const handleAddTag = () => {
    if (newTagName.trim()) {
      const newTag: Tag = {
        id: `t${Date.now()}`,
        name: newTagName.trim(),
        articlesCount: 0,
        isPublished: true,
        createdAt: new Date(),
      }
      setTags([newTag, ...tags])
      setNewTagName("")
      setShowAddDialog(false)
      console.log(`[v0] Tag ${newTag.name} added`)
    }
  }

  const filteredTags = tags.filter((tag) => {
    const matchesSearch = tag.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "published" && tag.isPublished) ||
      (statusFilter === "unpublished" && !tag.isPublished)
    return matchesSearch && matchesStatus
  })

  return (
    <>
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
                <h1 className="text-3xl font-bold">タグ管理</h1>
                <p className="text-muted-foreground mt-2">全{tags.length}個のタグ</p>
              </div>
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                タグを追加
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="タグ名で検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="ステータスで絞り込み" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべて</SelectItem>
                <SelectItem value="published">公開中</SelectItem>
                <SelectItem value="unpublished">非公開</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredTags.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">タグが見つかりませんでした</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredTags.map((tag) => (
                <TagCard
                  key={tag.id}
                  tag={tag}
                  onTogglePublish={handleTogglePublish}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新しいタグを追加</DialogTitle>
            <DialogDescription>新しいタグ名を入力してください。</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="newTagName">タグ名</Label>
              <Input
                id="newTagName"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="例: React"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newTagName.trim()) {
                    handleAddTag()
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddDialog(false)
                setNewTagName("")
              }}
            >
              キャンセル
            </Button>
            <Button onClick={handleAddTag} disabled={!newTagName.trim()}>
              追加
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
