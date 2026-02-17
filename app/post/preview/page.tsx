"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Send } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"

interface PreviewArticle {
  title: string
  content: string
  tags: string[]
}

export default function PreviewPage() {
  const router = useRouter()
  const [article, setArticle] = useState<PreviewArticle | null>(null)

  useEffect(() => {
    const stored = sessionStorage.getItem("previewArticle")
    if (stored) {
      setArticle(JSON.parse(stored))
    } else {
      router.push("/post")
    }
  }, [router])

  const handlePublish = () => {
    // Mock publish - in real app, this would call an API
    sessionStorage.removeItem("previewArticle")
    alert("記事を投稿しました!")
    router.push("/")
  }

  if (!article) {
    return null
  }

  return (
    <div className="container max-w-4xl py-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            編集に戻る
          </Button>
          <Button onClick={handlePublish} className="bg-[#E2703A] hover:bg-[#E2703A]/90 text-white">
            <Send className="h-4 w-4 mr-2" />
            投稿する
          </Button>
        </div>

        <div className="rounded-lg border bg-card p-8 space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-balance">{article.title}</h1>

            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder.svg" alt="あなた" />
                <AvatarFallback>あ</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">あなた</p>
                <p className="text-xs text-muted-foreground">{new Date().toLocaleDateString("ja-JP")}</p>
              </div>
            </div>

            {article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="border-t pt-6">
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
                {article.content}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
