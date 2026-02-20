
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log(`Start seeding ...`)

    const defaultPassword = await bcrypt.hash('password123', 10)

    // --- Users ---
    const users = [
        {
            id: "1",
            email: "admin@example.com",
            firstName: "太郎",
            lastName: "管理",
            role: "admin",
            nickname: "Admin Taro",
            bio: "システム管理者です",
            githubUrl: "https://github.com/admin",
            avatarUrl: "/admin-interface.png",
            createdAt: new Date("2024-01-15"),
            password: "$2b$10$.h88a6d12LoLyEYVhQfVK.gDgpDsjZFF6hhNv8ZEsTJNeBAdZmZnm",
        },
        {
            id: "2",
            email: "user1@example.com",
            firstName: "花子",
            lastName: "山田",
            role: "general",
            nickname: "Hanako",
            bio: "フロントエンド開発が好きです",
            githubUrl: "https://github.com/hanako",
            avatarUrl: "/diverse-woman-portrait.png",
            createdAt: new Date("2024-02-20"),
            password: "$2b$10$.h88a6d12LoLyEYVhQfVK.gDgpDsjZFF6hhNv8ZEsTJNeBAdZmZnm",
        },
        {
            id: "3",
            email: "user2@example.com",
            firstName: "次郎",
            lastName: "佐藤",
            role: "general",
            nickname: "Jiro Dev",
            bio: "TypeScript愛好家",
            githubUrl: "https://github.com/jiro",
            avatarUrl: "/developer-working.png",
            createdAt: new Date("2024-03-10"),
            password: "$2b$10$.h88a6d12LoLyEYVhQfVK.gDgpDsjZFF6hhNv8ZEsTJNeBAdZmZnm",
        },
        {
            id: "4",
            email: "user3@example.com",
            firstName: "三郎",
            lastName: "鈴木",
            role: "admin",
            nickname: "Saburo",
            bio: "バックエンドエンジニア",
            githubUrl: "https://github.com/saburo",
            avatarUrl: "/diverse-engineers-meeting.png",
            createdAt: new Date("2024-01-25"),
            password: "$2b$10$.h88a6d12LoLyEYVhQfVK.gDgpDsjZFF6hhNv8ZEsTJNeBAdZmZnm",
        },
        {
            id: "5",
            email: "user4@example.com",
            firstName: "美咲",
            lastName: "田中",
            role: "general",
            nickname: "Misaki",
            bio: "デザインとコードの両方が好き",
            githubUrl: "https://github.com/misaki",
            avatarUrl: "/diverse-designers-brainstorming.png",
            createdAt: new Date("2024-04-05"),
            password: "$2b$10$.h88a6d12LoLyEYVhQfVK.gDgpDsjZFF6hhNv8ZEsTJNeBAdZmZnm",
        }
    ]

    for (const u of users) {
        await prisma.user.upsert({
            where: { email: u.email },
            update: {},
            create: { ...u, password: defaultPassword },
        })
    }

    // --- Tags ---
    const tags = [
        { id: "t1", name: "React", color: "#61DAFB" },
        { id: "t2", name: "JavaScript", color: "#F7DF1E" },
        { id: "t3", name: "Next.js", color: "#000000" },
        { id: "t4", name: "TypeScript", color: "#3178C6" },
        { id: "t5", name: "CSS", color: "#1572B6" },
        { id: "t6", name: "Tailwind", color: "#06B6D4" },
        { id: "t7", name: "Supabase", color: "#3ECF8E" },
        { id: "t8", name: "Backend", color: "#8B5CF6" },
        { id: "t9", name: "Draft", color: "#6B7280", status: "draft" },
    ]

    for (const t of tags) {
        await prisma.tag.upsert({
            where: { name: t.name },
            update: {},
            create: t,
        })
    }

    // --- Articles ---
    const articles = [
        {
            id: "a1",
            title: "React 19の新機能について",
            content: "# React 19の新機能\n\nReact 19では多くの新機能が追加されました...",
            excerpt: "React 19の新機能について解説します。",
            authorId: "2",
            status: "published",
            publishedAt: new Date("2024-11-01"),
            tagIds: ["t1", "t2"],
            likes: 120,
        },
        {
            id: "a2",
            title: "Next.js App Routerの使い方",
            content: "# Next.js App Router\n\nNext.js 13から導入されたApp Routerについて...",
            excerpt: "App Routerの基本から応用まで。",
            authorId: "2",
            status: "published",
            publishedAt: new Date("2024-11-05"),
            tagIds: ["t3", "t1"],
            likes: 85,
        },
        {
            id: "a3",
            title: "TypeScriptの型システム入門",
            content: "# TypeScript型システム\n\nTypeScriptの型システムは強力です...",
            excerpt: "型システムの基礎を学びましょう。",
            authorId: "3",
            status: "draft",
            publishedAt: null,
            tagIds: ["t4"],
            likes: 0,
        },
        {
            id: "a4",
            title: "Tailwind CSSでスタイリング",
            content: "# Tailwind CSS\n\nTailwind CSSを使った効率的なスタイリング方法...",
            excerpt: "Utility-first CSSの魅力。",
            authorId: "3",
            status: "published",
            publishedAt: new Date("2024-11-12"),
            tagIds: ["t5", "t6"],
            likes: 210,
        },
        {
            id: "a5",
            title: "Supabaseでバックエンド構築",
            content: "# Supabase入門\n\nSupabaseを使ったバックエンドの構築方法について...",
            excerpt: "BaaSを活用した高速開発。",
            authorId: "4",
            status: "published",
            publishedAt: new Date("2024-11-15"),
            tagIds: ["t7", "t8"],
            likes: 95,
        },
    ]

    for (const a of articles) {
        const { tagIds, ...data } = a
        await prisma.article.upsert({
            where: { id: a.id },
            update: {},
            create: {
                ...data,
                tags: {
                    create: tagIds.map(tid => ({ tag: { connect: { id: tid } } }))
                }
            },
        })
    }

    // --- Comments ---
    const comments = [
        {
            id: "c1",
            content: "とても参考になりました！",
            articleId: "a1",
            authorId: "3",
            status: "published",
            createdAt: new Date("2024-11-02"),
        },
        {
            id: "c2",
            content: "App Routerは素晴らしいですね",
            articleId: "a2",
            authorId: "4",
            status: "published",
            createdAt: new Date("2024-11-06"),
        },
        {
            id: "c3",
            content: "スパムコメントです",
            articleId: "a1",
            authorId: "5",
            status: "draft",
            createdAt: new Date("2024-11-03"),
        }
    ]

    for (const c of comments) {
        await prisma.comment.upsert({
            where: { id: c.id },
            update: {},
            create: c,
        })
    }

    // --- Bookmarks ---
    const bookmarks = [
        { userId: "2", articleId: "a1" },
        { userId: "2", articleId: "a2" },
        { userId: "3", articleId: "a4" },
        { userId: "4", articleId: "a1" },
    ]

    for (const b of bookmarks) {
        await prisma.bookmark.upsert({
            where: { userId_articleId: { userId: b.userId, articleId: b.articleId } },
            update: {},
            create: b,
        })
    }

    // --- Activities ---
    const activities = [
        {
            id: "act1",
            adminId: "1",
            actionType: "promote_user",
            targetType: "user",
            targetId: "4",
            targetName: "鈴木 三郎",
            description: "鈴木 三郎を管理者に昇格しました",
        },
        {
            id: "act2",
            adminId: "1",
            actionType: "delete_article",
            targetType: "article",
            targetId: "a99",
            targetName: "削除された記事タイトル",
            description: "田中 美咲の記事「削除された記事タイトル」を削除しました",
        }
    ]

    for (const act of activities) {
        await prisma.activity.upsert({
            where: { id: act.id },
            update: {},
            create: act,
        })
    }

    console.log(`Seeding finished.`)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
