import { defaultSchema } from 'rehype-sanitize'

export const MARKDOWN_SANITIZE_SCHEMA = {
    ...defaultSchema,
    tagNames: [
        ...(defaultSchema.tagNames || []),
        'math', 'semantics', 'mrow', 'mi', 'mo', 'mn',
        'msup', 'msub', 'mfrac', 'mover', 'munder',
        'mtable', 'mtr', 'mtd', 'mtext', 'annotation'
    ],
    attributes: {
        ...defaultSchema.attributes,
        span: [
            ...(defaultSchema.attributes?.span || []),
            ['className', /^text-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950)$|^math(?:-display|-inline)?$/],
            ['class', /^text-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950)$|^math(?:-display|-inline)?$/]
        ],
        div: [
            ...(defaultSchema.attributes?.div || []),
            ['className', /^math(?:-display|-inline)?$/],
            ['class', /^math(?:-display|-inline)?$/]
        ],
        math: [
            ...(defaultSchema.attributes?.math || []),
            ['className', /^katex(?:-|$)/],
            ['class', /^katex(?:-|$)/]
        ],
        annotation: [
            ...(defaultSchema.attributes?.annotation || []),
            'encoding'
        ],
        code: [
            ...(defaultSchema.attributes?.code || []),
            ['className', /^language-[a-z0-9-]+$|^math(?:-display|-inline)?$/i],
            ['class', /^language-[a-z0-9-]+$|^math(?:-display|-inline)?$/i]
        ],
        '*': [
            ...(defaultSchema.attributes?.['*'] || []),
            ['className', /^katex(?:-|$)/],
            ['class', /^katex(?:-|$)/],
            'style'
        ]
    }
}
