"use client";
import { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Select from "react-select";
import { Users, Filter, Plus, Trash, MousePointerClick, Upload } from "lucide-react";
import StatCard from "./StatCard";
import { BeatLoader } from "react-spinners";
import CSVUploadModal from "./CSVUploadModal";

type Student = {
  id: number;
  student_id: number;
  name: string;
  gender: string;
  class: number;
};

type StudentListProps = {
  Students: Student[];
};

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: {
    student_id: string;
    name: string;
    gender: string;
    class: number;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      student_id: string;
      name: string;
      gender: string;
      class: number;
    }>
  >;
  onSubmit: (e: React.FormEvent) => void;
}

const options = [
  { value: 409, label: "4/9" },
  { value: 509, label: "5/9" },
  { value: 609, label: "6/9" },
];

const optionsforSelect = [
  { value: "all", label: "ทั้งหมด" },
  { value: 409, label: "4/9" },
  { value: 509, label: "5/9" },
  { value: 609, label: "6/9" },
];

const optionsGender = [
  { value: "male", label: "ชาย" },
  { value: "female", label: "หญิง" },
];

const AddModal = ({
  isOpen,
  onClose,
  formData,
  setFormData,
  onSubmit,
}: AddModalProps) => {
  if (!isOpen) return null;
  const [loading, setLoading] = useState(false);

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
      onClick={onClose} // ปิด modal เมื่อคลิกพื้นหลัง
    >
      <div
        className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden transform transition-all animate-scaleIn"
        onClick={(e) => e.stopPropagation()} // ป้องกันการปิด modal เมื่อคลิกภายใน
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 px-8 py-6 border-b border-blue-800">
          <h2 className="text-2xl font-bold text-white font-[Prompt]">
            เพิ่มนักเรียน
          </h2>
          <p className="text-blue-100 text-sm mt-1 font-[Prompt]">
            สร้างนักเรียนใหม่
          </p>
        </div>

        {/* Body */}
        <form className="p-8 space-y-6 font-[Prompt]" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              รหัสนักเรียน
            </label>
            <input
              type="text"
              name="studentID"
              value={formData.student_id || ""}
              onChange={(e) =>
                setFormData({ ...formData, student_id: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-900 placeholder-gray-400"
              placeholder="กรอกรหัสนักเรียน"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              ชื่อ
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-900 placeholder-gray-400"
              placeholder="กรอกชื่อ"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              เพศ
            </label>
            <Select
              options={optionsGender}
              value={optionsGender.find((o) => o.value === formData.gender)}
              onChange={(selectedOption) =>
                setFormData({
                  ...formData,
                  gender: selectedOption ? selectedOption.value : "",
                })
              }
              placeholder="เลือกเพศ"
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
              ห้อง
            </label>
            <Select
              options={options}
              value={options.find((o) => o.value === formData.class)}
              onChange={(selectedOption) =>
                setFormData({
                  ...formData,
                  class: selectedOption ? selectedOption.value : Number(""),
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
              disabled={loading || !formData.student_id || !formData.name || !formData.class || !formData.gender}
              type="submit"
              className={`${
                loading ? "bg-blue-500" : "bg-[#0e327a]"
              } disabled:opacity-50 flex-1 cursor-pointer px-4 py-3 bg-[#0e327a] text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 active:scale-95 shadow-md hover:shadow-lg transition-all duration-200 font-[Prompt]`}
            >
              {loading ? "กำลังบันทึก..." : "บันทึก"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const StudentList = ({ Students }: StudentListProps) => {
  const [filterClass, setFilterClass] = useState("all");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    student_id: "",
    name: "",
    gender: "",
    class: Number(""),
  });
  const [isSelected, setIsSelected] = useState(false);
  const [selectedDelete, setSelectedDelete] = useState<number[]>([]);
  const [csvUploadModal, setCSVUploadModal] = useState(false);

  function onClose() {
    setIsModalOpen(false);
    setFormData({
      student_id: "",
      name: "",
      gender: "",
      class: Number(""),
    });
  }

  const handleCheck = (id: number) => {
    setSelectedDelete((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const deletedSelect = async () => {
    setLoading(true);
    try {
      if (selectedDelete.length === 0) return;
      if (!confirm("ต้องการลบนักเรียนที่เลือกหรือไม่?")) return;

      const response = await fetch(`/api/students/multiple-delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: selectedDelete }),
      });

      if (!response.ok) {
        throw new Error("Error from API Students");
      }
    } catch (err) {
      console.error("Error to fetch API Delete multiply students:", err);
    } finally {
      setLoading(false);
      setIsSelected(false);
      setSelectedDelete([]);
      window.location.reload();
    }
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    if (
      !formData.student_id ||
      !formData.name ||
      !formData.gender ||
      !formData.class
    ) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    if (isNaN(Number(formData.student_id))) {
      alert("รหัสนักเรียนต้องเป็นตัวเลข");
      return;
    }

    const exists = Students.some(
      (s) =>
        (s.name === formData.name && s.class === formData.class) ||
        s.student_id === Number(formData.student_id)
    );
    if (exists) {
      alert("มีข้อมูลนี้ในระบบแล้ว");
      return;
    }

    const dataToSend = {
      student_id: Number(formData.student_id),
      name: formData.name,
      gender: formData.gender,
      classroom: formData.class,
    };

    try {
      const response = await fetch(`/api/students`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error("Failed to create student");
      }

      const result = await response.json();
      console.log("Success:", result);
    } catch (err) {
      console.error("Error fetch API Add Student: ", err);
    } finally {
      setLoading(false);
      onClose();
      window.location.reload();
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("ต้องการลบนักเรียนคนนี้จริงหรือไม่")) return;
    setLoading(true);

    try {
      const response = await fetch(`/api/students/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete student");
      }

      const result = await response.json();
      console.log(result.message);
    } catch (err) {
      console.log("Error Deleting Student: ", err);
      alert("เกิดข้อผิดพลาดในการลบข้อมูลนักเรียน");
    } finally {
      setLoading(false);
      window.location.reload();
    }
  }

  const filteredStudents =
    filterClass === "all"
      ? Students
      : Students.filter((student) => student.class === Number(filterClass));

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
            title="นักเรียนทั้งหมด"
            value={`${Students.length} คน`}
            icon={Users}
            variant="primary"
          />
          <StatCard
            title="ม.4/9"
            value={`${
              Students.filter((student) => student.class === 409).length
            } คน`}
            variant="default"
          />
          <StatCard
            title="ม.5/9"
            value={`${
              Students.filter((student) => student.class === 509).length
            } คน`}
            variant="default"
          />
          <StatCard
            title="ม.6/9"
            value={`${
              Students.filter((student) => student.class === 609).length
            } คน`}
            variant="default"
          />
        </div>

        {/* Filter Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-10">
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
            <button onClick={() => setCSVUploadModal(true)} className="transition-colors duration-300 hover:bg-green-600 flex font-[Prompt] cursor-pointer items-center gap-2 font-semibold text-white bg-green-500 px-4 py-2 rounded-lg">
                <Upload className="w-4 h-4" />
                <span>อัปโหลดไฟล์ผ่านไฟล์ CSV</span>
            </button>
          </div>
          <div className="gap-4 text-white cursor-pointer font-[Prompt] flex">
            <button
              disabled={loading}
              onClick={() => setIsModalOpen(true)}
              className={`${
                isSelected ? "hidden" : "block"
              } bg-[#0e327a] font-bold p-2 sm:p-3 rounded-lg flex items-center shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 gap-2`}
            >
              <Plus className="w-4 h-4" />
              <span>เพิ่มนักเรียนใหม่</span>
            </button>
            <button
              disabled={loading}
              onClick={() => setIsSelected(!isSelected)}
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
              onClick={deletedSelect}
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
                  filteredStudents.length > 0 &&
                  selectedDelete.length === filteredStudents.length
                }
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedDelete(filteredStudents.map((c: any) => c.id));
                  } else {
                    setSelectedDelete([]);
                  }
                }}
                className="w-[48px] h-[48px] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Students List Table */}
        <div>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="Students Table">
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
                    align="center"
                    style={{
                      fontFamily: "Prompt",
                      color: "#65758b",
                      fontWeight: "bold",
                      fontSize: "17px",
                    }}
                  >
                    รหัสนักเรียน
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
                    ชื่อ
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
                      width: "200px",
                    }}
                  >
                    จัดการ
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredStudents.map((student, index) => (
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
                      align="center"
                      style={{
                        fontFamily: "Prompt",
                        color: "black",
                        fontSize: "15px",
                      }}
                    >
                      {student.student_id}
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{
                        fontFamily: "Prompt",
                        color: "black",
                        fontSize: "15px",
                      }}
                    >
                      {student.name}
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{
                        fontFamily: "Prompt",
                        color: "black",
                        fontSize: "15px",
                      }}
                    >
                      {student.class === 609
                        ? "6/9"
                        : student.class === 509
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
                      <div className="flex justify-center gap-2">
                        {isSelected ? (
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedDelete.includes(student.id)}
                              onChange={() => handleCheck(student.id)}
                              className="w-[36px] h-[36px] bg-white border-2 rounded checked:bg-[#0e327a] cursor-pointer"
                            />
                          </div>
                        ) : (
                          <>
                            <button
                              disabled={loading}
                              onClick={() => handleDelete(student.id)}
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

        <AddModal
          isOpen={isModalOpen}
          onClose={onClose}
          formData={formData}
          setFormData={setFormData}
          onSubmit={onSubmit}
        />

        <CSVUploadModal
          csvUploadModal={csvUploadModal}
          setCSVUploadModal={setCSVUploadModal}
        />
      </div>
    </>
  );
};
export default StudentList;
