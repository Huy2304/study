import { notFound, redirect } from "next/navigation";

import {
    getConfiguredAdminEmail,
    hasAdminSession,
} from "@/lib/server/admin-session";

export async function requireAdmin() {
    const adminEmail = getConfiguredAdminEmail();

    if (!adminEmail) {
        notFound();
    }

    if (!(await hasAdminSession())) {
        redirect("/admin/login");
    }

    return { email: adminEmail };
}
