import StudentList from "@/components/StudentList"
import { prisma } from "@/prisma";

export const revalidate = 0;

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
      <div className="mb-3" style={{
        fontFamily: 'Mitr, sans-serif',
        fontWeight: '500',
        fontSize: '40px'
      }}>รายชื่อนักเรียนทั้งหมด</div>

      <div style={{
        width: '85%',
        height: '1.5px',
        backgroundColor: '#c7c7c7',
        marginBottom: '30px'
      }}></div>
      
      <StudentList Students={Students} />
    </div>
  )
}
export default StudentPage