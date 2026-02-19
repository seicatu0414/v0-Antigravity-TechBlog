import { getAuthCookie } from '@/lib/utils/cookie-auth'
import { verifyToken } from '@/lib/auth-system'
import { redirect } from 'next/navigation'
import { logout } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'

export default async function MyPage() {
  const token = await getAuthCookie()
  if (!token) {
    redirect('/login')
  }

  const payload = await verifyToken(token) as any
  if (!payload || !payload.userId) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
  })

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col items-center space-y-4">
        <h1 className="text-2xl font-bold">マイページ</h1>
        <p>ようこそ、{user.nickname || user.firstName} さん</p>
        <p>Email: {user.email}</p>
        <p>Role: {user.role}</p>

        <form action={logout}>
          <Button type="submit" variant="destructive">ログアウト</Button>
        </form>
      </div>
    </div>
  )
}
