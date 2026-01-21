"use client";

import { useAuth } from "./AuthProvider";
import Sidebar from "./Sidebar";
import MobileMenu from "./MobileMenu";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BeatLoader } from "react-spinners";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isAuthPage = pathname === "/login" || pathname === "/reset-password";
  const isUpdatePasswordPage = pathname === "/update-password";
  const isPublicPage = isAuthPage || isUpdatePasswordPage;

  useEffect(() => {
    if (!loading) {
      if (!user && !isPublicPage) {
        router.push("/login");
      } else if (user && isAuthPage) {
        // Only redirect if on login/reset-password, NOT update-password
        router.push("/");
      }
    }
  }, [user, loading, isPublicPage, isAuthPage, router]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center mt-30">
        <BeatLoader color="#5a5c7e" size={18} />
      </div>
    );
  }

  // If on login page, don't show sidebar and use full screen layout
  if (isPublicPage) {
    return <div className="w-full h-screen">{children}</div>;
  }

  // If not authenticated, don't render (will redirect)
  if (!user) {
    return null;
  }

  // Show sidebar and main content for authenticated users
  return (
    <div className="flex w-full h-screen">
      <div className="hidden sm:block">
        <Sidebar />
      </div>
      <MobileMenu />
      <main className="sm:ml-20 lg:ml-67 flex-1 w-[calc(100%-5rem)] md:w-full bg-[#f8fafc] overflow-y-auto h-screen">
        {children}
      </main>
    </div>
  );
}
