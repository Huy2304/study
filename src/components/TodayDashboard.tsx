"use client";

import { CheckCircle2, Flame, Timer } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import {
    DAILY_PROGRESS_EVENT,
    getFocusStreak,
    readDailyProgress,
} from "@/lib/daily-progress";

interface TodaySummary {
    focusMinutes: number;
    completedSessions: number;
    completedTasks: number;
    totalTasks: number;
    streak: number;
}

const EMPTY_SUMMARY: TodaySummary = {
    focusMinutes: 0,
    completedSessions: 0,
    completedTasks: 0,
    totalTasks: 0,
    streak: 0,
};

function getTodoSummary() {
    try {
        const todos = JSON.parse(
            window.localStorage.getItem("studyfocus-todos") ?? "[]"
        ) as unknown[];
        const completed = JSON.parse(
            window.localStorage.getItem("studyfocus-completed") ?? "[]"
        ) as unknown[];

        return {
            totalTasks: todos.length,
            completedTasks: completed.filter(
                (index) =>
                    Number.isInteger(index) &&
                    Number(index) >= 0 &&
                    Number(index) < todos.length
            ).length,
        };
    } catch {
        return { totalTasks: 0, completedTasks: 0 };
    }
}

function getTodaySummary(): TodaySummary {
    if (typeof window === "undefined") return EMPTY_SUMMARY;

    const progress = readDailyProgress();
    const tasks = getTodoSummary();

    return {
        focusMinutes: Math.floor(progress.focusSeconds / 60),
        completedSessions: progress.completedSessions,
        completedTasks: tasks.completedTasks,
        totalTasks: tasks.totalTasks,
        streak: getFocusStreak(progress.focusDays),
    };
}

export default function TodayDashboard() {
    const [summary, setSummary] = useState<TodaySummary>(EMPTY_SUMMARY);

    const refreshSummary = useCallback(() => {
        setSummary(getTodaySummary());
    }, []);

    useEffect(() => {
        const initialRefresh = window.setTimeout(refreshSummary, 0);

        window.addEventListener(DAILY_PROGRESS_EVENT, refreshSummary);
        window.addEventListener("studyhay-todos", refreshSummary);
        window.addEventListener("storage", refreshSummary);

        return () => {
            window.clearTimeout(initialRefresh);
            window.removeEventListener(
                DAILY_PROGRESS_EVENT,
                refreshSummary
            );
            window.removeEventListener("studyhay-todos", refreshSummary);
            window.removeEventListener("storage", refreshSummary);
        };
    }, [refreshSummary]);

    return (
        <section
            aria-labelledby="today-dashboard-title"
            className="w-[min(100%,25rem)] rounded-2xl border border-white/15 bg-black/40 px-3 py-3 shadow-xl backdrop-blur-xl sm:px-4"
        >
            <div className="flex items-baseline justify-between gap-3">
                <h2
                    id="today-dashboard-title"
                    className="text-sm font-semibold text-white"
                >
                    Hôm nay
                </h2>
                <p className="text-xs text-white/50">
                    {summary.completedSessions > 0
                        ? `${summary.completedSessions} phiên đã xong`
                        : "Bắt đầu một phiên nhỏ"}
                </p>
            </div>

            <div className="mt-3 grid grid-cols-3 divide-x divide-white/10">
                <SummaryMetric
                    icon={<Timer size={16} aria-hidden="true" />}
                    value={`${summary.focusMinutes}p`}
                    label="tập trung"
                />
                <SummaryMetric
                    icon={<CheckCircle2 size={16} aria-hidden="true" />}
                    value={`${summary.completedTasks}/${summary.totalTasks}`}
                    label="việc xong"
                />
                <SummaryMetric
                    icon={<Flame size={16} aria-hidden="true" />}
                    value={summary.streak || "–"}
                    label="ngày liên tiếp"
                />
            </div>
        </section>
    );
}

function SummaryMetric({
    icon,
    value,
    label,
}: {
    icon: React.ReactNode;
    value: string | number;
    label: string;
}) {
    return (
        <div className="min-w-0 px-2 text-center first:pl-0 last:pr-0">
            <div className="flex items-center justify-center gap-1 text-base font-semibold tabular-nums text-white">
                <span className="text-cyan-300">{icon}</span>
                {value}
            </div>
            <p className="mt-1 truncate text-[11px] text-white/55">{label}</p>
        </div>
    );
}
