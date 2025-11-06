import { prisma } from "@/prisma";
import { NextResponse } from "next/server";

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

    await prisma.camp.delete({
      where: { id: id }
    });

    return NextResponse.json({ message: "Camp deleted successfully" });
  } catch (err) {
    console.error("Error deleting camp:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}