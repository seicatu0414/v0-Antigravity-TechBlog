
import { getArticles, getPopularTags } from "./actions"
import { ArticleList } from "@/components/article-list"

export const dynamic = 'force-dynamic'

export default async function Home() {
  const articles = await getArticles()
  const popularTags = await getPopularTags()
  return <ArticleList initialArticles={articles} popularTags={popularTags} />
}
