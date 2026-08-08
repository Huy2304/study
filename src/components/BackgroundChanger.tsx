// components/BackgroundChanger.tsx
'use client';

import Image from "next/image";
import { useState } from "react";
import { ImageIcon, X } from "lucide-react";
import { useBackground } from "@/lib/BackgroundContext";


export default function BackgroundChanger() {
    const [isOpen, setIsOpen] = useState(false);
    const { backgrounds, currentBg, setCurrentBg } =
        useBackground();

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 transition-all hover:scale-110 group relative"
                title="Đổi background"
            >
                <ImageIcon size={24} aria-hidden="true" />
            </button>

            {isOpen && (
                <>
                    <div 
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
                        style={{ zIndex: 320 }}
                        onClick={() => setIsOpen(false)}
                        aria-label="Đóng background changer"
                    />

                    <div 
                        className="fixed inset-x-0 bottom-24 left-1/2 -translate-x-1/2 w-full max-w-3xl px-4"
                        style={{ zIndex: 321 }}
                    >
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
                                        onClick={() => {
                                            setCurrentBg(bg.url);
                                            setIsOpen(false);
                                        }}
                                        className="group relative h-24 overflow-hidden rounded-xl border border-white/10 text-left transition hover:border-white/35 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-300"
                                    >
                                        <Image
                                            src={bg.url}
                                            alt={bg.name}
                                            fill
                                            sizes="(min-width: 640px) 180px, 30vw"
                                            unoptimized={bg.url.endsWith(".gif")}
                                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
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
