"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
    LogIn,
    LogOut,
    User,
    UserPlus,
} from "lucide-react";

import { signOut, useSession } from "@/lib/auth-client";
export default function UserPanel() {
    const router = useRouter();
    const { data: session } = useSession();
    const user = session?.user ?? null;
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!open) return;

        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setOpen(false);
            }
        };

        window.addEventListener("keydown", closeOnEscape);
        return () => window.removeEventListener("keydown", closeOnEscape);
    }, [open]);

    async function handleSignOut() {
        await signOut();
        setOpen(false);
        router.refresh();
    }

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen((current) => !current)}
                className="relative flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-xl ring-4 ring-white/20 transition-all duration-300 hover:scale-110 hover:ring-white/40"
                aria-label={
                    user
                        ? `Mở tài khoản của ${user.name}`
                        : "Mở menu tài khoản"
                }
                aria-expanded={open}
            >
                <User
                    size={24}
                    strokeWidth={2}
                    className="drop-shadow"
                    aria-hidden="true"
                />
                <span
                    className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-black ${
                        user ? "bg-emerald-400" : "bg-white/50"
                    }`}
                />
            </button>

            {open &&
                typeof document !== "undefined" &&
                createPortal(
                    <>
                        <button
                            type="button"
                            className="fixed inset-0"
                            style={{ zIndex: 100 }}
                            onClick={() => setOpen(false)}
                            aria-label="Đóng menu tài khoản"
                        />
                        <section
                            role="dialog"
                            aria-modal="false"
                            aria-label="Menu tài khoản"
                            className="fixed right-3 top-20 max-h-[calc(100dvh-6rem)] w-[calc(100%-1.5rem)] max-w-72 overflow-y-auto rounded-2xl border border-white/20 bg-black/95 p-0 shadow-2xl backdrop-blur-2xl sm:right-5"
                            style={{ zIndex: 101 }}
                        >
                            <div className="w-full">
                    <div className="bg-gradient-to-r from-purple-600/50 to-pink-600/50 px-5 py-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur">
                                <User
                                    size={28}
                                    strokeWidth={2}
                                    className="text-white"
                                    aria-hidden="true"
                                />
                            </div>
                            <div className="min-w-0">
                                <p className="truncate font-bold text-white">
                                    {user?.name ?? "Khách"}
                                </p>
                                <p className="text-xs text-white/70">
                                    {user
                                        ? "Điểm được đồng bộ với Supabase"
                                        : "Đăng nhập để lưu thành tích"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1 p-3">
                        {user ? (
                            <button
                                type="button"
                                onClick={() => void handleSignOut()}
                                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-red-300 transition hover:bg-red-500/15"
                            >
                                <LogOut size={18} aria-hidden="true" />
                                <span>Đăng xuất</span>
                            </button>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    onClick={() => setOpen(false)}
                                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-cyan-300 transition hover:bg-cyan-500/15"
                                >
                                    <LogIn size={18} aria-hidden="true" />
                                    <span>Đăng nhập</span>
                                </Link>
                                <Link
                                    href="/register"
                                    onClick={() => setOpen(false)}
                                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-purple-200 transition hover:bg-purple-500/15"
                                >
                                    <UserPlus size={18} aria-hidden="true" />
                                    <span>Tạo tài khoản</span>
                                </Link>
                            </>
                        )}
                    </div>
                            </div>
                        </section>
                    </>,
                    document.body
                )}
        </>
    );
}
