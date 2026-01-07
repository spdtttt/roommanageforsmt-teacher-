import { prisma } from "@/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: Request, context: { params: Promise<{ camp_id: string }> }) {
  try {
    const { camp_id } = await context.params;
    const id = parseInt(camp_id, 10);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const camp = await prisma.camp.findUnique({
      where: { id }
    });
    if (!camp) return NextResponse.json({ error: 'Camp not found' }, { status: 404 });

    return NextResponse.json(camp);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch camp' }, { status: 500 });
  }
}


export async function DELETE(req: Request, context: { params: Promise<{ camp_id: string }> }) {
  try {
    const { camp_id } = await context.params;
    const id = parseInt(camp_id, 10);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    await prisma.room.deleteMany({
      where: {
        camp_id: id
      }
    })

    await prisma.camp.delete({
      where: { id: id }
    });

    return NextResponse.json({ message: "Camp deleted successfully" });
  } catch (err) {
    console.error("Error deleting camp:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ camp_id: string }> }
) {
  try {
    const body = await request.json();
    const { title, class: classroom, dateStart, dateEnd, roomTypes } = body;

    const { camp_id } = await context.params;
    const id = parseInt(camp_id, 10);

    const updatedCamp = await prisma.camp.update({
      where: { id },
      data: {
        title,
        class: classroom,
        dateStart: new Date(dateStart),
        dateEnd: new Date(dateEnd),
        roomTypes: roomTypes
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedCamp
    })
  } catch (err) {
    console.error('Error Update Data:', err);
    return NextResponse.json(
      { error: 'ไม่สามารถอัพเดทได้' },
      { status: 500 }
    )
  }
}