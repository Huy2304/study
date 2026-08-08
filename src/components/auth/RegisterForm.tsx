"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    FormEvent,
    useState,
} from "react";
import {
    LoaderCircle,
    UserPlus,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

function normalizeUsername(value: string) {
    return value
        .trim()
        .toLowerCase()
        .slice(0, 24);
}

export default function RegisterForm() {
    const router = useRouter();

    const [displayName, setDisplayName] =
        useState("");
    const [username, setUsername] =
        useState("");
    const [password, setPassword] =
        useState("");
    const [confirmPassword, setConfirmPassword] =
        useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] =
        useState(false);

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        if (isSubmitting) return;

        const normalizedUsername =
            normalizeUsername(username);

        if (
            !/^[a-z0-9_.]{3,24}$/.test(
                normalizedUsername
            )
        ) {
            setError(
                "Username chỉ gồm chữ, số, dấu chấm hoặc gạch dưới"
            );
            return;
        }

        if (password.length < 8) {
            setError(
                "Mật khẩu phải có ít nhất 8 ký tự"
            );
            return;
        }

        if (password !== confirmPassword) {
            setError(
                "Hai mật khẩu không trùng nhau"
            );
            return;
        }

        setError("");
        setIsSubmitting(true);

        try {
            const internalEmail =
                `${crypto
                    .randomUUID()
                    .replaceAll("-", "")}` +
                "@users.studyhay.app";

            const result =
                await authClient.signUp.email({
                    email: internalEmail,
                    name:
                        displayName.trim() ||
                        normalizedUsername,
                    username: normalizedUsername,
                    displayUsername:
                        displayName.trim() ||
                        normalizedUsername,
                    password,
                });

            if (result.error) {
                const message =
                    result.error.message?.toLowerCase() ??
                    "";

                setError(
                    message.includes("username")
                        ? "Username này đã được sử dụng"
                        : "Không thể tạo tài khoản"
                );
                return;
            }

            router.replace("/");
            router.refresh();
        } catch {
            setError(
                "Không thể tạo tài khoản. Vui lòng thử lại."
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
                Tạo tài khoản
            </h1>

            <p className="mt-2 text-sm leading-6 text-white/50">
                Không cần nhập email. Hãy ghi nhớ username
                và mật khẩu để đăng nhập trên thiết bị khác.
            </p>

            <label className="mt-6 block">
                <span className="text-sm text-white/65">
                    Tên hiển thị
                </span>

                <input
                    value={displayName}
                    onChange={(event) =>
                        setDisplayName(event.target.value)
                    }
                    maxLength={30}
                    required
                    className="
                        mt-2 w-full rounded-xl border
                        border-white/10 bg-white/[0.06]
                        px-4 py-3 text-white outline-none
                        focus:border-purple-400/60
                    "
                    placeholder="Tên hiển thị trên bảng xếp hạng"
                />
            </label>

            <label className="mt-4 block">
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
                        focus:border-purple-400/60
                    "
                    placeholder="quochuong"
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
                    autoComplete="new-password"
                    minLength={8}
                    required
                    className="
                        mt-2 w-full rounded-xl border
                        border-white/10 bg-white/[0.06]
                        px-4 py-3 text-white outline-none
                        focus:border-purple-400/60
                    "
                    placeholder="Tối thiểu 8 ký tự"
                />
            </label>

            <label className="mt-4 block">
                <span className="text-sm text-white/65">
                    Nhập lại mật khẩu
                </span>

                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(event) =>
                        setConfirmPassword(
                            event.target.value
                        )
                    }
                    autoComplete="new-password"
                    minLength={8}
                    required
                    className="
                        mt-2 w-full rounded-xl border
                        border-white/10 bg-white/[0.06]
                        px-4 py-3 text-white outline-none
                        focus:border-purple-400/60
                    "
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
                    !displayName.trim() ||
                    !username.trim() ||
                    password.length < 8 ||
                    confirmPassword.length < 8
                }
                className="
                    mt-5 flex w-full items-center
                    justify-center gap-2 rounded-xl
                    bg-purple-500 py-3 font-semibold
                    text-white transition
                    hover:bg-purple-400
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
                    <UserPlus size={20} />
                )}

                Đăng ký
            </button>

            <p className="mt-5 text-center text-sm text-white/45">
                Đã có tài khoản?{" "}
                <Link
                    href="/login"
                    className="text-purple-300 hover:text-purple-200"
                >
                    Đăng nhập
                </Link>
            </p>
        </form>
    );
}
