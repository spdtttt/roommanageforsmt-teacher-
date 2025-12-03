'use client'
import { useState, useEffect, useRef } from "react"
import { FaCirclePlus } from "react-icons/fa6";
import Select from "react-select";
import {Button} from "@heroui/react";
import { useRouter } from "next/navigation";

interface Camp {
  id: number;
  title: string;
  class: number;
  date: string;
  max: number;
}

interface CampListProps {
  Camps: Camp[];
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  // แก้ปัญหา timezone โดยบวก offset ของ Thailand (UTC+7)
  const utcDate = new Date(date.getTime() + (date.getTimezoneOffset() * 60000));
  
  return utcDate.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const options = [
  { value: 409, label: '4/9' },
  { value: 509, label: '5/9' },
  { value: 609, label: '6/9' },
]

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: {
    title: string;
    class: any;
    date: string;
    max: number;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    title: string;
    class: any;
    date: string;
    max: number;
  }>>;
  onSubmit: (e: React.FormEvent) => void;
}

interface EditModalProps {
  isEditModalOpen: boolean;
  onClose: () => void;
  campData: {
    id: number;
    title: string;
    class: any;
    date: string;
    max: number;
  }
  setCampData: React.Dispatch<React.SetStateAction<{
    id: number;
    title: string;
    class: any;
    date: string;
    max: number;
  }>>;
}

const AddModal = ({ isOpen, onClose, formData, setFormData, onSubmit }: AddModalProps) => {
  if (!isOpen) return null;

  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;

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
          เพิ่มค่าย & กิจกรรม
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1">ชื่อกิจกรรม</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="กรอกชื่อกิจกรรม"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">ห้อง</label>

            <Select options={options} value={options.find(o => o.value === formData.class)} 
              onChange={(selectedOption) =>
                setFormData({ ...formData, class: selectedOption ? selectedOption.value : null })
              } />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">วันที่</label>
            <input
              type="date"
              name="date"
              min={formattedDate}
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">จำนวนคนต่อห้อง</label>
            <input
              type="number"
              name="max"
              value={formData.max || ''}
              onChange={(e) =>
                setFormData({ ...formData, max: Number(e.target.value) })
              }
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="กรอกจำนวนคน"
              min="1"
              required
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

const EditModal = ({ isEditModalOpen, onClose, campData, setCampData }: EditModalProps) => {
  const router = useRouter();
  
  if (!isEditModalOpen) return null;
  const ISODate = campData.date;
  const DateforInput = ISODate.split('T')[0];

  const handleSave = async (e: React.FormEvent) => {
    try {
      e.preventDefault();

      const response = await fetch(`/api/camps/${campData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: campData.title,
          class: campData.class,
          date: DateforInput + 'T00:00:00Z',
          max: campData.max
        })
      });

      if(!response.ok) {
        console.error('Response not OK');
      }

      onClose();
      window.location.reload();
    } catch(err) {
        console.error('Error editing details:', err);
    } finally {
        router.push('/')
    }
  }

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
          แก้ไขค่าย & กิจกรรม
        </h2>

        <form className="space-y-4" onSubmit={handleSave}>
          <div>
            <label className="block text-sm font-medium mb-1">ชื่อกิจกรรม</label>
            <input
              type="text"
              name="title"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="กรอกชื่อกิจกรรม"
              value={campData.title}
              onChange={(e) => {
                setCampData({ ...campData, title: e.target.value });
              }}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">ห้อง</label>
            <Select options={options} value={options.find(o => o.value === campData.class)} 
              onChange={(selectedOption) =>
                setCampData({ ...campData, class: selectedOption ? selectedOption.value : null })
              } />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">วันที่</label>
            <input
              type="date"
              name="date"
              value={DateforInput}
              onChange={(e) =>
                setCampData({ ...campData, date: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">จำนวนคนต่อห้อง</label>
            <input
              type="number"
              name="max"
              value={campData.max || ''}
              onChange={(e) =>
                setCampData({ ...campData, max: Number(e.target.value) })
              }
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="กรอกจำนวนคน"
              min="1"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 cursor-pointer px-4 py-2 border rounded-md hover:bg-gray-100 transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="flex-1 cursor-pointer px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              บันทึก
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const CampList = ({ Camps }: CampListProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [filterClass, setFilterClass] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    class: Number(''),
    date: '',
    max: Number('')
  })
  const [campData, setCampData] = useState({
    id: Number(''),
    title: '',
    class: Number(''),
    date: '',
    max: Number('')
  })
  const [selectedDelete, setSelectedDelete] = useState<number[]>([]);
  const [isSelected, setIsSelected] = useState(false);
  const selectAllRef = useRef<HTMLInputElement | null>(null);

  const handleCheck = (id: number) => {
    setSelectedDelete((prev) => prev.includes(id)
      ? prev.filter((item) => item !== id)
      : [...prev, id]
    );
  };

  const handleSelectDeleted = async () => {
    try {
      if (selectedDelete.length === 0) return;

      const yesno = confirm("ต้องการลบค่ายที่เลือกจริงๆหรือไม่?")
      if (!yesno) {
        return
      }

      const resp = await fetch('/api/camps/delete-multiple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedDelete })
      })

      if (!resp.ok) {
        throw new Error('Failed to delete selected camps')
      }

      window.location.reload()
    } catch (err) {
      console.error('Error deleting selected camps:', err)
      alert('เกิดข้อผิดพลาดในการลบข้อมูล')
    } finally {
      setIsSelected(false);
      setSelectedDelete([]);
    }
  }

  function onClose() {
    setIsModalOpen(false);
    setIsEditModalOpen(false);
    setFormData({
      title: '',
      class: Number(''),
      date: '',
      max: Number(''),
    })
    setCampData({
      id: Number(''),
      title: '',
      class: Number(''),
      date: '',
      max: Number('')
    })
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const dataToSend = {
        title: formData.title,
        classroom: formData.class,
        date: formData.date + 'T00:00:00Z',
        max: formData.max
      }

      const response = await fetch(`/api/camps`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        throw new Error('Failed to create camp');
      }

      const result = await response.json();
      console.log('Success:', result)

    } catch (err) {
      console.error('Error fetch API Add Camp: ', err)
    } finally {
      onClose()
      window.location.reload();
    }
  }

  async function handleDelete(camp_id: number) {
    if (!confirm("ต้องการลบค่ายนี้จริงหรือไม่")) return;

    try {
      const response = await fetch(`/api/camps/${camp_id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error('Failed to delete camp');
      }

      const result = await response.json();
      console.log(result.message);

      window.location.reload();
    } catch (err) {
      console.error("Error deleting camp:", err);
      alert("เกิดข้อผิดพลาดในการลบข้อมูล");
    }
  }
  
  const updateCampDataFocus = async (camp: any) => {
    setCampData({
      id: camp.id,
      title: camp.title,
      class: camp.class,
      date: camp.date,
      max: camp.max
    })
    setIsEditModalOpen(true);
  }

  const filteredCamps = filterClass === 'all'
    ? Camps
    : Camps.filter(camp => camp.class === Number(filterClass));

  return (
    <>
      {/* Filter class && Selected Button */}
      <div className={`mt-5 justify-between flex flex-col md:flex-row`}>
        <div className="">
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

        <div className="flex gap-3 mt-4 md:mt-0">
          {isSelected && (
            <div
              className="bg-red-500 hover:bg-red-600 cursor-pointer rounded-lg"
              onClick={handleSelectDeleted}
            >
              <p
                style={{ fontFamily: 'Mitr, sans-serif' }}
                className="text-white text-xl md:text-2xl text-center px-3 py-2"
              >
                ลบ
              </p>
            </div>
          )}

          <div className="flex items-center gap-3">
            <div
              onClick={() => setIsSelected(!isSelected)}
              className="bg-blue-500 cursor-pointer rounded-lg hover:bg-blue-600"
            >
              <p
                style={{ fontFamily: 'Mitr, sans-serif' }}
                className="text-white text-xl md:text-2xl text-center px-3 py-2"
              >
                {!isSelected ? 'เลือก' : 'ยกเลิก'}
              </p>
            </div>

            {isSelected && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={filteredCamps.length > 0 && selectedDelete.length === filteredCamps.length}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedDelete(filteredCamps.map((c: any) => c.id))
                    } else {
                      setSelectedDelete([])
                    }
                  }}
                  className="w-8 h-8"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Camps List Table */}
      <div className="mt-5 overflow-x-auto">
        <table className="min-w-full text-sm md:text-base border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">ที่</th>
              <th className="border p-2">ชื่อกิจกรรม</th>
              <th className="border p-2">ห้อง</th>
              <th className="border p-2">วันที่</th>
              <th className="border p-2">จำนวนคนต่อห้อง</th>
              <th className="border p-2 text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {filteredCamps.map((item: any, index: any) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="border p-2 md:p-3 text-center">{index + 1}</td>
                <td className="border p-2 md:p-3">{item.title}</td>
                <td className="border p-2 md:p-3 text-center">{item.class === 409 ? '4/9' : item.class === 509 ? '5/9' : '6/9'}</td>
                <td className="border p-2 md:p-3 text-center">{formatDate(item.date)}</td>
                <td className="border p-2 md:p-3 text-center">{item.max}</td>
                <td className="md:p-3 p-2 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="px-2 py-1 md:py-1.5 md:px-3 text-sm md:text-base bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
                    >
                      ลบ
                    </button>
                    <button
                      onClick={() => updateCampDataFocus(item)}
                      className="px-2 py-1 md:py-1.5 md:px-3 text-sm md:text-base bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
                    >
                      แก้ไข
                    </button>
                    {isSelected && (
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedDelete.includes(item.id)}
                          onChange={() => handleCheck(item.id)}
                          className="w-6 h-6 bg-white border-2 rounded checked:bg-blue-700"
                        />
                      </div>
                    )}
                  </div>
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

      <EditModal
        isEditModalOpen={isEditModalOpen}
        onClose={onClose}
        campData={campData}
        setCampData={setCampData}
      />
    </>
  )
}

export default CampList