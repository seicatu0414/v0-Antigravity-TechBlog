import type React from "react"
import type { Metadata } from "next"
import { Inter, Noto_Sans_JP } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getUserFromSession } from "@/lib/utils/cookie-auth"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const notoSansJP = Noto_Sans_JP({ subsets: ["latin"], variable: "--font-noto-sans-jp" })

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
  const isLoggedIn = !!payload
  return (
    <html lang="ja">
      <body className={`${inter.variable} ${notoSansJP.variable} font-sans`}>
        <Header isLoggedIn={isLoggedIn} />
        <main className="min-h-[calc(100vh-64px-200px)]">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
