import StudentList from "@/components/StudentList"
import { prisma } from "@/prisma";

const StudentPage = async () => {
  const dbStudents = await prisma.student.findMany();
  const Students = dbStudents.map(s => ({
    id: s.id,
    student_id: s.student_id,
    name: s.name ?? '',
    gender: s.gender ?? '',
    class: s.class ?? 0,
  }));

  return (
    <div className="mt-10">
      <div>
        <h1 className="text-2xl md:text-4xl" style={{
          fontFamily: 'Mitr, sans-serif',
          fontWeight: '500'
        }}>รายชื่อนักเรียนทั้งหมด</h1>
      </div>
      
      <StudentList Students={Students} />
    </div>
  )
}
export default StudentPage