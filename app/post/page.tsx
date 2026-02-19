"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X } from "lucide-react"

import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"

function MarkdownPreview({ content }: { content: string }) {
  return (
    <div className="prose prose-slate max-w-none dark:prose-invert">
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "")
            return !inline && match ? (
              <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div" {...props}>
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}


import { createArticle } from "../actions"

export default function PostPage() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState<string[]>([])

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddTag()
    }
  }

  // We need to wrap the server action to pass the state data
  // Since server actions in forms typically work with FormData, 
  // we can use a hidden form or just construct FormData manually in an event handler, 
  // but using <form action={...}> is the most standard way for progressive enhancement.
  // However, `tags` state is managed in client.
  // So we will use a client-side handler that calls the action.

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('title', title)
    formData.append('content', content)
    formData.append('tags', tags.join(','))

    await createArticle(formData)
  }

  return (
    <div className="container max-w-6xl py-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">記事を投稿</h1>
          <form onSubmit={handleSubmit}>
            <Button type="submit" className="bg-[#E2703A] hover:bg-[#E2703A]/90 text-white">投稿する</Button>
          </form>
        </div>

        <div className="space-y-6 rounded-lg border bg-card p-6">
          <div className="space-y-2">
            <Label htmlFor="title">タイトル</Label>
            <Input
              id="title"
              placeholder="記事のタイトルを入力..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">タグ</Label>
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  id="tags"
                  placeholder="タグを入力してEnterキーを押す"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <Button type="button" variant="outline" onClick={handleAddTag} disabled={!tagInput.trim()}>
                  追加
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="pl-3 pr-1 py-1">
                      {tag}
                      <button type="button" onClick={() => handleRemoveTag(tag)} className="ml-2 hover:bg-muted rounded-full p-0.5">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>本文</Label>
            <Tabs defaultValue="edit" className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="edit">編集</TabsTrigger>
                <TabsTrigger value="preview">プレビュー</TabsTrigger>
              </TabsList>

              <TabsContent value="edit" className="mt-4">
                <Textarea
                  id="content"
                  placeholder="# 見出し&#10;&#10;本文をMarkdown形式で入力できます...&#10;&#10;## コード例&#10;```javascript&#10;console.log('Hello World');&#10;```"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[400px] font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Markdown記法が使用できます。見出し、リスト、コードブロックなどをサポートしています。
                </p>
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
        </div>
      </div>
    </div>
  )
}
