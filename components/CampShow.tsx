'use client'
import Link from "next/link";
import { useEffect } from "react";

interface Camp {
    id: number;
    title: string;
    class: number;
    date: string;
    max: number;
}

const CampShow = ({ camps }: { camps : Camp[] }) => {
    return (
        <>
            {camps.length === 0 ? (
                <div className="text-gray-500 text-lg flex justify-center">ยังไม่มีรายการค่าย คลิกปุ่ม + เพื่อเพิ่ม</div>
            ) : (
                // Grid responsive: 1 col (mobile), 2 cols (tablet), 3 cols (desktop)
                <div className="flex justify-center">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8 lg:gap-10 justify-items-center md:justify-items-stretch w-full">
                        {camps.map((item: Camp) => (
                            <div
                                key={item.id}
                                className="w-full border-2 border-gray-300 rounded-3xl px-4 py-3 sm:px-5 md:py-7 duration-300 hover:scale-105 flex flex-col max-w-md md:max-w-none"
                            >
                                {/* Font size responsive */}
                                <h1 className="text-xl sm:text-2xl mb-2" style={{
                                    fontFamily: 'Mitr, sans-serif',
                                    fontWeight: '500'
                                }}>{item.title}</h1>

                                <p className="text-sm sm:text-base text-gray-500">ห้อง: {item.class === 409 ? '4/9' : item.class === 509 ? '5/9' : '6/9'}</p>
                                <p className="text-sm sm:text-base text-gray-500">จำนวนคนต่อห้อง: {item.max}</p>
                                <p className="text-sm sm:text-base text-gray-500">วันที่: {new Date(item.date).toLocaleDateString("th-TH", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric"
                                })}</p>

                                <div className="flex justify-end mt-auto pt-3">
                                    <Link
                                        href={`/camps/${item.id}`}
                                        className="text-base sm:text-lg hover:underline cursor-pointer"
                                        style={{
                                            fontFamily: 'Mitr, sans-serif',
                                        }}
                                    >
                                        คลิก
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    )
}
export default CampShow