"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Activity } from "@/lib/types/admin"
import { formatRelativeTime } from "@/lib/utils/format"
import { UserPlus, Trash2, EyeOff, UserCheck, UserMinus, Edit, Mail } from "lucide-react"

interface ActivityFeedProps {
  activities: Activity[]
}

function getActivityIcon(actionType: string) {
  if (actionType.includes("delete")) return <Trash2 className="h-4 w-4" />
  if (actionType.includes("update") || actionType.includes("unpublish")) return <EyeOff className="h-4 w-4" />
  if (actionType === "promote_user") return <UserCheck className="h-4 w-4" />
  if (actionType === "demote_user") return <UserMinus className="h-4 w-4" />
  if (actionType === "create_user") return <UserPlus className="h-4 w-4" />
  if (actionType === "reset_password") return <Mail className="h-4 w-4" />
  return <Edit className="h-4 w-4" />
}

function getActivityColor(actionType: string): string {
  if (actionType.includes("delete")) {
    return "bg-red-500/10 text-red-700 dark:text-red-400"
  }
  if (actionType.includes("unpublish") || actionType === "demote_user") {
    return "bg-orange-500/10 text-orange-700 dark:text-orange-400"
  }
  if (actionType === "promote_user" || actionType === "create_user") {
    return "bg-green-500/10 text-green-700 dark:text-green-400"
  }
  return "bg-blue-500/10 text-blue-700 dark:text-blue-400"
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>お知らせ</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">まだアクティビティはありません</p>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0">
                <div className={`p-2 rounded-lg ${getActivityColor(activity.actionType)}`}>
                  {getActivityIcon(activity.actionType)}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm leading-relaxed">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">{formatRelativeTime(activity.timestamp)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
