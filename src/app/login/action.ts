'use server'

import { redirect } from 'next/navigation'
import { createClient } from "@/utils/suspabase/server"  // ← dùng server client

export async function login(formData: FormData) {
    const suspabase = await createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await suspabase.auth.signInWithPassword(data)

    if (error) {
        return { error: error.message }
    }

    // revalidatePath('/', 'layout')
    redirect('/')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
        },
    })

    if (error) {
        return { error: error.message }
    }

    // Supabase gửi mail xác nhận tự động
    return { success: true }
}