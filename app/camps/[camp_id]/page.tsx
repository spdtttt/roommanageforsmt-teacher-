import RoomTable from "@/components/RoomTable";
import UnassignedStudentsButton from "@/components/UnassignedStudentsButton";
import { Suspense, useState } from "react";
import { BeatLoader } from "react-spinners";
import { prisma } from "@/prisma";
import { notFound } from "next/navigation";
import StatsCamp from "@/components/StatsCamp";

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
    const rooms = dbRooms.map((r: { id: any; member_ids: any; camp_id: any; }) => ({
        id: r.id,
        member_ids: r.member_ids,
        camp_id: r.camp_id ?? camp_id,
    }))
    return <RoomTable rooms={rooms} />
}

const CampDetails = async ({ params }: { params: Promise<{ camp_id: string }> }) => {
    const { camp_id } = await params;
    const camp_idNum = await parseInt(camp_id, 10)
    
    let assignedStudents: number[] = [];

    const campInfo = await prisma.camp.findUnique({ where: { id: camp_idNum } })
    if (!campInfo) {
        notFound();
    }

    const getMembers = async () => {
        try {
            const response = await prisma.room.findMany({
                where: {
                    camp_id: campInfo.id
                },
                select: {
                    member_ids: true
                }
            })

            assignedStudents = response.flatMap((r: { member_ids: any; }) => r.member_ids);
            console.log("Assigned Students:", assignedStudents)
        } catch(err) {
            console.error('Error from getMembers')
        }
    }

    await getMembers()

    return (
        <div className="w-full h-full flex flex-col">
            <header className="py-5 bg-white border-b border-[#e1e7ef] flex items-center justify-between px-6 lg:px-8 w-full">
                <div>
                    <h1 className="text-2xl font-bold text-black font-[Prompt]">{`${campInfo.title} ม.${campInfo.class === 409 ? '4/9' : campInfo.class === 509 ? '5/9' : '6/9'}`}</h1>
                    <p className="text-sm font-[Prompt] text-gray-500">จัดการห้องพักของนักเรียนในแต่ละรายการค่าย</p>
                </div>
            </header>

            <div className="p-6 lg:p-8">
                <UnassignedStudentsButton campId={camp_idNum} campInfo={campInfo} />
                <Suspense fallback={
                    <div className="flex justify-center items-center py-20">
                        <BeatLoader color="#5a5c7e" size={18} />
                    </div>
                }>
                    <StatsCamp assignedStudents={assignedStudents} campClass={campInfo.class!}/>
                    <RoomData params={{ camp_id }} />
                </Suspense>
            </div>
        </div>
    )
}
export default CampDetails