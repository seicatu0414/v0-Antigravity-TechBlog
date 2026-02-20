"use client"

import { useActionState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { register } from "@/lib/actions/auth"

const initialState = {
  message: '',
}

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(register, initialState)

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">新規登録</CardTitle>
          <CardDescription className="text-center">アカウントを作成して技術記事を共有しましょう</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lastName">姓</Label>
                <Input id="lastName" name="lastName" placeholder="山田" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="firstName">名</Label>
                <Input id="firstName" name="firstName" placeholder="太郎" required />
              </div>
            </div>
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
                minLength={8}
              />
            </div>
            {/* 
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">パスワード（確認）</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                required
                minLength={8}
                className="h-12 rounded-xl bg-muted/40 border-0 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            */}
            {state?.message && (
              <p className="text-sm text-red-500 text-center">{state.message}</p>
            )}
            <Button type="submit" className="w-full bg-[#E2703A] hover:bg-[#E2703A]/90 text-white" disabled={isPending}>
              {isPending ? "登録中..." : "新規登録"}
            </Button>
          </form>

          <div className="text-center pt-2">
            <p className="text-sm text-muted-foreground">
              すでにアカウントをお持ちの方は
              <Link href="/login" className="text-[#E2703A] hover:text-[#d4612e] font-semibold ml-1 transition-colors">
                ログイン
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
