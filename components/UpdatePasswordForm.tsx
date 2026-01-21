"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { LockKeyhole, Save, CheckCircle, Eye, EyeOff } from "lucide-react";
import { BeatLoader } from "react-spinners";
import Link from "next/link";

const UpdatePasswordForm = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmVisible, setIsConfirmVisible] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!password || !confirmPassword) {
            setError("กรุณากรอกรหัสผ่านทั้งสองช่อง");
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError("รหัสผ่านไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง");
            setLoading(false);
            return;
        }

        try {
            const { error: updateError } = await supabase.auth.updateUser({
                password: password,
            });

            if (updateError) {
                setError("ไม่สามารถอัพเดตรหัสผ่านได้ กรุณาลองใหม่อีกครั้ง");
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
                <h3 className="text-xl font-semibold text-gray-800">
                    เปลี่ยนรหัสผ่านสำเร็จ!
                </h3>
                <p className="text-gray-600">
                    รหัสผ่านของคุณได้รับการอัพเดตเรียบร้อยแล้ว
                </p>
                <Link
                    href="/login"
                    className="inline-flex items-center justify-center gap-2 bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors mt-4"
                >
                    ไปหน้าเข้าสู่ระบบ
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
                        htmlFor="password"
                        className="font-medium text-md text-gray-700"
                    >
                        รหัสผ่านใหม่
                    </label>
                    <div className="relative text-gray-700">
                        <LockKeyhole className="text-gray-700 absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5" />
                        <input
                            autoComplete="new-password"
                            type={isPasswordVisible ? "text" : "password"}
                            id="password"
                            placeholder="กรอกรหัสผ่านใหม่"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-12 pr-12 py-3 w-full border-gray-300 border-1 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                            type="button"
                            onClick={() => setIsPasswordVisible((v) => !v)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 cursor-pointer"
                            aria-label={isPasswordVisible ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                        >
                            {isPasswordVisible ? (
                                <Eye className="w-5 h-5" />
                            ) : (
                                <EyeOff className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="confirmPassword"
                        className="font-medium text-md text-gray-700"
                    >
                        ยืนยันรหัสผ่านใหม่
                    </label>
                    <div className="relative text-gray-700">
                        <LockKeyhole className="text-gray-700 absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5" />
                        <input
                            autoComplete="new-password"
                            type={isConfirmVisible ? "text" : "password"}
                            id="confirmPassword"
                            placeholder="กรอกรหัสผ่านอีกครั้ง"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="pl-12 pr-12 py-3 w-full border-gray-300 border-1 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                            type="button"
                            onClick={() => setIsConfirmVisible((v) => !v)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 cursor-pointer"
                            aria-label={isConfirmVisible ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                        >
                            {isConfirmVisible ? (
                                <Eye className="w-5 h-5" />
                            ) : (
                                <EyeOff className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                    <p className="text-sm text-gray-500">
                        รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร
                    </p>
                </div>

                <button
                    type="submit"
                    className="group w-full bg-blue-900 cursor-pointer justify-center items-center flex py-3 rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50"
                    disabled={loading}
                >
                    <span className="flex items-center gap-2 text-white text-xl">
                        <Save className="group-hover:-translate-x-2 duration-300 w-5 h-5" />
                        บันทึกรหัสผ่านใหม่
                    </span>
                </button>
            </form>
        </>
    );
};

export default UpdatePasswordForm;
