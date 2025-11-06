'use server'
import CampList from "@/components/CampList"

const URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

const CampPage = async () => {
  const response = await fetch(`${URL}/api/camps`, {
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