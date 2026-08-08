"use client";

import Link from "next/link";
import {
    LogIn,
    LogOut,
    UserRound,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

export default function UserMenu() {
    const {
        data: session,
        isPending,
    } = authClient.useSession();

    if (isPending) {
        return (
            <div className="h-10 w-28 animate-pulse rounded-xl bg-white/10" />
        );
    }

    if (!session?.user) {
        return (
            <Link
                href="/login"
                className="
                    flex h-10 items-center gap-2
                    rounded-xl border border-white/10
                    bg-white/[0.06] px-3
                    text-sm text-white/70
                    hover:bg-white/10 hover:text-white
                "
            >
                <LogIn size={17} />
                Đăng nhập
            </Link>
        );
    }

    const visibleName =
        session.user.displayUsername ??
        session.user.name ??
        session.user.username ??
        "Người chơi";

    return (
        <div className="flex items-center gap-2">
            <div
                className="
                    flex h-10 min-w-0 items-center gap-2
                    rounded-xl border border-white/10
                    bg-white/[0.06] px-3
                "
            >
                <UserRound
                    size={17}
                    className="flex-shrink-0 text-cyan-300"
                />

                <span className="max-w-32 truncate text-sm text-white">
                    {visibleName}
                </span>
            </div>

            <button
                type="button"
                onClick={async () => {
                    await authClient.signOut();
                    window.location.href = "/";
                }}
                aria-label="Đăng xuất"
                className="
                    flex h-10 w-10 items-center
                    justify-center rounded-xl
                    border border-white/10
                    bg-white/[0.06] text-white/55
                    hover:bg-red-500/10
                    hover:text-red-300
                "
            >
                <LogOut size={18} />
            </button>
        </div>
    );
}
