import { NextResponse } from "next/server";

import {
    ADMIN_SESSION_COOKIE,
    ADMIN_SESSION_MAX_AGE,
    getAdminSessionToken,
    verifyAdminCredentials,
} from "@/lib/server/admin-session";

export const runtime = "nodejs";

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as {
            email?: unknown;
            password?: unknown;
        };
        const email = typeof body.email === "string" ? body.email : "";
        const password = typeof body.password === "string" ? body.password : "";

        if (!verifyAdminCredentials(email, password)) {
            return NextResponse.json(
                { error: "Email hoặc mật khẩu quản trị không đúng" },
                { status: 401 }
            );
        }

        const sessionToken = getAdminSessionToken();
        if (!sessionToken) {
            return NextResponse.json(
                { error: "Thiếu secret để tạo phiên quản trị" },
                { status: 500 }
            );
        }

        const response = NextResponse.json({ ok: true });
        response.cookies.set(ADMIN_SESSION_COOKIE, sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: ADMIN_SESSION_MAX_AGE,
        });

        return response;
    } catch {
        return NextResponse.json(
            { error: "Yêu cầu đăng nhập không hợp lệ" },
            { status: 400 }
        );
    }
}

export async function DELETE() {
    const response = NextResponse.json({ ok: true });
    response.cookies.set(ADMIN_SESSION_COOKIE, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 0,
    });

    return response;
}
