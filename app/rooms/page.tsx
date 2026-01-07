import CampShow from "@/components/CampShow";
import { Suspense } from "react";
import { BeatLoader } from "react-spinners";
import { prisma } from "@/prisma";

export const revalidate = 0;

async function CampData() {
  const dbCamps = await prisma.camp.findMany();

  const campsWithData = await Promise.all(
    dbCamps.map(async (camp) => {
      // ดึงทุกห้องของค่ายนี้
      const rooms = await prisma.room.findMany({
        where: {
          camp_id: camp.id,
        },
        select: {
          member_ids: true,
        },
      });

      // รวมจำนวนสมาชิกทั้งหมด
      const assignedStudents = rooms.reduce(
        (sum, room) => sum + room.member_ids.length,
        0
      );

      // นักเรียนทั้งหมดในห้องเรียนนั้นๆ
      const classStudents = await prisma.student.findMany({
        where: {
          class: camp.class,
        },
      });

      // หาจำนวนนักเรียนทั้งหมดและคิดค่า %
      const countStudents = classStudents.length;
      const percentage = camp.roomTypes
        ? (assignedStudents / countStudents) * 100
        : 0;

      return {
        id: camp.id,
        title: camp.title ?? "ไม่ระบุชื่อค่าย",
        class: camp.class ?? 0,
        roomTypes: camp.roomTypes ?? 0,
        dateStart: camp.dateStart ? camp.dateStart.toISOString() : "",
        dateEnd: camp.dateEnd ? camp.dateEnd.toISOString() : "",
        percentage: Math.round(percentage * 100) / 100, 
      };
    })
  );
  return <CampShow camps={campsWithData} />;
}

const RoomPage = () => {
  return (
    <div className="w-full h-full flex flex-col">
      <header className="py-5 bg-white border-b border-[#e1e7ef] flex items-center justify-between px-6 lg:px-8 w-full">
        <div>
          <h1 className="text-2xl font-bold text-black font-[Prompt]">
            รายการห้องพัก
          </h1>
          <p className="text-sm font-[Prompt] text-gray-500">
            จัดการห้องพักของนักเรียนในแต่ละรายการค่าย
          </p>
        </div>
      </header>

      <Suspense
        fallback={
          <div className="flex justify-center items-center py-20">
            <BeatLoader color="#5a5c7e" size={18} />
          </div>
        }
      >
        <CampData />
      </Suspense>
    </div>
  );
};
export default RoomPage;
