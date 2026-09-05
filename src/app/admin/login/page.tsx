import type { Metadata } from "next";

import AdminLoginForm from "@/components/admin/AdminLoginForm";

export const metadata: Metadata = {
    title: "Đăng nhập quản trị",
    robots: {
        index: false,
        follow: false,
    },
};

export default function AdminLoginPage() {
    return (
        <main className="flex min-h-screen items-center justify-center p-4">
            <AdminLoginForm />
        </main>
    );
}
