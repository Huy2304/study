// components/MusicTooltip.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Music, CloudRain, Coffee, Trees, Waves, Flame, Volume2, VolumeX } from "lucide-react";

const sounds = [
    { name: "Lo-fi", icon: Music, color: "text-purple-400", file: "/sounds/lofi.mp3" },
    { name: "Rain", icon: CloudRain, color: "text-blue-400", file: "/sounds/rain.wav" },
    { name: "Café", icon: Coffee, color: "text-amber-400", file: "/sounds/cafe.mp3" },
    { name: "Forest", icon: Trees, color: "text-green-400", file: "/sounds/forest.mp3" },
    { name: "Ocean", icon: Waves, color: "text-cyan-400", file: "/sounds/ocean.mp3" },
    { name: "Fire", icon: Flame, color: "text-orange-400", file: "/sounds/fireplace.mp3" },
];

export function MusicTooltip() {
    const [currentSound, setCurrentSound] = useState<string | null>(null);
    const [isMuted, setIsMuted] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Tạo 1 audio duy nhất, thay src khi đổi nhạc
    useEffect(() => {
        audioRef.current = new Audio();
        audioRef.current.loop = true;
        audioRef.current.volume = 0.4;

        return () => {
            audioRef.current?.pause();
            audioRef.current = null;
        };
    }, []);

    // Khi đổi nhạc hoặc mute
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

    const playSound = (file: string) => {
        if (currentSound === file) {
            setCurrentSound(null); // click lại cùng icon → tắt
        } else {
            setCurrentSound(file);
        }
    };

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <button 
                    className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 transition-all hover:scale-110 group focus:outline-none focus:ring-2 focus:ring-white/50 relative"
                    aria-label={currentSound ? `Đang phát: ${currentSound}` : "Mở focus sounds"}
                    aria-expanded={false}
                >
                    <Music size={22} className="text-white/70 group-hover:text-white transition" aria-hidden="true" />
                    {currentSound && (
                        <span 
                            className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"
                            aria-label="Đang phát"
                        />
                    )}
                </button>
            </TooltipTrigger>

            <TooltipContent side="top" className="bg-black/95 border border-white/20 p-5 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-medium">Focus Sounds</p>
                    <button
                        onClick={() => setIsMuted(!isMuted)}
                        className="p-2 rounded-lg hover:bg-white/10 transition"
                    >
                        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                    </button>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    {sounds.map(({ name, icon: Icon, color, file }) => (
                        <button
                            key={name}
                            onClick={() => playSound(file)}
                            className={`
                flex flex-col items-center gap-2 p-4 rounded-xl transition-all
                ${currentSound === file
                                ? "bg-white/20 ring-2 ring-white/50 scale-110"
                                : "bg-white/5 hover:bg-white/15"
                            }
              `}
                        >
                            <Icon size={28} className={color} />
                            <span className="text-xs">{name}</span>
                        </button>
                    ))}
                </div>

                {currentSound && (
                    <p className="text-xs text-white/60 text-center mt-3">
                        Click again to stop • Playing in background
                    </p>
                )}
            </TooltipContent>
        </Tooltip>
    );
}