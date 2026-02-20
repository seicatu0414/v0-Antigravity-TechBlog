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
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
                const isActive = item.exact
                    ? pathname === item.href
                    : pathname.startsWith(item.href)

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors group ${isActive
                                ? 'bg-primary text-primary-foreground'
                                : 'hover:bg-muted text-foreground/80 hover:text-foreground'
                            }`}
                    >
                        <item.icon className={`h-4 w-4 transition-colors ${isActive
                                ? 'text-primary-foreground'
                                : 'text-muted-foreground group-hover:text-primary'
                            }`} />
                        {item.label}
                    </Link>
                )
            })}
        </nav>
    )
}
