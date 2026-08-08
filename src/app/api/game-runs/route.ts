import { and, eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import {
    gameRuns,
    playerStats,
} from "@/lib/db/schema";
import {
    requireUser,
    UnauthorizedError,
} from "@/lib/server/require-user";
import {
    DAILY_CHALLENGE_QUESTION_COUNT,
    getDailyChallengeGameMode,
} from "@/lib/math-challenge";
import { parseGameRunInput } from "@/lib/validation/game-run";

export const runtime = "nodejs";

export async function POST(request: Request) {
    try {
        const user = await requireUser();
        const body = await request.json();
        const input = parseGameRunInput(body);
        const dailyGameMode = getDailyChallengeGameMode();
        const isDailyChallenge =
            input.gameMode.startsWith("daily-");

        if (
            isDailyChallenge &&
            input.gameMode !== dailyGameMode
        ) {
            throw new Error(
                "Thử thách này không còn hiệu lực"
            );
        }

        if (
            isDailyChallenge &&
            (input.gameType !== "quick-math" ||
                input.totalAnswers !==
                    DAILY_CHALLENGE_QUESTION_COUNT)
        ) {
            throw new Error(
                "Kết quả thử thách ngày không hợp lệ"
            );
        }

        const result = await db.transaction(
            async (tx) => {
                const [existingDailyRun] = isDailyChallenge
                    ? await tx
                          .select({ id: gameRuns.id })
                          .from(gameRuns)
                          .where(
                              and(
                                  eq(
                                      gameRuns.userId,
                                      user.id
                                  ),
                                  eq(
                                      gameRuns.gameType,
                                      "quick-math"
                                  ),
                                  eq(
                                      gameRuns.gameMode,
                                      dailyGameMode
                                  )
                              )
                          )
                          .limit(1)
                    : [];

                const inserted = existingDailyRun
                    ? []
                    : await tx
                          .insert(gameRuns)
                          .values({
                              clientRunId: input.clientRunId,
                              userId: user.id,
                              gameType: input.gameType,
                              gameMode: input.gameMode,
                              difficulty: input.difficulty,
                              score: input.score,
                              correctAnswers:
                                  input.correctAnswers,
                              totalAnswers:
                                  input.totalAnswers,
                              durationSeconds:
                                  input.durationSeconds,
                          })
                          .onConflictDoNothing({
                              target: gameRuns.clientRunId,
                          })
                          .returning({ id: gameRuns.id });

                const duplicate = inserted.length === 0;

                if (!duplicate) {
                    await tx
                        .insert(playerStats)
                        .values({
                            userId: user.id,
                            totalScore: input.score,
                            totalPlays: 1,
                            bestScore: input.score,
                            totalCorrect:
                                input.correctAnswers,
                            totalAnswers:
                                input.totalAnswers,
                            totalPlaySeconds:
                                input.durationSeconds,
                            updatedAt: new Date(),
                        })
                        .onConflictDoUpdate({
                            target:
                                playerStats.userId,
                            set: {
                                totalScore: sql`
                                    ${playerStats.totalScore}
                                    + ${input.score}
                                `,
                                totalPlays: sql`
                                    ${playerStats.totalPlays}
                                    + 1
                                `,
                                bestScore: sql`
                                    greatest(
                                        ${playerStats.bestScore},
                                        ${input.score}
                                    )
                                `,
                                totalCorrect: sql`
                                    ${playerStats.totalCorrect}
                                    + ${input.correctAnswers}
                                `,
                                totalAnswers: sql`
                                    ${playerStats.totalAnswers}
                                    + ${input.totalAnswers}
                                `,
                                totalPlaySeconds: sql`
                                    ${playerStats.totalPlaySeconds}
                                    + ${input.durationSeconds}
                                `,
                                updatedAt: new Date(),
                            },
                        });
                }

                const [stats] = await tx
                    .select({
                        totalScore:
                            playerStats.totalScore,
                        totalPlays:
                            playerStats.totalPlays,
                        bestScore:
                            playerStats.bestScore,
                        totalCorrect:
                            playerStats.totalCorrect,
                        totalAnswers:
                            playerStats.totalAnswers,
                        totalPlaySeconds:
                            playerStats.totalPlaySeconds,
                    })
                    .from(playerStats)
                    .where(
                        eq(
                            playerStats.userId,
                            user.id
                        )
                    )
                    .limit(1);

                return {
                    duplicate,
                    dailyAlreadyPlayed:
                        isDailyChallenge && Boolean(existingDailyRun),
                    stats: stats ?? {
                        totalScore: 0,
                        totalPlays: 0,
                        bestScore: 0,
                        totalCorrect: 0,
                        totalAnswers: 0,
                        totalPlaySeconds: 0,
                    },
                };
            }
        );

        return NextResponse.json(result);
    } catch (error) {
        if (error instanceof UnauthorizedError) {
            return NextResponse.json(
                { error: "Bạn chưa đăng nhập" },
                { status: 401 }
            );
        }

        const message =
            error instanceof Error
                ? error.message
                : "Không thể lưu kết quả";

        return NextResponse.json(
            { error: message },
            { status: 400 }
        );
    }
}
