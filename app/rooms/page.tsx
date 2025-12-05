import CampShow from "@/components/CampShow";
import { Suspense } from "react";
import { BeatLoader } from "react-spinners";
import { prisma } from "@/prisma";

export const revalidate = 0;

async function CampData() {
  const dbCamps = await prisma.camp.findMany();
  const camps = dbCamps.map(c => ({
    id: c.id,
    title: c.title ?? '',
    class: c.class ?? 0,
    date: (c.date ?? new Date()).toISOString(),
    max: c.max ?? 0,
  }));
  return <CampShow camps={camps} />
}

const RoomPage = () => {
  return (
    <div className="w-full h-full flex flex-col">
      <header className="py-5 bg-white border-b border-[#e1e7ef] flex items-center justify-between px-6 lg:px-8 w-full">
        <div>
          <h1 className="text-2xl font-bold text-black font-[Prompt]">รายการห้องพัก</h1>
          <p className="text-sm font-[Prompt] text-gray-500">จัดการห้องพักของนักเรียนในแต่ละรายการค่าย</p>
        </div>
      </header>

      <Suspense fallback={
        <div className="flex justify-center mt-30">
          <BeatLoader color="#5a5c7e" size={18} />
        </div>
      }>
        <CampData />
      </Suspense>
    </div>
  )
}
export default RoomPage