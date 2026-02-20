import { getArticles } from "./actions"
import { ArticleList } from "@/components/article-list"

export const dynamic = 'force-dynamic'

export default async function Home() {
  const result = await getArticles()
  return <ArticleList initialResult={result} />
}
