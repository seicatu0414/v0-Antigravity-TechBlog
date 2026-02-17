export interface Article {
  id: string
  title: string
  content: string
  excerpt: string
  author: {
    name: string
    avatar: string
  }
  tags: string[]
  likes: number
  bookmarks: number
  views: number
  createdAt: string
  updatedAt: string
}

export const mockArticles: Article[] = [
  {
    id: "1",
    title: "Next.js 15の新機能を徹底解説",
    content: "Next.js 15がリリースされました。この記事では、新機能について詳しく解説します...",
    excerpt: "Next.js 15の新機能であるTurbopackの安定版、React 19サポート、キャッシングAPIの改善について解説します。",
    author: {
      name: "山田太郎",
      avatar: "/diverse-avatars.png",
    },
    tags: ["Next.js", "React", "フロントエンド"],
    likes: 245,
    bookmarks: 89,
    views: 1523,
    createdAt: "2025-01-15",
    updatedAt: "2025-01-15",
  },
  {
    id: "2",
    title: "TypeScriptの型安全性を高める実践テクニック",
    content: "TypeScriptで型安全なコードを書くためのテクニックを紹介します...",
    excerpt: "ジェネリクス、ユーティリティ型、型ガードを活用して、より堅牢なTypeScriptコードを書く方法を解説します。",
    author: {
      name: "佐藤花子",
      avatar: "/female-avatar.png",
    },
    tags: ["TypeScript", "JavaScript", "型システム"],
    likes: 189,
    bookmarks: 67,
    views: 982,
    createdAt: "2025-01-14",
    updatedAt: "2025-01-14",
  },
  {
    id: "3",
    title: "Supabaseで構築する認証システム完全ガイド",
    content: "Supabaseを使った認証システムの実装方法を解説します...",
    excerpt: "Supabase Authを使用して、メール認証、OAuth、RLSを実装する方法を詳しく解説します。",
    author: {
      name: "鈴木一郎",
      avatar: "/avatar-male.jpg",
    },
    tags: ["Supabase", "バックエンド", "認証"],
    likes: 312,
    bookmarks: 145,
    views: 2104,
    createdAt: "2025-01-13",
    updatedAt: "2025-01-13",
  },
  {
    id: "4",
    title: "TailwindCSS v4の新機能とマイグレーション方法",
    content: "TailwindCSS v4の新機能について解説します...",
    excerpt:
      "TailwindCSS v4で導入された新しいカラーシステム、パフォーマンス改善、そしてv3からのマイグレーション手順を紹介します。",
    author: {
      name: "田中美咲",
      avatar: "/avatar-woman.png",
    },
    tags: ["TailwindCSS", "CSS", "デザイン"],
    likes: 156,
    bookmarks: 52,
    views: 743,
    createdAt: "2025-01-12",
    updatedAt: "2025-01-12",
  },
  {
    id: "5",
    title: "React Server Componentsの仕組みと活用法",
    content: "React Server Componentsについて詳しく解説します...",
    excerpt: "RSCの仕組み、クライアントコンポーネントとの違い、実践的な活用方法について解説します。",
    author: {
      name: "高橋健太",
      avatar: "/avatar-man.png",
    },
    tags: ["React", "Next.js", "サーバーサイド"],
    likes: 278,
    bookmarks: 98,
    views: 1654,
    createdAt: "2025-01-11",
    updatedAt: "2025-01-11",
  },
]

export const popularTags = [
  "Next.js",
  "React",
  "TypeScript",
  "JavaScript",
  "TailwindCSS",
  "Supabase",
  "フロントエンド",
  "バックエンド",
  "デザイン",
  "パフォーマンス",
]
