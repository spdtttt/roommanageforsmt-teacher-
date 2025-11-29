'use client'

import { useEffect, useState } from 'react'
import { BeatLoader } from 'react-spinners'

interface Student {
  id: number
  student_id: number
  name: string | null
  gender: string | null
  class: number | null
}

interface UnassignedStudentsModalProps {
  isOpen: boolean
  onClose: () => void
  campId: number
}

const UnassignedStudentsModal = ({
  isOpen,
  onClose,
  campId,
}: UnassignedStudentsModalProps) => {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && campId) {
      fetchUnassignedStudents()
    }
  }, [isOpen, campId])

  const fetchUnassignedStudents = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/camps/${campId}/unassigned-students`)
      if (response.ok) {
        const data = await response.json()
        setStudents(data)
      } else {
        console.error('Failed to fetch unassigned students')
        setStudents([])
      }
    } catch (err) {
      console.error('Error fetching unassigned students:', err)
      setStudents([])
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-5"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b">
          <h2
            className="text-2xl font-semibold"
            style={{ fontFamily: 'Mitr, sans-serif' }}
          >
            รายชื่อนักเรียนที่ยังไม่ได้ลงบันทึกห้องพัก
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {loading ? (
            <div className="flex justify-center py-10">
              <BeatLoader color="#5a5c7e" size={18} />
            </div>
          ) : students.length === 0 ? (
            <div className="text-gray-500 text-center py-10">
              ไม่มีนักเรียนที่ยังไม่ได้ลงบันทึกห้องพัก
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm md:text-base border-collapse border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2">ที่</th>
                    <th className="border p-2">รหัสนักเรียน</th>
                    <th className="border p-2">ชื่อ-นามสกุล</th>
                    <th className="border p-2">เพศ</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, index) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="border p-2 md:p-3 text-center">
                        {index + 1}
                      </td>
                      <td className="border p-2 md:p-3 text-center">
                        {student.student_id}
                      </td>
                      <td className="border p-2 md:p-3 text-center">{student.name ?? '-'}</td>
                      <td className="border p-2 md:p-3 text-center">
                        {student.gender == 'male' ? 'ชาย' : 'หญิง'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors cursor-pointer"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  )
}

export default UnassignedStudentsModal

