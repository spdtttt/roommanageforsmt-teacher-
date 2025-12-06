'use client'
import Image from "next/image"
import { usePathname } from "next/navigation"
import logo from '@/public/smt_logo.jpg'
import Link from "next/link"
import { LayoutDashboard, Users, School } from 'lucide-react'

const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'แดชบอร์ด', details: '' },
    { id: 'students', icon: Users, label: 'นักเรียน', details: 'students' },
    { id: 'rooms', icon: School, label: 'ห้อง', details: 'rooms' },
]

const Sidebar = () => {
    const pathname = usePathname();

    return (
        <>
            <nav className={`fixed inset-y-0 left-0 z-50 shadow-md min-h-screen h-auto flex flex-col duration-500 w-20 lg:w-67 bg-[#0A2A65] text-white`} >
                {/* Header */}
                <div className={`h-[93px] border-blue-900 flex items-center gap-4 justify-center lg:justify-start lg:px-7 border-b`}>
                    <div className="w-13 h-13 rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                        <Image src={logo} alt="logo" className="w-13 h-13 rounded-lg" />
                    </div>
                    <span className="hidden lg:block text-2xl font-semibold text-white" style={{
                        fontFamily: 'Prompt'
                    }}>S.M.T Camp</span>
                </div>

                {/* Body */}
                <div className="flex-1 py-6 px-3">
                    <ul className="space-y-3">
                        {
                            menuItems.map((item, index) => {
                                const Icon = item.icon;
                                const isActive = pathname === `/${item.details}` || (item.details === '' && pathname === '/');
                                return (
                                    <Link href={`/${item.details}`} key={index} className={`${isActive && 'bg-[#3c83f5] text-white shadow-[0_0_30px_rgba(59,130,246,0.3)]'} text-[#b5c0d1] w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300 hover:bg-[#0e327a] hover:text-white hover:shadow-lg`}>
                                        <Icon className="w-5 h-5 flex-shrink-0" />
                                        <span style={{
                                            fontFamily: 'Prompt'
                                        }} className={`hidden lg:block font-medium`}>{item.label}</span>
                                    </Link>
                                )
                            })
                        }
                    </ul>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-[#154b8c] font-[Prompt]">
                    <div className="flex items-center gap-4 px-2">
                        <div className="w-10 h-10 rounded-full bg-[#154b8c] flex items-center justify-center">
                            <span className="text-sm font-semibold text-sidebar-foreground">ครู</span>
                        </div>
                        <div className="hidden lg:block flex-1">
                            <p className="text-sm font-medium text-sidebar-foreground">คุณครู</p>
                            <p className="text-xs text-sidebar-foreground/60">ผู้ดูแลระบบ</p>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}
export default Sidebar