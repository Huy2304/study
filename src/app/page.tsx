import Link from "next/link";
import {
    ArrowRight,
    BookOpen,
    Clock3,
    Gamepad2,
    LampDesk,
    Trophy,
} from "lucide-react";

const navigationCards = [
    {
        id: "pomodoro",
        title: "Pomodoro",
        icon: Clock3,
        href: "/pomodoro",
        accent: "text-cyan-200",
        panel: (
            <>
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-200/75">
                        Tập trung mỗi ngày
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
                        Đồng hồ Pomodoro
                    </h2>
                    <p className="mt-2 max-w-xl leading-7 text-white/60">
                        Chọn phiên 25, 50 hoặc 90 phút, đặt mục tiêu và giữ nhịp
                        học của bạn.
                    </p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <Link
                        href="/pomodoro"
                        className="inline-flex items-center gap-2 rounded-xl bg-cyan-200 px-4 py-2.5 text-sm font-semibold text-cyan-950 transition hover:bg-cyan-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-100"
                    >
                        Bắt đầu tập trung
                        <ArrowRight size={17} aria-hidden="true" />
                    </Link>
                    <Link
                        href="/pomodoro/bang-xep-hang"
                        className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                    >
                        <Trophy size={17} aria-hidden="true" />
                        Bảng xếp hạng
                    </Link>
                </div>
            </>
        ),
    },
    {
        id: "tin-tuc",
        title: "Tin tức",
        icon: BookOpen,
        href: "/tin-tuc",
        accent: "text-violet-200",
        panel: (
            <>
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-200/75">
                        Góc học tập
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
                        Tin tức học tập
                    </h2>
                    <p className="mt-2 max-w-xl leading-7 text-white/60">
                        Các bài viết về phương pháp học, mẹo tập trung và cập nhật
                        mới của StudyHay sẽ được đăng tại đây.
                    </p>
                </div>
                <Link
                    href="/tin-tuc"
                    className="inline-flex w-fit items-center gap-2 rounded-xl border border-violet-200/25 bg-violet-200/10 px-4 py-2.5 text-sm font-semibold text-violet-100 transition hover:bg-violet-200/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-100"
                >
                    Đọc tin tức
                    <ArrowRight size={17} aria-hidden="true" />
                </Link>
            </>
        ),
    },
    {
        id: "game",
        title: "Game",
        icon: Gamepad2,
        href: "/game",
        accent: "text-amber-200",
        panel: (
            <>
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-200/75">
                        Học mà chơi
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
                        Trò chơi học tập
                    </h2>
                    <p className="mt-2 max-w-xl leading-7 text-white/60">
                        Luyện Toán, Tiếng Anh và các môn học khác trong không
                        gian trò chơi riêng của StudyHay.
                    </p>
                </div>
                <Link
                    href="/game"
                    className="inline-flex w-fit items-center gap-2 rounded-xl border border-amber-200/25 bg-amber-200/10 px-4 py-2.5 text-sm font-semibold text-amber-100 transition hover:bg-amber-200/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-100"
                >
                    Mở trò chơi
                    <ArrowRight size={17} aria-hidden="true" />
                </Link>
            </>
        ),
    },
];

export default function Home() {
    return (
        <div className="mx-auto min-h-screen w-full max-w-6xl px-5 py-6 sm:px-8 sm:py-10">
            <header className="flex items-center gap-2 text-lg font-bold tracking-tight text-white">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-300/15 text-yellow-300">
                    <LampDesk size={23} aria-hidden="true" />
                </span>
                StudyHay
            </header>

            <main className="py-10 sm:py-14">
                <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    Không gian học tập StudyHay
                </h1>
                <p className="mt-3 max-w-2xl leading-7 text-white/60">
                    Chọn một khu vực để bắt đầu học, đọc nội dung mới hoặc luyện
                    tập bằng trò chơi.
                </p>

                <section
                    aria-label="Các khu vực của StudyHay"
                    className="mt-8 grid gap-4 md:grid-cols-[10.25rem_minmax(0,1fr)]"
                >
                    {navigationCards.map((card) => {
                        const Icon = card.icon;
                        const navigationContent = (
                            <>
                                <Icon size={28} aria-hidden="true" />
                                <span className="mt-4 text-lg font-semibold text-white">
                                    {card.title}
                                </span>
                            </>
                        );

                        return (
                            <div
                                key={card.id}
                                className="contents md:col-span-2 md:grid md:grid-cols-subgrid"
                            >
                                {card.href ? (
                                    <Link
                                        href={card.href}
                                        className={`group flex min-h-40 flex-col items-center justify-center rounded-2xl border border-white/10 bg-zinc-950/65 p-5 text-center shadow-xl backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-white/25 hover:bg-zinc-950/85 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 ${card.accent}`}
                                    >
                                        {navigationContent}
                                    </Link>
                                ) : (
                                    <article
                                        className={`flex min-h-40 flex-col items-center justify-center rounded-2xl border border-white/10 bg-zinc-950/65 p-5 text-center shadow-xl backdrop-blur-xl ${card.accent}`}
                                    >
                                        {navigationContent}
                                    </article>
                                )}

                                <article className="flex min-h-40 flex-col justify-between gap-6 rounded-2xl border border-white/10 bg-zinc-950/55 p-6 shadow-xl backdrop-blur-xl sm:p-7">
                                    {card.panel}
                                </article>
                            </div>
                        );
                    })}
                </section>
            </main>
        </div>
    );
}
