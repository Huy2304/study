// components/RoomMeet.tsx  ← GIỮ NGUYÊN TÊN FILE
"use client";

import { useState, Suspense } from "react";                    // Thêm Suspense
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { createRoomAndGetToken } from "@/app/room/action";
import { LiveRoomListContent } from "./LiveRoomList";           // Đổi import

// Component bọc để dùng key + refresh
function LiveRoomListWrapper({ refreshKey, onRefresh }: { refreshKey: number; onRefresh: () => void }) {
    return <LiveRoomListContent key={refreshKey} onRefresh={onRefresh} />;
}

export function RoomMeet() {
    const [isOpen, setIsOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);           // Thêm state để refresh
    const router = useRouter();

    async function handleCreateRoom(formData: FormData) {
        setIsCreating(true);
        try {
            const { token, roomName } = await createRoomAndGetToken(formData);
            router.push(`/room/${roomName}?token=${token}`);
        } catch (error) {
            alert("Lỗi: " + (error as Error).message);
        } finally {
            setIsCreating(false);
        }
    }

    return (
        <>
            {/* Nút mở popup */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed right-30 z-50 fill-auto"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/>
                    <rect x="2" y="6" width="14" height="12" rx="2"/>
                </svg>
            </button>

            {/* Popup */}
            {isOpen && (
                <>
                    <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsOpen(false)} />

                    <Card className="fixed bottom-24 right-8 w-96 h-[80vh] overflow-y-auto z-50 shadow-2xl rounded-2xl bg-white p-6">
                        <button onClick={() => setIsOpen(false)} className="absolute top-4 right-6 text-2xl">×</button>

                        <h2 className="text-2xl font-bold text-center mb-6">Phòng họp video</h2>

                        {/* DANH SÁCH PHÒNG – CHỈ GỌI 1 LẦN + CÓ REFRESH */}
                        <div className="mb-8">
                            <h3 className="font-bold text-lg mb-3 text-orange-600">Phòng đang hoạt động</h3>

                            <Suspense fallback={
                                <div className="space-y-3">
                                    <div className="h-20 bg-gray-200 rounded-xl animate-pulse"></div>
                                    <div className="h-20 bg-gray-200 rounded-xl animate-pulse"></div>
                                </div>
                            }>
                                <LiveRoomListWrapper
                                    refreshKey={refreshKey}
                                    onRefresh={() => setRefreshKey(k => k + 1)}
                                />
                            </Suspense>
                        </div>

                        {/* Tạo phòng mới */}
                        <div>
                            <h3 className="font-bold text-lg mb-4 text-green-600">Tạo phòng mới</h3>
                            <form action={handleCreateRoom} className="space-y-4">
                                <div>
                                    <Label htmlFor="roomName">Tên phòng</Label>
                                    <Input name="roomName" placeholder="họp team, học online..." required />
                                </div>
                                <div>
                                    <Label htmlFor="userName">Tên bạn (không bắt buộc)</Label>
                                    <Input name="userName" placeholder="Minh, Lan..." />
                                </div>
                                <Button type="submit" disabled={isCreating} className="w-full">
                                    {isCreating ? "Đang tạo..." : "Tạo & vào phòng"}
                                </Button>
                            </form>
                        </div>
                    </Card>
                </>
            )}
        </>
    );
}