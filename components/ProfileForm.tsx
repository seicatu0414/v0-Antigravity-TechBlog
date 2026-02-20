'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { updateProfile } from '@/lib/actions/user'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Upload, Loader2, CheckCircle2 } from 'lucide-react'

type UserProfile = {
    firstName: string
    lastName: string
    nickname: string | null
    bio: string | null
    githubUrl: string | null
    avatarUrl: string | null
}

export function ProfileForm({ user }: { user: UserProfile }) {
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<boolean>(false)

    const [previewAvatar, setPreviewAvatar] = useState<string | null>(user.avatarUrl)

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError('ファイルサイズは5MB以下にしてください')
                return
            }
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreviewAvatar(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError(null)
        setSuccess(false)

        const formData = new FormData(e.currentTarget)

        startTransition(async () => {
            const result = await updateProfile(formData)
            if (result.error) {
                setError(result.error)
            } else {
                setSuccess(true)
                setTimeout(() => setSuccess(false), 3000)
            }
        })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <div className="flex flex-col space-y-2">
                    <Label>アバター画像</Label>
                    <div className="flex items-center gap-4">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={previewAvatar || undefined} alt="Avatar" />
                            <AvatarFallback className="text-2xl">{user.nickname?.[0] || user.firstName[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                            <Label htmlFor="avatar-upload" className="cursor-pointer">
                                <div className="flex items-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-md font-medium text-sm transition-colors">
                                    <Upload className="h-4 w-4" />
                                    画像を変更
                                </div>
                            </Label>
                            <Input
                                id="avatar-upload"
                                name="avatar"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                            <p className="text-xs text-muted-foreground mt-2">JPEG, PNG, GIF (最大5MB)</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>姓 (表示名としては利用されません)</Label>
                        <Input value={user.lastName} disabled className="bg-muted" />
                    </div>
                    <div className="space-y-2">
                        <Label>名 (表示名としては利用されません)</Label>
                        <Input value={user.firstName} disabled className="bg-muted" />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="nickname">ニックネーム (公開)</Label>
                    <Input id="nickname" name="nickname" defaultValue={user.nickname || ''} placeholder="JohnDoe" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="bio">自己紹介 (公開)</Label>
                    <Textarea
                        id="bio"
                        name="bio"
                        defaultValue={user.bio || ''}
                        placeholder="フロントエンドエンジニアです。ReactとNext.jsが好きです。"
                        className="h-32"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="githubUrl">GitHub URL (公開)</Label>
                    <Input id="githubUrl" name="githubUrl" type="url" defaultValue={user.githubUrl || ''} placeholder="https://github.com/username" />
                </div>
            </div>

            {error && <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">{error}</div>}
            {success && (
                <div className="p-3 text-sm text-green-600 bg-green-50 rounded-md border border-green-200 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    プロフィールを更新しました
                </div>
            )}

            <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isPending ? '保存中...' : 'プロフィールを保存'}
            </Button>
        </form>
    )
}
