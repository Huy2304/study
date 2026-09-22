import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Newspaper } from "lucide-react";
import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import { db } from "@/lib/db";
import { newsPosts } from "@/lib/db/schema";
import { formatNewsDate } from "@/lib/news";
import NewsComments from "@/components/news/NewsComments";

export const revalidate = 60;

type NewsDetailPageProps = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({
    params,
}: NewsDetailPageProps): Promise<Metadata> {
    const { slug } = await params;
    const [post] = await db
        .select({ title: newsPosts.title, excerpt: newsPosts.excerpt })
        .from(newsPosts)
        .where(and(eq(newsPosts.slug, slug), eq(newsPosts.isPublished, true)))
        .limit(1);

    return {
        title: post?.title ?? "Tin tức",
        description: post?.excerpt || undefined,
        openGraph: {
            title: post?.title ?? "Tin tức",
            description: post?.excerpt || undefined,
            type: "article",
            images: post?.coverImage ? [{ url: post.coverImage }] : undefined,
        },
    };
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
    const { slug } = await params;
    const [post] = await db
        .select()
        .from(newsPosts)
        .where(eq(newsPosts.slug, slug))
        .limit(1);

    if (!post || !post.isPublished) notFound();

    return (
        <div className="mx-auto min-h-screen w-full max-w-4xl px-5 py-8 sm:px-8 sm:py-12">
            <header className="flex items-center justify-between gap-4 border-b border-white/10 pb-6">
                <Link
                    href="/tin-tuc"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 transition hover:text-cyan-100"
                >
                    <ArrowLeft size={17} aria-hidden="true" />
                    Tất cả tin tức
                </Link>
                <Newspaper className="text-white/45" size={20} aria-hidden="true" />
            </header>

            <main className="py-8">
                <article className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/70 shadow-2xl backdrop-blur-xl">
                    {post.coverImage && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={post.coverImage}
                            alt=""
                            className="max-h-[28rem] w-full object-cover"
                        />
                    )}
                    <div className="p-6 sm:p-10">
                        <time className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200/70">
                            {formatNewsDate(post.publishedAt ?? post.createdAt)}
                        </time>
                        <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-5xl">
                            {post.title}
                        </h1>
                        {post.excerpt && (
                            <p className="mt-5 text-lg leading-8 text-white/65">
                                {post.excerpt}
                            </p>
                        )}
                        <div 
                            className="mt-8 whitespace-pre-wrap break-words text-[1.05rem] leading-8 text-white/80 prose prose-invert prose-cyan max-w-none prose-img:rounded-lg prose-img:mx-auto"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />

                        {post.affiliateUrl && (
                            <aside className="mt-10 border-t border-white/10 pt-7">
                                <p className="text-sm text-white/50">
                                    Bài viết có thể chứa liên kết tiếp thị liên kết.
                                </p>
                                <a
                                    href={post.affiliateUrl}
                                    target="_blank"
                                    rel="sponsored nofollow noopener"
                                    className="mt-3 inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-4 py-3 text-sm font-semibold text-cyan-950 transition hover:bg-cyan-200"
                                >
                                    Xem sản phẩm / ưu đãi
                                    <ExternalLink size={17} aria-hidden="true" />
                                </a>
                            </aside>
                        )}
                    </div>
                </article>

                {/* Phần bình luận */}
                <NewsComments slug={post.slug} />
            </main>
        </div>
    );
}
