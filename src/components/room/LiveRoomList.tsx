// components/LiveRoomList.tsx  ← GIỮ NGUYÊN TÊN FILE
"use server";

import { getRooms } from "@/app/room/action";
import { RefreshCw } from "lucide-react";

// Đổi tên component thành nội dung thực sự (sẽ được bọc Suspense bên ngoài)
export async function LiveRoomListContent({ onRefresh }: { onRefresh?: () => void }) {
    const rooms = await getRooms();

    return (
        <div className="space-y-3">
            {rooms.length === 0 ? (
                <p className="text-center text-gray-500 py-6 text-sm italic">
                    Chưa có phòng nào đang hoạt động
                </p>
            ) : (
                rooms.map((room: any) => (
                    <a
                        key={room.name}
                        href={`/room/${room.name}`}
                        className="block p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 hover:shadow-lg hover:scale-105 transition-all duration-200"
                    >
                        <div className="font-bold text-indigo-700 text-lg">{room.name}</div>
                        <div className="text-sm text-gray-600 mt-1">
                            {room.num_participants} người • {room.num_publishers} đang phát
                        </div>
                    </a>
                ))
            )}

            <button
                onClick={onRefresh}
                className="w-full mt-4 flex items-center justify-center gap-2 py-2 text-blue-600 hover:text-blue-800 font-medium text-sm hover:bg-blue-50 rounded-lg transition"
            >
                <RefreshCw className="w-4 h-4" />
                Làm mới danh sách
            </button>
        </div>
    );
}