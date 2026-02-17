"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Mail, Loader2, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function NewUserPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email.trim()) {
      setError("メールアドレスを入力してください")
      return
    }

    if (!validateEmail(email)) {
      setError("有効なメールアドレスを入力してください")
      return
    }

    setIsLoading(true)

    // Simulate API call to send OTP
    setTimeout(() => {
      setIsLoading(false)
      setIsSuccess(true)

      // Reset form after 3 seconds
      setTimeout(() => {
        setEmail("")
        setIsSuccess(false)
      }, 3000)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4 py-6">
          <Button variant="ghost" size="sm" onClick={() => router.push("/admin/users")} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            ユーザー一覧に戻る
          </Button>
          <h1 className="text-3xl font-bold">ユーザー新規登録</h1>
          <p className="text-muted-foreground mt-2">
            新しいユーザーのメールアドレスを入力してワンタイムパスワードを送信します
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>新規ユーザー登録</CardTitle>
            <CardDescription>
              登録するユーザーのメールアドレスを入力してください。 ワンタイムパスワードが送信されます。
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">メールアドレス</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9"
                    disabled={isLoading || isSuccess}
                  />
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {isSuccess && (
                <Alert className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>ワンタイムパスワードを{email}に送信しました</AlertDescription>
                </Alert>
              )}

              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <h3 className="font-semibold text-sm">登録フロー</h3>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>メールアドレスを入力</li>
                  <li>ワンタイムパスワードが送信されます</li>
                  <li>ユーザーがメールからログインしてアカウントを有効化</li>
                  <li>初期ロールは一般ユーザーとして登録されます</li>
                </ol>
              </div>
            </CardContent>
            <CardFooter className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/users")}
                disabled={isLoading}
                className="flex-1"
              >
                キャンセル
              </Button>
              <Button type="submit" disabled={isLoading || isSuccess} className="flex-1">
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    送信中...
                  </>
                ) : isSuccess ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    送信完了
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    ワンタイムパスワードを送信
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <h3 className="font-semibold text-sm mb-2 text-blue-700 dark:text-blue-400">注意事項</h3>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>登録されたユーザーは初期状態で一般ユーザー権限になります</li>
            <li>管理者権限への昇格はユーザー管理画面から行えます</li>
            <li>ワンタイムパスワードの有効期限は24時間です</li>
            <li>既に登録済みのメールアドレスには送信できません</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
