import type { Bookmark } from "@/lib/types/admin"
import { Card, CardContent } from "@/components/ui/card"
import { formatDate } from "@/lib/utils/format"
import { BookmarkIcon } from "lucide-react"

interface BookmarkListItemProps {
  bookmark: Bookmark
}

export function BookmarkListItem({ bookmark }: BookmarkListItemProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <BookmarkIcon className="h-5 w-5 text-primary mt-0.5" />
          <div className="flex-1">
            <h4 className="font-medium mb-1">{bookmark.articleTitle}</h4>
            <p className="text-xs text-muted-foreground">ブックマーク日: {formatDate(bookmark.createdAt)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
