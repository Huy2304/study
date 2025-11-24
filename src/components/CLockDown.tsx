// components/Timer.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { useFocusMode } from "@/lib/FocusModeContext";
import { ChevronDown, Plus, Settings } from "lucide-react";

const presets = [
    { name: "Deep Work", work: 90, short: 15, long: 45 },
    { name: "Pomodoro", work: 25, short: 5, long: 15 },
    { name: "Extended Focus", work: 50, short: 10, long: 30 },
    { name: "Quick Session", work: 15, short: 3, long: 10 },
];

export function CLockDown() {
    const [duration, setDuration] = useState(90 * 60);
    const [timeLeft, setTimeLeft] = useState(duration);
    const [isRunning, setIsRunning] = useState(false);
    const [showSetup, setShowSetup] = useState(false);
    const [showCustomForm, setShowCustomForm] = useState(false);
    const [customHours, setCustomHours] = useState(0);
    const [customMinutes, setCustomMinutes] = useState(1); // Default 1 phút để tránh alert 0
    const { isSuperFocus } = useFocusMode();
    const setupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (setupRef.current && !setupRef.current.contains(e.target as Node)) {
                setShowSetup(false);
            }
        };
        if (showSetup) {
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [showSetup]);

    useEffect(() => {
        if (!isRunning || timeLeft <= 0) return;
        const id = setInterval(() => setTimeLeft(t => t > 0 ? t - 1 : 0), 1000);
        return () => clearInterval(id);
    }, [isRunning, timeLeft]);

    const toggleTimer = () => {
        if (timeLeft === 0) setTimeLeft(duration);
        setIsRunning(!isRunning);
    };

    // Hàm chung để set timer mới và close popup
    const setNewTimer = (seconds: number) => {
        if (seconds <= 0) {
            alert("Thời gian phải lớn hơn 0.");
            return;
        }
        setDuration(seconds);
        setTimeLeft(seconds);
        setIsRunning(false);
        setShowCustomForm(false);
        setShowSetup(false);
        setCustomHours(0);
        setCustomMinutes(1); // Reset default
    };

    const applyCustomTimer = () => {
        if (customMinutes < 0 || customMinutes > 59) {
            alert("Phút phải từ 0 đến 59.");
            return;
        }
        const customSeconds = (customHours * 3600) + (customMinutes * 60);
        setNewTimer(customSeconds);
    };

    const format = (s: number) => {
        const h = Math.floor(s / 3600);
        const m = Math.floor((s % 3600) / 60);
        const sec = s % 60;
        return h > 0
            ? `${h}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
            : `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    };

    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="pointer-events-auto flex flex-col items-center space-y-16">
                {/* Đồng hồ chính */}
                <div
                    onClick={toggleTimer}
                    className={`select-none cursor-pointer font-bold tracking-wider text-white leading-none drop-shadow-2xl transition-all duration-700
            ${isSuperFocus ? "text-[14vw] md:text-[12vw] lg:text-[11vw] xl:text-[10vw]" : "text-[7em] sm:text-[9em] md:text-[11em] lg:text-[13em] xl:text-[15em]"}`}
                    style={{ textShadow: "0 0 80px rgba(255,255,255,0.5)", fontVariantNumeric: "tabular-nums" }}
                >
                    {format(timeLeft)}
                </div>

                {/* Nút Start/Pause + Nút mở popup */}
                <div className="flex flex-col items-center gap-8">
                    {!isSuperFocus && (
                        <button
                            onClick={() => setShowSetup(!showSetup)}
                            className="flex items-center gap-3 text-white/60 hover:text-white/90 transition text-lg font-medium"
                        >
                            <Settings size={22} />
                            <span>Setup Timer</span>
                            <ChevronDown size={18} className={`transition ${showSetup ? 'rotate-180' : ''}`} />
                        </button>
                    )}
                    <Button
                        onClick={toggleTimer}
                        size="lg"
                        className={`rounded-full px-24 py-8 text-3xl font-medium bg-white/15 backdrop-blur-xl border border-white/30 text-white hover:bg-white/25 active:scale-95 transition-all shadow-2xl ${isSuperFocus ? 'invisible' : ''}`}
                    >
                        {timeLeft === 0 ? "Restart" : isRunning ? "Pause" : "Start"}
                    </Button>
                </div>
            </div>

            {/* Popup Setup Timer */}
            {showSetup && !isSuperFocus && (
                <div ref={setupRef} className="fixed inset-0 flex items-center justify-center z-50 pointer-events-auto" style={{ backdropFilter: "blur(8px)" }}>
                    <div className="relative bg-black/90 border border-white/20 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
                        <button
                            onClick={() => setShowSetup(false)}
                            className="absolute top-4 right-4 text-white/50 hover:text-white/90 transition w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10"
                            aria-label="Close"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <h3 className="text-2xl font-bold text-white mb-6 text-center pr-8">Timer Setup</h3>

                        {/* Danh sách preset */}
                        <div className="space-y-3">
                            {presets.map((p) => (
                                <button
                                    key={p.name}
                                    onClick={() => setNewTimer(p.work * 60)}
                                    className={`w-full text-left p-4 rounded-xl transition ${duration === p.work * 60 ? "bg-white/20 border border-white/40" : "bg-white/5 hover:bg-white/10 border border-transparent"}`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-medium text-white">{p.name}</div>
                                            <div className="text-sm text-white/60">
                                                {p.work}m work · {p.short}m short · {p.long}m long
                                            </div>
                                        </div>
                                        {duration === p.work * 60 && <div className="w-3 h-3 bg-white rounded-full" />}
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Phần custom timer */}
                        <div className="mt-6 pt-6 border-t border-white/10">
                            <Button
                                className="w-full rounded-xl"
                                variant="outline"
                                onClick={() => setShowCustomForm(!showCustomForm)}
                            >
                                <Plus size={18} className="mr-2" />
                                {showCustomForm ? "Cancel Custom Timer" : "Add Custom Timer"}
                            </Button>

                            {showCustomForm && (
                                <div className="mt-4 space-y-4">
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <label className="block text-sm text-white/80 mb-1">Hours</label>
                                            <input
                                                type="number"
                                                min="0"
                                                step="1"
                                                value={customHours}
                                                onChange={(e) => setCustomHours(Math.max(0, parseInt(e.target.value) || 0))}
                                                className="w-full p-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-white/40"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-sm text-white/80 mb-1">Minutes</label>
                                            <input
                                                type="number"
                                                min="0"
                                                max="59"
                                                step="1"
                                                value={customMinutes}
                                                onChange={(e) => setCustomMinutes(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
                                                className="w-full p-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-white/40"
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        className="w-full rounded-xl bg-white/20 hover:bg-white/30"
                                        onClick={applyCustomTimer}
                                    >
                                        Apply Custom Timer
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}