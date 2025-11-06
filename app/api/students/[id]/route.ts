import { prisma } from "@/prisma";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const studentID = parseInt(id, 10);

    if (isNaN(studentID)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    await prisma.student.delete({
      where: { id: studentID }
    });

    return NextResponse.json({ message: "Student deleted successfully" });
  } catch (err) {
    console.error("Error deleting student:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}