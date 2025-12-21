import {prisma} from "@/prisma";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET() {
    const students = await prisma.student.findMany();
    return NextResponse.json(students);
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { student_id, national_id, name, gender, classroom } = body;

        if (!student_id || !national_id || !name || !gender || !classroom) {
            return NextResponse.json({ error: 'Missing or invalid data' }, { status: 400 })
        }

        const newCamp = await prisma.student.create({
            data: {
                student_id: student_id,
                national_id: String(national_id),
                name: name,
                gender: gender,
                class: classroom
            }
        })

        revalidatePath('/students')

        return NextResponse.json({ message: 'Student created successfully' });
    } catch(err) {
        console.error('Error From API Student Add: ', err)
        return
    }
}
