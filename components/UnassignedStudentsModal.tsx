"use client";
import { useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

interface Student {
  id: number;
  student_id: number;
  name: string | null;
  gender: string | null;
  class: number | null;
}

interface UnassignedStudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  campId: number;
  campInfo: any;
}

const UnassignedStudentsModal = ({
  isOpen,
  onClose,
  campId,
  campInfo,
}: UnassignedStudentsModalProps) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && campId) {
      fetchUnassignedStudents();
    }
  }, [isOpen, campId]);

  const fetchUnassignedStudents = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/camps/${campId}/unassigned-students`);
      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      } else {
        console.error("Failed to fetch unassigned students");
        setStudents([]);
      }
    } catch (err) {
      console.error("Error fetching unassigned students:", err);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    // สร้างหน้าต่างใหม่สำหรับพิมพ์
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    // สร้าง HTML สำหรับพิมพ์
    const title = `รายชื่อนักเรียนที่ยังไม่ได้ลงห้องพัก ${campInfo?.class === 108 ? 'ม.1/8'
      : campInfo?.class === 208 ? 'ม.2/8'
        : campInfo?.class === 308 ? 'ม.3/8'
          : campInfo?.class === 409 ? 'ม.4/9'
            : campInfo?.class === 509 ? 'ม.5/9'
              : 'ม.6/9'
      }`;

    let tableRows = "";
    students.forEach((student, index) => {
      tableRows += `
        <tr>
          <td>${index + 1}</td>
          <td>${student.student_id}</td>
          <td>${student.name || "-"}</td>
          <td>${student.gender === "male" ? "ชาย" : "หญิง"}</td>
        </tr>
      `;
    });

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Print - ${title}</title>
          <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@400;600;700&display=swap" rel="stylesheet">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              padding: 20px;
            }
            .print-title {
              text-align: center;
              font-size: 20px;
              font-weight: bold;
              margin-bottom: 20px;
              color: #333;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              page-break-inside: auto;
            }
            thead {
              display: table-header-group;
            }
            tr {
              page-break-inside: avoid;
              page-break-after: auto;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px 12px;
              text-align: center;
            }
            th {
              background-color: #f5f5f5;
              color: #65758b;
              font-weight: bold;
              font-size: 17px;
            }
            td {
              color: #333;
              font-size: 15px;
            }
            td:first-child {
              color: #65758b;
            }
            @page {
              size: A4;
              margin: 1.5cm;
            }
            @media print {
              body {
                print-color-adjust: exact;
                -webkit-print-color-adjust: exact;
              }
            }
          </style>
        </head>
        <body>
          <div class="print-title">${title}</div>
          <table>
            <thead>
              <tr>
                <th style="width: 60px;">ที่</th>
                <th style="width: 150px;">รหัสนักเรียน</th>
                <th style="width: 300px;">ชื่อ - สกุล</th>
                <th style="width: 200px;">เพศ</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();

    // รอให้โหลดเสร็จแล้วค่อยพิมพ์
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fadeIn"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
        onClick={onClose}
      >
        <div
          className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl h-300 max-h-[80vh] shadow-2xl overflow-hidden transform transition-all flex flex-col animate-scaleIn"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-6 py-4 border-b">
            <h2 className="text-2xl font-semibold font-[Prompt]">
              รายชื่อนักเรียนที่ยังไม่ได้ลงบันทึกห้องพัก
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            {loading ? (
              <div className="flex justify-center py-10">
                <BeatLoader color="#5a5c7e" size={18} />
              </div>
            ) : students.length === 0 ? (
              <div className="text-gray-500 text-center py-10 font-[Prompt]">
                ไม่มีนักเรียนที่ยังไม่ได้ลงบันทึกห้องพัก
              </div>
            ) : (
              <div className="overflow-x-auto">
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="Rooms Table">
                    <TableHead>
                      <TableRow>
                        <TableCell
                          align="center"
                          style={{
                            fontFamily: "Prompt",
                            width: "60px",
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
                            width: "150px",
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
                            width: "300px",
                          }}
                        >
                          ชื่อ - สกุล
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
                          เพศ
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {students.map((student, index) => (
                        <TableRow
                          key={index}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
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
                            {student.gender === "male" ? "ชาย" : "หญิง"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            )}
          </div>

          <div className="font-[Prompt] font-semibold px-6 py-4 border-t flex justify-end gap-3">
            <button
              onClick={handlePrint}
              className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors cursor-pointer"
              disabled={students.length === 0}
            >
              พิมพ์
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors cursor-pointer"
            >
              ปิด
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UnassignedStudentsModal;