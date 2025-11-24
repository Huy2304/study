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

// TIMER SIÊU MƯỢT + HIỂN THỊ REALTIME TRÊN TAB TITLE
    useEffect(() => {
        if (!isRunning || timeLeft <= 0) return;

        const intervalId = setInterval(() => {
            setTimeLeft(prev => {
                const next = prev - 1;

                // CẬP NHẬT TITLE MỖI GIÂY
                if (next > 0) {
                    const m = Math.floor(next / 60);
                    const s = next % 60;
                    document.title = `${m}:${s.toString().padStart(2, "0")} - Focus`;
                } else {
                    document.title = "00:00 - Time's up!";
                }

                return next >= 0 ? next : 0;
            });
        }, 1000);

        return () => clearInterval(intervalId);
    }, [isRunning]); // Chỉ depend vào isRunning → không re-create interval mỗi giây!
    useEffect(() => {
        if (isRunning) return;

        if (timeLeft === 0) {
            document.title = "00:00 - Time's up!";
        } else if (timeLeft === duration) {
            document.title = "StudyHay - Focus Timer";
        } else {
            const m = Math.floor(timeLeft / 60);
            const s = timeLeft % 60;
            document.title = `${m}:${s.toString().padStart(2, "0")} - Focus`;
        }
    }, [isRunning, timeLeft, duration]);

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

            {/* Popup Setup Timer - Chỉnh để không đè header/bottom, thu nhỏ, và UX tốt hơn */}
            {showSetup && !isSuperFocus && (
                <div
                    ref={setupRef}
                    className="fixed top-16 bottom-20 left-0 right-0 flex items-center justify-center z-[100] pointer-events-auto"

                >
                    <div className="relative bg-black/90 border border-white/20 rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl overflow-y-auto max-h-[80vh] transition-all duration-300 scale-100 hover:scale-105"> {/* Thu nhỏ max-w-sm, p-6, thêm animation scale */}
                        <button
                            onClick={() => setShowSetup(false)}
                            className="absolute top-3 right-3 text-white/50 hover:text-white/90 transition w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10"
                            aria-label="Close"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <h3 className="text-xl font-bold text-white mb-4 text-center pr-6">Timer Setup</h3> {/* Giảm size text, margin */}

                        {/* Danh sách preset - Làm ngắn gọn hơn */}
                        <div className="space-y-2"> {/* Giảm space-y-3 thành 2 */}
                            {presets.map((p) => (
                                <button
                                    key={p.name}
                                    onClick={() => setNewTimer(p.work * 60)}
                                    className={`w-full text-left p-3 rounded-lg transition ${duration === p.work * 60 ? "bg-white/20 border border-white/40" : "bg-white/5 hover:bg-white/10 border border-transparent"}`} // Giảm p-4 thành p-3
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-medium text-white text-sm">{p.name}</div> {/* Giảm text size */}
                                            <div className="text-xs text-white/60">
                                                {p.work}m work · {p.short}m short · {p.long}m long
                                            </div>
                                        </div>
                                        {duration === p.work * 60 && <div className="w-2 h-2 bg-white rounded-full" />} {/* Giảm size dot */}
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Phần custom timer */}
                        <div className="mt-4 pt-4 border-t border-white/10"> {/* Giảm mt-6 pt-6 thành 4 */}
                            <Button
                                className="w-full rounded-lg text-sm py-2" // Thu nhỏ button, text-sm
                                variant="outline"
                                onClick={() => setShowCustomForm(!showCustomForm)}
                            >
                                <Plus size={16} className="mr-2" /> {/* Giảm size icon */}
                                {showCustomForm ? "Cancel Custom Timer" : "Add Custom Timer"}
                            </Button>

                            {showCustomForm && (
                                <div className="mt-3 space-y-3"> {/* Giảm mt-4 space-y-4 thành 3 */}
                                    <div className="flex gap-3 justify-center">
                                        <div className="flex-1 max-w-[120px]"> {/* Giảm max-w-150 thành 120 */}
                                            <label className="block text-xs text-white/80 mb-1">Hours</label> {/* text-xs */}
                                            <input
                                                type="number"
                                                min="0"
                                                step="1"
                                                value={customHours}
                                                onChange={(e) => setCustomHours(Math.max(0, parseInt(e.target.value) || 0))}
                                                className="w-full p-1.5 rounded-md bg-white/10 border border-white/20 text-white focus:outline-none focus:border-white/40 text-sm" // Giảm p-2 thành 1.5, rounded-md, text-sm
                                            />
                                        </div>
                                        <div className="flex-1 max-w-[120px]">
                                            <label className="block text-xs text-white/80 mb-1">Minutes</label>
                                            <input
                                                type="number"
                                                min="0"
                                                max="59"
                                                step="1"
                                                value={customMinutes}
                                                onChange={(e) => setCustomMinutes(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
                                                className="w-full p-1.5 rounded-md bg-white/10 border border-white/20 text-white focus:outline-none focus:border-white/40 text-sm"
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        className="w-full rounded-lg bg-white/20 hover:bg-white/30 transition-colors shadow-md text-sm py-2" // Thu nhỏ, text-sm
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