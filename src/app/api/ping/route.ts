import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
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
