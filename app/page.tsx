
import { getArticles, getPopularTags } from "./actions"
import { ArticleList } from "@/components/article-list"

export const dynamic = 'force-dynamic'

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>
}) {
  const resolvedSearchParams = await searchParams
  const q = resolvedSearchParams?.q || null
  const { articles } = await getArticles({ search: q })
  const popularTags = await getPopularTags()
  return <ArticleList initialArticles={articles} popularTags={popularTags} />
}
