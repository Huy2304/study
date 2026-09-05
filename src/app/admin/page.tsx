import type { Metadata } from "next";
import Link from "next/link";
import { count, desc } from "drizzle-orm";
import {
    ArrowUpRight,
    CheckSquare,
    Gamepad2,
    LayoutDashboard,
    Newspaper,
    NotebookPen,
    Users,
} from "lucide-react";

import AdminLogoutButton from "@/components/admin/AdminLogoutButton";
import { db } from "@/lib/db";
import {
    gameRuns,
    notes,
    todos,
    user as users,
} from "@/lib/db/schema";
import { requireAdmin } from "@/lib/server/require-admin";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Quản trị",
    robots: {
        index: false,
        follow: false,
    },
};

function formatNumber(value: number) {
    return new Intl.NumberFormat("vi-VN").format(value);
}

function formatDate(value: Date) {
    return new Intl.DateTimeFormat("vi-VN", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(value);
}

export default async function AdminPage() {
    const admin = await requireAdmin();
    const [
        userResult,
        gameRunResult,
        noteResult,
        todoResult,
        recentUsers,
    ] = await Promise.all([
        db.select({ value: count() }).from(users),
        db.select({ value: count() }).from(gameRuns),
        db.select({ value: count() }).from(notes),
        db.select({ value: count() }).from(todos),
        db
            .select({
                id: users.id,
                name: users.name,
                email: users.email,
                username: users.username,
                createdAt: users.createdAt,
            })
            .from(users)
            .orderBy(desc(users.createdAt))
            .limit(8),
    ]);

    const stats = [
        {
            label: "Người dùng",
            value: userResult[0]?.value ?? 0,
            icon: Users,
            accent: "text-cyan-200 bg-cyan-300/10",
        },
        {
            label: "Lượt chơi",
            value: gameRunResult[0]?.value ?? 0,
            icon: Gamepad2,
            accent: "text-amber-100 bg-amber-300/10",
        },
        {
            label: "Ghi chú",
            value: noteResult[0]?.value ?? 0,
            icon: NotebookPen,
            accent: "text-violet-100 bg-violet-300/10",
        },
        {
            label: "Việc cần làm",
            value: todoResult[0]?.value ?? 0,
            icon: CheckSquare,
            accent: "text-emerald-100 bg-emerald-300/10",
        },
    ];

    return (
        <div className="mx-auto min-h-screen w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
            <header className="flex flex-col gap-5 border-b border-white/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-cyan-200/80">
                        <LayoutDashboard size={17} aria-hidden="true" />
                        StudyHay Admin
                    </p>
                    <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        Tổng quan website
                    </h1>
                    <p className="mt-2 text-white/60">
                        Đăng nhập với tư cách {admin.email}
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Link
                        href="/"
                        className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                    >
                        Xem website
                        <ArrowUpRight size={17} aria-hidden="true" />
                    </Link>
                    <AdminLogoutButton />
                </div>
            </header>

            <div className="mt-6">
                <Link
                    href="/admin/tin-tuc"
                    className="inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-4 py-2.5 text-sm font-semibold text-cyan-950 transition hover:bg-cyan-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-100"
                >
                    <Newspaper size={17} aria-hidden="true" />
                    Quản lý tin tức
                </Link>
            </div>

            <main className="py-8">
                <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat) => {
                        const Icon = stat.icon;

                        return (
                            <article
                                key={stat.label}
                                className="rounded-2xl border border-white/10 bg-zinc-950/60 p-5 shadow-xl backdrop-blur-xl"
                            >
                                <span
                                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.accent}`}
                                >
                                    <Icon size={21} aria-hidden="true" />
                                </span>
                                <p className="mt-5 text-sm text-white/55">
                                    {stat.label}
                                </p>
                                <p className="mt-1 text-3xl font-bold tabular-nums text-white">
                                    {formatNumber(stat.value)}
                                </p>
                            </article>
                        );
                    })}
                </section>

                <section className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/60 shadow-xl backdrop-blur-xl">
                    <header className="border-b border-white/10 px-5 py-4 sm:px-6">
                        <h2 className="font-semibold text-white">
                            Người dùng mới nhất
                        </h2>
                    </header>
                    {recentUsers.length === 0 ? (
                        <p className="px-5 py-8 text-sm text-white/55 sm:px-6">
                            Chưa có người dùng nào.
                        </p>
                    ) : (
                        <ul className="divide-y divide-white/[0.07]">
                            {recentUsers.map((member) => (
                                <li
                                    key={member.id}
                                    className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-6"
                                >
                                    <div className="min-w-0">
                                        <p className="truncate font-medium text-white">
                                            {member.name}
                                            {member.username
                                                ? ` (@${member.username})`
                                                : ""}
                                        </p>
                                        <p className="truncate text-sm text-white/50">
                                            {member.email}
                                        </p>
                                    </div>
                                    <time
                                        dateTime={member.createdAt.toISOString()}
                                        className="flex-shrink-0 text-sm text-white/45"
                                    >
                                        {formatDate(member.createdAt)}
                                    </time>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </main>
        </div>
    );
}
