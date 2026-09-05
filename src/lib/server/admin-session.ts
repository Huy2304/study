import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_SESSION_COOKIE = "studyhay_admin_session";
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 8;

export function getConfiguredAdminEmail() {
    return process.env.ADMIN_EMAIL?.trim().toLowerCase() ?? "";
}

function getAdminPassword() {
    return process.env.ADMIN_PASSWORD ?? "";
}

function safeEqual(left: string, right: string) {
    const leftBuffer = Buffer.from(left);
    const rightBuffer = Buffer.from(right);

    return (
        leftBuffer.length === rightBuffer.length &&
        timingSafeEqual(leftBuffer, rightBuffer)
    );
}

function createAdminSessionToken() {
    const email = getConfiguredAdminEmail();
    const password = getAdminPassword();
    const appSecret = process.env.BETTER_AUTH_SECRET ?? "";

    if (!email || !password || !appSecret) return "";

    return createHmac("sha256", `${appSecret}:${password}`)
        .update(`studyhay-admin-session-v1:${email}`)
        .digest("base64url");
}

export function verifyAdminCredentials(email: string, password: string) {
    const configuredEmail = getConfiguredAdminEmail();
    const configuredPassword = getAdminPassword();
    const appSecret = process.env.BETTER_AUTH_SECRET ?? "";

    if (!configuredEmail || !configuredPassword || !appSecret) return false;

    const emailMatches = safeEqual(email.trim().toLowerCase(), configuredEmail);
    const passwordMatches = safeEqual(password, configuredPassword);

    return emailMatches && passwordMatches;
}

export async function hasAdminSession() {
    const expectedToken = createAdminSessionToken();
    const providedToken = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value ?? "";

    return Boolean(expectedToken && safeEqual(providedToken, expectedToken));
}

export function getAdminSessionToken() {
    return createAdminSessionToken();
}
