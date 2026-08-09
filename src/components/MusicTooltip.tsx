"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
    CloudRain,
    Coffee,
    Flame,
    Music,
    Trees,
    Volume2,
    VolumeX,
    Waves,
    X,
} from "lucide-react";

const sounds = [
    { name: "Lo-fi", icon: Music, color: "text-purple-400", file: "/sounds/lofi.mp3" },
    { name: "Mưa", icon: CloudRain, color: "text-blue-400", file: "/sounds/rain.wav" },
    { name: "Café", icon: Coffee, color: "text-amber-400", file: "/sounds/cafe.mp3" },
    { name: "Rừng", icon: Trees, color: "text-green-400", file: "/sounds/forest.mp3" },
    { name: "Biển", icon: Waves, color: "text-cyan-400", file: "/sounds/ocean.mp3" },
    { name: "Lửa", icon: Flame, color: "text-orange-400", file: "/sounds/fireplace.mp3" },
] as const;

export function MusicTooltip() {
    const [currentSound, setCurrentSound] = useState<string | null>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        audioRef.current = new Audio();
        audioRef.current.loop = true;
        audioRef.current.volume = 0.4;

        return () => {
            audioRef.current?.pause();
            audioRef.current = null;
        };
    }, []);

    useEffect(() => {
        if (!audioRef.current) return;

        if (currentSound) {
            audioRef.current.src = currentSound;
            audioRef.current.play().catch(() => {});
        } else {
            audioRef.current.pause();
        }

        audioRef.current.muted = isMuted;
    }, [currentSound, isMuted]);

    useEffect(() => {
        if (!isOpen) return;

        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") setIsOpen(false);
        };

        window.addEventListener("keydown", closeOnEscape);
        return () => window.removeEventListener("keydown", closeOnEscape);
    }, [isOpen]);

    const playSound = (file: string) => {
        setCurrentSound((current) => (current === file ? null : file));
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen((current) => !current)}
                className="group relative flex h-12 w-12 items-center justify-center rounded-xl border border-white/20 bg-white/10 backdrop-blur-xl transition-all hover:scale-105 hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                aria-label="Mở âm thanh tập trung"
                aria-expanded={isOpen}
            >
                <Music size={22} className="text-white/70 transition group-hover:text-white" aria-hidden="true" />
                {currentSound && (
                    <span
                        className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-green-400"
                        aria-label="Đang phát âm thanh"
                    />
                )}
            </button>

            {isOpen &&
                typeof document !== "undefined" &&
                createPortal(
                    <>
                        <button
                            type="button"
                            className="fixed inset-0"
                            style={{ zIndex: 200 }}
                            onClick={() => setIsOpen(false)}
                            aria-label="Đóng âm thanh tập trung"
                        />
                        <section
                            role="dialog"
                            aria-modal="false"
                            aria-label="Âm thanh tập trung"
                            className="fixed bottom-20 left-4 max-h-[calc(100dvh-6rem)] w-[calc(100%-2rem)] max-w-sm overflow-y-auto rounded-2xl border border-white/20 bg-black/95 p-4 text-white shadow-2xl backdrop-blur-2xl"
                            style={{ zIndex: 201 }}
                        >
                            <div className="mb-4 flex items-center justify-between gap-3">
                                <p className="text-sm font-medium">Âm thanh tập trung</p>
                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={() => setIsMuted((current) => !current)}
                                        className="rounded-lg p-2 transition hover:bg-white/10"
                                        aria-label={isMuted ? "Bật âm thanh" : "Tắt tiếng"}
                                    >
                                        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsOpen(false)}
                                        className="rounded-lg p-2 transition hover:bg-white/10"
                                        aria-label="Đóng âm thanh tập trung"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2 sm:gap-3">
                                {sounds.map(({ name, icon: Icon, color, file }) => (
                                    <button
                                        key={name}
                                        type="button"
                                        onClick={() => playSound(file)}
                                        className={`flex min-h-20 flex-col items-center justify-center gap-2 rounded-xl p-2 text-center transition sm:min-h-24 sm:p-3 ${
                                            currentSound === file
                                                ? "bg-white/20 ring-2 ring-white/50"
                                                : "bg-white/5 hover:bg-white/15"
                                        }`}
                                        aria-pressed={currentSound === file}
                                    >
                                        <Icon size={24} className={color} aria-hidden="true" />
                                        <span className="text-xs">{name}</span>
                                    </button>
                                ))}
                            </div>

                            {currentSound && (
                                <p className="mt-3 text-center text-xs text-white/60">
                                    Chọn lại âm thanh đang phát để dừng.
                                </p>
                            )}
                        </section>
                    </>,
                    document.body
                )}
        </>
    );
}
