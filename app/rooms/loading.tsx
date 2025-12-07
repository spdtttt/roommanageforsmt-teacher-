import { BeatLoader } from "react-spinners";

export default function Loading() {
  return (
    <div className="w-full h-full flex flex-col">
      <header className="py-5 bg-white border-b border-[#e1e7ef] flex items-center justify-between px-6 lg:px-8 w-full">
        <div>
          <h1 className="text-2xl font-bold text-black font-[Prompt]">รายการห้องพัก</h1>
          <p className="text-sm font-[Prompt] text-gray-500">จัดการห้องพักของนักเรียนในแต่ละรายการค่าย</p>
        </div>
      </header>
      <div className="flex justify-center items-center py-20">
        <BeatLoader color="#5a5c7e" size={18} />
      </div>
    </div>
  );
}

