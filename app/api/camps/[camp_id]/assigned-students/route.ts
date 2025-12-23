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

        // Map assigned students by ID for quick lookup
        const studentMap = new Map<number, any>();
        assignedStudents.forEach((student) => {
            studentMap.set(student.id, student);
        });

        // Construct the response: Rooms with their Students
        const roomsWithStudents = rooms.map((room) => {
            const studentsInRoom = room.member_ids
                .map((studentId) => studentMap.get(studentId))
                .filter((student) => student !== undefined) // Filter out any missing students
                .sort((a, b) => {
                    // Sort by gender (Male first usually, or based on requirement) then student_id
                    // Assuming 'นาย' or 'Male' like string comparison if gender is string
                    // Let's just stick to student_id or name sort for consistency within room if not specified
                    // Original code sorted by gender desc, student_id asc globally.
                    // Let's sort within room by gender desc, student_id asc
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

        // Filter out rooms with no students if desired? 
        // Logic says "Assigned Students", so maybe only rooms that actally have students?
        // But the button is "Assigned Students", maybe it implies "List of Assignments".
        // Let's return only rooms that have at least one student, or maybe all rooms?
        // User request: "print รายการห้องพักของนักเรียน" -> Rooms of students.
        // If a room is empty, it's not a "room of students".
        // Let's keep all rooms for completeness, or just filter. 
        // Given "AssignedStudentsButton", let's return only rooms with students.

        const meaningfulRooms = roomsWithStudents.filter(r => r.students.length > 0);

        return NextResponse.json(meaningfulRooms);
    } catch (err) {
        console.error("Error fetching assigned students:", err);
        return NextResponse.json(
            { error: "Failed to fetch assigned students" },
            { status: 500 }
        );
    }
}