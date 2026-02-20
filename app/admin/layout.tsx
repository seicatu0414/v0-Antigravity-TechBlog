import { redirect } from 'next/navigation'
import { getUserFromSession } from '@/lib/utils/cookie-auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { LayoutDashboard, ChevronLeft } from 'lucide-react'
import { SidebarNav } from '@/components/admin/sidebar-nav'

export const metadata = {
    title: 'Admin Dashboard | TechBlog',
}

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const payload = await getUserFromSession()
    if (!payload) redirect('/login')

    const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: { role: true }
    })

    // Role check: Only allow admin users
    if (!user || user.role !== 'admin') {
        redirect('/')
    }

    return (
        <div className="flex min-h-screen bg-muted/20">
            {/* Admin Sidebar */}
            <aside className="w-64 border-r bg-card flex flex-col fixed inset-y-0 left-0 z-50 pt-16 lg:pt-0">
                <div className="p-6 border-b flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <LayoutDashboard className="h-5 w-5" />
                    </div>
                    <span className="font-bold text-lg tracking-tight">Admin Console</span>
                </div>

                <SidebarNav />

                <div className="p-4 border-t">
                    <Link href="/" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                        <ChevronLeft className="h-4 w-4" />
                        サイトに戻る
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 lg:pl-64">
                <div className="p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
