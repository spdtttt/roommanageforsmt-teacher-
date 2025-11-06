'use server'
import CampList from "@/components/CampList"
import { prisma } from "@/prisma";

const CampPage = async () => {
  const dbCamps = await prisma.camp.findMany();
  const Camps = dbCamps.map(c => ({
    id: c.id,
    title: c.title ?? '',
    class: c.class ?? 0,
    date: (c.date ?? new Date()).toISOString(),
    max: c.max ?? 0,
  }));

  return (
    <div className="mt-10">
      <div className="mb-3" style={{
        fontFamily: 'Mitr, sans-serif',
        fontWeight: '500',
        fontSize: '40px'
      }}>รายการค่าย & กิจกรรมทั้งหมด</div>

      <div style={{
        width: '85%',
        height: '1.5px',
        backgroundColor: '#c7c7c7',
        marginBottom: '30px'
      }}></div>

      <CampList Camps={Camps} />
    </div>
  )
}
export default CampPage