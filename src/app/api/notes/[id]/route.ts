import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { notes } from "@/lib/db/schema";
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
            title?: string;
            content?: string;
            updatedAt: Date;
        } = {
            updatedAt: new Date(),
        };

        if (typeof body?.title === "string") {
            update.title = body.title
                .trim()
                .slice(0, 120);
        }

        if (typeof body?.content === "string") {
            update.content = body.content.slice(
                0,
                100_000
            );
        }

        const [updated] = await db
            .update(notes)
            .set(update)
            .where(
                and(
                    eq(notes.id, id),
                    eq(notes.userId, user.id)
                )
            )
            .returning();

        if (!updated) {
            return NextResponse.json(
                { error: "Không tìm thấy ghi chú" },
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
            { error: "Không thể cập nhật ghi chú" },
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
            .delete(notes)
            .where(
                and(
                    eq(notes.id, id),
                    eq(notes.userId, user.id)
                )
            )
            .returning({
                id: notes.id,
            });

        if (!deleted) {
            return NextResponse.json(
                { error: "Không tìm thấy ghi chú" },
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
            { error: "Không thể xóa ghi chú" },
            { status: 500 }
        );
    }
}
