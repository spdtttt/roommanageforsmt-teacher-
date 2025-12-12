'use client'
import { useEffect, useState } from 'react'
import { BeatLoader } from 'react-spinners'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Trash, MousePointerClick } from 'lucide-react';

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
    const [loading, setLoading] = useState(false)
    const [isSelected, setIsSelected] = useState(false)
    const [selectedDelete, setSelectedDelete] = useState<number[]>([]);

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

    const handleCheck = (id: number) => {
        setSelectedDelete((prev) => prev.includes(id)
            ? prev.filter((item) => item !== id)
            : [...prev, id]
        );
    };

    const handleSelectDeleted = async () => {
        setLoading(true);
        try {
            if (selectedDelete.length === 0) return;

            const yesno = confirm("ต้องการลบค่ายที่เลือกจริงๆหรือไม่?")
            if (!yesno) {
                return
            }

            const resp = await fetch('/api/room/delete-multiple', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: selectedDelete })
            })

            if (!resp.ok) {
                throw new Error('Failed to delete selected rooms')
            }
        } catch (err) {
            console.error('Error deleting rooms camps:', err)
            alert('เกิดข้อผิดพลาดในการลบข้อมูล')
        } finally {
            setLoading(false)
            setIsSelected(false);
            setSelectedDelete([]);
            window.location.reload()
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm('ต้องการลบห้องนี้จริงๆหรือไม่')) return
        setLoading(true);

        try {
            const response = await fetch(`/api/room/delete/${id}`, {
                method: 'DELETE'
            })

            if (!response.ok) {
                throw new Error('Failed to delete room')
            }

            const result = await response.json()
            console.log(result.message)
        } catch (err) {
            console.error("Error deleting room:", err);
            alert("เกิดข้อผิดพลาดในการลบข้อมูล");
        } finally {
            setLoading(false);
            window.location.reload()
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
        <div>
            <div className="flex justify-between mb-4 items-center">
                <div className='font-[Prompt] text-xl font-bold text-gray-500'>
                    นักเรียนที่บันทึกห้องพักแล้ว :
                </div>
                <div className='flex gap-4'>
                    <div
                        onClick={() => setIsSelected(!isSelected)}
                        className="flex font-[Prompt] cursor-pointer text-white bg-yellow-500 hover:bg-yellow-600 p-2 sm:p-3 items-center rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 gap-2 font-bold"
                    >
                        <MousePointerClick className="w-5 h-5" />
                        <span>{!isSelected ? 'เลือก' : 'ยกเลิก'}</span>
                    </div>
                    <div
                        className={`${isSelected ? 'block' : 'hidden'} font-[Prompt] text-white bg-red-500 hover:bg-red-600 font-bold p-2 sm:p-3 rounded-lg flex items-center shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 gap-2 cursor-pointer`}
                        onClick={handleSelectDeleted}
                    >
                        <Trash className="w-5 h-5" />
                        <span>ลบรายการที่เลือก</span>
                    </div>
                    <div className={`${isSelected ? 'block' : 'hidden'} flex items-center`}>
                        <input
                            type="checkbox"
                            checked={rooms.length > 0 && selectedDelete.length === rooms.length}
                            onChange={(e) => {
                                if (e.target.checked) {
                                    setSelectedDelete(rooms.map((c: any) => c.id))
                                } else {
                                    setSelectedDelete([])
                                }
                            }}
                            className="w-[45px] h-[45px] cursor-pointer"
                        />
                    </div>
                </div>
            </div>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="Rooms Table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" style={{ fontFamily: 'Prompt', width: '100px', color: '#65758b', fontWeight: 'bold', fontSize: '17px' }}>ที่</TableCell>
                            <TableCell align="left" style={{ fontFamily: 'Prompt', width: '500px', color: '#65758b', fontWeight: 'bold', fontSize: '17px' }}>สมาชิก</TableCell>
                            <TableCell align="center" style={{ fontFamily: 'Prompt', color: '#65758b', fontWeight: 'bold', fontSize: '17px', width: '200px' }}>จัดการ</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rooms.map((room: Room, index) => (
                            <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell align="center" style={{ fontFamily: 'Prompt', color: '#65758b', fontSize: '15px' }} component="th" scope="row">{index + 1}</TableCell>
                                <TableCell align="left" style={{ fontFamily: 'Prompt', color: 'black', fontSize: '15px' }}>
                                    {room.member_ids.map((memberId: number) => (
                                        <div key={memberId}>{idToName[memberId] ?? memberId}</div>
                                    ))}
                                </TableCell>
                                <TableCell align="center" style={{ fontFamily: 'Prompt', color: 'black', fontSize: '15px' }}>
                                    {isSelected ? (
                                        <div className="flex justify-center items-center">
                                            <input type="checkbox" checked={selectedDelete.includes(room.id)} onChange={() => handleCheck(room.id)} className="w-[33px] h-[33px] bg-white border-2 rounded checked:bg-[#0e327a] cursor-pointer" />
                                        </div>
                                    ) : (
                                        <div className="flex justify-center gap-2">
                                            <button onClick={() => handleDelete(room.id)} className="gap-3 items-center flex px-2 py-1 md:py-1.5 md:px-3 text-sm md:text-base bg-red-500 text-white hover:bg-red-600 rounded cursor-pointer transition-all duration-300">
                                                <Trash className='' />
                                                <span>ลบ</span>
                                            </button>
                                        </div>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}
export default RoomTable