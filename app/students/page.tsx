import StudentList from "@/components/StudentList"
import { prisma } from "@/prisma";
import { Suspense } from "react";
import { BeatLoader } from "react-spinners";

export const revalidate = 0;

const StudentPage = async () => {
  const dbStudents = await prisma.student.findMany({
    orderBy: [
      { class: 'asc' },
      { gender: 'desc' },
      { student_id: 'asc' },
    ]
  });
  const Students = dbStudents.map(s => ({
    id: s.id,
    student_id: s.student_id,
    name: s.name ?? '',
    gender: s.gender ?? '',
    class: s.class ?? 0,
  }));

  return (
    <div className="w-full h-full flex flex-col">
      <header className="py-5 bg-white border-b border-[#e1e7ef] flex items-center justify-between px-6 lg:px-8 w-full">
        <div>
          <h1 className="text-2xl font-bold text-black font-[Prompt]">รายชื่อนักเรียนในระบบ</h1>
          <p className="text-sm font-[Prompt] text-gray-500">จัดการ/เพิ่ม/ลบ รายชื่อนักเรียน S.M.T. ในระบบ</p>
        </div>
      </header>
      <Suspense fallback={
        <div className="flex justify-center items-center py-20">
          <BeatLoader color="#5a5c7e" size={18} />
        </div>
      }>
        <StudentList Students={Students} />
      </Suspense>
    </div>
  )
}
export default StudentPage