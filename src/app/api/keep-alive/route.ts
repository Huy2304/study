import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
    const cronSecret = process.env.CRON_SECRET?.trim();
    const authorization = request.headers.get("authorization");

    if (!cronSecret || authorization !== `Bearer ${cronSecret}`) {
        return NextResponse.json(
            { error: "Không được phép" },
            { status: 401 }
        );
    }

    try {
        await db.execute(sql`select 1`);
        return NextResponse.json({ ok: true });
    } catch {
        return NextResponse.json(
            { error: "Không thể kết nối database" },
            { status: 503 }
        );
    }
}
