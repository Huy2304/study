"use client";

import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import {
    CheckCircle2,
    ChevronDown,
    Coffee,
    Pause,
    Play,
    RotateCcw,
    Settings2,
    Sparkles,
    X,
} from "lucide-react";

import { useFocusMode } from "@/lib/FocusModeContext";
import { recordFocusSession } from "@/lib/daily-progress";

type SessionKind = "focus" | "break";
type ClockFace = "ring" | "digital" | "flip" | "minimal";

const FOCUS_PRESETS = [
    { minutes: 25, label: "25 phút", hint: "Pomodoro" },
    { minutes: 50, label: "50 phút", hint: "Tập trung sâu" },
    { minutes: 90, label: "90 phút", hint: "Deep work" },
] as const;

const BREAK_DURATION = 5 * 60;
const DEFAULT_DURATION = 25 * 60;
const CIRCLE_RADIUS = 122;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

const CLOCK_FACES: Array<{
    id: ClockFace;
    label: string;
}> = [
    { id: "ring", label: "Vòng" },
    { id: "digital", label: "Số" },
    { id: "flip", label: "Lật số" },
    { id: "minimal", label: "Tối giản" },
];

const FOCUS_INTENTIONS = ["Ôn bài", "Làm bài tập", "Luyện đề"] as const;

function formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
        .toString()
        .padStart(2, "0")}`;
}

export function CLockDown() {
    const [duration, setDuration] = useState(DEFAULT_DURATION);
    const [timeLeft, setTimeLeft] = useState(DEFAULT_DURATION);
    const [isRunning, setIsRunning] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [sessionKind, setSessionKind] =
        useState<SessionKind>("focus");
    const [goal, setGoal] = useState("");
    const [showSettings, setShowSettings] = useState(false);
    const [customMinutes, setCustomMinutes] = useState(30);
    const [completionMessage, setCompletionMessage] = useState("");
    const [clockFace, setClockFace] = useState<ClockFace>("ring");

    const { isSuperFocus } = useFocusMode();
    const deadlineRef = useRef<number | null>(null);
    const timeLeftRef = useRef(timeLeft);
    const hasStartedRef = useRef(false);
    const completionRecordedRef = useRef(false);
    const [estimatedEndTime, setEstimatedEndTime] = useState("");

    const formattedTime = useMemo(() => formatTime(timeLeft), [timeLeft]);
    const [minutesPart, secondsPart] = formattedTime.split(":");
    const progress = Math.min(
        1,
        Math.max(0, (duration - timeLeft) / duration)
    );
    const dashOffset = CIRCLE_CIRCUMFERENCE * (1 - progress);
    const resetSession = useCallback((seconds = duration) => {
        deadlineRef.current = null;
        hasStartedRef.current = false;
        completionRecordedRef.current = false;
        setIsRunning(false);
        setIsCompleted(false);
        setTimeLeft(seconds);
        setCompletionMessage("");
    }, [duration]);

    const chooseFocusPreset = useCallback((minutes: number) => {
        const seconds = minutes * 60;

        deadlineRef.current = null;
        hasStartedRef.current = false;
        completionRecordedRef.current = false;
        setSessionKind("focus");
        setDuration(seconds);
        setTimeLeft(seconds);
        setIsRunning(false);
        setIsCompleted(false);
        setCompletionMessage("");
        setShowSettings(false);
    }, []);

    const startBreak = useCallback(() => {
        deadlineRef.current = null;
        hasStartedRef.current = true;
        completionRecordedRef.current = false;
        setSessionKind("break");
        setDuration(BREAK_DURATION);
        setTimeLeft(BREAK_DURATION);
        setIsCompleted(false);
        setCompletionMessage("");
        setIsRunning(true);
    }, []);

    const startNextFocus = useCallback(() => {
        deadlineRef.current = null;
        hasStartedRef.current = false;
        completionRecordedRef.current = false;
        setSessionKind("focus");
        setDuration(DEFAULT_DURATION);
        setTimeLeft(DEFAULT_DURATION);
        setIsCompleted(false);
        setCompletionMessage("");
        setIsRunning(false);
    }, []);

    const completeSession = useCallback(() => {
        if (completionRecordedRef.current) return;

        completionRecordedRef.current = true;
        deadlineRef.current = null;
        setIsRunning(false);
        setIsCompleted(true);

        if (sessionKind === "focus" && hasStartedRef.current) {
            recordFocusSession(duration);
        }

        setCompletionMessage(
            sessionKind === "focus"
                ? `Đã hoàn thành phiên tập trung ${Math.round(duration / 60)} phút.`
                : "Đã hoàn thành thời gian nghỉ."
        );
    }, [duration, sessionKind]);

    useEffect(() => {
        timeLeftRef.current = timeLeft;
    }, [timeLeft]);

    useEffect(() => {
        if (!isRunning) return;

        const deadline = Date.now() + timeLeftRef.current * 1_000;
        deadlineRef.current = deadline;
        setEstimatedEndTime(
            new Intl.DateTimeFormat("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
            }).format(new Date(deadline))
        );

        const updateTimer = () => {
            const deadline = deadlineRef.current;
            if (!deadline) return;

            const nextTimeLeft = Math.max(
                0,
                Math.ceil((deadline - Date.now()) / 1_000)
            );

            if (nextTimeLeft === timeLeftRef.current) return;

            timeLeftRef.current = nextTimeLeft;
            setTimeLeft(nextTimeLeft);

            if (nextTimeLeft === 0) {
                completeSession();
            }
        };

        updateTimer();
        const intervalId = window.setInterval(updateTimer, 250);

        return () => window.clearInterval(intervalId);
    }, [completeSession, isRunning]);

    useEffect(() => {
        if (isCompleted) {
            document.title = "Hoàn thành phiên học · StudyHay";
            return;
        }

        document.title = isRunning
            ? `${formattedTime} · ${
                  sessionKind === "focus" ? "Tập trung" : "Nghỉ"
              }`
            : "StudyHay · Học tập trung";
    }, [formattedTime, isCompleted, isRunning, sessionKind]);

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            const target = event.target as HTMLElement | null;
            const isTyping =
                target?.tagName === "INPUT" ||
                target?.tagName === "TEXTAREA" ||
                target?.tagName === "SELECT";

            if (event.code === "Space" && !isTyping && !isCompleted) {
                event.preventDefault();
                hasStartedRef.current = true;
                setIsRunning((running) => !running);
            }
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [isCompleted]);

    const toggleTimer = () => {
        if (isCompleted) return;

        hasStartedRef.current = true;
        setCompletionMessage("");
        setIsRunning((running) => !running);
    };

    const applyCustomDuration = () => {
        const minutes = Math.min(240, Math.max(5, customMinutes || 5));
        chooseFocusPreset(minutes);
        setCustomMinutes(minutes);
    };

    const activePreset = FOCUS_PRESETS.find(
        (preset) => preset.minutes * 60 === duration
    );
    const timerLabel =
        sessionKind === "focus" ? "Phiên tập trung" : "Nghỉ ngắn";
    const timerDetail = isRunning
        ? `Kết thúc lúc ${estimatedEndTime}`
        : activePreset
          ? activePreset.hint
          : "Thời lượng tự chọn";

    return (
        <div
            className={`fixed inset-0 overflow-y-auto px-4 ${
                isSuperFocus
                    ? "pb-20 pt-4"
                    : "pb-[var(--app-bottom-safe-area)] pt-[var(--app-header-safe-area)]"
            }`}
        >
            <main className="focus-timer-layout mx-auto flex min-h-full w-full max-w-md flex-col items-center justify-center py-2 text-center">
                <p className="sr-only" role="status" aria-live="polite">
                    {completionMessage}
                </p>

                {!isSuperFocus && !isCompleted && (
                    <section className="mb-3 w-full rounded-2xl border border-white/10 bg-black/25 p-3 text-left shadow-xl backdrop-blur-xl">
                        <div className="flex items-start gap-3">
                            <span className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-cyan-400/15 text-cyan-200">
                                <Sparkles size={18} aria-hidden="true" />
                            </span>
                            <div className="min-w-0 flex-1">
                                <label className="block">
                                    <span className="block text-xs font-medium uppercase tracking-[0.14em] text-white/45">
                                        Phiên này, mình sẽ…
                                    </span>
                                    <input
                                        value={goal}
                                        onChange={(event) =>
                                            setGoal(event.target.value)
                                        }
                                        placeholder="Ví dụ: hiểu xong chương 2"
                                        className="mt-1 w-full bg-transparent text-base font-medium text-white outline-none placeholder:text-white/35"
                                    />
                                </label>
                                <div className="mt-2 flex flex-wrap gap-1.5">
                                    {FOCUS_INTENTIONS.map((intention) => (
                                        <button
                                            key={intention}
                                            type="button"
                                            onClick={() => setGoal(intention)}
                                            className={`rounded-full border px-2.5 py-1 text-xs transition ${
                                                goal === intention
                                                    ? "border-cyan-300/50 bg-cyan-400/15 text-cyan-100"
                                                    : "border-white/10 bg-white/[0.04] text-white/50 hover:bg-white/[0.1] hover:text-white"
                                            }`}
                                        >
                                            {intention}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {isCompleted ? (
                    <section className="w-full rounded-3xl border border-emerald-300/25 bg-gradient-to-b from-emerald-500/20 to-cyan-500/10 p-7 shadow-2xl backdrop-blur-xl sm:p-9">
                        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-400/20 text-emerald-100">
                            <CheckCircle2 size={30} aria-hidden="true" />
                        </span>
                        <p className="mt-5 text-sm font-medium uppercase tracking-[0.18em] text-emerald-100/75">
                            {sessionKind === "focus"
                                ? "Bạn đã làm được"
                                : "Sẵn sàng quay lại"}
                        </p>
                        <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
                            {sessionKind === "focus"
                                ? `${Math.round(duration / 60)} phút tập trung`
                                : "Đã nghỉ xong"}
                        </h1>
                        {goal && sessionKind === "focus" && (
                            <p className="mt-3 text-white/70">{goal}</p>
                        )}
                        <div className="mt-7 grid gap-3 sm:grid-cols-2">
                            {sessionKind === "focus" ? (
                                <button
                                    type="button"
                                    onClick={startBreak}
                                    className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-300 px-4 py-3 font-semibold text-emerald-950 transition hover:bg-emerald-200"
                                >
                                    <Coffee size={19} aria-hidden="true" />
                                    Nghỉ 5 phút
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={startNextFocus}
                                    className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-cyan-300 px-4 py-3 font-semibold text-cyan-950 transition hover:bg-cyan-200"
                                >
                                    <Play size={19} aria-hidden="true" />
                                    Phiên 25 phút
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={() => resetSession(duration)}
                                className="min-h-12 rounded-xl border border-white/15 bg-white/[0.06] px-4 py-3 font-semibold text-white/80 transition hover:bg-white/[0.12]"
                            >
                                Làm lại
                            </button>
                        </div>
                    </section>
                ) : (
                    <>
                        <section
                            className={`relative flex w-full items-center justify-center transition-all duration-500 ${
                                isSuperFocus
                                    ? "min-h-[min(80vw,32rem)]"
                                    : "min-h-60 sm:min-h-64"
                            }`}
                            aria-label={`${timerLabel}: ${formattedTime}`}
                        >
                            {clockFace === "ring" && (
                                <div
                                    className={`relative flex items-center justify-center ${
                                        isSuperFocus
                                            ? "h-[min(80vw,32rem)] w-[min(80vw,32rem)]"
                                            : "h-60 w-60 sm:h-64 sm:w-64"
                                    }`}
                                >
                                    <svg
                                        viewBox="0 0 280 280"
                                        className="absolute inset-0 h-full w-full -rotate-90"
                                        aria-hidden="true"
                                    >
                                        <circle
                                            cx="140"
                                            cy="140"
                                            r={CIRCLE_RADIUS}
                                            fill="none"
                                            stroke="rgba(255,255,255,0.09)"
                                            strokeWidth="7"
                                        />
                                        <circle
                                            cx="140"
                                            cy="140"
                                            r={CIRCLE_RADIUS}
                                            fill="none"
                                            stroke={
                                                sessionKind === "focus"
                                                    ? "rgb(34 211 238)"
                                                    : "rgb(167 243 208)"
                                            }
                                            strokeWidth="7"
                                            strokeLinecap="round"
                                            strokeDasharray={CIRCLE_CIRCUMFERENCE}
                                            strokeDashoffset={dashOffset}
                                            className="transition-[stroke-dashoffset] duration-300"
                                        />
                                    </svg>
                                    <TimerCopy
                                        label={timerLabel}
                                        time={formattedTime}
                                        detail={timerDetail}
                                        large={isSuperFocus}
                                    />
                                </div>
                            )}

                            {clockFace === "digital" && (
                                <div className="w-full rounded-[2rem] border border-cyan-200/15 bg-gradient-to-br from-cyan-400/15 via-slate-950/55 to-violet-500/15 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
                                    <TimerCopy
                                        label={timerLabel}
                                        time={formattedTime}
                                        detail={timerDetail}
                                        large
                                    />
                                    <div className="mt-7 h-2 overflow-hidden rounded-full bg-white/10">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-violet-300 transition-[width] duration-300"
                                            style={{ width: `${progress * 100}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            {clockFace === "flip" && (
                                <div className="w-full rounded-[2rem] border border-white/15 bg-black/45 p-5 shadow-2xl backdrop-blur-xl sm:p-7">
                                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/45">
                                        {timerLabel}
                                    </p>
                                    <div className="mt-5 grid grid-cols-[1fr_1fr_auto_1fr_1fr] items-center gap-1.5 sm:gap-3">
                                        <CalendarFlipDigit digit={minutesPart.charAt(0)} />
                                        <CalendarFlipDigit digit={minutesPart.charAt(1)} />
                                        <span className="text-3xl font-bold text-white/45 sm:text-4xl">
                                            :
                                        </span>
                                        <CalendarFlipDigit digit={secondsPart.charAt(0)} />
                                        <CalendarFlipDigit digit={secondsPart.charAt(1)} />
                                    </div>
                                    <div className="mt-3 grid grid-cols-[1fr_1fr_auto_1fr_1fr] gap-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-white/35 sm:gap-3">
                                        <span className="col-span-2">phút</span>
                                        <span aria-hidden="true" />
                                        <span className="col-span-2">giây</span>
                                    </div>
                                    <p className="mt-5 text-sm text-white/50">
                                        {timerDetail}
                                    </p>
                                </div>
                            )}

                            {clockFace === "minimal" && (
                                <div className="w-full border-y border-white/15 py-8 sm:py-10">
                                    <TimerCopy
                                        label={timerLabel}
                                        time={formattedTime}
                                        detail={timerDetail}
                                        large
                                    />
                                    <div className="mx-auto mt-7 h-px w-3/4 bg-white/10">
                                        <div
                                            className="h-px bg-white transition-[width] duration-300"
                                            style={{ width: `${progress * 100}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                        </section>

                        {!isSuperFocus && (
                            <>
                                <div className="mt-3 flex flex-wrap justify-center gap-2">
                                    {FOCUS_PRESETS.map((preset) => {
                                        const isActive =
                                            sessionKind === "focus" &&
                                            duration === preset.minutes * 60;

                                        return (
                                            <button
                                                key={preset.minutes}
                                                type="button"
                                                disabled={isRunning}
                                                onClick={() =>
                                                    chooseFocusPreset(
                                                        preset.minutes
                                                    )
                                                }
                                                className={`min-h-9 rounded-full border px-3 text-sm font-medium transition ${
                                                    isActive
                                                        ? "border-cyan-300/60 bg-cyan-400/15 text-cyan-100"
                                                        : "border-white/10 bg-white/[0.04] text-white/55 hover:bg-white/[0.1] hover:text-white"
                                                } disabled:cursor-not-allowed disabled:opacity-45`}
                                            >
                                                {preset.label}
                                            </button>
                                        );
                                    })}
                                </div>

                                <section
                                    className="mt-3 w-full"
                                    aria-label="Chọn giao diện đồng hồ"
                                >
                                    <div className="grid grid-cols-4 gap-2">
                                        {CLOCK_FACES.map((face) => {
                                            const isActive =
                                                clockFace === face.id;

                                            return (
                                                <button
                                                    key={face.id}
                                                    type="button"
                                                    onClick={() =>
                                                        setClockFace(face.id)
                                                    }
                                                    aria-pressed={isActive}
                                                    className={`min-h-9 rounded-xl border px-1 py-1.5 text-center text-xs font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 sm:text-sm ${
                                                        isActive
                                                            ? "border-cyan-300/60 bg-cyan-400/15 text-cyan-50"
                                                            : "border-white/10 bg-white/[0.035] text-white/60 hover:bg-white/[0.09] hover:text-white"
                                                    }`}
                                                >
                                                    <span>
                                                        {face.label}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </section>

                                <div className="mt-4 flex items-center justify-center gap-3">
                                    <button
                                        type="button"
                                        onClick={toggleTimer}
                                        className={`flex min-h-12 items-center justify-center gap-2 rounded-2xl px-7 text-base font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 ${
                                            isRunning
                                                ? "bg-white/[0.1] text-white hover:bg-white/[0.16]"
                                                : "bg-cyan-400 text-cyan-950 shadow-[0_0_36px_rgba(34,211,238,0.25)] hover:bg-cyan-300"
                                        }`}
                                    >
                                        {isRunning ? (
                                            <Pause size={21} aria-hidden="true" />
                                        ) : (
                                            <Play size={21} aria-hidden="true" />
                                        )}
                                        {isRunning ? "Tạm dừng" : "Bắt đầu"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => resetSession()}
                                        disabled={
                                            timeLeft === duration && !isRunning
                                        }
                                        aria-label="Đặt lại phiên học"
                                        className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/65 transition hover:bg-white/[0.1] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                                    >
                                        <RotateCcw size={20} aria-hidden="true" />
                                    </button>
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowSettings((open) => !open)
                                    }
                                    className="mt-2 inline-flex min-h-8 items-center gap-2 rounded-lg px-3 text-sm text-white/50 transition hover:bg-white/[0.06] hover:text-white"
                                >
                                    <Settings2 size={16} aria-hidden="true" />
                                    Thời lượng khác
                                    <ChevronDown
                                        size={16}
                                        className={
                                            showSettings
                                                ? "rotate-180 transition"
                                                : "transition"
                                        }
                                        aria-hidden="true"
                                    />
                                </button>

                                {showSettings && (
                                    <section className="mt-3 w-full rounded-2xl border border-white/10 bg-black/35 p-4 text-left shadow-xl backdrop-blur-xl">
                                        <div className="flex items-center justify-between gap-3">
                                            <div>
                                                <p className="font-medium text-white">
                                                    Tạo phiên riêng
                                                </p>
                                                <p className="mt-1 text-xs text-white/45">
                                                    Từ 5 đến 240 phút
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowSettings(false)
                                                }
                                                className="flex h-9 w-9 items-center justify-center rounded-lg text-white/45 transition hover:bg-white/10 hover:text-white"
                                                aria-label="Đóng cài đặt thời lượng"
                                            >
                                                <X size={17} aria-hidden="true" />
                                            </button>
                                        </div>
                                        <div className="mt-4 flex gap-2">
                                            <input
                                                type="number"
                                                min="5"
                                                max="240"
                                                value={customMinutes}
                                                onChange={(event) =>
                                                    setCustomMinutes(
                                                        Number(
                                                            event.target.value
                                                        )
                                                    )
                                                }
                                                className="min-h-11 min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.05] px-3 text-white outline-none focus:border-cyan-300/60"
                                                aria-label="Số phút cho phiên riêng"
                                            />
                                            <button
                                                type="button"
                                                onClick={applyCustomDuration}
                                                className="min-h-11 rounded-xl bg-white/10 px-4 font-medium text-white transition hover:bg-white/[0.16]"
                                            >
                                                Áp dụng
                                            </button>
                                        </div>
                                    </section>
                                )}

                            </>
                        )}

                        {isSuperFocus && (
                            <button
                                type="button"
                                onClick={toggleTimer}
                                className="mt-7 flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-white/[0.1] px-8 text-lg font-semibold text-white transition hover:bg-white/[0.16]"
                            >
                                {isRunning ? (
                                    <Pause size={21} aria-hidden="true" />
                                ) : (
                                    <Play size={21} aria-hidden="true" />
                                )}
                                {isRunning ? "Tạm dừng" : "Bắt đầu"}
                            </button>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}

function TimerCopy({
    label,
    time,
    detail,
    large = false,
}: {
    label: string;
    time: string;
    detail: string;
    large?: boolean;
}) {
    return (
        <div className="relative z-10 text-center">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/45">
                {label}
            </p>
            <p
                className={`mt-2 font-bold tracking-tight tabular-nums text-white drop-shadow-2xl ${
                    large
                        ? "text-6xl sm:text-7xl"
                        : "text-5xl sm:text-6xl"
                }`}
            >
                {time}
            </p>
            <p className="mt-3 text-sm text-white/50">{detail}</p>
        </div>
    );
}

function CalendarFlipDigit({ digit }: { digit: string }) {
    const currentDigitRef = useRef(digit);
    const [leavingDigit, setLeavingDigit] = useState<string | null>(null);

    useLayoutEffect(() => {
        if (currentDigitRef.current === digit) return;

        const previousDigit = currentDigitRef.current;
        currentDigitRef.current = digit;

        setLeavingDigit(previousDigit);
    }, [digit]);

    return (
        <div className="calendar-flip-card relative h-24 overflow-hidden rounded-xl border border-white/15 bg-gradient-to-b from-zinc-100 to-zinc-300 text-zinc-950 shadow-[0_10px_24px_rgba(0,0,0,0.3)] sm:h-28">
            <span className="pointer-events-none absolute left-3 top-2 z-30 h-2 w-2 rounded-full bg-zinc-700 shadow-[0_1px_0_rgba(255,255,255,0.7)]" />
            <span className="pointer-events-none absolute right-3 top-2 z-30 h-2 w-2 rounded-full bg-zinc-700 shadow-[0_1px_0_rgba(255,255,255,0.7)]" />
            <span className="calendar-sheet absolute inset-0 grid place-items-center pt-2 text-5xl font-black tabular-nums sm:text-6xl">
                {digit}
            </span>
            {leavingDigit && (
                <span
                    key={`${leavingDigit}-${digit}`}
                    className="calendar-turning-sheet absolute inset-0 z-20 grid place-items-center border-b border-zinc-400 bg-gradient-to-b from-white via-zinc-100 to-zinc-300 pt-2 text-5xl font-black tabular-nums sm:text-6xl"
                    onAnimationEnd={() => setLeavingDigit(null)}
                    aria-hidden="true"
                >
                    {leavingDigit}
                </span>
            )}
        </div>
    );
}
