"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X, LayoutDashboard, Users, School, LogOut } from "lucide-react";
import { useAuth } from "./AuthProvider";

const menuItems = [
  { id: "dashboard", icon: LayoutDashboard, label: "แดชบอร์ด", details: "" },
  { id: "students", icon: Users, label: "นักเรียน", details: "students" },
  { id: "rooms", icon: School, label: "รายการห้องพัก", details: "rooms" },
];

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { signOut, user } = useAuth();

  // Close menu when pathname changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Close menu when pressing Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <>
      {/* Hamburger Button */}
      <div className="sm:hidden fixed top-4 left-4 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg bg-transparent border border-gray-400 text-gray-400 duration-300"
          aria-label="Menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay and Content */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="sm:hidden fixed inset-0 bg-black/50 z-30 animate-in fade-in duration-300 ease-out"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu Content */}
          <nav className="sm:hidden fixed top-0 left-0 h-screen w-72 bg-[#0A2A65] text-white z-40 flex flex-col shadow-2xl animate-slideInFromLeft">
            {" "}
            {/* Header */}
            <div className="h-[93px] border-blue-900 flex items-center gap-4 px-5 border-b">
              <span
                className="text-xl font-semibold text-white"
                style={{ fontFamily: "Prompt" }}
              >
                S.M.T Camp
              </span>
            </div>
            {/* Body */}
            <div className="flex-1 py-6 px-3 overflow-y-auto">
              <ul className="space-y-3">
                {menuItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive =
                    pathname === `/${item.details}` ||
                    (item.details === "" && pathname === "/");
                  return (
                    <Link
                      href={`/${item.details}`}
                      key={index}
                      className={`${
                        isActive
                          ? "bg-[#3c83f5] text-white shadow-[0_0_30px_rgba(59,130,246,0.3)]"
                          : "text-[#b5c0d1] hover:bg-[#0e327a] hover:text-white"
                      } w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span
                        style={{ fontFamily: "Prompt" }}
                        className="font-medium"
                      >
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </ul>
            </div>
            {/* Footer */}
            <div className="p-4 border-t border-[#154b8c] font-[Prompt]">
              <div className="flex items-center gap-4 px-2 mb-3">
                <div className="w-10 h-10 rounded-full bg-[#154b8c] flex items-center justify-center">
                  <span className="text-sm font-semibold text-sidebar-foreground">
                    ครู
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-sidebar-foreground">
                    {user?.email?.split("@")[0] || "คุณครู"}
                  </p>
                  <p className="text-xs text-sidebar-foreground/60">
                    ผู้ดูแลระบบ
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  signOut();
                  setIsOpen(false);
                }}
                className="cursor-pointer w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 hover:bg-[#0e327a] text-[#b5c0d1] hover:text-white"
              >
                <LogOut className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">ออกจากระบบ</span>
              </button>
            </div>
          </nav>
        </>
      )}
    </>
  );
};

export default MobileMenu;
