import CampShow from "@/components/CampShow";
import { Suspense } from "react";
import { BeatLoader } from "react-spinners";

const URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

async function CampData() {
  const response = await fetch(`${URL}/api/camps`, {
    cache: 'no-store'
  });
  const camps = await response.json();
  console.log('Fetch Camp: ', camps);

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