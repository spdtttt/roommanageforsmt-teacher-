"use client";
import Link from "next/link";

interface Camp {
  id: number;
  title: string;
  class: number;
  dateStart: string;
  dateEnd: string;
  max: number;
  percentage: number;
}

const CampShow = ({ camps }: { camps: Camp[] }) => {
  const formatDateRange = (dateStart: string, dateEnd: string) => {
    const startDate = new Date(dateStart);
    const endDate = new Date(dateEnd);

    const formatter = new Intl.DateTimeFormat("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
      calendar: "buddhist",
    });

    return `${formatter.format(startDate)} - ${formatter.format(endDate)}`;
  };
  return (
    <>
      {/* Grid responsive: 1 col (mobile), 2 cols (tablet), 3 cols (desktop) */}
      <div className="flex justify-center p-6 lg:p-8 font-[Prompt]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8 lg:gap-10 justify-items-center md:justify-items-stretch w-full">
          {camps.map((item: Camp) => (
            <div
              key={item.id}
              className="w-full bg-white shadow-md hover:shadow-lg border-2 border-gray-300 rounded-3xl px-4 py-3 sm:px-5 md:py-7 duration-300 hover:-translate-y-1 flex flex-col max-w-md md:max-w-none"
            >
              <div className="flex justify-between ">
                <h1 className="text-xl sm:text-2xl mb-2 font-semibold">
                  {item.title}
                </h1>
                {/* Progress Bar */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-20 h-2.5 bg-gray-200 rounded-xl overflow-hidden">
                    <div
                      className="h-full bg-green-600 rounded-xl transition-all duration-300"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <p className="text-sm text-green-600">{item.percentage}%</p>
                </div>
              </div>
              <p className="text-sm sm:text-base text-gray-500 font-medium">
                ห้อง:{" "}
                {item.class === 409
                  ? "4/9"
                  : item.class === 509
                  ? "5/9"
                  : "6/9"}
              </p>
              <p className="text-sm sm:text-base text-gray-500 font-medium">
                จำนวนคนต่อห้อง: {item.max}
              </p>
              <p className="text-sm sm:text-base text-gray-500 font-medium">
                วันที่: {formatDateRange(item.dateStart, item.dateEnd)}
              </p>

              <div className="flex justify-end mt-auto pt-3">
                <Link
                  href={`/camps/${item.id}`}
                  className="text-base sm:text-lg hover:underline cursor-pointer flex"
                >
                  คลิก
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
export default CampShow;
