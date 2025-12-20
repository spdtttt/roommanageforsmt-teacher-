"use client";
import { useState } from "react";
import Select from "react-select";
import { useRouter } from "next/navigation";
import StatCard from "./StatCard";
import {
  CalendarDays,
  GraduationCap,
  Users,
  Filter,
  Plus,
  MousePointerClick,
  Trash,
  SquarePen,
  Square,
} from "lucide-react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { BeatLoader } from "react-spinners";

interface Camp {
  id: number;
  title: string;
  class: number;
  dateStart: string;
  dateEnd: string;
  max: number;
}

interface CampListProps {
  Camps: Camp[];
  // Optional array of student IDs (numbers) gathered from rooms
  Students?: number[];
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  // แก้ปัญหา timezone โดยบวก offset ของ Thailand (UTC+7)
  const utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);

  return utcDate.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const optionsforSelect = [
  { value: "all", label: "ทั้งหมด" },
  { value: 409, label: "4/9" },
  { value: 509, label: "5/9" },
  { value: 609, label: "6/9" },
];

const options = [
  { value: 409, label: "4/9" },
  { value: 509, label: "5/9" },
  { value: 609, label: "6/9" },
];

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: {
    title: string;
    class: any;
    dateStart: string;
    dateEnd: string;
    max: number;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      title: string;
      class: any;
      dateStart: string;
      dateEnd: string;
      max: number;
    }>
  >;
  onSubmit: (e: React.FormEvent) => void;
}

interface EditModalProps {
  isEditModalOpen: boolean;
  onClose: () => void;
  campData: {
    id: number;
    title: string;
    class: number | null;
    dateStart: string;
    dateEnd: string;
    max: number;
  };
  setCampData: React.Dispatch<
    React.SetStateAction<{
      id: number;
      title: string;
      class: number | null;
      dateStart: string;
      dateEnd: string;
      max: number;
    }>
  >;
}

const AddModal = ({
  isOpen,
  onClose,
  formData,
  setFormData,
  onSubmit,
}: AddModalProps) => {
  if (!isOpen) return null;

  const [loading, setLoading] = useState(false);

  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const day = today.getDate().toString().padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      onSubmit(e);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fadeIn"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
      onClick={onClose} // ปิดเมื่อคลิกพื้นหลัง
    >
      <div
        className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden transform transition-all animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 px-8 py-6 border-b border-blue-800">
          <h2 className="text-2xl font-bold text-white font-[Prompt]">
            เพิ่มค่าย & กิจกรรม
          </h2>
          <p className="text-blue-100 text-sm mt-1 font-[Prompt]">
            สร้างกิจกรรมใหม่
          </p>
        </div>

        {/* Body */}
        <form className="p-8 space-y-6 font-[Prompt]" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              ชื่อกิจกรรม
            </label>
            <input
              autoComplete="off"
              type="text"
              name="title"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200 font-[Prompt] text-gray-900 placeholder-gray-400"
              placeholder="กรอกชื่อกิจกรรม"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              ห้อง
            </label>
            <Select
              options={options}
              value={options.find((o) => o.value === formData.class)}
              onChange={(selectedOption) =>
                setFormData({
                  ...formData,
                  class: selectedOption ? selectedOption.value : null,
                })
              }
              placeholder="เลือกห้อง"
              styles={{
                control: (base, state) => ({
                  ...base,
                  borderRadius: "0.5rem",
                  borderWidth: "2px",
                  borderColor: state.isFocused ? "#3b82f6" : "#e5e7eb",
                  boxShadow: state.isFocused
                    ? "0 0 0 2px rgba(59, 130, 246, 0.1)"
                    : "none",
                  padding: "0.375rem 0.5rem",
                  fontSize: "0.95rem",
                  transition: "all 0.2s ease",
                }),
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              วันที่เริ่มต้น
            </label>
            <input
              type="date"
              name="date"
              min={formattedDate}
              value={formData.dateStart}
              onChange={(e) =>
                setFormData({ ...formData, dateStart: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200 font-[Prompt] text-gray-900"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              วันที่สิ้นสุด
            </label>
            <input
              type="date"
              name="date"
              min={formattedDate}
              value={formData.dateEnd}
              onChange={(e) =>
                setFormData({ ...formData, dateEnd: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200 font-[Prompt] text-gray-900"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              จำนวนคนต่อห้อง
            </label>
            <input
              autoComplete="off"
              type="number"
              name="max"
              value={formData.max || ""}
              onChange={(e) =>
                setFormData({ ...formData, max: Number(e.target.value) })
              }
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200 font-[Prompt] text-gray-900 placeholder-gray-400"
              placeholder="กรอกจำนวนคน"
              min="1"
              required
            />
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              disabled={loading}
              type="button"
              onClick={onClose}
              className="flex-1 cursor-pointer px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 font-[Prompt]"
            >
              ยกเลิก
            </button>
            <button
              disabled={loading}
              type="submit"
              className={`${
                loading ? "bg-blue-500" : "bg-[#0e327a]"
              } flex-1 cursor-pointer px-4 py-3 bg-[#0e327a] text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 active:scale-95 shadow-md hover:shadow-lg transition-all duration-200 font-[Prompt]`}
            >
              {loading ? "กำลังบันทึก..." : "บันทึก"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// หน้าต่างแก้ไขข้อมูลค่าย
const EditModal = ({
  isEditModalOpen,
  onClose,
  campData,
  setCampData,
}: EditModalProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (!isEditModalOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    setLoading(true);
    try {
      e.preventDefault();

      const response = await fetch(`/api/camps/${campData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: campData.title,
          class: campData.class,
          dateStart: campData.dateStart,
          dateEnd: campData.dateEnd,
          max: campData.max,
        }),
      });

      if (!response.ok) {
        console.error("Response not OK");
      }

      onClose();
    } catch (err) {
      console.error("Error editing details:", err);
    } finally {
      setLoading(false);
      window.location.reload();
      router.push("/");
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fadeIn"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden transform transition-all animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 px-8 py-6 border-b border-blue-800">
          <h2 className="text-2xl font-bold text-white font-[Prompt]">
            แก้ไขค่าย & กิจกรรม
          </h2>
          <p className="text-blue-100 text-sm mt-1 font-[Prompt]">
            อัปเดตข้อมูลกิจกรรม
          </p>
        </div>

        {/* Body */}
        <form className="p-8 space-y-6 font-[Prompt]" onSubmit={handleSave}>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              ชื่อกิจกรรม
            </label>
            <input
              autoComplete="off"
              type="text"
              name="title"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200 font-[Prompt] text-gray-900 placeholder-gray-400"
              placeholder="กรอกชื่อกิจกรรม"
              value={campData.title}
              onChange={(e) => {
                setCampData({ ...campData, title: e.target.value });
              }}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              ห้อง
            </label>
            <Select
              options={options}
              value={options.find((o) => o.value === campData.class)}
              onChange={(selectedOption) =>
                setCampData({
                  ...campData,
                  class:
                    selectedOption && typeof selectedOption.value === "number"
                      ? selectedOption.value
                      : null,
                })
              }
              placeholder="เลือกห้อง..."
              styles={{
                control: (base, state) => ({
                  ...base,
                  borderRadius: "0.5rem",
                  borderWidth: "2px",
                  borderColor: state.isFocused ? "#3b82f6" : "#e5e7eb",
                  boxShadow: state.isFocused
                    ? "0 0 0 2px rgba(59, 130, 246, 0.1)"
                    : "none",
                  padding: "0.375rem 0.5rem",
                  fontSize: "0.95rem",
                  transition: "all 0.2s ease",
                }),
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              วันที่เริ่มต้น
            </label>
            <input
              type="date"
              name="date"
              value={campData.dateStart}
              onChange={(e) =>
                setCampData({ ...campData, dateStart: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200 font-[Prompt] text-gray-900"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              วันที่สิ้นสุด
            </label>
            <input
              type="date"
              name="date"
              value={campData.dateEnd}
              onChange={(e) =>
                setCampData({ ...campData, dateEnd: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200 font-[Prompt] text-gray-900"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              จำนวนคนต่อห้อง
            </label>
            <input
              autoComplete="off"
              type="number"
              name="max"
              value={campData.max || ""}
              onChange={(e) =>
                setCampData({ ...campData, max: Number(e.target.value) })
              }
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200 font-[Prompt] text-gray-900 placeholder-gray-400"
              placeholder="กรอกจำนวนคน"
              min="1"
              required
            />
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              disabled={loading}
              type="button"
              onClick={onClose}
              className="flex-1 cursor-pointer px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 font-[Prompt]"
            >
              ยกเลิก
            </button>
            <button
              disabled={loading}
              type="submit"
              className={`${
                loading ? "bg-blue-500" : "bg-[#0e327a]"
              } flex-1 cursor-pointer px-4 py-3 bg-[#0e327a] text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 active:scale-95 shadow-md hover:shadow-lg transition-all duration-200 font-[Prompt]`}
            >
              {loading ? "กำลังบันทึก..." : "บันทึก"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CampList = ({ Camps, Students = [] }: CampListProps) => {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [filterClass, setFilterClass] = useState("all");
  const [formData, setFormData] = useState({
    title: "",
    class: Number(""),
    dateStart: "",
    dateEnd: "",
    max: Number(""),
  });
  const [campData, setCampData] = useState({
    id: Number(""),
    title: "",
    class: null as number | null,
    dateStart: "",
    dateEnd: "",
    max: Number(""),
  });
  const [selectedDelete, setSelectedDelete] = useState<number[]>([]);
  const [isSelected, setIsSelected] = useState(false);

  const handleCheck = (id: number) => {
    setSelectedDelete((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectDeleted = async () => {
    setLoading(true);
    try {
      if (selectedDelete.length === 0) return;

      const yesno = confirm("ต้องการลบค่ายที่เลือกจริงๆหรือไม่?");
      if (!yesno) {
        return;
      }

      const resp = await fetch("/api/camps/delete-multiple", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedDelete }),
      });

      if (!resp.ok) {
        throw new Error("Failed to delete selected camps");
      }
    } catch (err) {
      console.error("Error deleting selected camps:", err);
      alert("เกิดข้อผิดพลาดในการลบข้อมูล");
    } finally {
      setLoading(false);
      setIsSelected(false);
      setSelectedDelete([]);
      window.location.reload();
    }
  };

  function onClose() {
    setIsModalOpen(false);
    setIsEditModalOpen(false);
    setFormData({
      title: "",
      class: Number(""),
      dateStart: "",
      dateEnd: "",
      max: Number(""),
    });
    setCampData({
      id: Number(""),
      title: "",
      class: Number(""),
      dateStart: "",
      dateEnd: "",
      max: Number(""),
    });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const dataToSend = {
        title: formData.title,
        classroom: formData.class,
        dateStart: formData.dateStart,
        dateEnd: formData.dateEnd,
        max: formData.max,
      };

      const response = await fetch(`/api/camps`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error("Failed to create camp");
      }

      const result = await response.json();
      console.log("Success:", result);
    } catch (err) {
      console.error("Error fetch API Add Camp: ", err);
    } finally {
      onClose();
      window.location.reload();
    }
  }

  async function handleDelete(camp_id: number) {
    if (!confirm("ต้องการลบค่ายนี้จริงหรือไม่")) return;
    setLoading(true);

    try {
      const response = await fetch(`/api/camps/${camp_id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete camp");
      }

      const result = await response.json();
      console.log(result.message);
    } catch (err) {
      console.error("Error deleting camp:", err);
      alert("เกิดข้อผิดพลาดในการลบข้อมูล");
    } finally {
      setLoading(false);
      window.location.reload();
    }
  }

  const updateCampDataFocus = async (camp: any) => {
    // Convert ISO string to YYYY-MM-DD format for date input
    const formatDateForInput = (isoString: string) => {
      const date = new Date(isoString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    setCampData({
      id: camp.id,
      title: camp.title,
      class: camp.class,
      dateStart: formatDateForInput(camp.dateStart),
      dateEnd: formatDateForInput(camp.dateEnd),
      max: camp.max,
    });
    setIsEditModalOpen(true);
  };

  const filteredCamps =
    filterClass === "all"
      ? Camps
      : Camps.filter((camp) => camp.class === Number(filterClass));

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <BeatLoader color="#5a5c7e" size={18} />
      </div>
    );
  }

  return (
    <>
      <div className="p-6 lg:p-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="กิจกรรมทั้งหมด"
            value={Camps.length}
            icon={CalendarDays}
            variant="primary"
          />
          <StatCard
            title="นักเรียนที่บันทึกแล้ว"
            value={Students.length}
            icon={Users}
            variant="default"
          />
          <StatCard
            title="ห้องที่รองรับ"
            value="3"
            icon={GraduationCap}
            variant="default"
          />
        </div>

        {/* Filter Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-500 font-[Prompt]">
              <Filter className="w-4 h-4" />
              <span className="font-medium">ห้องเรียน:</span>
              <Select
                placeholder="เลือก"
                options={optionsforSelect}
                value={optionsforSelect.find(
                  (o) => o.value === Number(filterClass)
                )}
                onChange={(selectedOption) =>
                  setFilterClass(
                    selectedOption ? String(selectedOption.value) : "all"
                  )
                }
                defaultValue={optionsforSelect[0]}
              />
            </div>
          </div>
          <div className="gap-4 text-white cursor-pointer font-[Prompt] flex">
            <div
              onClick={() => setIsModalOpen(true)}
              className={`${
                isSelected ? "hidden" : "block"
              } bg-[#0e327a] font-bold p-2 sm:p-3 rounded-lg flex items-center shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 gap-2`}
            >
              <Plus className="w-4 h-4" />
              <span>เพิ่มกิจกรรมใหม่</span>
            </div>
            <button
              onClick={() => setIsSelected(!isSelected)}
              disabled={loading}
              className="flex bg-yellow-500 hover:bg-yellow-600 p-2 sm:p-3 items-center rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 gap-2 font-bold"
            >
              <MousePointerClick className="w-4 h-4" />
              <span>{!isSelected ? "เลือก" : "ยกเลิก"}</span>
            </button>
            <button
              disabled={loading}
              className={`${
                isSelected ? "block" : "hidden"
              } bg-red-500 hover:bg-red-600 font-bold p-2 sm:p-3 rounded-lg flex items-center shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 gap-2`}
              onClick={handleSelectDeleted}
            >
              <Trash className="w-4 h-4" />
              <span>ลบรายการที่เลือก</span>
            </button>
            <div
              className={`${isSelected ? "block" : "hidden"} flex items-center`}
            >
              <input
                type="checkbox"
                checked={
                  filteredCamps.length > 0 &&
                  selectedDelete.length === filteredCamps.length
                }
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedDelete(filteredCamps.map((c: any) => c.id));
                  } else {
                    setSelectedDelete([]);
                  }
                }}
                className="w-[48px] h-[48px] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Camps Table */}
        <div>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="Camps Table">
              <TableHead>
                <TableRow>
                  <TableCell
                    align="center"
                    style={{
                      fontFamily: "Prompt",
                      color: "#65758b",
                      fontWeight: "bold",
                      fontSize: "17px",
                    }}
                  >
                    ที่
                  </TableCell>
                  <TableCell
                    align="left"
                    style={{
                      fontFamily: "Prompt",
                      color: "#65758b",
                      fontWeight: "bold",
                      fontSize: "17px",
                    }}
                  >
                    ชื่อกิจกรรม
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{
                      fontFamily: "Prompt",
                      color: "#65758b",
                      fontWeight: "bold",
                      fontSize: "17px",
                    }}
                  >
                    ห้อง
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{
                      fontFamily: "Prompt",
                      color: "#65758b",
                      fontWeight: "bold",
                      fontSize: "17px",
                    }}
                  >
                    วันที่เริ่มต้น
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{
                      fontFamily: "Prompt",
                      color: "#65758b",
                      fontWeight: "bold",
                      fontSize: "17px",
                    }}
                  >
                    วันที่สิ้นสุด
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{
                      fontFamily: "Prompt",
                      color: "#65758b",
                      fontWeight: "bold",
                      fontSize: "17px",
                    }}
                  >
                    จำนวนคนต่อห้อง
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{
                      fontFamily: "Prompt",
                      color: "#65758b",
                      fontWeight: "bold",
                      fontSize: "17px",
                      width: "200px",
                    }}
                  >
                    จัดการ
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCamps.map((camp, index) => (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell
                      align="center"
                      style={{
                        fontFamily: "Prompt",
                        color: "#65758b",
                        fontSize: "15px",
                      }}
                      component="th"
                      scope="row"
                    >
                      {index + 1}
                    </TableCell>
                    <TableCell
                      align="left"
                      style={{
                        fontFamily: "Prompt",
                        color: "black",
                        fontSize: "15px",
                      }}
                    >
                      {camp.title}
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{
                        fontFamily: "Prompt",
                        color: "black",
                        fontSize: "15px",
                      }}
                    >
                      {camp.class === 609
                        ? "6/9"
                        : camp.class === 509
                        ? "5/9"
                        : "4/9"}
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{
                        fontFamily: "Prompt",
                        color: "black",
                        fontSize: "15px",
                      }}
                    >
                      {formatDate(camp.dateStart)}
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{
                        fontFamily: "Prompt",
                        color: "black",
                        fontSize: "15px",
                      }}
                    >
                      {formatDate(camp.dateEnd)}
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{
                        fontFamily: "Prompt",
                        color: "black",
                        fontSize: "15px",
                      }}
                    >
                      {camp.max}
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{
                        fontFamily: "Prompt",
                        color: "black",
                        fontSize: "15px",
                      }}
                    >
                      <div className="flex justify-center gap-2">
                        {isSelected ? (
                          <div className="flex items-center justify-center">
                            <input
                              type="checkbox"
                              checked={selectedDelete.includes(camp.id)}
                              onChange={() => handleCheck(camp.id)}
                              className="w-[36px] h-[36px] bg-white border-2 rounded checked:bg-[#0e327a] cursor-pointer"
                            />
                          </div>
                        ) : (
                          <>
                            <button
                              onClick={() => updateCampDataFocus(camp)}
                              className="items-center flex gap-2 px-2 py-1 md:py-1.5 md:px-3 text-sm md:text-base font-[Prompt] bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer transition-all duration-300"
                            >
                              <SquarePen className="w-5 h-5" />
                              แก้ไข
                            </button>
                            <button
                              onClick={() => handleDelete(camp.id)}
                              className="flex items-center gap-2 px-2 py-1 md:py-1.5 md:px-3 text-sm md:text-base bg-red-500 text-white hover:bg-red-600 rounded cursor-pointer transition-all duration-300"
                            >
                              <Trash className="w-5 h-5" />
                              ลบ
                            </button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>

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
  );
};

export default CampList;
