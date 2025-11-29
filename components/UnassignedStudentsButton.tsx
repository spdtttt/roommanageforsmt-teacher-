'use client'

import { useState } from 'react'
import UnassignedStudentsModal from './UnassignedStudentsModal'

interface UnassignedStudentsButtonProps {
  campId: number
}

const UnassignedStudentsButton = ({
  campId,
}: UnassignedStudentsButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="cursor-pointer px-4 font-semibold py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-[20px]"
        style={{ fontFamily: 'Mitr, sans-serif' }}
      >
        ดูรายชื่อนักเรียนที่ยังไม่ได้ลงบันทึกห้องพัก
      </button>

      <UnassignedStudentsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        campId={campId}
      />
    </>
  )
}

export default UnassignedStudentsButton

