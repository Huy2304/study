export interface SubmitGameRunInput {
    clientRunId: string;
    gameType:
        | "quick-math"
        | "flashcard"
        | "subject-quiz";
    gameMode: string;
    difficulty: string;
    score: number;
    correctAnswers: number;
    totalAnswers: number;
    durationSeconds: number;
}

export interface PlayerStatsResponse {
    totalScore: number;
    totalPlays: number;
    bestScore: number;
    totalCorrect: number;
    totalAnswers: number;
    totalPlaySeconds: number;
}

export async function submitGameRun(
    input: SubmitGameRunInput
): Promise<{
    duplicate: boolean;
    dailyAlreadyPlayed?: boolean;
    stats: PlayerStatsResponse;
}> {
    const response = await fetch("/api/game-runs", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data?.error ?? "Không thể lưu kết quả"
        );
    }

    return data;
}

export async function getMyStats(): Promise<
    PlayerStatsResponse
> {
    const response = await fetch("/api/me/stats", {
        cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data?.error ?? "Không thể tải thống kê"
        );
    }

    return data;
}
