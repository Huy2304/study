"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    FormEvent,
    useState,
} from "react";
import { LoaderCircle, LogIn } from "lucide-react";

import { authClient } from "@/lib/auth-client";

export default function LoginForm() {
    const router = useRouter();

    const [username, setUsername] =
        useState("");
    const [password, setPassword] =
        useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] =
        useState(false);

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        if (isSubmitting) return;

        setError("");
        setIsSubmitting(true);

        try {
            const result =
                await authClient.signIn.username({
                    username: username.trim(),
                    password,
                });

            if (result.error) {
                setError(
                    "Username hoặc mật khẩu không đúng"
                );
                return;
            }

            router.replace("/");
            router.refresh();
        } catch {
            setError(
                "Không thể đăng nhập. Vui lòng thử lại."
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="
                w-full max-w-sm rounded-2xl border
                border-white/10 bg-zinc-950/95 p-6
                shadow-2xl
            "
        >
            <h1 className="text-2xl font-semibold text-white">
                Đăng nhập
            </h1>

            <p className="mt-2 text-sm leading-6 text-white/50">
                Dùng cùng username trên thiết bị khác để
                đồng bộ điểm, ghi chú và công việc.
            </p>

            <label className="mt-6 block">
                <span className="text-sm text-white/65">
                    Username
                </span>

                <input
                    value={username}
                    onChange={(event) =>
                        setUsername(event.target.value)
                    }
                    autoComplete="username"
                    maxLength={24}
                    required
                    className="
                        mt-2 w-full rounded-xl border
                        border-white/10 bg-white/[0.06]
                        px-4 py-3 text-white outline-none
                        placeholder:text-white/25
                        focus:border-cyan-400/60
                    "
                    placeholder="Ví dụ: quochuong"
                />
            </label>

            <label className="mt-4 block">
                <span className="text-sm text-white/65">
                    Mật khẩu
                </span>

                <input
                    type="password"
                    value={password}
                    onChange={(event) =>
                        setPassword(event.target.value)
                    }
                    autoComplete="current-password"
                    minLength={8}
                    required
                    className="
                        mt-2 w-full rounded-xl border
                        border-white/10 bg-white/[0.06]
                        px-4 py-3 text-white outline-none
                        placeholder:text-white/25
                        focus:border-cyan-400/60
                    "
                    placeholder="Tối thiểu 8 ký tự"
                />
            </label>

            {error && (
                <p
                    role="alert"
                    className="mt-4 text-sm text-red-300"
                >
                    {error}
                </p>
            )}

            <button
                type="submit"
                disabled={
                    isSubmitting ||
                    !username.trim() ||
                    password.length < 8
                }
                className="
                    mt-5 flex w-full items-center
                    justify-center gap-2 rounded-xl
                    bg-cyan-500 py-3 font-semibold
                    text-black transition hover:bg-cyan-400
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                "
            >
                {isSubmitting ? (
                    <LoaderCircle
                        size={20}
                        className="animate-spin"
                    />
                ) : (
                    <LogIn size={20} />
                )}

                Đăng nhập
            </button>

            <p className="mt-5 text-center text-sm text-white/45">
                Chưa có tài khoản?{" "}
                <Link
                    href="/register"
                    className="text-cyan-300 hover:text-cyan-200"
                >
                    Đăng ký
                </Link>
            </p>
        </form>
    );
}
