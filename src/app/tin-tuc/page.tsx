import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Newspaper } from "lucide-react";
import { desc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { newsPosts } from "@/lib/db/schema";
import { formatNewsDate } from "@/lib/news";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Tin tức học tập",
    description: "Các bài viết học tập, phương pháp tập trung và cập nhật từ StudyHay.",
};

export default async function NewsPage() {
    const posts = await db
        .select()
        .from(newsPosts)
        .where(eq(newsPosts.isPublished, true))
        .orderBy(desc(newsPosts.publishedAt), desc(newsPosts.createdAt));

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
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    Tin tức học tập
                </h1>
                <p className="mt-2 max-w-2xl leading-7 text-white/60">
                    Phương pháp học, mẹo tập trung và những cập nhật mới từ StudyHay.
                </p>
            </header>

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
                            <article
                                key={post.id}
                                className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/65 shadow-xl backdrop-blur-xl"
                            >
                                {post.coverImage && (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={post.coverImage}
                                        alt=""
                                        className="h-48 w-full object-cover"
                                    />
                                )}
                                <div className="p-6">
                                    <time className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200/70">
                                        {formatNewsDate(post.publishedAt ?? post.createdAt)}
                                    </time>
                                    <h2 className="mt-3 text-xl font-semibold text-white">
                                        {post.title}
                                    </h2>
                                    {post.excerpt && (
                                        <p className="mt-3 line-clamp-3 leading-7 text-white/60">
                                            {post.excerpt}
                                        </p>
                                    )}
                                    <Link
                                        href={`/tin-tuc/${post.slug}`}
                                        className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 transition hover:text-cyan-100"
                                    >
                                        Đọc bài viết
                                        <ArrowRight size={17} aria-hidden="true" />
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </section>
                )}
            </main>
        </div>
    );
}
