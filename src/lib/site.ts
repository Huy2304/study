const FALLBACK_SITE_URL = "http://localhost:3000";

export function getSiteUrl() {
    const configuredUrl =
        process.env.NEXT_PUBLIC_SITE_URL ??
        process.env.BETTER_AUTH_URL ??
        FALLBACK_SITE_URL;

    try {
        return new URL(configuredUrl).origin;
    } catch {
        return FALLBACK_SITE_URL;
    }
}
