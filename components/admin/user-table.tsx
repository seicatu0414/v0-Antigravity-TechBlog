'use client'

import { useState, useTransition } from 'react'
import { updateUserRole, deleteUser } from '@/lib/actions/admin'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Calendar, MoreVertical, ShieldAlert, Trash2 } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type UserData = {
    id: string
    email: string
    firstName: string
    lastName: string
    nickname: string | null
    role: string
    createdAt: Date
    _count: {
        articles: number
        comments: number
    }
}

export function UserTable({ initialUsers, currentUserId }: { initialUsers: UserData[], currentUserId: string }) {
    const [users, setUsers] = useState<UserData[]>(initialUsers)
    const [isPending, startTransition] = useTransition()

    const handleRoleChange = (userId: string, newRole: 'admin' | 'general') => {
        if (userId === currentUserId) return alert('自身の権限は変更できません')

        startTransition(async () => {
            try {
                await updateUserRole(userId, newRole)
                setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u))
            } catch (error: any) {
                alert(error.message)
            }
        })
    }

    const handleDelete = (userId: string) => {
        if (userId === currentUserId) return alert('自身のアカウントは削除できません')
        if (!confirm('本当にこのユーザーを削除しますか？\n(注: 投稿した記事やコメントも全て削除されます)')) return

        startTransition(async () => {
            try {
                await deleteUser(userId)
                setUsers(users.filter(u => u.id !== userId))
            } catch (error: any) {
                alert(error.message)
            }
        })
    }

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'short', day: 'numeric' })
    }

    return (
        <Card>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted pb-2 text-muted-foreground font-medium uppercase text-xs border-b">
                            <tr>
                                <th className="px-6 py-4">ユーザー</th>
                                <th className="px-6 py-4">権限</th>
                                <th className="px-6 py-4">記事数</th>
                                <th className="px-6 py-4">登録日</th>
                                <th className="px-6 py-4 text-right">アクション</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {users.map(user => (
                                <tr key={user.id} className={`hover:bg-muted/50 transition-colors ${isPending ? 'opacity-50' : ''}`}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9">
                                                <AvatarFallback>{user.nickname?.[0] || user.firstName[0]}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium text-foreground">
                                                    {user.nickname || `${user.firstName} ${user.lastName}`}
                                                </div>
                                                <div className="text-xs text-muted-foreground">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${user.role === 'admin'
                                            ? 'bg-blue-50 text-blue-700 ring-blue-700/10 dark:bg-blue-900/40 dark:text-blue-400 dark:ring-blue-800/50'
                                            : 'bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-900/30 dark:text-green-400 dark:ring-green-800/40'
                                            }`}>
                                            {user.role === 'admin' ? '管理者' : '一般ユーザー'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground">
                                        {user._count.articles} 件
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground">
                                        {formatDate(user.createdAt)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0" disabled={isPending}>
                                                    <span className="sr-only">メニューを開く</span>
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>アクション</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                {user.role === 'general' ? (
                                                    <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'admin')} disabled={user.id === currentUserId}>
                                                        <ShieldAlert className="mr-2 h-4 w-4" /> 管理者にする
                                                    </DropdownMenuItem>
                                                ) : (
                                                    <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'general')} disabled={user.id === currentUserId}>
                                                        一般ユーザーにする
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() => handleDelete(user.id)}
                                                    disabled={user.id === currentUserId}
                                                    className="text-red-600 focus:bg-red-50 focus:text-red-600"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" /> アカウント削除
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    )
}
