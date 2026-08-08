export interface DailyProgress {
    day: string;
    focusSeconds: number;
    completedSessions: number;
    focusDays: string[];
}

const STORAGE_KEY = "studyhay-daily-progress";
export const DAILY_PROGRESS_EVENT = "studyhay-daily-progress";

function getDayKey(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function createDefaultProgress(): DailyProgress {
    return {
        day: getDayKey(),
        focusSeconds: 0,
        completedSessions: 0,
        focusDays: [],
    };
}

export function readDailyProgress(): DailyProgress {
    const fallback = createDefaultProgress();

    if (typeof window === "undefined") return fallback;

    try {
        const stored = window.localStorage.getItem(STORAGE_KEY);

        if (!stored) return fallback;

        const parsed = JSON.parse(stored) as Partial<DailyProgress>;
        const focusDays = Array.isArray(parsed.focusDays)
            ? parsed.focusDays.filter(
                  (value): value is string => typeof value === "string"
              )
            : [];

        return {
            day: parsed.day === fallback.day ? fallback.day : fallback.day,
            focusSeconds:
                parsed.day === fallback.day &&
                Number.isFinite(parsed.focusSeconds)
                    ? Math.max(0, Number(parsed.focusSeconds))
                    : 0,
            completedSessions:
                parsed.day === fallback.day &&
                Number.isFinite(parsed.completedSessions)
                    ? Math.max(0, Number(parsed.completedSessions))
                    : 0,
            focusDays,
        };
    } catch {
        return fallback;
    }
}

function writeDailyProgress(progress: DailyProgress) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    window.dispatchEvent(new Event(DAILY_PROGRESS_EVENT));
}

export function recordFocusSession(durationSeconds: number) {
    if (typeof window === "undefined" || durationSeconds <= 0) return;

    const progress = readDailyProgress();
    const today = getDayKey();
    const focusDays = Array.from(
        new Set([...progress.focusDays, today])
    ).slice(-365);

    writeDailyProgress({
        ...progress,
        focusSeconds: progress.focusSeconds + Math.round(durationSeconds),
        completedSessions: progress.completedSessions + 1,
        focusDays,
    });
}

export function getFocusStreak(focusDays: string[]) {
    const focused = new Set(focusDays);
    const cursor = new Date();
    let streak = 0;

    while (focused.has(getDayKey(cursor))) {
        streak += 1;
        cursor.setDate(cursor.getDate() - 1);
    }

    return streak;
}
