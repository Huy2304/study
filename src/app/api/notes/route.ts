import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { notes } from "@/lib/db/schema";
import {
    requireUser,
    UnauthorizedError,
} from "@/lib/server/require-user";

export const runtime = "nodejs";

function cleanTitle(value: unknown) {
    if (typeof value !== "string") return "";
    return value.trim().slice(0, 120);
}

function cleanContent(value: unknown) {
    if (typeof value !== "string") return "";
    return value.slice(0, 100_000);
}

export async function GET() {
    try {
        const user = await requireUser();

        const rows = await db
            .select()
            .from(notes)
            .where(eq(notes.userId, user.id))
            .orderBy(desc(notes.updatedAt));

        return NextResponse.json(rows);
    } catch (error) {
        if (error instanceof UnauthorizedError) {
            return NextResponse.json(
                { error: "Bạn chưa đăng nhập" },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { error: "Không thể tải ghi chú" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const user = await requireUser();
        const body = await request.json();

        const title = cleanTitle(body?.title);
        const content = cleanContent(body?.content);

        if (!title && !content) {
            return NextResponse.json(
                {
                    error:
                        "Ghi chú cần có tiêu đề hoặc nội dung",
                },
                { status: 400 }
            );
        }

        const [created] = await db
            .insert(notes)
            .values({
                userId: user.id,
                title,
                content,
            })
            .returning();

        return NextResponse.json(created, {
            status: 201,
        });
    } catch (error) {
        if (error instanceof UnauthorizedError) {
            return NextResponse.json(
                { error: "Bạn chưa đăng nhập" },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { error: "Không thể tạo ghi chú" },
            { status: 500 }
        );
    }
}
