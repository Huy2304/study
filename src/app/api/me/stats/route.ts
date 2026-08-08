import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { playerStats } from "@/lib/db/schema";
import {
    requireUser,
    UnauthorizedError,
} from "@/lib/server/require-user";

export const runtime = "nodejs";

export async function GET() {
    try {
        const user = await requireUser();

        const [stats] = await db
            .select({
                totalScore: playerStats.totalScore,
                totalPlays: playerStats.totalPlays,
                bestScore: playerStats.bestScore,
                totalCorrect:
                    playerStats.totalCorrect,
                totalAnswers:
                    playerStats.totalAnswers,
                totalPlaySeconds:
                    playerStats.totalPlaySeconds,
            })
            .from(playerStats)
            .where(
                eq(playerStats.userId, user.id)
            )
            .limit(1);

        return NextResponse.json(
            stats ?? {
                totalScore: 0,
                totalPlays: 0,
                bestScore: 0,
                totalCorrect: 0,
                totalAnswers: 0,
                totalPlaySeconds: 0,
            }
        );
    } catch (error) {
        if (error instanceof UnauthorizedError) {
            return NextResponse.json(
                { error: "Bạn chưa đăng nhập" },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { error: "Không thể tải thống kê" },
            { status: 500 }
        );
    }
}
