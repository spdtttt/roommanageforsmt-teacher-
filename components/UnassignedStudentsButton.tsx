'use client'
import { MousePointerClick } from 'lucide-react'
import { useState } from 'react'
import UnassignedStudentsModal from './UnassignedStudentsModal'

interface UnassignedStudentsButtonProps {
  campId: number
  campInfo: any
}

const UnassignedStudentsButton = ({
  campId,
  campInfo
}: UnassignedStudentsButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex gap-3 items-center cursor-pointer px-4 font-bold py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-[20px] font-[Prompt]"
      >
        <MousePointerClick className='w-6 h-6' />
        ดูรายชื่อนักเรียนที่ยังไม่ได้ลงบันทึกห้องพัก
      </button>

      <UnassignedStudentsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        campId={campId}
        campInfo={campInfo}
      />
    </div>
  )
}

export default UnassignedStudentsButton

