// app/account/page.tsx
import AccountForm from './account-form'
import { createClient } from "@/utils/suspabase/server"  // Dùng server client
import { redirect } from 'next/navigation'

export default async function AccountPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    // Nếu chưa đăng nhập → đá về login
    if (!user) {
        redirect('/login')
    }

    return <AccountForm user={user} />
}