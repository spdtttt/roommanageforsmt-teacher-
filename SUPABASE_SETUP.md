# คู่มือการตั้งค่า Supabase Authentication

## ขั้นตอนการติดตั้ง

### 1. ติดตั้ง Package ที่จำเป็น

```bash
npm install @supabase/ssr @supabase/supabase-js
```

### 2. สร้างโปรเจค Supabase

1. ไปที่ [https://supabase.com](https://supabase.com)
2. สร้างโปรเจคใหม่
3. ไปที่ Settings > API
4. คัดลอก:
   - **Project URL** (NEXT_PUBLIC_SUPABASE_URL)
   - **anon/public key** (NEXT_PUBLIC_SUPABASE_ANON_KEY)

### 3. ตั้งค่า Environment Variables

สร้างไฟล์ `.env.local` ใน root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. ตั้งค่า Authentication ใน Supabase Dashboard

1. ไปที่ Authentication > Providers
2. เปิดใช้งาน Email provider
3. (Optional) ปิดการใช้งาน "Enable email confirmations" ถ้าต้องการให้ login ได้ทันทีโดยไม่ต้องยืนยันอีเมล

### 5. สร้างผู้ใช้ทดสอบ

1. ไปที่ Authentication > Users
2. คลิก "Add user" > "Create new user"
3. กรอก Email และ Password
4. คลิก "Create user"

## โครงสร้างไฟล์ที่สร้างขึ้น

```
lib/supabase/
├── client.ts          # Client-side Supabase client
├── server.ts          # Server-side Supabase client
└── middleware.ts      # Middleware client สำหรับ route protection

app/
├── middleware.ts      # Next.js middleware สำหรับ protect routes
└── layout.tsx         # Root layout ที่ wrap ด้วย AuthProvider

components/
├── AuthProvider.tsx       # Context provider สำหรับ auth state
├── ProtectedLayout.tsx     # Layout ที่ตรวจสอบ auth และแสดง Sidebar
└── LoginForm.tsx          # ฟอร์ม login ที่ใช้ Supabase
```

## การทำงาน

1. **Middleware** (`app/middleware.ts`):
   - ตรวจสอบ session ทุก request
   - Redirect ไป `/login` ถ้ายังไม่ได้ login
   - Refresh session อัตโนมัติ

2. **AuthProvider** (`components/AuthProvider.tsx`):
   - จัดการ auth state ทั้งหมด
   - ให้ context สำหรับ components อื่นๆ
   - มีฟังก์ชัน `signOut()` สำหรับออกจากระบบ

3. **ProtectedLayout** (`components/ProtectedLayout.tsx`):
   - ตรวจสอบ auth state
   - แสดง Sidebar เฉพาะเมื่อ login แล้ว
   - Redirect ไป `/login` ถ้ายังไม่ได้ login
   - แสดง loading state ขณะตรวจสอบ

4. **LoginForm** (`components/LoginForm.tsx`):
   - ใช้ Supabase `signInWithPassword()`
   - จัดการ error และ loading state
   - Redirect ไปหน้าหลักเมื่อ login สำเร็จ

## การใช้งานใน Components อื่นๆ

```tsx
'use client'
import { useAuth } from '@/components/AuthProvider'

export default function MyComponent() {
  const { user, loading, signOut } = useAuth()
  
  if (loading) return <div>Loading...</div>
  
  return (
    <div>
      <p>Welcome, {user?.email}</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  )
}
```

## การใช้งานใน Server Components

```tsx
import { createClient } from '@/lib/supabase/server'

export default async function ServerComponent() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  return <div>User: {user?.email}</div>
}
```

## หมายเหตุ

- Middleware จะ protect ทุก route ยกเว้น `/login` และ static files
- Session จะถูก refresh อัตโนมัติโดย middleware
- ถ้าต้องการ protect API routes เพิ่มเติม ให้ตรวจสอบ auth ใน route handlers

