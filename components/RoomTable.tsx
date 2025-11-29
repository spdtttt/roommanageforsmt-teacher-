'use client'

import { useEffect, useState } from 'react'
import { BeatLoader } from 'react-spinners'

interface Room {
    id: number;
    member_ids: number[];
    camp_id: number;
}

interface Student {
    id: number;
    name: string | null;
}

const RoomTable = ({ rooms }: { rooms: Room[] }) => {
    const [idToName, setIdToName] = useState<Record<number, string>>({})
    const [loading, setLoading] = useState(true)
    const [availableStudent, setAvailableStudent] = useState([]);

    useEffect(() => {
        let isMounted = true
        const fetchStudents = async () => {
            try {
                const res = await fetch('/api/students', { cache: 'no-store' })
                if (res.ok) {
                    const students: Student[] = await res.json()
                    if (!isMounted) return
                    const map: Record<number, string> = {}
                    for (const s of students) {
                        if (typeof s.id === 'number') {
                            map[s.id] = s.name ?? ''
                        }
                    }
                    setIdToName(map)
                }
            } catch {
                // noop
            } finally {
                if (isMounted) setLoading(false)
            }
        }
        fetchStudents()
        return () => { isMounted = false }
    }, [])

    async function handleDelete(id: number) {
        if(!confirm('ต้องการลบห้องนี้จริงๆหรือไม่')) return

        try {
            const response = await fetch(`/api/room/delete/${id}`, {
                method: 'DELETE'
            })

            if (!response.ok) {
                throw new Error('Failed to delete room')
            }

            const result = await response.json()
            console.log(result.message)

            window.location.reload();
        } catch(err) {
            console.error("Error deleting room:", err);
            alert("เกิดข้อผิดพลาดในการลบข้อมูล");
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center mt-30">
                <BeatLoader color="#5a5c7e" size={18} />
            </div>
        )
    }

    return (
        <div className="mt-5 overflow-x-auto">
            <table className="min-w-full text-sm md:text-base border-collapse border">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border p-2">ที่</th>
                        <th className="border p-2">สมาชิก</th>
                        <th className="border p-2">จัดการ</th>
                    </tr>
                </thead>
                <tbody>
                    {rooms.map((item: Room, index: number) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                            <td className="border p-2 md:p-3 text-center">{index + 1}</td>
                            <td className="border p-2 md:p-3">
                                {Array.isArray(item.member_ids)
                                    ? item.member_ids.map((memberId: number) => (
                                        <div key={memberId}>{idToName[memberId] ?? memberId}</div>
                                    ))
                                    : item.member_ids}
                            </td>
                            <td className="md:p-3 p-2 text-center">
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="px-2 py-1 md:py-1.5 md:px-3 text-sm md:text-base bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
                                >
                                    ลบ
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
export default RoomTable