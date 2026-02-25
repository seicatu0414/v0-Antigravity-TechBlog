import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import { preprocessMarkdownContent } from '@/lib/utils/markdown-preprocessor'

export function MarkdownPreview({ content }: { content: string }) {
    const processedContent = preprocessMarkdownContent(content)

    return (
        <div className="prose prose-slate prose-img:rounded-md max-w-none break-words dark:prose-invert">
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[
                    rehypeRaw,
                    [
                        rehypeSanitize,
                        {
                            ...defaultSchema,
                            attributes: {
                                ...defaultSchema.attributes,
                                span: [
                                    ...(defaultSchema.attributes?.span || []),
                                    ['className', /^text-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950)$/],
                                    ['class', /^text-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950)$/]
                                ],
                                div: [
                                    ...(defaultSchema.attributes?.div || []),
                                    ['className', /^katex(?:-|$)/],
                                    ['class', /^katex(?:-|$)/]
                                    // Math equations may have `math` or `katex-display`
                                ],
                                math: [
                                    ...(defaultSchema.attributes?.math || []),
                                    ['className', /^katex(?:-|$)/],
                                    ['class', /^katex(?:-|$)/]
                                ],
                                code: [
                                    ...(defaultSchema.attributes?.code || []),
                                    ['className', /^language-[a-z0-9-]+$/i],
                                    ['class', /^language-[a-z0-9-]+$/i]
                                ],
                                '*': [
                                    ...(defaultSchema.attributes?.['*'] || []),
                                    ['className', /^katex(?:-|$)/],
                                    ['class', /^katex(?:-|$)/]
                                ]
                            }
                        }
                    ],
                    rehypeKatex
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
                    code({ className, children, ...props }) {
                        const isInline = !className
                        if (isInline) {
                            return <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" {...props}>{children}</code>
                        }
                        return (
                            <pre className="bg-muted p-4 rounded-lg overflow-x-auto my-4">
                                <code className={`text-sm font-mono ${className || ''}`} {...props}>
                                    {children}
                                </code>
                            </pre>
                        )
                    }
                }}
            >
                {processedContent}
            </ReactMarkdown>
        </div>
    )
}
