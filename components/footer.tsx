import Link from "next/link"

export function Footer() {
    return (
        <footer className="border-t border-border bg-background mt-16">
            <div className="container py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary text-primary-foreground shadow-none">
                                <span className="text-lg font-mono font-bold">T</span>
                            </div>
                            <span className="text-lg font-mono font-bold tracking-tight">TechBlog</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                            エンジニアのための技術記事共有プラットフォーム。最新の技術情報やノウハウを共有し、学び合いましょう。
                        </p>
                    </div>

                    {/* Navigation */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-xs font-mono uppercase tracking-wider text-muted-foreground">ナビゲーション</h3>
                        <nav className="flex flex-col space-y-2">
                            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">記事一覧</Link>
                            <Link href="/post" className="text-sm text-muted-foreground hover:text-foreground transition-colors">記事を投稿</Link>
                            <Link href="/mypage" className="text-sm text-muted-foreground hover:text-foreground transition-colors">マイページ</Link>
                        </nav>
                    </div>

                    {/* Info */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-xs font-mono uppercase tracking-wider text-muted-foreground">その他</h3>
                        <nav className="flex flex-col space-y-2">
                            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">ログイン</Link>
                            <Link href="/register" className="text-sm text-muted-foreground hover:text-foreground transition-colors">新規登録</Link>
                        </nav>
                    </div>
                </div>

                <div className="border-t border-border mt-8 pt-6 text-center">
                    <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                        © {new Date().getFullYear()} TechBlog. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}
