import { redirect } from 'next/navigation'
import Link from 'next/link'
import { User, Settings, LayoutDashboard } from 'lucide-react'
import { getUserFromSession } from '@/lib/utils/cookie-auth'

export default async function MyPageLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const payload = await getUserFromSession()
    if (!payload) {
        redirect('/login')
    }

    return (
        <div className="container py-8 min-h-screen">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">

                {/* Sidebar — Navigation Rail */}
                <aside className="w-full md:w-64 flex-shrink-0">
                    <div className="rounded-sm border border-border bg-card p-6 space-y-3 md:sticky md:top-20 shadow-none">
                        <h2 className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground px-2 mb-4">マイページ</h2>
                        <nav className="flex flex-col space-y-1">
                            <Link
                                href="/mypage"
                                className="flex items-center gap-3 px-3 py-2 text-[11px] sm:text-xs font-mono uppercase tracking-wider font-medium rounded-sm hover:bg-accent text-muted-foreground hover:text-foreground transition-colors border border-transparent hover:border-border"
                            >
                                <LayoutDashboard className="h-4 w-4" />
                                ダッシュボード
                            </Link>
                            <Link
                                href="/mypage/profile"
                                className="flex items-center gap-3 px-3 py-2 text-[11px] sm:text-xs font-mono uppercase tracking-wider font-medium rounded-sm hover:bg-accent text-muted-foreground hover:text-foreground transition-colors border border-transparent hover:border-border"
                            >
                                <User className="h-4 w-4" />
                                プロフィール編集
                            </Link>
                            <Link
                                href="/mypage/account"
                                className="flex items-center gap-3 px-3 py-2 text-[11px] sm:text-xs font-mono uppercase tracking-wider font-medium rounded-sm hover:bg-accent text-muted-foreground hover:text-foreground transition-colors border border-transparent hover:border-border"
                            >
                                <Settings className="h-4 w-4" />
                                アカウント設定
                            </Link>
                        </nav>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 min-w-0">
                    {children}
                </main>

            </div>
        </div>
    )
}
