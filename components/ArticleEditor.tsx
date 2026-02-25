'use client'

import React, { useState, useTransition, useRef } from 'react'
import { MarkdownPreview } from '@/components/MarkdownPreview'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { X, Upload, Loader2, Image as ImageIcon, Bold, Italic, Heading, Code, Table, Palette, Sigma, Link as LinkIcon, List, Quote, ListOrdered, FileCode } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { createArticle, updateArticle, uploadImage } from '@/lib/actions/article'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const COLOR_OPTIONS = [
    { name: '赤', value: 'red-500', class: 'bg-red-500' },
    { name: '青', value: 'blue-500', class: 'bg-blue-500' },
    { name: '緑', value: 'green-500', class: 'bg-green-500' },
    { name: '黄', value: 'yellow-500', class: 'bg-yellow-500' },
    { name: '紫', value: 'purple-500', class: 'bg-purple-500' },
    { name: 'オレンジ', value: 'orange-500', class: 'bg-orange-500' },
    { name: 'スカイ', value: 'sky-500', class: 'bg-sky-500' },
    { name: 'エメラルド', value: 'emerald-500', class: 'bg-emerald-500' },
    { name: 'インディゴ', value: 'indigo-500', class: 'bg-indigo-500' },
    { name: 'ピンク', value: 'pink-500', class: 'bg-pink-500' }
]


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

    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const insertTextAtCursor = (before: string, after: string = '') => {
        if (!textareaRef.current) return

        const start = textareaRef.current.selectionStart
        const end = textareaRef.current.selectionEnd
        const selectedText = content.substring(start, end)

        const placeholder = after ? 'テキスト' : ''
        const replacement = before + (selectedText || placeholder) + after
        const newContent = content.substring(0, start) + replacement + content.substring(end)

        setContent(newContent)

        // フォーカスと選択状態を復元
        setTimeout(() => {
            if (textareaRef.current) {
                textareaRef.current.focus()
                const newCursorPos = start + before.length + (selectedText || placeholder).length
                if (!selectedText && placeholder) {
                    textareaRef.current.selectionStart = start + before.length
                    textareaRef.current.selectionEnd = start + before.length + placeholder.length
                } else {
                    textareaRef.current.selectionStart = newCursorPos
                    textareaRef.current.selectionEnd = newCursorPos
                }
            }
        }, 10)
    }

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

        const result = await uploadImage(file)
        if (result.error) {
            setError(result.error)
            return
        }

        if (result.url) {
            const markdownImage = `\n![${file.name}](${result.url})\n`

            // カーソル位置に挿入
            if (textareaRef.current) {
                const start = textareaRef.current.selectionStart
                const end = textareaRef.current.selectionEnd
                const newContent = content.substring(0, start) + markdownImage + content.substring(end)
                setContent(newContent)

                // 状態更新後にカーソル位置を再設定
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

        // 入力をリセット
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
        <div className="card-elevated rounded-2xl p-6 md:p-8 space-y-6">
            {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                <div className="flex flex-col space-y-2">
                    <Label>カバー画像</Label>
                    {previewCover ? (
                        <div className="relative w-full aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden shadow-sm">
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
                            <div className="w-full aspect-video md:aspect-[21/9] rounded-2xl border-2 border-dashed border-primary/20 hover:border-primary/40 bg-primary/3 hover:bg-primary/5 flex flex-col items-center justify-center text-muted-foreground hover:text-primary transition-all">
                                <ImageIcon className="h-10 w-10 mb-3 opacity-40" />
                                <span className="font-medium">カバー画像をアップロード</span>
                                <span className="text-xs mt-1 opacity-60">推奨比率 21:9 (最大5MB)</span>
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
                    <Label htmlFor="title" className="text-sm font-medium">タイトル</Label>
                    <Input
                        id="title"
                        placeholder="記事のタイトルを入力..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="h-12 text-lg font-bold rounded-xl bg-muted/40 border-0 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all"
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
                                className="flex-1 h-10 rounded-xl bg-muted/40 border-0 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                            <Button type="button" variant="outline" onClick={handleAddTag} disabled={!tagInput.trim()} className="rounded-xl">
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

                        <TabsContent value="edit" className="mt-4 space-y-2">
                            {/* ツールバー */}
                            <div className="flex flex-wrap items-center gap-1 p-1.5 bg-muted/40 rounded-xl border border-border/50 shadow-sm overflow-x-auto">
                                <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground" onClick={() => insertTextAtCursor('**', '**')} title="太字"><Bold className="h-4 w-4" /></Button>
                                <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground" onClick={() => insertTextAtCursor('*', '*')} title="斜体"><Italic className="h-4 w-4" /></Button>
                                <div className="w-px h-4 bg-border mx-1" />
                                <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground" onClick={() => insertTextAtCursor('### ')} title="見出し"><Heading className="h-4 w-4" /></Button>
                                <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground" onClick={() => insertTextAtCursor('> ')} title="引用"><Quote className="h-4 w-4" /></Button>
                                <div className="w-px h-4 bg-border mx-1" />
                                <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground" onClick={() => insertTextAtCursor('- ')} title="箇条書き"><List className="h-4 w-4" /></Button>
                                <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground" onClick={() => insertTextAtCursor('1. ')} title="番号付きリスト"><ListOrdered className="h-4 w-4" /></Button>
                                <div className="w-px h-4 bg-border mx-1" />
                                <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground" onClick={() => insertTextAtCursor('[', '](https://)')} title="リンク"><LinkIcon className="h-4 w-4" /></Button>
                                <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground" onClick={() => insertTextAtCursor('`', '`')} title="インラインコード"><Code className="h-4 w-4" /></Button>
                                <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground" onClick={() => insertTextAtCursor('\n```\n', '\n```\n')} title="コードブロック"><FileCode className="h-4 w-4" /></Button>
                                <div className="w-px h-4 bg-border mx-1" />
                                <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground" onClick={() => insertTextAtCursor('\n| 列1 | 列2 |\n|---|---|\n| 値1 | 値2 |\n')} title="テーブル"><Table className="h-4 w-4" /></Button>
                                <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground" onClick={() => insertTextAtCursor('\n$$\n', '\n$$\n')} title="数式 (KaTeX)"><Sigma className="h-4 w-4" /></Button>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground" title="文字色">
                                            <Palette className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start" className="w-[140px] p-2">
                                        <div className="grid grid-cols-5 gap-1.5">
                                            {COLOR_OPTIONS.map(color => (
                                                <DropdownMenuItem key={color.value} className="p-0.5 cursor-pointer focus:bg-transparent flex justify-center" onClick={(e) => { e.preventDefault(); insertTextAtCursor(`<span class="text-${color.value}">`, '</span>') }} title={color.name}>
                                                    <div className={`w-5 h-5 rounded-full ${color.class} hover:scale-110 transition-transform shadow-sm`} />
                                                </DropdownMenuItem>
                                            ))}
                                        </div>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <Textarea
                                ref={textareaRef}
                                id="content"
                                placeholder="# 見出し&#10;&#10;本文をMarkdown形式で入力できます...&#10;&#10;## コード例&#10;```javascript&#10;console.log('Hello World');&#10;```"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="min-h-[400px] font-mono text-sm leading-relaxed rounded-xl bg-muted/20 border-border/50 shadow-inner focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all resize-y"
                            />
                        </TabsContent>

                        <TabsContent value="preview" className="mt-4">
                            <div className="min-h-[400px] rounded-xl bg-white elevation-1 p-6">
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
                            className="rounded-full bg-gradient-to-r from-[#E2703A] to-[#d4612e] hover:from-[#d4612e] hover:to-[#c55525] text-white shadow-md hover:shadow-lg font-semibold transition-all"
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
