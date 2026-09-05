import { and, eq, ne } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { newsPosts } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/server/require-admin";
import {
    getUniqueSlug as getAvailableSlug,
    parseNewsInput,
} from "@/lib/server/news-admin";

export const runtime = "nodejs";

type RouteContext = {
    params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
    await requireAdmin();

    try {
        const { id } = await context.params;
        const [existing] = await db
            .select()
            .from(newsPosts)
            .where(eq(newsPosts.id, id))
            .limit(1);

        if (!existing) {
            return NextResponse.json(
                { error: "Không tìm thấy bài viết" },
                { status: 404 }
            );
        }

        const body = (await request.json()) as Record<string, unknown>;
        const input = parseNewsInput(body);

        if (typeof input === "string") {
            return NextResponse.json({ error: input }, { status: 400 });
        }

        const requestedSlug = input.slug;
        const [sameSlug] = await db
            .select({ id: newsPosts.id })
            .from(newsPosts)
            .where(
                and(eq(newsPosts.slug, requestedSlug), ne(newsPosts.id, id))
            )
            .limit(1);
        const slug = sameSlug
            ? await getAvailableSlug(requestedSlug)
            : requestedSlug;

        const [updated] = await db
            .update(newsPosts)
            .set({
                ...input,
                slug,
                publishedAt: input.isPublished
                    ? existing.publishedAt ?? new Date()
                    : null,
            })
            .where(eq(newsPosts.id, id))
            .returning();

        return NextResponse.json(updated);
    } catch {
        return NextResponse.json(
            { error: "Không thể cập nhật bài viết" },
            { status: 500 }
        );
    }
}

export async function DELETE(_request: Request, context: RouteContext) {
    await requireAdmin();

    try {
        const { id } = await context.params;
        const [deleted] = await db
            .delete(newsPosts)
            .where(eq(newsPosts.id, id))
            .returning({ id: newsPosts.id });

        if (!deleted) {
            return NextResponse.json(
                { error: "Không tìm thấy bài viết" },
                { status: 404 }
            );
        }

        return NextResponse.json({ ok: true });
    } catch {
        return NextResponse.json(
            { error: "Không thể xóa bài viết" },
            { status: 500 }
        );
    }
}
