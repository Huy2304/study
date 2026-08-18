import { notFound, redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/server/require-user";

function getAdminEmails() {
    return new Set(
        (process.env.ADMIN_EMAILS ?? "")
            .split(",")
            .map((email) => email.trim().toLowerCase())
            .filter(Boolean)
    );
}

export async function requireAdmin() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    const adminEmails = getAdminEmails();

    if (
        adminEmails.size === 0 ||
        !adminEmails.has(user.email.trim().toLowerCase())
    ) {
        notFound();
    }

    return user;
}
