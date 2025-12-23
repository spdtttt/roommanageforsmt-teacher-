'use client'
import { useEffect, useState } from "react";
import axios from 'axios';
import { MousePointerClick } from "lucide-react";

interface Student {
  id: number;
  student_id: number;
  name: string | null;
  gender: string | null;
  class: number | null;
}

interface RoomWithStudents {
  id: number;
  note: string | null;
  students: Student[];
}

const AssignedStudentsButton = ({ campId, campInfo }: { campId: number, campInfo: any }) => {
  const [rooms, setRooms] = useState<RoomWithStudents[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (campId) {
      fetchAssignedStudents();
    }
  }, [campId])

  const fetchAssignedStudents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/camps/${campId}/assigned-students`);
      setRooms(response.data);
    } catch (error) {
      console.error("Error fetching assigned students:", error);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  }

  const handlePrint = () => {
    if (loading) return;

    // สร้างหน้าต่างใหม่สำหรับพิมพ์
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    // สร้าง HTML สำหรับพิมพ์
    const title = `รายชื่อห้องพักนักเรียน ${campInfo?.title} ${campInfo?.class === 108 ? 'ม.1/8'
      : campInfo?.class === 208 ? 'ม.2/8'
        : campInfo?.class === 308 ? 'ม.3/8'
          : campInfo?.class === 409 ? 'ม.4/9'
            : campInfo?.class === 509 ? 'ม.5/9'
              : 'ม.6/9'
      }`;

    let tableRows = "";
    rooms.forEach((room, index) => {
      const studentNames = room.students.map(s => s.name || "-").join("<br>");
      tableRows += `
        <tr>
          <td>${index + 1}</td>
          <td style="text-align: left; padding-left: 15px;">${studentNames}</td>
          <td></td>
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
              vertical-align: middle;
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
            td:last-child {
              min-height: 30px;
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
                <th style="width: 250px;">สมาชิกในห้อง</th>
                <th style="width: 150px;">เลขห้อง</th>
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

    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  return (
    <button
      disabled={loading}
      onClick={handlePrint}
      className={`cursor-pointer ${loading ? 'opacity-50 cursor-not-allowed' : ''} flex gap-3 items-center cursor-pointer px-4 font-bold py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-[20px] font-[Prompt]`}
    >
      <MousePointerClick className='w-6 h-6' />
      พิมพ์รายการห้องพักของนักเรียน
    </button>
  )
}
export default AssignedStudentsButton