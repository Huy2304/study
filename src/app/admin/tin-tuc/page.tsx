import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Newspaper } from "lucide-react";
import { desc } from "drizzle-orm";

import AdminLogoutButton from "@/components/admin/AdminLogoutButton";
import AdminNewsManager from "@/components/admin/AdminNewsManager";
import { db } from "@/lib/db";
import { newsPosts } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/server/require-admin";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Quản lý tin tức",
    robots: {
        index: false,
        follow: false,
    },
};

export default async function AdminNewsPage() {
    await requireAdmin();
    const posts = await db
        .select()
        .from(newsPosts)
        .orderBy(desc(newsPosts.createdAt));

    return (
        <div className="mx-auto min-h-screen w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
            <header className="flex flex-col gap-5 border-b border-white/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <Link
                        href="/admin"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 transition hover:text-cyan-100"
                    >
                        <ArrowLeft size={17} aria-hidden="true" />
                        Quản trị tổng quan
                    </Link>
                    <p className="mt-5 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-cyan-200/80">
                        <Newspaper size={17} aria-hidden="true" />
                        Nội dung
                    </p>
                    <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        Quản lý tin tức
                    </h1>
                    <p className="mt-2 text-white/60">
                        Soạn bài, gắn link affiliate và đưa bài viết lên trang công khai.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Link
                        href="/tin-tuc"
                        target="_blank"
                        className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
                    >
                        Xem trang tin tức
                    </Link>
                    <AdminLogoutButton />
                </div>
            </header>

            <main className="py-8">
                <AdminNewsManager initialPosts={posts} />
            </main>
        </div>
    );
}
