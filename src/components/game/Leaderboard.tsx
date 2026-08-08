"use client";

import {
    useCallback,
    useEffect,
    useState,
} from "react";
import {
    usePathname,
    useRouter,
    useSearchParams,
} from "next/navigation";
import {
    Medal,
    RefreshCw,
    Trophy,
} from "lucide-react";

import { getChallengeDate } from "@/lib/math-challenge";

interface LeaderboardEntry {
    rank: number;
    userId: string;
    username: string | null;
    displayName: string;
    totalScore: number;
    totalPlays: number;
    bestScore: number;
    accuracy: number;
}

export default function Leaderboard() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [entries, setEntries] =
        useState<LeaderboardEntry[]>([]);
    const [isLoading, setIsLoading] =
        useState(true);
    const [error, setError] = useState("");
    const scope =
        searchParams.get("tab") === "daily"
            ? "daily"
            : "overall";
    const challengeDate = getChallengeDate();

    const loadLeaderboard = useCallback(
        async () => {
            setError("");
            setIsLoading(true);

            try {
                const query = new URLSearchParams({ limit: "20" });

                if (scope === "daily") {
                    query.set("challenge", challengeDate);
                }

                const response = await fetch(
                    `/api/leaderboard?${query.toString()}`,
                    {
                        cache: "no-store",
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data?.error ??
                            "Không thể tải bảng xếp hạng"
                    );
                }

                setEntries(data);
            } catch (loadError) {
                setError(
                    loadError instanceof Error
                        ? loadError.message
                        : "Không thể tải bảng xếp hạng"
                );
            } finally {
                setIsLoading(false);
            }
        },
        [challengeDate, scope]
    );

    useEffect(() => {
        void loadLeaderboard();
    }, [loadLeaderboard]);

    const setScope = (nextScope: "overall" | "daily") => {
        const query = new URLSearchParams(searchParams.toString());

        if (nextScope === "daily") {
            query.set("tab", "daily");
        } else {
            query.delete("tab");
        }

        const queryString = query.toString();
        router.replace(
            queryString ? `${pathname}?${queryString}` : pathname,
            { scroll: false }
        );
    };

    return (
        <section
            className="
                overflow-hidden rounded-2xl border
                border-white/10 bg-zinc-950/90
            "
        >
            <header
                className="
                    flex items-center justify-between
                    border-b border-white/10 px-4 py-4
                    sm:px-5
                "
            >
                <div className="flex items-center gap-3">
                    <div
                        className="
                            flex h-10 w-10 items-center
                            justify-center rounded-xl
                            bg-yellow-500/15
                            text-yellow-300
                        "
                    >
                        <Trophy size={21} />
                    </div>

                    <div>
                        <h2 className="font-semibold text-white">
                            {scope === "daily"
                                ? "Thử thách hôm nay"
                                : "Bảng xếp hạng"}
                        </h2>

                        <p className="text-xs text-white/40">
                            {scope === "daily"
                                ? "10 câu chung · xếp theo điểm"
                                : "Xếp theo tổng điểm"}
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        void loadLeaderboard()
                    }
                    disabled={isLoading}
                    aria-label="Tải lại bảng xếp hạng"
                    className="
                        flex h-9 w-9 items-center
                        justify-center rounded-lg
                        text-white/45 hover:bg-white/10
                        hover:text-white disabled:opacity-40
                    "
                >
                    <RefreshCw
                        size={17}
                        className={
                            isLoading
                                ? "animate-spin"
                                : ""
                        }
                    />
                </button>
            </header>

            <div className="flex gap-2 border-b border-white/[0.06] px-4 py-3 sm:px-5">
                <button
                    type="button"
                    onClick={() => setScope("overall")}
                    className={`min-h-10 rounded-lg px-3 text-sm font-medium transition ${
                        scope === "overall"
                            ? "bg-cyan-500/15 text-cyan-200"
                            : "text-white/50 hover:bg-white/[0.06] hover:text-white"
                    }`}
                >
                    Tổng điểm
                </button>
                <button
                    type="button"
                    onClick={() => setScope("daily")}
                    className={`min-h-10 rounded-lg px-3 text-sm font-medium transition ${
                        scope === "daily"
                            ? "bg-amber-300/15 text-amber-100"
                            : "text-white/50 hover:bg-white/[0.06] hover:text-white"
                    }`}
                >
                    Thử thách ngày
                </button>
            </div>

            {error && (
                <p className="p-5 text-sm text-red-300">
                    {error}
                </p>
            )}

            {!error && isLoading && (
                <div className="space-y-2 p-4">
                    {Array.from({
                        length: 6,
                    }).map((_, index) => (
                        <div
                            key={index}
                            className="h-14 animate-pulse rounded-xl bg-white/[0.05]"
                        />
                    ))}
                </div>
            )}

            {!error &&
                !isLoading &&
                entries.length === 0 && (
                    <p className="p-6 text-center text-sm text-white/45">
                        {scope === "daily"
                            ? "Chưa có ai hoàn thành thử thách hôm nay."
                            : "Chưa có thành tích nào."}
                    </p>
                )}

            {!error &&
                !isLoading &&
                entries.length > 0 && (
                    <ol className="divide-y divide-white/[0.06]">
                        {entries.map((entry) => (
                            <li
                                key={entry.userId}
                                className="
                                    grid grid-cols-[44px_1fr_auto]
                                    items-center gap-3 px-4 py-3
                                    sm:px-5
                                "
                            >
                                <div className="flex justify-center">
                                    {entry.rank <= 3 ? (
                                        <Medal
                                            size={22}
                                            className={
                                                entry.rank === 1
                                                    ? "text-yellow-300"
                                                    : entry.rank === 2
                                                      ? "text-zinc-300"
                                                      : "text-amber-600"
                                            }
                                        />
                                    ) : (
                                        <span className="text-sm font-semibold text-white/40">
                                            {entry.rank}
                                        </span>
                                    )}
                                </div>

                                <div className="min-w-0">
                                    <p className="truncate font-medium text-white">
                                        {
                                            entry.displayName
                                        }
                                    </p>

                                    <p className="mt-0.5 text-xs text-white/35">
                                        {scope === "daily"
                                            ? "Thử thách hôm nay"
                                            : `${entry.totalPlays} lượt`}{" "}
                                        ·{" "}
                                        {
                                            entry.accuracy
                                        }
                                        % chính xác
                                    </p>
                                </div>

                                <div className="text-right">
                                    <p className="font-semibold tabular-nums text-cyan-300">
                                        {entry.totalScore.toLocaleString(
                                            "vi-VN"
                                        )}
                                    </p>

                                    <p className="text-[11px] text-white/35">
                                        {scope === "daily"
                                            ? "10 câu"
                                            : `Kỷ lục ${entry.bestScore.toLocaleString(
                                                  "vi-VN"
                                              )}`}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ol>
                )}
        </section>
    );
}
