"use client"
import { Zap} from "lucide-react";
import { MusicTooltip } from "@/components/MusicTooltip";
import MiniYoutubePlayer from "@/components/MiniYoutubePlayer";
import BackgroundChanger from "@/components/BackgroundChanger";
import { useFocusMode } from "@/lib/FocusModeContext";
import Support from "@/components/Support";

export default function BottomBar() {
    const { isSuperFocus, toggleSuperFocus } = useFocusMode();  // Sử dụng context
    return (
        <div className="fixed inset-x-0 bottom-0 z-50">
            <div className="flex items-center justify-between py-4 px-6 ">
                <div className={`flex items-center gap-8 ${isSuperFocus ? 'invisible' : ''}`}>
                    <MusicTooltip />   {/* Giữ nguyên */}
                    <MiniYoutubePlayer />
                    <BackgroundChanger/>
                    <Support/>
                </div>
                <button
                    className="text-white rounded-full bg-gradient-to-r from-purple-600 to-pink-600 p-3 shadow-lg"
                    onClick={toggleSuperFocus}
                >
                    <Zap size={24} />
                </button>
            </div>
        </div>
    );
}