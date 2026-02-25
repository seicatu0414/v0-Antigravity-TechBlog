'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart3, Users, Tags, Image as ImageIcon } from 'lucide-react'

export function SidebarNav() {
    const pathname = usePathname()

    const navItems = [
        { href: '/admin', label: 'ダッシュボード', icon: BarChart3, exact: true },
        { href: '/admin/users', label: 'ユーザー管理', icon: Users },
        { href: '/admin/tags', label: 'タグ管理', icon: Tags },
        { href: '/admin/hero-images', label: 'ヒーロー画像管理', icon: ImageIcon },
    ]

    return (
        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
            {navItems.map((item) => {
                const isActive = item.exact
                    ? pathname === item.href
                    : pathname.startsWith(item.href)

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-colors group border-l-4 ${isActive
                            ? 'bg-primary/5 border-primary text-primary'
                            : 'border-transparent hover:bg-muted/50 text-foreground/80 hover:text-foreground'
                            }`}
                    >
                        <item.icon className={`h-4 w-4 transition-colors ${isActive
                            ? 'text-primary'
                            : 'text-muted-foreground group-hover:text-foreground'
                            }`} />
                        {item.label}
                    </Link>
                )
            })}
        </nav>
    )
}
