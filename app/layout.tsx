import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"
import StoreProvider from "./StoreProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TechBlog - 技術記事共有プラットフォーム",
  description: "エンジニアのための技術記事共有プラットフォーム",
  generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <StoreProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
        </StoreProvider>
      </body>
    </html>
  )
}
