import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server/require-admin";

function extractMeta(html: string, property: string) {
    // Thử match meta property="..." content="..."
    const regex1 = new RegExp(
        `<meta\\s+(?:[^>]*?\\s+)?(?:property|name)=["'](?:og:)?${property}["']\\s+(?:[^>]*?\\s+)?content=["']([^"']*)["']`,
        "i"
    );
    const match1 = html.match(regex1);
    if (match1) return match1[1];

    // Thử match meta content="..." property="..."
    const regex2 = new RegExp(
        `<meta\\s+(?:[^>]*?\\s+)?content=["']([^"']*)["']\\s+(?:[^>]*?\\s+)?(?:property|name)=["'](?:og:)?${property}["']`,
        "i"
    );
    const match2 = html.match(regex2);
    if (match2) return match2[1];

    return null;
}

function extractTitle(html: string) {
    const titleRegex = /<title[^>]*>([^<]+)<\/title>/i;
    const match = html.match(titleRegex);
    return match ? match[1].trim() : null;
}

export async function POST(req: Request) {
    try {
        await requireAdmin();

        const { url } = await req.json();
        if (!url || !url.startsWith("http")) {
            return NextResponse.json({ error: "URL không hợp lệ" }, { status: 400 });
        }

        // Fake user agent để các trang TMĐT (như Shopee, Lazada) không block request
        const response = await fetch(url, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept-Language": "vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7",
            },
            signal: AbortSignal.timeout(5000), // Timeout 5s
        });

        if (!response.ok) {
            return NextResponse.json({ error: "Không thể truy cập URL" }, { status: 400 });
        }

        const html = await response.text();

        // Ưu tiên og:title, nếu không có thì lấy thẻ <title>
        let title = extractMeta(html, "title") || extractTitle(html);
        let description = extractMeta(html, "description");
        let image = extractMeta(html, "image");

        // Một số web có thể mã hóa HTML Entities, nhưng ở mức đơn giản ta tạm dùng chuỗi thô.
        return NextResponse.json({
            title: title || "",
            description: description || "",
            image: image || "",
        });
    } catch (error) {
        console.error("Lỗi khi scrape link:", error);
        return NextResponse.json(
            { error: "Lỗi server khi lấy thông tin link" },
            { status: 500 }
        );
    }
}
