"use client"

import { useEffect, useState } from "react"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { createClient } from "@/utils/suspabase/client"  // ← DÙNG CLIENT
import { User, LogOut, LogIn, Settings, HelpCircle, Crown } from "lucide-react"
import { logout } from "@/app/auth/signout/action"

export default function UserPanel() {
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const supabase = createClient()
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user)
            setLoading(false)
        })

        // Optional: listen realtime nếu cần
        const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
            setUser(session?.user ?? null)
        })

        return () => listener.subscription.unsubscribe()
    }, [])

    if (loading) {
        return (
            <button className="relative w-11 h-11 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 animate-pulse" />
        )
    }

    return (
        <TooltipProvider delayDuration={150}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <button className="relative w-11 h-11 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-xl ring-4 ring-white/20 hover:ring-white/40 transition-all duration-300 hover:scale-110">
                        <User size={24} strokeWidth={2} className="drop-shadow" />
                        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-black rounded-full"></span>
                    </button>
                </TooltipTrigger>

                <TooltipContent
                    side="bottom"
                    align="end"
                    className="bg-black/95 backdrop-blur-2xl border border-white/20 p-0 rounded-2xl shadow-2xl overflow-hidden"
                    sideOffset={12}
                >
                    <div className="w-72">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-purple-600/50 to-pink-600/50 px-5 py-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                                    <User size={28} strokeWidth={2} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-white font-bold">
                                        {user?.email?.split("@")[0] || "Khách"}
                                    </p>
                                    <p className="text-white/70 text-xs flex items-center gap-1">
                                        Pro Member
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-3 space-y-1">
                            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition text-white/80 text-left">
                                <Settings size={18} strokeWidth={2} />
                                <span>Cài đặt</span>
                            </button>
                            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition text-white/80 text-left">
                                <HelpCircle size={18} strokeWidth={2} />
                                <span>Trợ giúp</span>
                            </button>
                            <div className="border-t border-white/10 my-2"></div>

                            {user ? (
                                <form action={logout} className="w-full">
                                    <button
                                        type="submit"
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/20 transition text-red-400 text-left"
                                    >
                                        <LogOut size={18} strokeWidth={2} />
                                        <span>Đăng xuất</span>
                                    </button>
                                </form>
                            ) : (
                                <a
                                    href="/login"
                                    className="flex w-full items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-500/20 transition text-blue-400"
                                >
                                    <LogIn size={20} strokeWidth={2} />
                                    <span>Đăng nhập</span>
                                </a>
                            )}
                        </div>
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}