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
                <aside className="w-full md:w-60 flex-shrink-0">
                    <div className="card-elevated p-4 rounded-2xl space-y-1 md:sticky md:top-20">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground px-3 mb-3">マイページ</h2>
                        <nav className="flex flex-col space-y-0.5">
                            <Link
                                href="/mypage"
                                className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl hover:bg-primary/8 text-foreground/70 hover:text-primary transition-all"
                            >
                                <LayoutDashboard className="h-4.5 w-4.5" />
                                ダッシュボード
                            </Link>
                            <Link
                                href="/mypage/profile"
                                className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl hover:bg-primary/8 text-foreground/70 hover:text-primary transition-all"
                            >
                                <User className="h-4.5 w-4.5" />
                                プロフィール編集
                            </Link>
                            <Link
                                href="/mypage/account"
                                className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl hover:bg-primary/8 text-foreground/70 hover:text-primary transition-all"
                            >
                                <Settings className="h-4.5 w-4.5" />
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
