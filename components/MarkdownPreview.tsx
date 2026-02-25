import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import { preprocessMarkdownContent } from '@/lib/utils/markdown-preprocessor'
import { MARKDOWN_SANITIZE_SCHEMA } from '@/lib/utils/markdown-sanitize-schema'

export function MarkdownPreview({ content }: { content: string }) {
    const processedContent = preprocessMarkdownContent(content)

    return (
        <div className="prose prose-slate prose-img:rounded-md max-w-none break-words dark:prose-invert">
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[
                    rehypeRaw,
                    rehypeKatex,
                    [rehypeSanitize, MARKDOWN_SANITIZE_SCHEMA]
                ]}
                components={{
                    h1({ children }) {
                        return <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>
                    },
                    h2({ children }) {
                        return <h2 className="text-2xl font-bold mt-8 mb-4">{children}</h2>
                    },
                    h3({ children }) {
                        return <h3 className="text-xl font-bold mt-6 mb-3">{children}</h3>
                    },
                    a({ href, children }) {
                        return <a href={href} className="text-[#E2703A] hover:underline cursor-pointer" target="_blank" rel="noopener noreferrer">{children}</a>
                    },
                    img({ src, alt }) {
                        return <img src={src} alt={alt} className="rounded-lg max-w-full my-4 border shadow-sm" />
                    },
                    pre({ children, ...props }: any) {
                        return <pre className="bg-muted p-4 rounded-lg overflow-x-auto my-4" {...props}>{children}</pre>
                    },
                    code({ inline, className, children, ...props }: any) {
                        if (inline) {
                            return <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" {...props}>{children}</code>
                        }
                        return (
                            <code className={`text-sm font-mono ${className || ''}`} {...props}>
                                {children}
                            </code>
                        )
                    },
                    table({ children, ...props }: any) {
                        return (
                            <div className="w-full overflow-x-auto my-6">
                                <table className="w-full border-collapse border border-border text-sm" {...props}>
                                    {children}
                                </table>
                            </div>
                        )
                    },
                    thead({ children, ...props }: any) {
                        return <thead className="bg-muted/70" {...props}>{children}</thead>
                    },
                    tr({ children, ...props }: any) {
                        return <tr className="border-b border-border m-0 p-0 hover:bg-muted/30 transition-colors" {...props}>{children}</tr>
                    },
                    th({ children, ...props }: any) {
                        return <th className="border border-border px-4 py-2 font-semibold text-left [&[align=center]]:text-center [&[align=right]]:text-right text-foreground" {...props}>{children}</th>
                    },
                    td({ children, ...props }: any) {
                        return <td className="border border-border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right text-foreground/90" {...props}>{children}</td>
                    }
                }}
            >
                {processedContent}
            </ReactMarkdown>
        </div>
    )
}
