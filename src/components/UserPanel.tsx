'use client';

import { User, Settings, LogOut, HelpCircle, Crown } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export default function UserPanel() {
    return (
        <TooltipProvider delayDuration={300}>
            <Tooltip>
                {/* Avatar làm Trigger */}
                <TooltipTrigger asChild>
                    <button className="relative w-11 h-11 rounded-full bg-gradient-to-br from-purple-500 to-pink-500
                           flex items-center justify-center text-white font-bold text-lg
                           shadow-xl ring-4 ring-white/20 hover:ring-white/40
                           transition-all duration-300 hover:scale-110">
                        <User size={24} className="drop-shadow" />
                        {/* Chấm xanh online nhỏ (tùy chọn đẹp) */}
                        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-black rounded-full"></span>
                    </button>
                </TooltipTrigger>

                {/* Nội dung Tooltip - hiện khi hover avatar */}
                <TooltipContent
                    side="bottom"
                    align="end"
                    className="bg-black/95 backdrop-blur-2xl border border-white/20 p-0 rounded-2xl shadow-2xl overflow-hidden"
                    sideOffset={12}
                >
                    <div className="w-72">
                        {/* Header đẹp */}
                        <div className="bg-gradient-to-r from-purple-600/50 to-pink-600/50 px-5 py-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                                    <User size={28} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-white font-bold">User</p>
                                    <p className="text-white/70 text-xs flex items-center gap-1">
                                        <Crown size={14} className="text-yellow-400" />
                                        Pro Member
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Menu */}
                        <div className="p-3 space-y-1">
                            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl
                               hover:bg-white/10 transition text-white/80 text-left">
                                <Settings size={18} />
                                <span>Cài đặt</span>
                            </button>

                            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl
                               hover:bg-white/10 transition text-white/80 text-left">
                                <HelpCircle size={18} />
                                <span>Trợ giúp & Hỗ trợ</span>
                            </button>

                            <div className="border-t border-white/10 my-2"></div>

                            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl
                               hover:bg-red-500/20 transition text-red-400 text-left">
                                <LogOut size={18} />
                                <span>Đăng xuất</span>
                            </button>
                        </div>
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}