'use client'

import { useState, useTransition } from 'react'
import { updateTag, createTag, deleteTag } from '@/lib/actions/admin-tags'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, Edit, Plus, Trash2 } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'

type TagData = {
    id: string
    name: string
    color: string
    status: string
    createdAt: Date
    _count: {
        articles: number
    }
}

import { useRouter } from 'next/navigation'

export function TagTable({ initialTags }: { initialTags: TagData[] }) {
    const router = useRouter()
    const [tags, setTags] = useState<TagData[]>(initialTags)
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState('')

    // Dialog state
    const [isOpen, setIsOpen] = useState(false)
    const [editingTag, setEditingTag] = useState<TagData | null>(null)
    const [formData, setFormData] = useState({ name: '', color: '#000000' })

    const openCreateDialog = () => {
        setEditingTag(null)
        setFormData({ name: '', color: '#000000' })
        setError('')
        setIsOpen(true)
    }

    const openEditDialog = (tag: TagData) => {
        setEditingTag(tag)
        setFormData({ name: tag.name, color: tag.color })
        setError('')
        setIsOpen(true)
    }

    const handleSave = () => {
        if (!formData.name.trim()) {
            setError('タグ名を入力してください')
            return
        }

        startTransition(async () => {
            setError('')
            try {
                if (editingTag) {
                    await updateTag(editingTag.id, formData.name, formData.color)
                    setTags(tags.map(t => t.id === editingTag.id ? { ...t, name: formData.name, color: formData.color } : t))
                } else {
                    await createTag(formData.name, formData.color)
                    // For simplicity, refresh to get fresh list
                    router.refresh()
                }
                setIsOpen(false)
            } catch (err: any) {
                setError(err.message)
            }
        })
    }

    const handleDelete = (id: string, name: string) => {
        if (!confirm(`タグ「${name}」を削除しますか？\n紐づいていた記事からこのタグは外れます。`)) return

        startTransition(async () => {
            try {
                await deleteTag(id)
                setTags(tags.filter(t => t.id !== id))
            } catch (err: any) {
                alert(err.message)
            }
        })
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Button onClick={openCreateDialog} className="gap-2">
                    <Plus className="w-4 h-4" />
                    新規タグ作成
                </Button>
            </div>

            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted pb-2 text-muted-foreground font-medium uppercase text-xs border-b">
                                <tr>
                                    <th className="px-6 py-4">タグ名</th>
                                    <th className="px-6 py-4">プレビュー</th>
                                    <th className="px-6 py-4">使用記事数</th>
                                    <th className="px-6 py-4 text-right">アクション</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {tags.map(tag => (
                                    <tr key={tag.id} className={`hover:bg-muted/50 transition-colors ${isPending ? 'opacity-50' : ''}`}>
                                        <td className="px-6 py-4 font-medium">
                                            {tag.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white shadow-sm"
                                                style={{ backgroundColor: tag.color }}
                                            >
                                                {tag.name}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            {tag._count.articles} 件
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <Button variant="outline" size="sm" onClick={() => openEditDialog(tag)} disabled={isPending}>
                                                <Edit className="w-4 h-4 mr-1" /> 編集
                                            </Button>
                                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(tag.id, tag.name)} disabled={isPending}>
                                                <Trash2 className="w-4 h-4 mr-1" /> 削除
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {tags.length === 0 && (
                            <div className="p-8 text-center text-muted-foreground">
                                タグがありません。新しく作成してください。
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingTag ? 'タグを編集' : '新規タグ作成'}</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {error && (
                            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="name">タグ名</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                placeholder="例: React"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="color">カラーコード</Label>
                            <div className="flex gap-3">
                                <Input
                                    id="color"
                                    type="color"
                                    value={formData.color}
                                    onChange={e => setFormData({ ...formData, color: e.target.value })}
                                    className="w-20 h-10 p-1 cursor-pointer"
                                />
                                <Input
                                    value={formData.color}
                                    onChange={e => setFormData({ ...formData, color: e.target.value })}
                                    className="flex-1 font-mono uppercase"
                                    placeholder="#000000"
                                    maxLength={7}
                                />
                            </div>
                        </div>

                        <div className="pt-4 space-y-2">
                            <Label>プレビュー</Label>
                            <div>
                                <span
                                    className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white shadow-sm"
                                    style={{ backgroundColor: formData.color || '#000000' }}
                                >
                                    {formData.name || 'タグ名'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isPending}>キャンセル</Button>
                        <Button onClick={handleSave} disabled={isPending}>
                            {isPending ? '保存中...' : '保存'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
