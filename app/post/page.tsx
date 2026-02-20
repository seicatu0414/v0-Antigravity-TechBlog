import { ArticleEditor } from '@/components/ArticleEditor'
import { getUserFromSession } from '@/lib/utils/cookie-auth'
import { redirect } from 'next/navigation'

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

export default async function PostPage() {
  const payload = await getUserFromSession()
  if (!payload) {
    redirect('/login')
  }

  return (
    <div className="container max-w-6xl py-8">
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">新しい記事を書く</h1>
          <p className="text-muted-foreground mt-2">
            Markdown形式で記事を執筆し、公開することができます。
          </p>
        </div>

        <ArticleEditor />
      </div>
    </div>
  )
}
