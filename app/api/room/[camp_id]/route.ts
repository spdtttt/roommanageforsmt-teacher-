import { prisma } from '@/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request, context: { params: Promise<{ camp_id: string }> }) {
    const { camp_id } = await context.params;
    const camp_idNum = await parseInt(camp_id, 10);

    const rooms = await prisma.room.findMany({
      where: { camp_id: camp_idNum },
    });

    return NextResponse.json(rooms)
}