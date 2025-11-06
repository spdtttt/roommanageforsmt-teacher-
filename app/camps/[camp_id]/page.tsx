import RoomTable from "@/components/RoomTable";
import { Suspense } from "react";
import { BeatLoader } from "react-spinners";

const URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

async function RoomData({
    params,
}: {
    params: { camp_id: string };
}) {
    const camp_id = parseInt(params.camp_id, 10)
    console.log("Camp ID: ", camp_id)
    const response = await fetch(`${URL}/api/room/${camp_id}`, {
        cache: 'no-store'
    });
    const rooms = await response.json();
    console.log('Fetch Room: ', rooms);

    return <RoomTable rooms={rooms} />
}

const CampDetails = async ({ params }: { params: Promise<{ camp_id: string }>}) => {
    const  { camp_id } = await params;
    const camp_idNum = await parseInt(camp_id, 10)

    const response = await fetch(`${URL}/api/camps/${camp_idNum}`, {
        cache: 'no-store'
    })

    const campInfo = await response.json();

    return (
        <div className="px-4 sm:px-8 md:px-15 mt-8">
            <div className="mb-3" style={{
                fontFamily: 'Mitr, sans-serif',
                fontWeight: '500',
                fontSize: '40px'
            }}>{campInfo.title} {campInfo.class === 409 ? 'ม.4/9' : campInfo.class === 509 ? 'ม.5/9' : 'ม.6/9'}</div>

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
                <RoomData params={{ camp_id }}/>
            </Suspense>
        </div>
    )
}
export default CampDetails