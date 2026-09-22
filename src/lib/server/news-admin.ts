import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { newsPosts } from "@/lib/db/schema";
import { slugify } from "@/lib/news";

export type NewsInput = {
    title: string;
    excerpt: string;
    content: string;
    slug: string;
    coverImage: string | null;
    affiliateUrl: string | null;
    isPublished: boolean;
    category: string;
};

function readString(value: unknown, maxLength: number) {
    return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function readUrl(value: unknown, options: { allowLocal: boolean }) {
    const input = readString(value, 2_048);
    if (!input) return null;

    if (options.allowLocal && input.startsWith("/")) return input;

    try {
        const url = new URL(input);
        return url.protocol === "http:" || url.protocol === "https:"
            ? url.toString()
            : null;
    } catch {
        return null;
    }
}

export function parseNewsInput(body: Record<string, unknown>): NewsInput | string {
    const title = readString(body.title, 180);
    const content = typeof body.content === "string"
        ? body.content.slice(0, 100_000).trim()
        : "";
    const slug = slugify(readString(body.slug, 180) || title);

    if (title.length < 3) return "Tiêu đề cần có ít nhất 3 ký tự";
    if (!content) return "Nội dung bài viết không được để trống";
    if (!slug) return "Slug bài viết không hợp lệ";

    const affiliateInput = readString(body.affiliateUrl, 2_048);
    const affiliateUrl = readUrl(affiliateInput, { allowLocal: false });
    if (affiliateInput && !affiliateUrl) {
        return "Link affiliate phải bắt đầu bằng http:// hoặc https://";
    }

    const coverInput = typeof body.coverImage === "string" ? body.coverImage : "";
    let coverImage: string | null = null;
    if (coverInput.startsWith("data:image/")) {
        coverImage = coverInput.slice(0, 5_000_000); // 5MB limit
    } else if (coverInput) {
        coverImage = readUrl(coverInput.slice(0, 2048), { allowLocal: true });
        if (!coverImage) {
            return "Ảnh đại diện phải là URL http(s), file tải lên hoặc đường dẫn /";
        }
    }

    return {
        title,
        content,
        slug,
        excerpt: readString(body.excerpt, 320),
        coverImage,
        affiliateUrl,
        isPublished: body.isPublished === true,
        category: readString(body.category, 50) || "Khác",
    };
}

export async function getUniqueSlug(baseSlug: string) {
    let candidate = baseSlug;
    let suffix = 2;

    while (true) {
        const [existing] = await db
            .select({ id: newsPosts.id })
            .from(newsPosts)
            .where(eq(newsPosts.slug, candidate))
            .limit(1);

        if (!existing) return candidate;

        const suffixText = `-${suffix}`;
        candidate = `${baseSlug.slice(0, 180 - suffixText.length)}${suffixText}`;
        suffix += 1;
    }
}
