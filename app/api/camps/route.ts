import { prisma } from "@/prisma"
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET() {
    const camps = await prisma.camp.findMany({
        orderBy: {
            id: 'asc'
        }
    });
    return NextResponse.json(camps);
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title, classroom, dateStart, dateEnd, roomTypes } = body;

        if (!title || !classroom || !dateStart || !dateEnd || !roomTypes) {
            return NextResponse.json({ error: 'Missing or invalid data' }, { status: 400 })
        }

        const newCamp = await prisma.camp.create({
            data: {
                title: title,
                class: classroom,
                dateStart: new Date(dateStart),
                dateEnd: new Date(dateEnd),
                roomTypes: roomTypes
            }
        })

        revalidatePath('/')
        revalidatePath('/rooms')

        return NextResponse.json({ message: 'Camp created successfully', newCamp });
    } catch (err) {
        console.error('Error From API Camp Add: ', err)
        return
    }
}