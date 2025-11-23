"use client"
import {Calendar, Home, Mail, Zap} from "lucide-react";
import { MusicTooltip } from "@/components/MusicTooltip";
import MiniYoutubePlayer from "@/components/MiniYoutubePlayer";
import BackgroundChanger from "@/components/BackgroundChanger";
import { useFocusMode } from "@/lib/FocusModeContext";
import Support from "@/components/Support";

export default function BottomBar() {
    const { isSuperFocus, toggleSuperFocus } = useFocusMode();  // Sử dụng context
    return (
        <div className="fixed inset-x-0 bottom-0 z-50">
            {/* Giữ nguyên */}
            <div className="flex items-center justify-between py-4 px-6 ">

                {/* BÊN TRÁI: Ẩn nhưng vẫn chiếm chỗ khi super focus */}
                <div className={`flex items-center gap-8 ${isSuperFocus ? 'invisible' : ''}`}>

                    <MusicTooltip />   {/* Giữ nguyên */}
                    <MiniYoutubePlayer />

                    <BackgroundChanger/>
                    <Support/>
                </div>

                {/* BÊN PHẢI: Zap giữ nguyên */}
                <button
                    className="text-white rounded-full bg-gradient-to-r from-purple-600 to-pink-600 p-3 shadow-lg"
                    onClick={toggleSuperFocus}  // Kết nối toggle
                >
                    <Zap size={24} />
                </button>
            </div>
        </div>
    );
}