import type React from "react"
import type { Metadata } from "next"
import { Inter, Noto_Sans_JP, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import "katex/dist/katex.min.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getUserFromSession } from "@/lib/utils/cookie-auth"
import { prisma } from "@/lib/prisma"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const notoSansJP = Noto_Sans_JP({ subsets: ["latin"], variable: "--font-noto-sans-jp" })
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono" })

export const metadata: Metadata = {
  title: "TechBlog - 技術記事共有プラットフォーム",
  description: "エンジニアのための技術記事共有プラットフォーム",
  generator: 'v0.app'
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const payload = await getUserFromSession()
  let user = null
  if (payload) {
    const dbUser = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, nickname: true, firstName: true, lastName: true, avatarUrl: true },
    })

    if (dbUser) {
      user = {
        id: dbUser.id,
        name: dbUser.nickname || [dbUser.lastName, dbUser.firstName].filter(Boolean).join(' ') || 'User',
        avatar: dbUser.avatarUrl,
      }
    }
  }

  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={`${inter.variable} ${notoSansJP.variable} ${jetbrainsMono.variable} font-sans antialiased text-foreground bg-background`} suppressHydrationWarning>
        <Header user={user} />
        <main className="min-h-[calc(100vh-64px-200px)]">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
