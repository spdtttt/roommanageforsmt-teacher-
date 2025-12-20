"use client";
import { useState, useRef } from "react";
import Papa from "papaparse";
import { createClient } from "@supabase/supabase-js";
import { BeatLoader } from "react-spinners";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

const CSVUploadModal = ({ csvUploadModal, setCSVUploadModal }: any) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  if (!csvUploadModal) return null;

  const onClose = () => {
    setCSVUploadModal(false);
    setSelectedFile(null); // รีเซ็ตไฟล์เมื่อปิด
  };

  // ฟังก์ชันจำลองการเลือกไฟล์ เพื่อให้ UI แสดงผล
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileUpload = async () => {
    // เช็คว่าเลือกไฟล์แล้วหรือไม่
    if (!selectedFile) return;
    setLoading(true);

    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,
      complete: async (results: any) => {
        const csvData = results.data;

        try {
          const { error } = await supabase.from("Student").insert(csvData);

          if (error) throw error;
          alert("Upload รายชื่อนักเรียนเรียบร้อย");
          onClose();
        } catch (error: any) {
          console.error("Error uploading:", error.message);
          alert(
            "อาจมีนักเรียนที่เลขประจำตัวนักเรียน หรือ เลขบัตรประชาชนนี้ในระบบแล้ว"
          );
        } finally {
          setLoading(false);
        }
      },
      error: (error: any) => {
        console.error("CSV parsing error:", error);
        setLoading(false);
      },
    });
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fadeIn"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden transform transition-all animate-scaleIn flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* --- Header --- */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 px-8 py-6 border-b border-blue-800">
          <h2 className="text-2xl font-bold text-white font-[Prompt]">
            อัปโหลดรายชื่อนักเรียน
          </h2>
          <p className="text-blue-100 text-sm mt-1 font-[Prompt]">
            อัปโหลดรายชื่อนักเรียนผ่านไฟล์ CSV
          </p>
        </div>

        {/* --- Upload Section --- */}
        <div className="px-8 py-6">
          {/* Recommended Section */}
          <div className="font-[Prompt] mb-4">
            <div className="font-semibold mb-2 text-lg">
              <h3>คำแนะนำ</h3>
            </div>
            <div>
              <div>1.ไฟล์ที่อัปโหลด ต้องเป็นนามสกุล .csv เท่านั้น</div>
              <div className="flex flex-col">
                2.ไฟล์ csv ต้องมีหัวตารางและข้อมูลดังนี้{" "}
                <div className="text-gray-600 ml-4">
                  <p>- student_id เลขประจำตัวนักเรียน (ตัวเลข)</p>
                  <p>- national_id เลขประจำตัวประชาชน (ตัวเลข)</p>
                  <p>- name ชื่อ-นามสกุล (ตัวอักษร)</p>
                  <p>- gender เพศ (male && female)</p>
                  <p>- class ห้องเรียน (409 && 509 && 609)</p>
                </div>
              </div>
            </div>
          </div>
          {loading ? (
            // Loading State
            <div className="flex items-center justify-center py-4">
              <BeatLoader color="#2563EB" size={15} />
            </div>
          ) : !selectedFile ? (
            // ยังไม่ได้เลือกไฟล์
            <div
              className="border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="bg-blue-100 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <p className="text-gray-600 font-[Prompt] font-medium">
                คลิกเพื่อเลือกไฟล์ หรือลากไฟล์มาวาง
              </p>
              <p className="text-gray-400 text-sm mt-2 font-[Prompt]">
                รองรับเฉพาะไฟล์ .csv เท่านั้น
              </p>
              <input
                type="file"
                accept=".csv"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </div>
          ) : (
            // Preview File (เลือกไฟล์แล้ว)
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
              {/* แสดงชื่อไฟล์ */}
              <div className="flex items-center space-x-4 overflow-hidden">
                <div className="bg-white p-2 rounded-lg shadow-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-green-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-gray-800 font-[Prompt] font-medium truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-gray-500 text-xs font-[Prompt]">
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <button
                onClick={handleRemoveFile}
                className="text-gray-400 hover:text-red-500 transition-colors p-2"
                title="เอาไฟล์ออก"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 cursor-pointer"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* --- ปุ่มบันทึก & ยกเลิก --- */}
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="cursor-pointer px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-200 font-[Prompt] transition-colors"
          >
            ยกเลิก
          </button>
          <button
            disabled={!selectedFile || loading}
            className={`cursor-pointer px-6 py-2 rounded-lg text-white font-[Prompt] shadow-md transition-all 
              ${
                !selectedFile
                  ? "bg-gray-300 cursor-not-allowed shadow-none"
                  : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg active:scale-95"
              }`}
            onClick={handleFileUpload}
          >
            อัปโหลดข้อมูล
          </button>
        </div>
      </div>
    </div>
  );
};

export default CSVUploadModal;
