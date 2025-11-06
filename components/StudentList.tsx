'use client'
import { useState } from "react"
import { FaCirclePlus } from "react-icons/fa6"
import Select, { SingleValue } from "react-select"

type Student = {
    id: number;
    student_id: number;
    name: string;
    gender: string;
    class: number;
}

type StudentListProps = {
    Students: Student[];
}

interface AddModalProps {
    isOpen: boolean;
    onClose: () => void;
    formData: {
        student_id: string;
        name: string;
        gender: string;
        class: number;
    };
    setFormData: React.Dispatch<React.SetStateAction<{
        student_id: string;
        name: string;
        gender: string;
        class: number;
    }>>;
    onSubmit: (e: React.FormEvent) => void;
}

const optionsClass = [
    { value: 409, label: '4/9' },
    { value: 509, label: '5/9' },
    { value: 609, label: '6/9' },
]

const optionsGender = [
    { value: 'male', label: 'ชาย' },
    { value: 'female', label: 'หญิง' },
]

const AddModal = ({ isOpen, onClose, formData, setFormData, onSubmit }: AddModalProps) => {
    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(e);
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50 p-5"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
            onClick={onClose} // ปิด modal เมื่อคลิกพื้นหลัง
        >
            <div
                className="bg-white px-10 py-6 rounded-lg w-full max-w-md"
                onClick={(e) => e.stopPropagation()} // ป้องกันการปิด modal เมื่อคลิกภายใน
            >
                <h2
                    className="text-3xl font-semibold mb-4"
                    style={{ fontFamily: 'Mitr, sans-serif' }}
                >
                    เพิ่มนักเรียน
                </h2>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium mb-1">รหัสนักเรียน</label>
                        <input
                            type="text"
                            name="studentID"
                            value={formData.student_id || ""}
                            onChange={(e) =>
                                setFormData({ ...formData, student_id: e.target.value })
                            }
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="กรอกรหัสนักเรียน"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">ชื่อ</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                            }
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="กรอกชื่อ"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">เพศ</label>
                        <Select
                            options={optionsGender}
                            value={optionsGender.find(o => o.value === formData.gender)}
                            onChange={(selectedOption =>
                                setFormData({ ...formData, gender: selectedOption ? selectedOption.value : '' })
                            )}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">ห้อง</label>
                        <Select
                            options={optionsClass}
                            value={optionsClass.find(o => o.value === formData.class)}
                            onChange={(selectedOption =>
                                setFormData({ ...formData, class: selectedOption ? selectedOption.value : Number('') })
                            )}
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border rounded-md hover:bg-gray-100 transition-colors"
                        >
                            ยกเลิก
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                        >
                            บันทึก
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

const StudentList = ({ Students }: StudentListProps) => {
    const [filterClass, setFilterClass] = useState('all')
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        student_id: '',
        name: '',
        gender: '',
        class: Number(''),
    })

    function onClose() {
        setIsModalOpen(false);
        setFormData({
            student_id: '',
            name: '',
            gender: '',
            class: Number(''),
        })
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!formData.student_id || !formData.name || !formData.gender || !formData.class) {
            alert('กรุณากรอกข้อมูลให้ครบถ้วน')
            return
        }

        if (isNaN(Number(formData.student_id))) {
            alert('รหัสนักเรียนต้องเป็นตัวเลข')
            return
        }

        const exists = Students.some(s => (s.name === formData.name && s.class === formData.class) || s.student_id === Number(formData.student_id));
        if (exists) {
            alert('มีข้อมูลนี้ในระบบแล้ว');
            return
        }

        const dataToSend = {
            student_id: Number(formData.student_id),
            name: formData.name,
            gender: formData.gender,
            classroom: formData.class
        }

        try {
            const response = await fetch(`/api/students`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataToSend)
            });

            if (!response.ok) {
                throw new Error('Failed to create student');
            }

            const result = await response.json();
            console.log('Success:', result)

        } catch (err) {
            console.error('Error fetch API Add Student: ', err)
        } finally {
            onClose()
            window.location.reload();
        }
    }

    async function handleDelete(id: number) {
        if (!confirm('ต้องการลบนักเรียนคนนี้จริงหรือไม่')) return

        try {
            const response = await fetch(`/api/students/${id}`, {
                method: 'DELETE',
            })

            if (!response.ok) {
                throw new Error('Failed to delete student')
            }

            const result = await response.json();
            console.log(result.message);
            window.location.reload();
        } catch (err) {
            console.log('Error Deleting Student: ', err);
            alert('เกิดข้อผิดพลาดในการลบข้อมูลนักเรียน')
        }
    }

    const filteredStudents = filterClass === 'all'
        ? Students
        : Students.filter(student => student.class === Number(filterClass));

    return (
        <>
            {/* Filter class */}
            <div className="mt-5">
                <label className="mr-2 font-semibold">ห้องเรียน:</label>
                <select
                    value={filterClass}
                    onChange={(e) => setFilterClass(e.target.value)}
                    className="border px-3 py-2 rounded-md"
                >
                    <option value="all">ทั้งหมด</option>
                    <option value="409">4/9</option>
                    <option value="509">5/9</option>
                    <option value="609">6/9</option>
                </select>
            </div>

            {/* Student List Table */}
            <div className="mt-5 overflow-x-auto">
                <table className="min-w-full text-sm md:text-base border-collapse border">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2">ที่</th>
                            <th className="border p-2">รหัสนักเรียน</th>
                            <th className="border p-2">ชื่อ</th>
                            <th className="border p-2">ห้อง</th>
                            <th className="border p-2 text-center">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.map((item: any, index: any) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="border p-2 md:p-3 text-center">{index+1}</td>
                                <td className="border p-2 md:p-3">{item.student_id}</td>
                                <td className="border p-2 md:p-3">{item.name}</td>
                                <td className="border p-2 md:p-3 text-center">{item.class === 409 ? '4/9' : item.class === 509 ? '5/9' : '6/9'}</td>
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

            <button
                onClick={() => setIsModalOpen(true)}
                className="fixed bottom-6 right-6 hover:scale-110 transition-transform duration-300"
            >
                <FaCirclePlus size={80} color="#2a4365" />
            </button>

            <AddModal
                isOpen={isModalOpen}
                onClose={onClose}
                formData={formData}
                setFormData={setFormData}
                onSubmit={onSubmit}
            />
        </>
    )
}
export default StudentList