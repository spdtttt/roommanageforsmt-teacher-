import {prisma} from "@/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { camp_id, member_ids } = body;

        // เช็คว่ามีข้อมูลครบหรือไม่
        if (!camp_id || !member_ids || !Array.isArray(member_ids)) {
            return NextResponse.json(
                { error: "Missing or invalid camp_id or member_ids" },
                { status: 400 }
            );
        }

        // แปลงเป็น number array
        const validMemberIds = member_ids
            .map((id: any) => {
                const numId = typeof id === 'string' ? parseInt(id, 10) : id;
                return numId;
            })
            .filter((id: number) => !isNaN(id) && id > 0);

        if (validMemberIds.length === 0) {
            return NextResponse.json(
                { error: "No valid member IDs provided" },
                { status: 400 }
            );
        }

        // ดึง Room ทั้งหมดของ camp_id นี้
        const rooms = await prisma.room.findMany({
            where: { camp_id: parseInt(camp_id, 10) },
        });

        // รวม member_ids ที่มีอยู่แล้ว
        const existingMembers = rooms.flatMap((room) => room.member_ids);

        // เช็คว่า member_ids ที่ส่งมาซ้ำหรือไม่
        const duplicateMembers = validMemberIds.filter((id: number) =>
            existingMembers.includes(id)
        );

        if (duplicateMembers.length > 0) {
            // ถ้ามีซ้ำ ส่ง error กลับ
            return NextResponse.json(
                { error: "Some members are already assigned", duplicateMembers },
                { status: 400 }
            );
        }

        // ถ้าไม่มีซ้ำ ให้สร้าง room ใหม่
        const room = await prisma.room.create({
            data: {
                camp_id: parseInt(camp_id, 10),
                member_ids: validMemberIds, // ใช้ array ที่แปลงเป็น number แล้ว
            },
        });

        return NextResponse.json(room);
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Failed to save room" },
            { status: 500 }
        );
    }
}