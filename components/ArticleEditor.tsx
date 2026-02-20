'use client'

import React, { useState, useTransition, useRef } from 'react'
import { MarkdownPreview } from '@/components/MarkdownPreview'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { X, Upload, Loader2, Image as ImageIcon } from 'lucide-react'
import { createArticle, updateArticle, uploadImage } from '@/lib/actions/article'
import { useRouter } from 'next/navigation'
import Image from 'next/image'


export type ArticleEditorProps = {
    article?: {
        id: string
        title: string
        content: string
        tags: string[]
        coverImageUrl?: string | null
        status: string
    }
}

export function ArticleEditor({ article }: ArticleEditorProps) {
    const isEdit = !!article
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [title, setTitle] = useState(article?.title || '')
    const [content, setContent] = useState(article?.content || '')
    const [tagInput, setTagInput] = useState('')
    const [tags, setTags] = useState<string[]>(article?.tags || [])
    const [previewCover, setPreviewCover] = useState<string | null>(article?.coverImageUrl || null)
    const [coverFile, setCoverFile] = useState<File | null>(null)
    const [error, setError] = useState<string | null>(null)

    const fileInputRef = useRef<HTMLInputElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const handleAddTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim()])
            setTagInput('')
        }
    }

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter((tag) => tag !== tagToRemove))
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            handleAddTag()
        }
    }

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError('画像サイズは5MB以下にしてください')
                return
            }
            setCoverFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreviewCover(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleImageUploadToEditor = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const uploadToast = '画像をアップロード中...'
        // Usually you'd show a toast here. For now setting temporary error just to show activity

        const result = await uploadImage(file)
        if (result.error) {
            setError(result.error)
            return
        }

        if (result.url) {
            const markdownImage = `\n![${file.name}](${result.url})\n`

            // Insert at cursor
            if (textareaRef.current) {
                const start = textareaRef.current.selectionStart
                const end = textareaRef.current.selectionEnd
                const newContent = content.substring(0, start) + markdownImage + content.substring(end)
                setContent(newContent)

                // Reposition cursor after the state updates (using setTimeout as simple hack)
                setTimeout(() => {
                    if (textareaRef.current) {
                        textareaRef.current.selectionStart = start + markdownImage.length
                        textareaRef.current.selectionEnd = start + markdownImage.length
                        textareaRef.current.focus()
                    }
                }, 10)
            } else {
                setContent(prev => prev + markdownImage)
            }
        }

        // Reset input
        e.target.value = ''
    }

    const handleSubmit = async (e: React.FormEvent, status: string) => {
        e.preventDefault()
        setError(null)

        if (!title.trim() || !content.trim()) {
            setError('タイトルと本文は必須です')
            return
        }

        const formData = new FormData()
        formData.append('title', title)
        formData.append('content', content)
        formData.append('tags', tags.join(','))
        formData.append('status', status)

        if (coverFile) {
            formData.append('coverImage', coverFile)
        }

        startTransition(async () => {
            const result = isEdit && article
                ? await updateArticle(article.id, formData)
                : await createArticle(formData)

            if (result.error) {
                setError(result.error)
            } else {
                router.push('/mypage')
            }
        })
    }

    return (
        <div className="space-y-6 rounded-lg border bg-card p-6">
            {error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                <div className="flex flex-col space-y-2">
                    <Label>カバー画像</Label>
                    {previewCover ? (
                        <div className="relative w-full aspect-video md:aspect-[21/9] rounded-lg overflow-hidden border">
                            <Image
                                src={previewCover}
                                alt="Cover image"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Label htmlFor="cover-upload" className="cursor-pointer">
                                    <div className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-md font-medium flex items-center gap-2">
                                        <Upload className="h-4 w-4" />
                                        画像を変更
                                    </div>
                                </Label>
                            </div>
                        </div>
                    ) : (
                        <Label htmlFor="cover-upload" className="cursor-pointer">
                            <div className="w-full aspect-video md:aspect-[21/9] rounded-lg border-2 border-dashed border-muted hover:border-primary/50 bg-muted/20 flex flex-col items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                                <ImageIcon className="h-8 w-8 mb-2 opacity-50" />
                                <span>カバー画像をアップロード</span>
                                <span className="text-xs mt-1">推奨比率 21:9 (最大5MB)</span>
                            </div>
                        </Label>
                    )}
                    <Input
                        id="cover-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleCoverChange}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="title">タイトル</Label>
                    <Input
                        id="title"
                        placeholder="記事のタイトルを入力..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="text-lg font-bold"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="tags">タグ</Label>
                    <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row gap-2">
                            <Input
                                id="tags"
                                placeholder="タグを入力してEnterキーを押す"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="flex-1"
                            />
                            <Button type="button" variant="outline" onClick={handleAddTag} disabled={!tagInput.trim()}>
                                追加
                            </Button>
                        </div>
                        {tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {tags.map((tag) => (
                                    <Badge key={tag} variant="secondary" className="pl-3 pr-1 py-1 text-sm bg-primary/10 hover:bg-primary/20 text-primary border-primary/20">
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTag(tag)}
                                            className="ml-2 hover:bg-primary/20 rounded-full p-0.5"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label>本文</Label>
                        <div>
                            <Input
                                type="file"
                                id="editor-image-upload"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUploadToEditor}
                            />
                            <Label htmlFor="editor-image-upload" className="cursor-pointer text-xs flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                                <ImageIcon className="h-3.5 w-3.5" />
                                画像を挿入
                            </Label>
                        </div>
                    </div>

                    <Tabs defaultValue="edit" className="w-full">
                        <TabsList className="grid w-full max-w-md grid-cols-2">
                            <TabsTrigger value="edit">編集</TabsTrigger>
                            <TabsTrigger value="preview">プレビュー</TabsTrigger>
                        </TabsList>

                        <TabsContent value="edit" className="mt-4">
                            <Textarea
                                ref={textareaRef}
                                id="content"
                                placeholder="# 見出し&#10;&#10;本文をMarkdown形式で入力できます...&#10;&#10;## コード例&#10;```javascript&#10;console.log('Hello World');&#10;```"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="min-h-[400px] font-mono text-sm leading-relaxed"
                            />
                        </TabsContent>

                        <TabsContent value="preview" className="mt-4">
                            <div className="min-h-[400px] rounded-lg border bg-background p-6">
                                {content ? (
                                    <>
                                        {title && <h1 className="text-4xl font-bold mb-6 text-balance">{title}</h1>}
                                        {tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-6">
                                                {tags.map((tag) => (
                                                    <Badge key={tag} variant="secondary">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}
                                        <MarkdownPreview content={content} />
                                    </>
                                ) : (
                                    <p className="text-muted-foreground text-center py-20">本文を入力するとプレビューが表示されます</p>
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                <div className="pt-6 border-t flex flex-wrap gap-4 items-center justify-between">
                    <Button
                        type="button"
                        variant="outline"
                        disabled={isPending}
                        onClick={(e) => handleSubmit(e, 'draft')}
                    >
                        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        下書き保存
                    </Button>
                    <div className="flex gap-4">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => router.back()}
                            disabled={isPending}
                        >
                            キャンセル
                        </Button>
                        <Button
                            type="button"
                            className="bg-[#E2703A] hover:bg-[#E2703A]/90 text-white"
                            disabled={isPending}
                            onClick={(e) => handleSubmit(e, 'published')}
                        >
                            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            {isEdit ? '更新する' : '公開する'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
