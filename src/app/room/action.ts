// app/room/action.ts
"use server";

import { AccessToken, VideoGrant } from "livekit-server-sdk";

const apiKey = process.env.LIVEKIT_API_KEY!.trim();
const apiSecret = process.env.LIVEKIT_API_SECRET!.trim();
const livekitHost = process.env.LIVEKIT_URL!.trim(); // https://project.livekit.cloud

// Header đúng theo docs LiveKit Cloud 2025
const authHeader = `Bearer ${apiKey}`; // CHỈ cần API Key

// 1. Tạo phòng + sinh token (chuẩn docs)
export async function createRoomAndGetToken(formData: FormData) {
    const roomNameRaw = formData.get("roomName") as string;
    const userName = (formData.get("userName") as string)?.trim() || "Khách";

    if (!roomNameRaw?.trim()) throw new Error("Vui lòng nhập tên phòng");

    const roomName = roomNameRaw
        .trim()
        .toLowerCase() // hoặc tự viết replace
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

    // Tạo phòng trên LiveKit (nếu chưa tồn tại)
    try {
        await fetch(`${livekitHost}/rtc/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: authHeader,
            },
            body: JSON.stringify({
                name: roomName,
                empty_timeout: 1800,
                max_participants: 100,
            }),
        });
    } catch {
        // Bỏ qua nếu phòng đã tồn tại
    }

    // Tạo token chuẩn docs
    const at = new AccessToken(apiKey, apiSecret, {
        identity: `${userName}-${Math.random().toString(36).slice(2, 9)}`,
    });

    const grant: VideoGrant = {
        roomJoin: true,
        room: roomName,
        canPublish: true,
        canSubscribe: true,
    };

    at.addGrant(grant);
    const token = await at.toJwt();

    return { token, roomName };
}

// 2. Lấy danh sách phòng
export async function getRooms() {
    try {
        const res = await fetch(`${livekitHost}/rtc/list`, {
            headers: { Authorization: authHeader },
            next: { revalidate: 10 },
        });

        if (!res.ok) return [];
        const data = await res.json();
        return data.rooms || [];
    } catch {
        return [];
    }
}