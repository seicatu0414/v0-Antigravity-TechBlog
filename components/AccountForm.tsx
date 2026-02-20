'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updateAccount } from '@/lib/actions/user'
import { Loader2, CheckCircle2 } from 'lucide-react'

export function AccountForm({ email }: { email: string }) {
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<boolean>(false)

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError(null)
        setSuccess(false)

        const formData = new FormData(e.currentTarget)

        startTransition(async () => {
            const result = await updateAccount(formData)
            if (result.error) {
                setError(result.error)
            } else {
                setSuccess(true)
                setTimeout(() => setSuccess(false), 3000)
                // Clear password fields
                const form = e.target as HTMLFormElement
                form.currentPassword.value = ''
                form.newPassword.value = ''
                if (form.confirmPassword) {
                    form.confirmPassword.value = ''
                }
            }
        })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">メールアドレス</Label>
                    <Input id="email" name="email" type="email" defaultValue={email} required />
                </div>

                <div className="pt-4 border-t space-y-4">
                    <h3 className="text-lg font-medium">パスワードの変更</h3>
                    <p className="text-sm text-muted-foreground">
                        パスワードを変更しない場合は、以下のフィールドを空白のままにしてください。
                    </p>

                    <div className="space-y-2">
                        <Label htmlFor="currentPassword">現在のパスワード</Label>
                        <Input id="currentPassword" name="currentPassword" type="password" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="newPassword">新しいパスワード (8文字以上)</Label>
                        <Input id="newPassword" name="newPassword" type="password" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">新しいパスワード (確認用)</Label>
                        <Input id="confirmPassword" name="confirmPassword" type="password" />
                    </div>
                </div>
            </div>

            {error && <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">{error}</div>}
            {success && (
                <div className="p-3 text-sm text-green-600 bg-green-50 rounded-md border border-green-200 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    アカウント情報を更新しました
                </div>
            )}

            <Button type="submit" disabled={isPending}>
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isPending ? '保存中...' : '変更を保存'}
            </Button>
        </form>
    )
}
