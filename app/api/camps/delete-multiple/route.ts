// import { prisma } from '@/prisma'
// import { NextResponse } from 'next/server'

// export async function POST(req: Request) {
// 	try {
// 		const body = await req.json()
// 		const { ids } = body

// 		if (!ids || !Array.isArray(ids) || ids.length === 0) {
// 			return NextResponse.json({ error: 'Missing ids' }, { status: 400 })
// 		}

// 		const idNums = ids.map((v: any) => parseInt(v, 10)).filter((n: number) => !isNaN(n))

// 		await prisma.camp.deleteMany({
// 			where: {
// 				id: { in: idNums }
// 			}
// 		})

// 		return NextResponse.json({ success: true })
// 	} catch (err) {
// 		console.error('Error deleting multiple camps:', err)
// 		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
// 	}
// }
import { prisma } from '@/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { ids } = body
        const idNums = ids.map((id: any) => parseInt(id, 10))

        await prisma.camp.deleteMany({
            where: {
                id: {
                    in: idNums
                }
            }
        })

        return NextResponse.json({ success: true })
    } catch(err) {
        console.error('Error from API Deleting Multiple:', err)
        return
    }
}