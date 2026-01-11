import { prisma } from "@/prisma";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    context: { params: Promise<{ camp_id: string }> }
) {
    try {
        const { camp_id } = await context.params;
        const campIdNum = parseInt(camp_id, 10);

        if (isNaN(campIdNum)) {
            return NextResponse.json({ error: "Invalid camp ID" }, { status: 400 });
        }

        // ดึงข้อมูลค่าย
        const camp = await prisma.camp.findUnique({
            where: { id: campIdNum },
        });

        if (!camp) {
            return NextResponse.json({ error: "Camp not found" }, { status: 404 });
        }

        // ดึงข้อมูลห้องทั้งหมดในค่ายนี้ พร้อม member_ids
        const rooms = await prisma.room.findMany({
            where: { camp_id: campIdNum },
            select: {
                id: true,
                member_ids: true,
                note: true,
            },
            orderBy: {
                id: 'asc',
            }
        });

        // รวม student ids ทั้งหมดที่ถูก assign แล้ว
        const assignedStudentIds = new Set(
            rooms.flatMap(room => room.member_ids)
        );

        // ดึงข้อมูลนักเรียนที่ถูก assign แล้ว
        const assignedStudents = await prisma.student.findMany({
            where: {
                id: { in: Array.from(assignedStudentIds) },
            },
        });

        const studentMap = new Map<number, any>();
        assignedStudents.forEach((student) => {
            studentMap.set(student.id, student);
        });

        const roomsWithStudents = rooms.map((room) => {
            const studentsInRoom = room.member_ids
                .map((studentId) => studentMap.get(studentId))
                .filter((student) => student !== undefined)
                .sort((a, b) => {
                    if (a.gender !== b.gender) {
                        return (b.gender || "").localeCompare(a.gender || "");
                    }
                    return a.student_id - b.student_id;
                });

            return {
                id: room.id,
                note: room.note,
                students: studentsInRoom,
            };
        });

        const meaningfulRooms = roomsWithStudents.filter(r => r.students.length > 0);

        meaningfulRooms.sort((a, b) => {
            const genderA = a.students[0]?.gender || "";
            const genderB = b.students[0]?.gender || "";

            return genderB.localeCompare(genderA);
        });

        return NextResponse.json(meaningfulRooms);
    } catch (err) {
        console.error("Error fetching assigned students:", err);
        return NextResponse.json(
            { error: "Failed to fetch assigned students" },
            { status: 500 }
        );
    }
}