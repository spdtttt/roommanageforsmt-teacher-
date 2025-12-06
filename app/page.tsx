import CampList from "@/components/CampList"
import { prisma } from "@/prisma";
import { Suspense } from "react";
import { BeatLoader } from "react-spinners";

export const revalidate = 0;

const CampPage = async () => {
  const dbCamps = await prisma.camp.findMany();
  const Camps = dbCamps.map(c => ({
    id: c.id,
    title: c.title ?? '',
    class: c.class ?? 0,
    date: (c.date ?? new Date()).toISOString(),
    max: c.max ?? 0,
  }));

  const dbStudents = await prisma.room.findMany({
    select: {
      member_ids: true,
    }
  });

  // รวม member_ids ทั้งหมดให้อยู่ใน array เดียวกัน (แค่ตัวเลขทั้งหมด)
  const allMemberIds = dbStudents.flatMap(r => r.member_ids ?? []);

  return (
    <div className="w-full h-full flex flex-col">
      <header className="py-5 bg-white border-b border-[#e1e7ef] flex items-center justify-between px-6 lg:px-8 w-full">
        <div>
          <h1 className="text-2xl font-bold text-black font-[Prompt]">รายการค่าย & กิจกรรม</h1>
          <p className="text-sm font-[Prompt] text-gray-500">จัดการกิจกรรมและค่ายต่างๆ ของห้องเรียน S.M.T โรงเรียนเมืองสุราษฎร์ธานี</p>
        </div>
      </header>
      
      <Suspense fallback={
        <div className="flex justify-center mt-30">
          <BeatLoader color="#5a5c7e" size={18} />
        </div>
      }>
        <CampList Camps={Camps} Students={allMemberIds} />
      </Suspense>
    </div>
  )
}
export default CampPage