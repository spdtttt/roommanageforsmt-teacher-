import { prisma } from '@/prisma'
import { NextResponse } from 'next/server'

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        const idNum = await parseInt(id, 10);

        await prisma.room.delete({
            where: {
                id: idNum
            }
        })

        return NextResponse.json({ message: 'Room deleted successfully' })
    } catch(err) {
        console.error("Error deleting room:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}