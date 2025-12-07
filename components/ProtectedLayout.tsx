'use client'

import { useAuth } from './AuthProvider'
import Sidebar from './Sidebar'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BeatLoader } from 'react-spinners'

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const isLoginPage = pathname === '/login'

  useEffect(() => {
    if (!loading) {
      if (!user && !isLoginPage) {
        router.push('/login')
      } else if (user && isLoginPage) {
        router.push('/')
      }
    }
  }, [user, loading, isLoginPage, router])

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center mt-30">
        <BeatLoader color="#5a5c7e" size={18} />
      </div>
    )
  }

  // If on login page, don't show sidebar and use full screen layout
  if (isLoginPage) {
    return (
      <div className="w-full h-screen">
        {children}
      </div>
    )
  }

  // If not authenticated, don't render (will redirect)
  if (!user) {
    return null
  }

  // Show sidebar and main content for authenticated users
  return (
    <div className="flex w-full h-screen">
      <Sidebar />
      <main className="ml-20 lg:ml-67 flex-1 w-[calc(100%-5rem)] md:w-full bg-[#f8fafc] overflow-y-auto h-screen">
        {children}
      </main>
    </div>
  )
}

