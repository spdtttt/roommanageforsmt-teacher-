import RoomTable from "@/components/RoomTable";
import UnassignedStudentsButton from "@/components/UnassignedStudentsButton";
import { Suspense } from "react";
import { BeatLoader } from "react-spinners";
import { prisma } from "@/prisma";
import { notFound } from "next/navigation";

export const revalidate = 0;

async function RoomData({
    params,
}: {
    params: { camp_id: string };
}) {
    const camp_id = parseInt(params.camp_id, 10)
    const dbRooms = await prisma.room.findMany({ 
        where: { 
            camp_id 
        },
        orderBy: {
            member_ids: 'asc'
        }
        
    })
    const rooms = dbRooms.map(r => ({
        id: r.id,
        member_ids: r.member_ids,
        camp_id: r.camp_id ?? camp_id,
    }))
    return <RoomTable rooms={rooms} />
}

const CampDetails = async ({ params }: { params: Promise<{ camp_id: string }>}) => {
    const  { camp_id } = await params;
    const camp_idNum = await parseInt(camp_id, 10)

    const campInfo = await prisma.camp.findUnique({ where: { id: camp_idNum } })
    if (!campInfo) {
        notFound();
    }

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

            <div className="mb-5">
                <UnassignedStudentsButton campId={camp_idNum} />
            </div>

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