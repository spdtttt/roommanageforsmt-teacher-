import CampShow from "@/components/CampShow";
import { Suspense } from "react";
import { BeatLoader } from "react-spinners";
import { prisma } from "@/prisma";

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
    <div className="mt-10">
      <div className="mb-3" style={{
        fontFamily: 'Mitr, sans-serif',
        fontWeight: '500',
        fontSize: '40px'
      }}>ค่ายทั้งหมด</div>

      <div style={{
        width: '85%',
        height: '1.5px',
        backgroundColor: '#c7c7c7',
        marginBottom: '30px'
      }}></div>

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