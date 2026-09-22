import { NextRequest, NextResponse } from "next/server";
import { eq, desc } from "drizzle-orm";

import { db } from "@/lib/db";
import { newsComments, newsPosts, user } from "@/lib/db/schema";
import { auth } from "@/lib/auth";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;

        // Tìm bài viết
        const [post] = await db
            .select()
            .from(newsPosts)
            .where(eq(newsPosts.slug, slug))
            .limit(1);

        if (!post) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        // Lấy comments (hỗ trợ leftJoin để lấy user nếu có)
        const comments = await db
            .select({
                id: newsComments.id,
                content: newsComments.content,
                createdAt: newsComments.createdAt,
                nickname: newsComments.nickname,
                user: {
                    id: user.id,
                    name: user.name,
                    image: user.image,
                },
            })
            .from(newsComments)
            .leftJoin(user, eq(newsComments.userId, user.id))
            .where(eq(newsComments.postId, post.id))
            .orderBy(desc(newsComments.createdAt));

        // Format lại dữ liệu trả về để thống nhất name
        const formattedComments = comments.map(c => ({
            id: c.id,
            content: c.content,
            createdAt: c.createdAt,
            user: c.user?.id ? c.user : {
                id: `anon-${c.id}`,
                name: c.nickname || "Khách",
                image: null
            }
        }));

        return NextResponse.json(formattedComments);
    } catch (error) {
        console.error("GET Comments error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const session = await auth.api.getSession({
            headers: request.headers,
        });

        const { slug } = await params;
        const body = await request.json();
        const content = body.content?.trim();
        const nickname = body.nickname?.trim();

        if (!content) {
            return NextResponse.json({ error: "Content is required" }, { status: 400 });
        }

        if (!session?.user && !nickname) {
            return NextResponse.json({ error: "Nickname is required for anonymous users" }, { status: 400 });
        }

        // Tìm bài viết
        const [post] = await db
            .select()
            .from(newsPosts)
            .where(eq(newsPosts.slug, slug))
            .limit(1);

        if (!post) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        // Tạo comment
        const [newComment] = await db
            .insert(newsComments)
            .values({
                postId: post.id,
                userId: session?.user?.id || null,
                nickname: session?.user?.id ? null : (nickname || "Khách"),
                content: content,
            })
            .returning();

        // Trả về comment vừa tạo
        return NextResponse.json({
            id: newComment.id,
            content: newComment.content,
            createdAt: newComment.createdAt,
            user: session?.user ? {
                id: session.user.id,
                name: session.user.name,
                image: session.user.image,
            } : {
                id: `anon-${newComment.id}`,
                name: newComment.nickname || "Khách",
                image: null
            },
        });
    } catch (error) {
        console.error("POST Comment error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
