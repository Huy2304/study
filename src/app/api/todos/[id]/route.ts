import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { todos } from "@/lib/db/schema";
import {
    requireUser,
    UnauthorizedError,
} from "@/lib/server/require-user";

export const runtime = "nodejs";

type RouteContext = {
    params: Promise<{
        id: string;
    }>;
};

export async function PATCH(
    request: Request,
    context: RouteContext
) {
    try {
        const user = await requireUser();
        const { id } = await context.params;
        const body = await request.json();

        const update: {
            content?: string;
            completed?: boolean;
            updatedAt: Date;
        } = {
            updatedAt: new Date(),
        };

        if (typeof body?.content === "string") {
            const content = body.content
                .trim()
                .slice(0, 500);

            if (!content) {
                return NextResponse.json(
                    {
                        error:
                            "Nội dung không được để trống",
                    },
                    { status: 400 }
                );
            }

            update.content = content;
        }

        if (
            typeof body?.completed === "boolean"
        ) {
            update.completed = body.completed;
        }

        const [updated] = await db
            .update(todos)
            .set(update)
            .where(
                and(
                    eq(todos.id, id),
                    eq(todos.userId, user.id)
                )
            )
            .returning();

        if (!updated) {
            return NextResponse.json(
                { error: "Không tìm thấy công việc" },
                { status: 404 }
            );
        }

        return NextResponse.json(updated);
    } catch (error) {
        if (error instanceof UnauthorizedError) {
            return NextResponse.json(
                { error: "Bạn chưa đăng nhập" },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { error: "Không thể cập nhật công việc" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    _request: Request,
    context: RouteContext
) {
    try {
        const user = await requireUser();
        const { id } = await context.params;

        const [deleted] = await db
            .delete(todos)
            .where(
                and(
                    eq(todos.id, id),
                    eq(todos.userId, user.id)
                )
            )
            .returning({
                id: todos.id,
            });

        if (!deleted) {
            return NextResponse.json(
                { error: "Không tìm thấy công việc" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
        });
    } catch (error) {
        if (error instanceof UnauthorizedError) {
            return NextResponse.json(
                { error: "Bạn chưa đăng nhập" },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { error: "Không thể xóa công việc" },
            { status: 500 }
        );
    }
}
