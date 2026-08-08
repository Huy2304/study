import { and, asc, desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import {
    gameRuns,
    playerStats,
    user,
} from "@/lib/db/schema";
import { getDailyChallengeGameMode } from "@/lib/math-challenge";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const challengeDate = url.searchParams.get("challenge");
        const requestedLimit = Number(
            url.searchParams.get("limit") ?? 20
        );

        const limit = Number.isFinite(requestedLimit)
            ? Math.min(
                  100,
                  Math.max(1, Math.trunc(requestedLimit))
              )
            : 20;

        if (
            challengeDate &&
            !/^\d{4}-\d{2}-\d{2}$/.test(challengeDate)
        ) {
            return NextResponse.json(
                { error: "Ngày thử thách không hợp lệ" },
                { status: 400 }
            );
        }

        if (challengeDate) {
            const rows = await db
                .select({
                    userId: gameRuns.userId,
                    username: user.username,
                    displayName: user.displayUsername,
                    fallbackName: user.name,
                    score: gameRuns.score,
                    correctAnswers: gameRuns.correctAnswers,
                    totalAnswers: gameRuns.totalAnswers,
                    durationSeconds: gameRuns.durationSeconds,
                })
                .from(gameRuns)
                .innerJoin(user, eq(gameRuns.userId, user.id))
                .where(
                    and(
                        eq(gameRuns.gameType, "quick-math"),
                        eq(
                            gameRuns.gameMode,
                            getDailyChallengeGameMode(challengeDate)
                        )
                    )
                )
                .orderBy(
                    desc(gameRuns.score),
                    desc(gameRuns.correctAnswers),
                    asc(gameRuns.durationSeconds),
                    desc(gameRuns.createdAt)
                )
                .limit(limit);

            return NextResponse.json(
                rows.map((row, index) => ({
                    rank: index + 1,
                    userId: row.userId,
                    username: row.username,
                    displayName:
                        row.displayName ??
                        row.fallbackName ??
                        row.username ??
                        "Người chơi",
                    totalScore: row.score,
                    totalPlays: 1,
                    bestScore: row.score,
                    accuracy:
                        row.totalAnswers > 0
                            ? Math.round(
                                  (row.correctAnswers /
                                      row.totalAnswers) *
                                      100
                              )
                            : 0,
                })),
                {
                    headers: {
                        "Cache-Control":
                            "public, s-maxage=60, stale-while-revalidate=300",
                    },
                }
            );
        }

        const rows = await db
            .select({
                userId: playerStats.userId,
                username: user.username,
                displayName: user.displayUsername,
                fallbackName: user.name,
                totalScore: playerStats.totalScore,
                totalPlays: playerStats.totalPlays,
                bestScore: playerStats.bestScore,
                totalCorrect:
                    playerStats.totalCorrect,
                totalAnswers:
                    playerStats.totalAnswers,
            })
            .from(playerStats)
            .innerJoin(
                user,
                eq(playerStats.userId, user.id)
            )
            .orderBy(
                desc(playerStats.totalScore),
                desc(playerStats.bestScore),
                desc(playerStats.updatedAt)
            )
            .limit(limit);

        return NextResponse.json(
            rows.map((row, index) => ({
                rank: index + 1,
                userId: row.userId,
                username: row.username,
                displayName:
                    row.displayName ??
                    row.fallbackName ??
                    row.username ??
                    "Người chơi",
                totalScore: row.totalScore,
                totalPlays: row.totalPlays,
                bestScore: row.bestScore,
                accuracy:
                    row.totalAnswers > 0
                        ? Math.round(
                              (row.totalCorrect /
                                  row.totalAnswers) *
                                  100
                          )
                        : 0,
            })),
            {
                headers: {
                    "Cache-Control":
                        "public, s-maxage=60, stale-while-revalidate=300",
                },
            }
        );
    } catch {
        return NextResponse.json(
            { error: "Không thể tải bảng xếp hạng" },
            { status: 500 }
        );
    }
}
