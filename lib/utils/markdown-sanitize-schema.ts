import { defaultSchema } from 'rehype-sanitize'

export const MARKDOWN_SANITIZE_SCHEMA = {
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
