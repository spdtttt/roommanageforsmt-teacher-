import { prisma } from "@/prisma"
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET() {
    const camps = await prisma.camp.findMany();
    return NextResponse.json(camps);
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title, classroom, date, max } = body;

        if (!title || !classroom || !date || !max) {
            return NextResponse.json({ error: 'Missing or invalid data' }, { status: 400 })
        }

        const newCamp = await prisma.camp.create({
            data: {
                title: title,
                class: classroom,
                date: date,
                max: max
            }
        })

        revalidatePath('/')
        revalidatePath('/rooms')

        return NextResponse.json({ message: 'Camp created successfully', newCamp });
    } catch(err) {
        console.error('Error From API Camp Add: ', err)
        return
    }
}