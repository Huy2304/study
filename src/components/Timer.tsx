// components/Timer.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";

const presets = [
    { label: "5m", seconds: 5 * 60 },
    { label: "10m", seconds: 10 * 60 },
    { label: "15m", seconds: 15 * 60 },
    { label: "25m", seconds: 25 * 60 },
    { label: "30m", seconds: 30 * 60 },
];

export function Timer() {
    const [duration, setDuration] = useState(25 * 60);   // thời gian ban đầu (giây)
    const [timeLeft, setTimeLeft] = useState(duration); // thời gian còn lại
    const [isRunning, setIsRunning] = useState(false);

    // Khi chọn preset mới → reset timer
    const selectPreset = (seconds: number) => {
        setDuration(seconds);
        setTimeLeft(seconds);
        setIsRunning(false);
    };

    // Đếm ngược
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (isRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((t) => t - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsRunning(false);
            // Có thể thêm âm báo ở đây
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isRunning, timeLeft]);

    const format = (totalSeconds: number) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        if (hours > 0) {
            return `${hours.toString().padStart(2, '0')}:${minutes
                .toString()
                .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        return `${minutes.toString().padStart(2, '0')}:${seconds
            .toString()
            .padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col items-center space-y-10">
            {/* Timer lớn */}
            <div
                onClick={() => setIsRunning(!isRunning)}
                className="text-8xl md:text-9xl font-thin tracking-wider text-white select-none cursor-pointer transition-all hover:text-white/90"
                style={{ textShadow: '0 0 30px rgba(255,255,255,0.3)' }}
            >
                {format(timeLeft)}
            </div>

            {/* Nút chọn thời gian */}
            <div className="flex flex-wrap justify-center gap-3 max-w-lg">
                {presets.map((preset) => (
                    <Button
                        key={preset.seconds}
                        variant={duration === preset.seconds ? "default" : "outline"}
                        className={`rounded-full px-6 h-11 ${
                            duration === preset.seconds
                                ? "bg-white text-black hover:bg-white/90"
                                : "border-white/30 text-white hover:bg-white/10"
                        }`}
                        onClick={() => selectPreset(preset.seconds)}
                    >
                        {preset.label}
                    </Button>
                ))}

                {/* Nút Custom (tùy chọn mở rộng sau) */}
                <Button
                    variant="outline"
                    className="rounded-full px-6 h-11 border-white/30 text-white hover:bg-white/10"
                    onClick={() => {
                        const custom = prompt("Nhập thời gian (phút):", "25");
                        if (custom && !isNaN(+custom)) {
                            const secs = Math.max(1, Math.floor(+custom * 60));
                            selectPreset(secs);
                        }
                    }}
                >
                    Custom
                </Button>
            </div>

            {/* Nút điều khiển Start / Pause (tùy chọn) */}
            <Button
                size="lg"
                onClick={() => setIsRunning(!isRunning)}
                className="rounded-full px-16 h-14 text-lg font-medium bg-white text-black hover:bg-white/90"
            >
                {isRunning ? "Pause" : timeLeft === duration ? "Start" : "Resume"}
            </Button>
        </div>
    );
}