'use client'

import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState } from "react"
import logo from '@/public/smt_logo.jpg'
import { MdMenuOpen } from "react-icons/md"
import { FaThList } from "react-icons/fa";
import { MdManageAccounts } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa"
import Link from "next/link"

const menuItems = [
    {
        icon: <FaThList size={30} />,
        label: 'รายการค่าย',
        detail: ''
    },
    {
        icon: <FaThList size={30} />,
        label: 'รายชื่อนักเรียน',
        detail: 'students'
    },
    {
        icon: <MdManageAccounts size={30} />,
        label: 'จัดการห้องพัก',
        detail: 'rooms'
    }
]

const Sidebar = () => {
    const [open, setOpen] = useState(true);
    const pathname = usePathname();

    return (
        <>
        {/* Backdrop for mobile when sidebar is open */}
        {open && (
            <div
                className="fixed inset-0 z-40 bg-black/40 md:hidden"
                onClick={() => setOpen(false)}
            />
        )}
        <nav className={`fixed md:static inset-y-0 left-0 z-50 shadow-md min-h-screen h-auto p-3 flex flex-col duration-500 ${open ? 'w-60 md:w-75' : 'w-20 md:w-30'} bg-blue-900 text-white`} >
            {/* Header */}
            <div className={`px-3 py-2 h-25 flex items-center ${open ? 'justify-between' : 'justify-center'}`}>
                <Image src={logo} alt="Logo" className={`${open ? 'w-10' : 'w-0'} rounded-md`} />
                <div><MdMenuOpen size={40} className={`duration-500 cursor-pointer ${!open && 'rotate-180'}`} onClick={() => setOpen(!open)} /></div>
            </div>

            {/* Body */}
            <ul className="flex-1">
                {
                    menuItems.map((item, index) => {
                        const isActive = pathname === `/${item.detail}` || (item.detail === '' && pathname === '/');
                        return (
                        <Link href={`/${item.detail}`} key={index} className={`${!open && 'justify-center'} px-3 my-3 h-20 ${isActive ? 'bg-blue-950' : 'hover:bg-blue-950'} rounded-md duration-300 cursor-pointer flex items-center gap-4 group`}>
                            <div className={`${!open && 'absolute'}`}>{item.icon}</div>
                            <p className={`${!open && 'w-0 translate-x-24'} duration-500 overflow-hidden`}>{item.label}</p>
                            {!open && (
                                <p className={`absolute left-16 bg-white text-gray-800 
                                    shadow-lg rounded-md px-3 py-1 
                                    opacity-0 pointer-events-none 
                                    whitespace-nowrap 
                                    transition-all duration-300 
                                    group-hover:opacity-100 group-hover:left-26`}>
                                    {item.label}
                                </p>
                            )}
                        </Link>
                    )})
                }
            </ul>

            {/* Footer */}
            <div className={`flex mb-2 items-center gap-4 justify-center`}>
                <div className={`${!open && 'absolute'}`}><FaUserCircle size={40} /></div>
                <div className={`leading-5 ${!open && 'w-0 translate-x-24'} duration-500 overflow-hidden`}>
                    <p>โรงเรียนเมืองสุราษฎร์ธานี</p>
                    <p className="text-xs">warunya@mst.ac.th</p>
                </div>
            </div>
        </nav>
        </>
    )
}
export default Sidebar