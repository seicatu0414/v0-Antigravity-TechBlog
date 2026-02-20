import React from 'react'

export function MarkdownPreview({ content }: { content: string }) {
    const renderMarkdown = (text: string) => {
        let html = text
        html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
            return `<pre class="bg-muted p-4 rounded-lg overflow-x-auto my-4"><code class="text-sm font-mono">${code.trim()}</code></pre>`
        })
        html = html.replace(/`([^`]+)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
        html = html.replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-6 mb-3">$1</h3>')
        html = html.replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-8 mb-4">$1</h2>')
        html = html.replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-8 mb-4">$1</h1>')
        html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold">$1</strong>')
        html = html.replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>')

        // Process markdown images: ![alt](url)
        html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="rounded-lg max-w-full my-4 border shadow-sm" />')

        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-[#E2703A] hover:underline cursor-pointer" target="_blank" rel="noopener noreferrer">$1</a>')
        html = html.replace(/\n\n/g, '</p><p class="mb-4 text-foreground/90 leading-relaxed font-serif">')
        html = html.replace(/\n/g, '<br />')
        return `<p class="mb-4 text-foreground/90 leading-relaxed font-serif">${html}</p>`
    }

    return <div className="prose prose-slate prose-img:rounded-md max-w-none break-words" dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }} />
}
