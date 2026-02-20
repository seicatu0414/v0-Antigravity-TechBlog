"use client"

import { useActionState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { login } from "@/lib/actions/auth"

const initialState = {
  message: '',
}

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, initialState)

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">ログイン</CardTitle>
          <CardDescription className="text-center">アカウントにログインして記事を投稿しましょう</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">メールアドレス</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="example@email.com"
                required
                className="h-12 rounded-xl bg-muted/40 border-0 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">パスワード</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className="h-12 rounded-xl bg-muted/40 border-0 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            {state?.message && (
              <p className="text-sm text-red-500 text-center">{state.message}</p>
            )}
            <Button type="submit" className="w-full bg-[#E2703A] hover:bg-[#E2703A]/90 text-white" disabled={isPending}>
              {isPending ? "ログイン中..." : "ログイン"}
            </Button>
          </form>

          <div className="text-center pt-2">
            <p className="text-sm text-muted-foreground">
              アカウントをお持ちでない方は
              <Link href="/register" className="text-[#E2703A] hover:text-[#d4612e] font-semibold ml-1 transition-colors">
                新規登録
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
