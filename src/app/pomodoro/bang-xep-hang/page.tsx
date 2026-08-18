import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";

import Leaderboard from "@/components/game/Leaderboard";

export const metadata: Metadata = {
    title: "Bảng xếp hạng",
    description:
        "Theo dõi thành tích học tập và thử thách hằng ngày của cộng đồng StudyHay.",
    alternates: {
        canonical: "/pomodoro/bang-xep-hang",
    },
    openGraph: {
        title: "Bảng xếp hạng | StudyHay",
        description:
            "Theo dõi thành tích học tập và thử thách hằng ngày của cộng đồng StudyHay.",
        url: "/pomodoro/bang-xep-hang",
    },
};

export default function LeaderboardPage() {
    return (
        <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 pb-10 pt-8 sm:px-6 sm:pt-14">
            <Link
                href="/pomodoro"
                className="inline-flex w-fit items-center gap-2 text-sm text-white/60 transition hover:text-white"
            >
                <ArrowLeft size={16} aria-hidden="true" />
                Về Pomodoro
            </Link>

            <header className="mt-10">
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-cyan-300">
                    StudyHay
                </p>
                <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    Bảng xếp hạng
                </h1>
                <p className="mt-3 max-w-2xl leading-7 text-white/65">
                    Theo dõi tổng điểm từ các trò chơi học tập và bảng riêng của
                    Thử thách toán mỗi ngày. Đăng nhập trước khi chơi để đồng bộ
                    thành tích của bạn.
                </p>
            </header>

            <div className="mt-8">
                <Suspense
                    fallback={
                        <div className="h-72 animate-pulse rounded-2xl border border-white/10 bg-white/[0.04]" />
                    }
                >
                    <Leaderboard />
                </Suspense>
            </div>
        </div>
    );
}
