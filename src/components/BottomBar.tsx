// components/BottomBar.tsx
import { Home, MessageCircle, Settings, Zap } from "lucide-react";
import { MusicTooltip } from "@/components/MusicTooltip"; // ← Thay thế hoàn toàn

export default function BottomBar() {
    return (
        <div className="fixed inset-x-0 bottom-0 z-50">
            <div className="flex items-center justify-around py-4 px-2">
                <button className="text-white/60 hover:text-white transition"><Home size={24} /></button>
                <MusicTooltip />   {/* ← Chỉ cần cái này thôi! */}
                <button className="text-white/60 hover:text-white transition"><MessageCircle size={24} /></button>
                <button className="text-white/60 hover:text-white transition"><Settings size={24} /></button>
                <button className="text-white rounded-full bg-gradient-to-r from-purple-600 to-pink-600 p-3 shadow-lg"><Zap size={24} /></button>
            </div>
        </div>
    );
}