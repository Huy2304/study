import type { Metadata } from "next";
import Link from "next/link";
import { ShoppingBag, ExternalLink } from "lucide-react";
import { desc, eq, and, isNotNull, ne } from "drizzle-orm";

import { db } from "@/lib/db";
import { newsPosts } from "@/lib/db/schema";
import { formatNewsDate } from "@/lib/news";

export const revalidate = 60;

export const metadata: Metadata = {
    title: "Góc Review & Khuyến Mãi",
    description: "Tổng hợp các sản phẩm chất lượng, review chi tiết và deal hot.",
};

export default async function ReviewPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>;
}) {
    const params = await searchParams;
    const page = parseInt(params.page || "1", 10);
    const pageSize = 12;
    const offset = (page - 1) * pageSize;

    // Lọc các bài viết đã xuất bản và có affiliateUrl
    const condition = and(
        eq(newsPosts.isPublished, true),
        isNotNull(newsPosts.affiliateUrl),
        ne(newsPosts.affiliateUrl, "")
    );

    const posts = await db
        .select()
        .from(newsPosts)
        .where(condition)
        .orderBy(desc(newsPosts.publishedAt), desc(newsPosts.createdAt))
        .limit(pageSize + 1)
        .offset(offset);

    const hasNextPage = posts.length > pageSize;
    const displayPosts = posts.slice(0, pageSize);

    return (
        <div className="mx-auto min-h-screen w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
            <header className="border-b border-white/10 pb-7">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-rose-300 transition hover:text-rose-200"
                >
                    <ShoppingBag size={17} aria-hidden="true" />
                    StudyHay / Góc Review
                </Link>
                <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl">Góc Review & Deal Hot</h1>
                <p className="mt-2 text-white/60">Tổng hợp các sản phẩm chất lượng được chọn lọc kỹ càng, giúp bạn mua sắm thông minh hơn và nhận nhiều ưu đãi.</p>
            </header>

            <main className="py-8">
                {posts.length === 0 ? (
                    <section className="rounded-2xl border border-dashed border-white/15 bg-zinc-950/55 px-6 py-14 text-center">
                        <ShoppingBag className="mx-auto text-white/35" size={36} aria-hidden="true" />
                        <h2 className="mt-4 text-lg font-semibold text-white">
                            Chưa có sản phẩm nào
                        </h2>
                        <p className="mt-2 text-sm text-white/50">
                            Các deal hot và sản phẩm review sẽ sớm được cập nhật.
                        </p>
                    </section>
                ) : (
                    <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {displayPosts.map((post) => (
                            <div key={post.id} className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/65 shadow-xl backdrop-blur-xl transition hover:border-rose-400/50 hover:bg-zinc-900/80">
                                {post.coverImage && (
                                    <Link href={`/tin-tuc/${post.slug}`} className="block relative h-52 overflow-hidden">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={post.coverImage}
                                            alt={post.title}
                                            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />
                                    </Link>
                                )}
                                <div className="flex flex-1 flex-col p-5">
                                    <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.1em]">
                                        <span className="text-rose-300/80">{post.category}</span>
                                        <time className="text-white/40">
                                            {formatNewsDate(post.publishedAt ?? post.createdAt)}
                                        </time>
                                    </div>
                                    <Link href={`/tin-tuc/${post.slug}`} className="block">
                                        <h2 className="text-lg font-semibold leading-snug text-white transition group-hover:text-rose-300 line-clamp-2">
                                            {post.title}
                                        </h2>
                                    </Link>
                                    {post.excerpt && (
                                        <p className="mt-3 text-sm line-clamp-2 leading-relaxed text-white/60">
                                            {post.excerpt}
                                        </p>
                                    )}
                                    <div className="mt-auto pt-5 flex items-center gap-3">
                                        <Link
                                            href={`/tin-tuc/${post.slug}`}
                                            className="flex-1 rounded-xl bg-white/5 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-white/10"
                                        >
                                            Xem review
                                        </Link>
                                        {post.affiliateUrl && (
                                            <a
                                                href={post.affiliateUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-rose-500 py-2.5 text-sm font-semibold text-white shadow-[0_0_15px_rgba(244,63,94,0.3)] transition hover:bg-rose-400 hover:shadow-[0_0_20px_rgba(244,63,94,0.5)]"
                                            >
                                                Mua ngay
                                                <ExternalLink size={15} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </section>
                )}

                {/* Pagination Controls */}
                {(page > 1 || hasNextPage) && (
                    <div className="mt-10 flex items-center justify-center gap-4">
                        {page > 1 && (
                            <Link
                                href={`/goc-review?${new URLSearchParams({
                                    page: (page - 1).toString(),
                                }).toString()}`}
                                className="rounded-xl border border-white/10 bg-zinc-900/50 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
                            >
                                Trang trước
                            </Link>
                        )}
                        <span className="text-sm font-semibold text-white/40">Trang {page}</span>
                        {hasNextPage && (
                            <Link
                                href={`/goc-review?${new URLSearchParams({
                                    page: (page + 1).toString(),
                                }).toString()}`}
                                className="rounded-xl border border-white/10 bg-zinc-900/50 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
                            >
                                Trang tiếp theo
                            </Link>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
