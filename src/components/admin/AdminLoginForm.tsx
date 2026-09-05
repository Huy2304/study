"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, LoaderCircle, LogIn } from "lucide-react";

export default function AdminLoginForm() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (isSubmitting) return;

        setError("");
        setIsSubmitting(true);

        try {
            const response = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email.trim(),
                    password,
                }),
            });

            if (!response.ok) {
                setError("Email hoặc mật khẩu quản trị không đúng");
                return;
            }

            router.replace("/admin/tin-tuc");
            router.refresh();
        } catch {
            setError("Không thể đăng nhập. Vui lòng thử lại.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full max-w-sm rounded-2xl border border-white/10 bg-zinc-950/95 p-6 shadow-2xl"
        >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-300/10 text-cyan-200">
                <KeyRound size={21} aria-hidden="true" />
            </div>
            <h1 className="mt-5 text-2xl font-semibold text-white">
                Quản trị tin tức
            </h1>
            <p className="mt-2 text-sm leading-6 text-white/50">
                Chỉ tài khoản quản trị được phép đăng và quản lý bài viết.
            </p>

            <label className="mt-6 block">
                <span className="text-sm text-white/65">Email quản trị</span>
                <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="username"
                    required
                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none placeholder:text-white/25 focus:border-cyan-400/60"
                    placeholder="email@example.com"
                />
            </label>

            <label className="mt-4 block">
                <span className="text-sm text-white/65">Mật khẩu</span>
                <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                    minLength={8}
                    required
                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none placeholder:text-white/25 focus:border-cyan-400/60"
                    placeholder="Mật khẩu quản trị"
                />
            </label>

            {error && (
                <p role="alert" className="mt-4 text-sm text-red-300">
                    {error}
                </p>
            )}

            <button
                type="submit"
                disabled={isSubmitting || !email.trim() || password.length < 8}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 py-3 font-semibold text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
                {isSubmitting ? (
                    <LoaderCircle size={20} className="animate-spin" />
                ) : (
                    <LogIn size={20} />
                )}
                Đăng nhập quản trị
            </button>
        </form>
    );
}
