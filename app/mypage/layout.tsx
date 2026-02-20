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
        <div className="container py-8 bg-background min-h-screen">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">

                {/* Sidebar */}
                <aside className="w-full md:w-64 flex-shrink-0 space-y-6">
                    <div className="space-y-1">
                        <h2 className="text-xl font-bold px-4 mb-4">マイページ</h2>
                        <nav className="flex flex-col space-y-1">
                            <Link
                                href="/mypage"
                                className="flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <LayoutDashboard className="h-4 w-4" />
                                ダッシュボード
                            </Link>
                            <Link
                                href="/mypage/profile"
                                className="flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <User className="h-4 w-4" />
                                プロフィール編集
                            </Link>
                            <Link
                                href="/mypage/account"
                                className="flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
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
