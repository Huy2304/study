import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { todos } from "@/lib/db/schema";
import {
    requireUser,
    UnauthorizedError,
} from "@/lib/server/require-user";

export const runtime = "nodejs";

export async function GET() {
    try {
        const user = await requireUser();

        const rows = await db
            .select()
            .from(todos)
            .where(eq(todos.userId, user.id))
            .orderBy(desc(todos.updatedAt));

        return NextResponse.json(rows);
    } catch (error) {
        if (error instanceof UnauthorizedError) {
            return NextResponse.json(
                { error: "Bạn chưa đăng nhập" },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { error: "Không thể tải công việc" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const user = await requireUser();
        const body = await request.json();

        const content =
            typeof body?.content === "string"
                ? body.content.trim().slice(0, 500)
                : "";

        if (!content) {
            return NextResponse.json(
                { error: "Nội dung không được để trống" },
                { status: 400 }
            );
        }

        const [created] = await db
            .insert(todos)
            .values({
                userId: user.id,
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
            { error: "Không thể tạo công việc" },
            { status: 500 }
        );
    }
}
