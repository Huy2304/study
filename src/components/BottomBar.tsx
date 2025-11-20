// components/BottomBar.tsx
import {Image, Home, Zap} from "lucide-react";
import {MusicTooltip} from "@/components/MusicTooltip";
import MiniYoutubePlayer from "@/components/MiniYoutubePlayer";
import BackgroundChanger from "@/components/BackgroundChanger";

export default function BottomBar() {
    return (
        <div className="fixed inset-x-0 bottom-0 z-50">
            {/* Chỉ đổi justify-around → justify-between + thêm px để đẹp */}
            <div className="flex items-center justify-between py-4 px-6 ">

                {/* BÊN TRÁI: 4 nút dồn sát trái */}
                <div className="flex items-center gap-8">
                    <button className="text-white/60 hover:text-white transition">
                        <Home size={24} />
                    </button>

                    <MusicTooltip />   {/* Giữ nguyên y chang */}
                    <MiniYoutubePlayer />

                    <BackgroundChanger/>
                </div>

                {/* BÊN PHẢI: Zap sát phải, giữ nguyên kiểu cũ của bạn */}
                <button className="text-white rounded-full bg-gradient-to-r from-purple-600 to-pink-600 p-3 shadow-lg">
                    <Zap size={24} />
                </button>
            </div>
        </div>
    );
}