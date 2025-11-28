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

    // ดึงข้อมูลห้องทั้งหมดในค่ายนี้
    const rooms = await prisma.room.findMany({
      where: { camp_id: campIdNum },
    });

    // รวม member_ids ทั้งหมดจากทุกห้อง
    const assignedStudentIds = new Set<number>();
    rooms.forEach((room) => {
      room.member_ids.forEach((id) => {
        assignedStudentIds.add(id);
      });
    });

    // ดึงข้อมูลนักเรียนทั้งหมดที่มี class ตรงกับค่าย
    const allStudents = await prisma.student.findMany({
      where: {
        class: camp.class ?? undefined,
      },
      orderBy: {
        student_id: "asc",
      },
    });

    // กรองเฉพาะนักเรียนที่ยังไม่ได้ลงบันทึกห้องพัก
    const unassignedStudents = allStudents.filter(
      (student) => !assignedStudentIds.has(student.id)
    );

    return NextResponse.json(unassignedStudents);
  } catch (err) {
    console.error("Error fetching unassigned students:", err);
    return NextResponse.json(
      { error: "Failed to fetch unassigned students" },
      { status: 500 }
    );
  }
}

