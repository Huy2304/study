// components/BackgroundChanger.tsx
'use client';

import { useState } from "react";
import { X } from "lucide-react";
import { useBackground } from "@/lib/BackgroundContext";

const backgrounds = [
    { url: "/images/thumb.jpg", name: "Study Room" },
    { url: "/images/1.jpg", name: "Rainy Window" },
    { url: "/images/2.jpg", name: "Cozy Library" },
    { url: "/images/3.jpg", name: "Night City" },
    { url: "/images/4.jpg", name: "Forest Cabin" },
    { url: "/images/5.jpg", name: "Ocean Sunset" },
];

export default function BackgroundChanger() {
    const [isOpen, setIsOpen] = useState(false);
    const { setCurrentBg, currentBg } = useBackground(); // LẤY TỪ CONTEXT

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 transition-all hover:scale-110 group relative"
                title="Đổi background"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                     className="lucide lucide-image-icon lucide-image">
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                    <circle cx="9" cy="9" r="2"/>
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                </svg>
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[998]"
                         onClick={() => setIsOpen(false)}/>

                    <div className="fixed inset-x-0 bottom-24 left-1/2 -translate-x-1/2 z-[999] w-full max-w-3xl px-4">
                        <div className="bg-black/95 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl">
                            <div className="flex items-center justify-between p-4 border-b border-white/10">
                                <h3 className="text-lg font-bold text-white">Chọn Background</h3>
                                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition">
                                    <X size={22} className="text-white/70" />
                                </button>
                            </div>

                            <div className="p-5 grid grid-cols-3 sm:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
                                {backgrounds.map((bg) => (
                                    <button
                                        key={bg.url}
                                        onClick={() => setCurrentBg(bg.url)}
                                        className={`group relative rounded-xl overflow-hidden border-4 transition-all ${
                                            currentBg === bg.url
                                                ? 'border-purple-500 shadow-lg shadow-purple-500/50'
                                                : 'border-white/20 hover:border-white/40'
                                        }`}
                                    >
                                        <img src={bg.url} alt={bg.name} className="w-full h-28 object-cover group-hover:scale-110 transition-transform duration-500" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                        <p className="absolute bottom-1 left-1 text-xs font-medium text-white">{bg.name}</p>
                                        {currentBg === bg.url && (
                                            <div className="absolute top-2 right-2 w-3 h-3 bg-purple-500 rounded-full animate-pulse" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}