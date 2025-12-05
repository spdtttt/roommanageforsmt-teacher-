import StatCard from "./StatCard"
import { prisma } from '@/prisma'

const StatsCamp = async (
    { assignedStudents, campClass }: { assignedStudents: number[], campClass: number }
) => {
    const students = await prisma.student.findMany({
        where: {
            class: campClass
        }
    })

    const totalStudents = students.length;
    const assignedCount = assignedStudents.length;
    const unAssignedCount = totalStudents - assignedCount;
    const percent = totalStudents === 0 
                    ? 0
                    : ((assignedCount/totalStudents)*100).toFixed(2);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard title="นักเรียนทั้งหมด" value={totalStudents} variant="primary" />
            <StatCard title="นักเรียนที่บันทึกแล้ว" value={`${assignedCount} คน`} variant="default" />
            <StatCard title="นักเรียนที่ไม่ได้บันทึก" value={`${unAssignedCount} คน`} variant="default" />
            <StatCard title="เปอร์เซ็นต์" value={`${percent} %`} variant="default" />
        </div>
    )
}

export default StatsCamp
