import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Newspaper } from "lucide-react";
import { desc, eq, and } from "drizzle-orm";

import { db } from "@/lib/db";
import { newsPosts } from "@/lib/db/schema";
import { formatNewsDate } from "@/lib/news";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Tin tức",
    description: "Các bài viết, tin tức Esports, thời sự và cập nhật từ StudyHay.",
};

export default async function NewsPage({
    searchParams,
}: {
    searchParams: Promise<{ category?: string }>;
}) {
    const params = await searchParams;
    const category = params.category;

    const condition = category
        ? and(eq(newsPosts.isPublished, true), eq(newsPosts.category, category))
        : eq(newsPosts.isPublished, true);

    const posts = await db
        .select()
        .from(newsPosts)
        .where(condition)
        .orderBy(desc(newsPosts.publishedAt), desc(newsPosts.createdAt));

    const categories = ["Esports", "Thời sự", "Học tập", "Giải trí", "Khác"];

    return (
        <div className="mx-auto min-h-screen w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
            <header className="border-b border-white/10 pb-7">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 transition hover:text-cyan-100"
                >
                    <Newspaper size={17} aria-hidden="true" />
                    StudyHay / Tin tức
                </Link>
            </header>

            {/* Hàng chứa các thể loại */}
            <div className="mt-6 flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-zinc-950/65 p-2 shadow-xl backdrop-blur-xl">
                <Link
                    href="/tin-tuc"
                    className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${!category ? "bg-cyan-400 text-cyan-950" : "text-white/70 hover:bg-white/10 hover:text-white"}`}
                >
                    Tất cả
                </Link>
                {categories.map((cat) => (
                    <Link
                        key={cat}
                        href={`/tin-tuc?category=${encodeURIComponent(cat)}`}
                        className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${category === cat ? "bg-cyan-400 text-cyan-950" : "text-white/70 hover:bg-white/10 hover:text-white"}`}
                    >
                        {cat}
                    </Link>
                ))}
            </div>

            <main className="py-8">
                {posts.length === 0 ? (
                    <section className="rounded-2xl border border-dashed border-white/15 bg-zinc-950/55 px-6 py-14 text-center">
                        <Newspaper className="mx-auto text-white/35" size={36} aria-hidden="true" />
                        <h2 className="mt-4 text-lg font-semibold text-white">
                            Chưa có bài viết
                        </h2>
                        <p className="mt-2 text-sm text-white/50">
                            Nội dung mới sẽ được cập nhật tại đây.
                        </p>
                    </section>
                ) : (
                    <section className="grid gap-5 md:grid-cols-2">
                        {posts.map((post) => (
                            <Link
                                key={post.id}
                                href={`/tin-tuc/${post.slug}`}
                                className="group overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/65 shadow-xl backdrop-blur-xl transition hover:border-cyan-400/50 hover:bg-zinc-900/80"
                            >
                                <article>
                                    {post.coverImage && (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={post.coverImage}
                                            alt=""
                                            className="h-48 w-full object-cover transition duration-500 group-hover:scale-105"
                                        />
                                    )}
                                    <div className="p-6">
                                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em]">
                                            <span className="text-white/60">{post.category}</span>
                                            <span className="text-white/30">•</span>
                                            <time className="text-cyan-200/70">
                                                {formatNewsDate(post.publishedAt ?? post.createdAt)}
                                            </time>
                                        </div>
                                        <h2 className="mt-3 text-xl font-semibold text-white transition group-hover:text-cyan-300">
                                            {post.title}
                                        </h2>
                                        {post.excerpt && (
                                            <p className="mt-3 line-clamp-3 leading-7 text-white/60">
                                                {post.excerpt}
                                            </p>
                                        )}
                                        <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 transition group-hover:text-cyan-100">
                                            Đọc bài viết
                                            <ArrowRight size={17} aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </section>
                )}
            </main>
        </div>
    );
}
