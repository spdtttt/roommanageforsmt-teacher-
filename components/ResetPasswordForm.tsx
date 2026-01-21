"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Mail, Send, ArrowLeft, CheckCircle } from "lucide-react";
import { BeatLoader } from "react-spinners";
import Link from "next/link";

const ResetPasswordForm = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!email) {
            setError("กรุณากรอกอีเมล");
            setLoading(false);
            return;
        }

        try {
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(
                email,
                {
                    redirectTo: `https://smtteacher.vercel.app/update-password`,
                }
            );

            if (resetError) {
                setError("ไม่สามารถส่งอีเมลรีเซ็ตรหัสผ่านได้ กรุณาลองใหม่อีกครั้ง");
                setLoading(false);
                return;
            }

            setSuccess(true);
            setLoading(false);
        } catch (err) {
            setError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <BeatLoader color="#0a0a4f" />
            </div>
        );
    }

    if (success) {
        return (
            <div className="text-center space-y-4">
                <div className="flex justify-center">
                    <div className="bg-green-100 p-4 rounded-full">
                        <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-800">ส่งอีเมลสำเร็จ!</h3>
                <p className="text-gray-600">
                    เราได้ส่งลิงก์สำหรับรีเซ็ตรหัสผ่านไปยัง
                    <br />
                    <span className="font-medium text-blue-600">{email}</span>
                </p>
                <p className="text-sm text-gray-500">
                    กรุณาตรวจสอบอีเมลของคุณและคลิกลิงก์เพื่อรีเซ็ตรหัสผ่าน
                </p>
                <Link
                    href="/login"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mt-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    กลับไปหน้าเข้าสู่ระบบ
                </Link>
            </div>
        );
    }

    return (
        <>
            {error && (
                <div className="px-4 py-2.5 bg-red-50 border border-red-200 rounded-lg mb-4">
                    <p className="text-red-600">{error}</p>
                </div>
            )}
            <form onSubmit={onSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label
                        htmlFor="email"
                        className="font-medium text-md text-gray-700"
                    >
                        อีเมล
                    </label>
                    <div className="relative text-gray-700">
                        <Mail className="text-gray-700 absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5" />
                        <input
                            autoComplete="off"
                            type="email"
                            id="email"
                            placeholder="กรอกอีเมลของคุณ"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-12 py-3 w-full border-gray-300 border-1 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <p className="text-sm text-gray-500">
                        เราจะส่งลิงก์สำหรับรีเซ็ตรหัสผ่านไปยังอีเมลนี้
                    </p>
                </div>

                <button
                    type="submit"
                    className="group w-full bg-blue-900 cursor-pointer justify-center items-center flex py-3 rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50"
                    disabled={loading}
                >
                    <span className="flex items-center gap-2 text-white text-xl">
                        <Send className="group-hover:-translate-x-2 duration-300 w-5 h-5" />
                        ส่งลิงก์รีเซ็ตรหัสผ่าน
                    </span>
                </button>

                <div className="text-center">
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        กลับไปหน้าเข้าสู่ระบบ
                    </Link>
                </div>
            </form>
        </>
    );
};

export default ResetPasswordForm;
