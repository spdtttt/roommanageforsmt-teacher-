'use server'
import CampList from "@/components/CampList"
import { prisma } from "@/prisma";

const CampPage = async () => {
  const response = await fetch(`${process.env.NEXT_URL}/api/camps`, {
    cache: 'no-store'
  });
  const Camps = await response.json();

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