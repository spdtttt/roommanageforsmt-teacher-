"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, LockKeyhole, LogIn } from "lucide-react";
import { EyeOff, Eye } from "lucide-react";
import { BeatLoader } from "react-spinners";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) {
        setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
        setLoading(false);
        return;
      }

      if (data.user) {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="flex justify-self-center">
        <BeatLoader color="#0a0a4f" />
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className="px-4 py-2.5 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="studentId"
            className="font-medium text-md text-gray-700"
          >
            อีเมล
          </label>
          <div className="relative text-gray-700">
            <User className="text-gray-700 absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5" />
            <input
              autoComplete="off"
              type="text"
              id="email"
              placeholder="อีเมล"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-12 py-3 w-full border-gray-300 border-1 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="nationalId"
            className="font-medium text-md text-gray-700"
          >
            รหัสผ่าน
          </label>
          <div className="relative text-gray-700">
            <LockKeyhole className="text-gray-700 absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5" />
            <input
              autoComplete="off"
              type={isVisible ? "text" : "password"}
              id="password"
              placeholder="รหัสผ่าน"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-12 pr-12 py-3 w-full border-gray-300 border-1 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => setIsVisible((v) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 cursor-pointer"
              aria-label={isVisible ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
            >
              {isVisible ? (
                <Eye className="w-5 h-5" />
              ) : (
                <EyeOff className="w-5 h-5" />
              )}
            </button>
          </div>
          <Link href="/reset-password" className="flex justify-end text-blue-800 hover:underline text-md">
            ลืมรหัสผ่าน
          </Link>
        </div>

        <button
          type="submit"
          className="group w-full bg-blue-900 cursor-pointer justify-center items-center flex py-3 rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50"
          disabled={loading}
        >
          {/* ถ้ากำลังเข้าสู่ระบบ */}
          {loading ? (
            <span className="flex items-center text-white text-xl">
              กำลังเข้าสู่ระบบ...
            </span>
          ) : (
            <span className="flex items-center gap-2 text-white text-xl">
              <LogIn className="group-hover:-translate-x-2 duration-300 w-5 h-5" />
              เข้าสู่ระบบ
            </span>
          )}
        </button>
      </form>
    </>
  );
};
export default LoginForm;
