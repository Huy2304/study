// app/auth/signout/action.ts   ← hoặc để trong components đều được
"use server"

import { createClient } from "@/utils/suspabase/server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function logout() {
    const supabase = await createClient()
    await supabase.auth.signOut()

    // revalidatePath("/", "layout")
    redirect("/")
}