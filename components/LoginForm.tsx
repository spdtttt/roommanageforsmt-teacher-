'use client'
import Logo from '@/public/smt_logo.jpg'
import Image from 'next/image'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError(signInError.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ')
        setLoading(false)
        return
      }

      if (data.user) {
        router.push('/')
        router.refresh()
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการเข้าสู่ระบบ')
      setLoading(false)
    }
  }

  return (
    <>
      <div className="w-full max-w-md font-[Prompt]">
        <div className="text-center mb-8">
          <Image src={Logo} alt='SMT Logo' className="inline-flex items-center justify-center w-16 h-16 rounded-2xl shadow-[0_0_30px_rgba(30,64,175,0.4)] mb-4"></Image>
          <h1 className="text-2xl font-bold text-blue-900">S.M.T Camp</h1>
          <p className="text-blue-600 mt-1">ระบบจัดการกิจกรรมห้องเรียน S.M.T</p>
        </div>
        <div className="bg-white rounded-2xl p-8 border border-blue-200 shadow-xl">
          <h2 className="text-xl font-semibold text-blue-900 text-center mb-6">เข้าสู่ระบบ</h2>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              {error}
            </div>
          )}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-blue-900">Email</label>
              <input
                id="email"
                type="email"
                placeholder="กรอก Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className='flex h-10 w-full rounded-md border px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm bg-blue-50 border-blue-200 text-blue-900 placeholder:text-blue-400 focus:border-blue-500 focus:ring-blue-500'
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-blue-900">Password</label>
              <input
                id="password"
                type="password"
                placeholder="กรอก Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className='flex h-10 w-full rounded-md border px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm bg-blue-50 border-blue-200 text-blue-900 placeholder:text-blue-400 focus:border-blue-500 focus:ring-blue-500 pr-10'
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className='cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary hover:bg-primary/90 h-10 px-4 w-full bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white font-medium py-2.5 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] disabled:hover:scale-100'
            >
              {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </button>
          </form>
        </div>
        <p className='text-center text-blue-600/70 text-sm mt-6'>© 2025 Muang Suratthani School (S.M.T)</p>
      </div>
    </>
  )
}
export default LoginForm
