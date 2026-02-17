
import { getArticles } from "./actions"
import { ArticleList } from "@/components/article-list"

export const dynamic = 'force-dynamic'

export default async function Home() {
  const articles = await getArticles()
  return <ArticleList initialArticles={articles} />
}
