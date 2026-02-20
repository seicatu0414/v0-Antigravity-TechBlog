import { prisma } from '@/lib/prisma'

async function main() {
    const count = await prisma.article.count()
    console.log(`Total articles: ${count}`)

    const articles = await prisma.article.findMany({
        take: 5
    })
    console.log('Articles:', articles)
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
