"use client"

import { useActionState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { login } from "@/lib/actions/auth"

const initialState = {
  message: '',
}

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, initialState)

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-8">
      <div className="w-full max-w-md">
        <div className="card-elevated p-8 rounded-2xl space-y-6">
          {/* Logo */}
          <div className="flex flex-col items-center space-y-4 pb-2">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#E2703A] to-[#EEB76B] shadow-lg">
              <span className="text-2xl font-bold text-white">T</span>
            </div>
            <div className="text-center space-y-1">
              <h1 className="text-2xl font-bold tracking-tight">ログイン</h1>
              <p className="text-sm text-muted-foreground">アカウントにログインして記事を投稿しましょう</p>
            </div>
          </div>

          <form action={formAction} className="space-y-5">
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
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100">
                {state.message}
              </div>
            )}
            <Button
              type="submit"
              className="w-full h-12 rounded-full bg-gradient-to-r from-[#E2703A] to-[#d4612e] hover:from-[#d4612e] hover:to-[#c55525] text-white shadow-md hover:shadow-lg font-semibold text-base transition-all"
              disabled={isPending}
            >
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
