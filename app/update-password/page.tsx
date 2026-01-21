import UpdatePasswordForm from "@/components/UpdatePasswordForm";
import Logo from "@/public/smt_logo.jpg";
import Image from "next/image";

const UpdatePassword = () => {
    return (
        <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4 -mt-5 relative overflow-hidden font-[Prompt]">
            <div className="w-full max-w-md relative z-10">
                {/* Logo & Title */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-30 h-30 mb-6 shadow-xl rounded-2xl overflow-hidden bg-white">
                        <Image
                            src={Logo}
                            alt="logo"
                            priority
                            className="object-cover w-full h-full"
                        />
                    </div>
                    <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-2">
                        SMT Camp
                    </h1>
                    <p className="text-gray-500 text-lg">ระบบเข้าสู่ระบบสำหรับคุณครู</p>
                </div>

                {/* Update Password Card */}
                <div className="rounded-2xl p-8 bg-white shadow-lg">
                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold mb-1">ตั้งรหัสผ่านใหม่</h2>
                        <p className="text-md text-gray-500">
                            กรุณากรอกรหัสผ่านใหม่ของคุณ
                        </p>
                    </div>

                    <UpdatePasswordForm />
                </div>

                {/* Footer */}
                <p className="text-center text-sm mt-6 text-gray-500">
                    © 2025 SMT Camp. Muang Suratthani School.
                </p>
            </div>
        </div>
    );
};

export default UpdatePassword;
