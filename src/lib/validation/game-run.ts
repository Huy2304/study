export const GAME_TYPES = [
    "quick-math",
    "flashcard",
    "subject-quiz",
] as const;

export type GameType =
    (typeof GAME_TYPES)[number];

export interface GameRunInput {
    clientRunId: string;
    gameType: GameType;
    gameMode: string;
    difficulty: string;
    score: number;
    correctAnswers: number;
    totalAnswers: number;
    durationSeconds: number;
}

const UUID_PATTERN =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isIntegerInRange(
    value: unknown,
    min: number,
    max: number
): value is number {
    return (
        Number.isInteger(value) &&
        Number(value) >= min &&
        Number(value) <= max
    );
}

function isShortText(
    value: unknown,
    maxLength: number
): value is string {
    return (
        typeof value === "string" &&
        value.length > 0 &&
        value.length <= maxLength
    );
}

export function parseGameRunInput(
    value: unknown
): GameRunInput {
    if (
        typeof value !== "object" ||
        value === null
    ) {
        throw new Error("Dữ liệu không hợp lệ");
    }

    const input = value as Record<string, unknown>;

    if (
        typeof input.clientRunId !== "string" ||
        !UUID_PATTERN.test(input.clientRunId)
    ) {
        throw new Error("clientRunId không hợp lệ");
    }

    if (
        typeof input.gameType !== "string" ||
        !GAME_TYPES.includes(
            input.gameType as GameType
        )
    ) {
        throw new Error("gameType không hợp lệ");
    }

    if (!isShortText(input.gameMode, 30)) {
        throw new Error("gameMode không hợp lệ");
    }

    if (!isShortText(input.difficulty, 20)) {
        throw new Error("difficulty không hợp lệ");
    }

    if (!isIntegerInRange(input.score, 0, 100_000)) {
        throw new Error("score không hợp lệ");
    }

    if (
        !isIntegerInRange(
            input.correctAnswers,
            0,
            1_000
        )
    ) {
        throw new Error(
            "correctAnswers không hợp lệ"
        );
    }

    if (
        !isIntegerInRange(
            input.totalAnswers,
            0,
            1_000
        )
    ) {
        throw new Error("totalAnswers không hợp lệ");
    }

    if (
        Number(input.correctAnswers) >
        Number(input.totalAnswers)
    ) {
        throw new Error(
            "Số câu đúng lớn hơn tổng số câu"
        );
    }

    if (
        !isIntegerInRange(
            input.durationSeconds,
            0,
            86_400
        )
    ) {
        throw new Error(
            "durationSeconds không hợp lệ"
        );
    }

    return {
        clientRunId: input.clientRunId,
        gameType: input.gameType as GameType,
        gameMode: input.gameMode,
        difficulty: input.difficulty,
        score: input.score,
        correctAnswers: input.correctAnswers,
        totalAnswers: input.totalAnswers,
        durationSeconds: input.durationSeconds,
    };
}
