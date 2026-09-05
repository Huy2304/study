import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { newsPosts } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/server/require-admin";
import {
    getUniqueSlug,
    parseNewsInput,
} from "@/lib/server/news-admin";

export const runtime = "nodejs";

export async function GET() {
    await requireAdmin();

    try {
        const rows = await db
            .select()
            .from(newsPosts)
            .orderBy(desc(newsPosts.createdAt));

        return NextResponse.json(rows);
    } catch {
        return NextResponse.json(
            { error: "Không thể tải danh sách tin tức" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    await requireAdmin();

    try {
        const body = (await request.json()) as Record<string, unknown>;
        const input = parseNewsInput(body);

        if (typeof input === "string") {
            return NextResponse.json({ error: input }, { status: 400 });
        }

        const slug = await getUniqueSlug(input.slug);
        const [created] = await db
            .insert(newsPosts)
            .values({
                ...input,
                slug,
                publishedAt: input.isPublished ? new Date() : null,
            })
            .returning();

        return NextResponse.json(created, { status: 201 });
    } catch {
        return NextResponse.json(
            { error: "Không thể tạo bài viết" },
            { status: 500 }
        );
    }
}
