import { prisma } from '@/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    const body = await req.json();
    const { ids } = body;
    const idNums = ids.map((id: any) => parseInt(id, 10));

    await prisma.student.deleteMany({
        where: {
            id: {
                in: idNums
            }
        }
    })

    return NextResponse.json({ success: true })
}