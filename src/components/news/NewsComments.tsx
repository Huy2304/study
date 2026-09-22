"use client";

import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { MessageSquare, Send } from "lucide-react";

import { useSession } from "@/lib/auth-client";

type Comment = {
    id: string;
    content: string;
    createdAt: string;
    user: {
        id: string;
        name: string;
        image: string | null;
    };
};

export default function NewsComments({ slug }: { slug: string }) {
    const { data: session } = useSession();
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState("");
    const [nickname, setNickname] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await fetch(`/api/news/${slug}/comments`);
                if (res.ok) {
                    const data = await res.json();
                    setComments(data);
                }
            } catch (error) {
                console.error("Error fetching comments:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchComments();
    }, [slug]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() || submitting) return;

        setSubmitting(true);
        try {
            const res = await fetch(`/api/news/${slug}/comments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ content, nickname: session ? undefined : nickname }),
            });

            if (res.ok) {
                const newComment = await res.json();
                setComments((prev) => [newComment, ...prev]);
                setContent("");
                if (!session) setNickname("");
            }
        } catch (error) {
            console.error("Error posting comment:", error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="mt-12 rounded-2xl border border-white/10 bg-zinc-950/40 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
            <h2 className="flex items-center gap-2 text-2xl font-bold text-white">
                <MessageSquare className="text-cyan-400" size={24} />
                Bình luận ({comments.length})
            </h2>

            {/* Comment Form */}
            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4 sm:flex-row">
                <div className="hidden sm:block">
                    {session?.user?.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={session.user.image}
                            alt=""
                            className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-cyan-500/20"
                        />
                    ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-950 text-sm font-bold text-cyan-200 ring-2 ring-cyan-500/20">
                            {session ? session.user.name?.charAt(0).toUpperCase() : "?"}
                        </div>
                    )}
                </div>
                <div className="flex-1 space-y-3">
                    {!session && (
                        <input
                            type="text"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            placeholder="Tên hoặc biệt danh của bạn *"
                            className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                            required
                        />
                    )}
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Viết bình luận của bạn..."
                        className="w-full resize-none rounded-xl border border-white/10 bg-black/50 p-4 text-sm text-white placeholder-white/30 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                        rows={3}
                        required
                    />
                    <div className="flex items-center justify-between">
                        {!session ? (
                            <span className="text-xs text-white/40">Bình luận ẩn danh (không cần tài khoản)</span>
                        ) : (
                            <span className="text-xs text-white/40">Đang bình luận dưới tên: <b className="text-cyan-200/70">{session.user.name}</b></span>
                        )}
                        <button
                            type="submit"
                            disabled={submitting || !content.trim() || (!session && !nickname.trim())}
                            className="inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-5 py-2 text-sm font-semibold text-cyan-950 transition hover:bg-cyan-300 disabled:opacity-50 disabled:hover:bg-cyan-400"
                        >
                            {submitting ? "Đang gửi..." : "Gửi bình luận"}
                            <Send size={16} />
                        </button>
                    </div>
                </div>
            </form>

            {/* Comments List */}
            <div className="mt-10 space-y-6">
                {loading ? (
                    <div className="animate-pulse space-y-4">
                        {[1, 2].map((i) => (
                            <div key={i} className="flex gap-4">
                                <div className="h-10 w-10 shrink-0 rounded-full bg-white/5" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 w-32 rounded bg-white/5" />
                                    <div className="h-16 rounded bg-white/5" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : comments.length > 0 ? (
                    comments.map((comment) => (
                        <div key={comment.id} className="flex gap-4">
                            {comment.user.image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={comment.user.image}
                                    alt=""
                                    className="h-10 w-10 shrink-0 rounded-full object-cover"
                                />
                            ) : (
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-sm font-bold text-white/80">
                                    {comment.user.name?.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div className="flex-1">
                                <div className="flex items-baseline gap-2">
                                    <h4 className="font-semibold text-white">
                                        {comment.user.name}
                                    </h4>
                                    <time className="text-xs text-white/40">
                                        {formatDistanceToNow(new Date(comment.createdAt), {
                                            addSuffix: true,
                                            locale: vi,
                                        })}
                                    </time>
                                </div>
                                <p className="mt-1 whitespace-pre-wrap text-[15px] leading-relaxed text-white/70">
                                    {comment.content}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-8 text-center text-sm text-white/40">
                        Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
                    </div>
                )}
            </div>
        </section>
    );
}
