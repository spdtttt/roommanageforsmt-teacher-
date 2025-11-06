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
      <div>
        <h1 className="text-2xl md:text-4xl" style={{
          fontFamily: 'Mitr, sans-serif',
          fontWeight: '500'
        }}>รายการค่าย & กิจกรรมทั้งหมด</h1>
      </div>

      <CampList Camps={Camps} />
    </div>
  )
}
export default CampPage