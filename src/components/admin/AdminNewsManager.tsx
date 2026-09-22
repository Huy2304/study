"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import {
    Check,
    Edit3,
    ExternalLink,
    FilePlus2,
    LoaderCircle,
    Newspaper,
    Trash2,
} from "lucide-react";

import type { newsPosts } from "@/lib/db/schema";
import { formatNewsDate } from "@/lib/news";
import TipTapEditor from "./TipTapEditor";
import { uploadImage } from "@/lib/supabase-client";

type NewsPost = typeof newsPosts.$inferSelect;

type NewsForm = {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage: string;
    affiliateUrl: string;
    isPublished: boolean;
    category: string;
};

const emptyForm: NewsForm = {
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    affiliateUrl: "",
    isPublished: false,
    category: "Khác",
};

function getFormFromPost(post: NewsPost): NewsForm {
    return {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        coverImage: post.coverImage ?? "",
        affiliateUrl: post.affiliateUrl ?? "",
        isPublished: post.isPublished,
        category: post.category ?? "Khác",
    };
}

async function readResponseError(response: Response) {
    try {
        const body = (await response.json()) as { error?: string };
        return body.error || "Có lỗi xảy ra, vui lòng thử lại";
    } catch {
        return "Có lỗi xảy ra, vui lòng thử lại";
    }
}

export default function AdminNewsManager({
    initialPosts,
}: {
    initialPosts: NewsPost[];
}) {
    const [posts, setPosts] = useState(initialPosts);
    const [form, setForm] = useState<NewsForm>(emptyForm);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    function updateField<K extends keyof NewsForm>(field: K, value: NewsForm[K]) {
        setForm((current) => ({ ...current, [field]: value }));
    }

    async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setError("");
        
        try {
            const url = await uploadImage(file);
            updateField("coverImage", url);
            setMessage("Đã tải ảnh lên thành công");
        } catch (error) {
            console.error(error);
            setError("Lỗi tải ảnh: Hãy đảm bảo bạn đã tạo Bucket 'uploads' (Public) trong Supabase Storage");
        } finally {
            setIsUploading(false);
            event.target.value = "";
        }
    }

    function startNewPost() {
        setEditingId(null);
        setForm(emptyForm);
        setMessage("");
        setError("");
    }

    function startEditing(post: NewsPost) {
        setEditingId(post.id);
        setForm(getFormFromPost(post));
        setMessage("");
        setError("");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (isSaving) return;

        setIsSaving(true);
        setMessage("");
        setError("");

        try {
            const response = await fetch(
                editingId ? `/api/admin/news/${editingId}` : "/api/admin/news",
                {
                    method: editingId ? "PATCH" : "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form),
                }
            );

            if (!response.ok) {
                setError(await readResponseError(response));
                return;
            }

            const saved = (await response.json()) as NewsPost;
            setPosts((current) =>
                editingId
                    ? current.map((post) => (post.id === saved.id ? saved : post))
                    : [saved, ...current]
            );
            setForm(emptyForm);
            setEditingId(null);
            setMessage(saved.isPublished ? "Bài viết đã được xuất bản" : "Đã lưu bản nháp");
        } catch {
            setError("Không thể kết nối tới máy chủ");
        } finally {
            setIsSaving(false);
        }
    }

    async function handleDelete(post: NewsPost) {
        if (deletingId) return;
        if (!window.confirm(`Xóa bài viết “${post.title}”?`)) return;

        setDeletingId(post.id);
        setMessage("");
        setError("");

        try {
            const response = await fetch(`/api/admin/news/${post.id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                setError(await readResponseError(response));
                return;
            }

            setPosts((current) => current.filter((item) => item.id !== post.id));
            if (editingId === post.id) startNewPost();
            setMessage("Đã xóa bài viết");
        } catch {
            setError("Không thể kết nối tới máy chủ");
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)]">
            <section className="rounded-2xl border border-white/10 bg-zinc-950/65 p-5 shadow-xl backdrop-blur-xl sm:p-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-cyan-200/75">
                            {editingId ? <Edit3 size={16} aria-hidden="true" /> : <FilePlus2 size={16} aria-hidden="true" />}
                            {editingId ? "Chỉnh sửa" : "Bài viết mới"}
                        </p>
                        <h2 className="mt-2 text-xl font-semibold text-white">
                            {editingId ? "Cập nhật bài viết" : "Soạn nội dung"}
                        </h2>
                    </div>
                    {editingId && (
                        <button
                            type="button"
                            onClick={startNewPost}
                            className="rounded-lg border border-white/15 px-3 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
                        >
                            Bài mới
                        </button>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <label className="block">
                        <span className="text-sm text-white/65">Tiêu đề</span>
                        <input
                            value={form.title}
                            onChange={(event) => updateField("title", event.target.value)}
                            maxLength={180}
                            required
                            className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none placeholder:text-white/25 focus:border-cyan-400/60"
                            placeholder="Ví dụ: 5 cách học tập trung hơn mỗi ngày"
                        />
                    </label>

                    <label className="block">
                        <span className="text-sm text-white/65">Slug (không bắt buộc)</span>
                        <input
                            value={form.slug}
                            onChange={(event) => updateField("slug", event.target.value)}
                            maxLength={180}
                            className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none placeholder:text-white/25 focus:border-cyan-400/60"
                            placeholder="Tự tạo từ tiêu đề nếu để trống"
                        />
                    </label>

                    <label className="block">
                        <span className="text-sm text-white/65">Thể loại</span>
                        <select
                            value={form.category}
                            onChange={(event) => updateField("category", event.target.value)}
                            className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none focus:border-cyan-400/60 [&>option]:bg-zinc-900"
                        >
                            <option value="Khác">Khác</option>
                            <option value="Esports">Esports</option>
                            <option value="Thời sự">Thời sự</option>
                            <option value="Học tập">Học tập</option>
                            <option value="Giải trí">Giải trí</option>
                        </select>
                    </label>

                    <label className="block">
                        <span className="text-sm text-white/65">Mô tả ngắn</span>
                        <textarea
                            value={form.excerpt}
                            onChange={(event) => updateField("excerpt", event.target.value)}
                            maxLength={320}
                            rows={3}
                            className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none placeholder:text-white/25 focus:border-cyan-400/60"
                            placeholder="Hiển thị ở danh sách tin tức"
                        />
                    </label>

                    <div className="block">
                        <span className="text-sm text-white/65">Nội dung (HTML)</span>
                        <TipTapEditor
                            content={form.content}
                            onChange={(html) => updateField("content", html)}
                        />
                    </div>

                    <div className="block">
                        <span className="text-sm text-white/65">Ảnh đại diện (Tải lên hoặc URL)</span>
                        <div className="mt-2 flex gap-3">
                            <input
                                type="text"
                                value={form.coverImage}
                                onChange={(event) => updateField("coverImage", event.target.value)}
                                className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none placeholder:text-white/25 focus:border-cyan-400/60"
                                placeholder="https://... hoặc data:..."
                            />
                            <label className={`flex flex-shrink-0 cursor-pointer items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold text-white transition ${isUploading ? "bg-white/5 opacity-50" : "bg-white/10 hover:bg-white/20"}`}>
                                {isUploading ? "Đang tải..." : "Chọn ảnh"}
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
                            </label>
                        </div>
                    </div>

                    <label className="block">
                        <span className="text-sm text-white/65">Link affiliate (https://)</span>
                        <input
                            type="url"
                            value={form.affiliateUrl}
                            onChange={(event) => updateField("affiliateUrl", event.target.value)}
                            className="mt-2 w-full rounded-xl border border-cyan-300/20 bg-cyan-300/[0.04] px-4 py-3 text-white outline-none placeholder:text-white/25 focus:border-cyan-400/60"
                            placeholder="https://san-pham-doi-tac.example/..."
                        />
                        <span className="mt-2 block text-xs leading-5 text-white/45">
                            Link sẽ xuất hiện thành nút kêu gọi hành động ở cuối bài viết.
                        </span>
                    </label>

                    <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-white/75">
                        <input
                            type="checkbox"
                            checked={form.isPublished}
                            onChange={(event) => updateField("isPublished", event.target.checked)}
                            className="h-4 w-4 accent-cyan-400"
                        />
                        <span>Xuất bản ngay trên trang tin tức</span>
                    </label>

                    {error && <p className="text-sm text-red-300">{error}</p>}
                    {message && (
                        <p className="flex items-center gap-2 text-sm text-emerald-300">
                            <Check size={16} aria-hidden="true" />
                            {message}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isSaving}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-cyan-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isSaving && <LoaderCircle size={18} className="animate-spin" />}
                        {editingId ? "Lưu thay đổi" : form.isPublished ? "Xuất bản bài viết" : "Lưu bản nháp"}
                    </button>
                </form>
            </section>

            <section className="rounded-2xl border border-white/10 bg-zinc-950/65 p-5 shadow-xl backdrop-blur-xl sm:p-6">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-white/45">
                            <Newspaper size={16} aria-hidden="true" />
                            Kho bài viết
                        </p>
                        <h2 className="mt-2 text-xl font-semibold text-white">
                            {posts.length} bài viết
                        </h2>
                    </div>
                </div>

                {posts.length === 0 ? (
                    <p className="mt-8 rounded-xl border border-dashed border-white/15 px-4 py-8 text-center text-sm text-white/45">
                        Chưa có bài viết nào.
                    </p>
                ) : (
                    <ul className="mt-5 space-y-3">
                        {posts.map((post) => (
                            <li key={post.id} className="rounded-xl border border-white/10 bg-white/[0.035] p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <h3 className="line-clamp-2 font-medium text-white">{post.title}</h3>
                                        <p className="mt-1 text-xs text-white/45">
                                            {post.category} · {post.isPublished ? "Đã xuất bản" : "Bản nháp"} · {formatNewsDate(post.publishedAt ?? post.createdAt)}
                                        </p>
                                    </div>
                                    <span className={`flex-shrink-0 rounded-full px-2 py-1 text-[11px] font-semibold ${post.isPublished ? "bg-emerald-300/10 text-emerald-200" : "bg-amber-300/10 text-amber-200"}`}>
                                        {post.isPublished ? "LIVE" : "NHÁP"}
                                    </span>
                                </div>
                                <div className="mt-4 flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => startEditing(post)}
                                        className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold text-white/75 transition hover:bg-white/10 hover:text-white"
                                    >
                                        <Edit3 size={14} aria-hidden="true" />
                                        Sửa
                                    </button>
                                    {post.isPublished && (
                                        <Link
                                            href={`/tin-tuc/${post.slug}`}
                                            target="_blank"
                                            className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold text-white/75 transition hover:bg-white/10 hover:text-white"
                                        >
                                            <ExternalLink size={14} aria-hidden="true" />
                                            Xem
                                        </Link>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(post)}
                                        disabled={deletingId === post.id}
                                        className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-red-300/20 px-3 py-2 text-xs font-semibold text-red-200/80 transition hover:bg-red-300/10 hover:text-red-100 disabled:opacity-50"
                                    >
                                        {deletingId === post.id ? <LoaderCircle size={14} className="animate-spin" /> : <Trash2 size={14} aria-hidden="true" />}
                                        Xóa
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
}
