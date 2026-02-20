import { ArticleEditor } from '@/components/ArticleEditor'
import { getUserFromSession } from '@/lib/utils/cookie-auth'
import { prisma } from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'

export const metadata = {
    title: '記事を編集 | TechBlog',
}

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const payload = await getUserFromSession()

    if (!payload) {
        redirect('/login')
    }

    const article = await prisma.article.findUnique({
        where: { id },
        include: {
            tags: {
                include: { tag: true }
            }
        }
    })

    if (!article) {
        notFound()
    }

    if (article.authorId !== payload.userId) {
        redirect('/mypage')
    }

    const articleData = {
        id: article.id,
        title: article.title,
        content: article.content,
        tags: article.tags.map(t => t.tag.name),
        coverImageUrl: article.coverImageUrl,
        status: article.status
    }

    return (
        <div className="container max-w-6xl py-8">
            <div className="space-y-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">記事を編集</h1>
                    <p className="text-muted-foreground mt-2">
                        記事の内容を更新して保存します。
                    </p>
                </div>

                <ArticleEditor article={articleData} />
            </div>
        </div>
    )
}
