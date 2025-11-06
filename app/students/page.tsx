import StudentList from "@/components/StudentList"

const StudentPage = async () => {
  const response = await fetch(`${process.env.NEXT_URL}/api/students`);
  const Students = await response.json();

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