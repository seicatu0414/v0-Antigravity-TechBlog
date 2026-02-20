import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { ArticleCard } from '@/components/article-card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Github } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { getUserFromSession } from '@/lib/utils/cookie-auth'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const user = await prisma.user.findUnique({ where: { id } })
    if (!user) return { title: 'ユーザーが見つかりません' }

    return {
        title: `${user.nickname || user.firstName}のプロフィール | TechBlog`,
        description: user.bio || `${user.nickname || user.firstName}の公開プロフィールです。`,
    }
}

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    const user = await prisma.user.findUnique({
        where: { id },
        include: {
            articles: {
                where: { status: 'published' },
                orderBy: { createdAt: 'desc' },
                include: {
                    author: true,
                    tags: {
                        include: {
                            tag: true,
                        },
                    },
                    _count: {
                        select: { bookmarks: true, comments: true },
                    },
                },
            },
        },
    })

    if (!user) {
        notFound()
    }

    let isOwnProfile = false
    const payload = await getUserFromSession()
    if (payload && payload.userId === id) {
        isOwnProfile = true
    }

    // Convert schema Article type to UI suitable type
    const publishedArticles = user.articles.map(article => ({
        id: article.id,
        title: article.title,
        content: article.content,
        excerpt: article.excerpt || '',
        author: {
            name: article.author.nickname || `${article.author.firstName} ${article.author.lastName}`,
            avatar: article.author.avatarUrl || '',
        },
        tags: article.tags.map(t => t.tag.name),
        likes: article.likes,
        comments: article._count.comments,
        bookmarks: article._count.bookmarks,
        isBookmarked: false, // In public profile, not fetching viewer's bookmarks for now, or we can just leave it false
        views: article.views,
        createdAt: article.publishedAt ? article.publishedAt.toISOString().split('T')[0] : article.createdAt.toISOString().split('T')[0],
        updatedAt: article.updatedAt.toISOString().split('T')[0],
    }))

    return (
        <div className="container py-8 bg-background min-h-screen">
            <div className="max-w-4xl mx-auto space-y-12">

                {/* Profile Header */}
                <section className="bg-card rounded-xl p-8 shadow-sm border space-y-6">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        <Avatar className="h-32 w-32 border-4 border-background shadow-md">
                            <AvatarImage src={user.avatarUrl || undefined} alt={user.nickname || user.firstName} className="object-cover" />
                            <AvatarFallback className="text-4xl text-primary font-bold bg-primary/10">
                                {user.nickname?.[0] || user.firstName[0]}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 text-center md:text-left space-y-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h1 className="text-3xl font-bold">{user.nickname || `${user.firstName} ${user.lastName}`}</h1>
                                    <p className="text-muted-foreground mt-1 text-sm">@{user.id.slice(-6)}</p>
                                </div>
                                {isOwnProfile && (
                                    <Button asChild variant="outline">
                                        <Link href="/mypage/profile">プロフィールを編集</Link>
                                    </Button>
                                )}
                            </div>

                            <div className="bg-muted/30 p-4 rounded-lg text-sm leading-relaxed border border-muted">
                                {user.bio ? (
                                    <p className="whitespace-pre-wrap">{user.bio}</p>
                                ) : (
                                    <p className="text-muted-foreground italic">自己紹介はまだありません。</p>
                                )}
                            </div>

                            {user.githubUrl && user.githubUrl.startsWith('https://github.com/') && (
                                <div className="flex justify-center md:justify-start">
                                    <a
                                        href={user.githubUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        <Github className="h-5 w-5" />
                                        GitHub
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* User's Articles */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-bold border-l-4 border-primary pl-4">投稿記事 <span className="text-muted-foreground font-normal text-lg">({publishedArticles.length})</span></h2>

                    {publishedArticles.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {publishedArticles.map((article) => (
                                <ArticleCard key={article.id} article={article} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-muted/30 rounded-lg p-12 text-center border-dashed border-2">
                            <p className="text-muted-foreground">まだ公開された記事はありません。</p>
                        </div>
                    )}
                </section>

            </div>
        </div>
    )
}
