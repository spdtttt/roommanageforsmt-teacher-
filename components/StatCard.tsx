import { LucideIcon } from "lucide-react";

interface StatCardProps {
    title: string;
    value: any;
    icon?: LucideIcon;
    variant?: string;
}

const StatCard = ({ title, value, icon: Icon, variant }: StatCardProps) => {
    const isPrimary = variant !== 'default';
    return (
        <div className={`${isPrimary ? 'bg-[#0e327a]' : 'bg-white'} rounded-2xl p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}>
            <div className="flex items-start justify-between">
                <div>
                    <p className={`text-sm font-medium font-[Prompt] ${isPrimary ? 'text-gray-300' : 'text-gray-600'}`}>{title}</p>
                    <p className={`text-3xl font-bold mt-2 font-[Prompt] ${isPrimary ? 'text-white' : 'text-black'}`}>{value}</p>
                </div>
                {Icon && (
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white bg-[#406197]">
                        <Icon className="w-6 h-6" />
                    </div>
                )}
            </div>
        </div>
    )
}
export default StatCard