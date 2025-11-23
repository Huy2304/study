// components/HeaderBar.tsx
'use client';

import { useState, useEffect } from 'react';
import {LampDesk, Users, Volume2, VolumeX, MoreVertical, Globe, Share2, Calendar, Book} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import TodoList from "@/components/TodoList";
import UserPanel from "@/components/UserPanel";
import {useFocusMode} from "@/lib/FocusModeContext";

export default function HeaderBar() {
    const [isMuted, setIsMuted] = useState(false);
    const [now, setNow] = useState(new Date());
    const [showTodoList, setShowTodoList] = useState(false);
    const { isSuperFocus } = useFocusMode();  // Không cần toggleSuperFocus nếu không dùng ở đây

    // Đồng hồ chạy thật - cập nhật mỗi giây (vẫn chạy dù ẩn)
    useEffect(() => {
        const interval = setInterval(() => {
            setNow(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Format ngày tháng + giờ đẹp
    const formatDateTime = (date: Date) => {
        const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
        const dayName = days[date.getDay()];
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');

        return {
            date: `${dayName}, ${day}/${month}`,
            time: `${hours}:${minutes}:${seconds}`
        };
    };

    const { date, time } = formatDateTime(now);

    return (
        <div className={`fixed inset-x-0 top-0 z-50 ${isSuperFocus ? 'hidden' : ''}`}>  {/* Thêm hidden khi super focus */}
            <div className="flex items-center justify-between px-5 py-3">

                {/* Left: Logo + Title */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <LampDesk size={28} className="text-yellow-400 drop-shadow-lg" />
                        <span className="text-2xl font-bold text-white tracking-tight">
                            StudyHay
                        </span>
                    </div>
                </div>

                {/* Center: Room Info + ĐỒNG HỒ + Controls */}
                <div className="flex items-center gap-6 text-white/80">
                    {/* Room Name */}
                    {/*<Tooltip>*/}
                    {/*    <TooltipTrigger asChild>*/}
                    {/*        <button className="flex items-center gap-2 hover:text-white transition">*/}
                    {/*            <Users size={18} />*/}
                    {/*            <span className="text-sm font-medium">User room</span>*/}
                    {/*        </button>*/}
                    {/*    </TooltipTrigger>*/}
                    {/*</Tooltip>*/}

                    {/* ĐỒNG HỒ THỰC + NGÀY THÁNG */}
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl px-4 py-2 rounded-full border border-white/20">
                        <Calendar size={16} className="text-white/70" />
                        <div className="text-right">
                            <div className="text-xs text-white/70 leading-tight">{date}</div>
                            <div className="text-lg font-mono text-white tracking-wider">{time}</div>
                        </div>
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-4">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                onClick={() => setShowTodoList(!showTodoList)}
                                className="relative p-2.5 rounded-lg hover:bg-white/10 transition"
                            >
                                <Book size={20} />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>
                            {showTodoList ? 'Ẩn Todo List' : 'Hiện Todo List'}
                        </TooltipContent>
                    </Tooltip>
                    {/*<Tooltip>*/}
                    {/*    <TooltipTrigger asChild>*/}
                    {/*        <button className="p-2.5 rounded-lg hover:bg-white/10 transition">*/}
                    {/*            <Globe size={20} />*/}
                    {/*        </button>*/}
                    {/*    </TooltipTrigger>*/}
                    {/*    <TooltipContent>Change background</TooltipContent>*/}
                    {/*</Tooltip>*/}

                    {/*<Tooltip>*/}
                    {/*    <TooltipTrigger asChild>*/}
                    {/*        <button className="p-2.5 rounded-lg hover:bg-white/10 transition">*/}
                    {/*            <Share2 size={20} />*/}
                    {/*        </button>*/}
                    {/*    </TooltipTrigger>*/}
                    {/*    <TooltipContent>Invite friends</TooltipContent>*/}
                    {/*</Tooltip>*/}

                    {/*<Tooltip>*/}
                    {/*    <TooltipTrigger asChild>*/}
                    {/*        <button className="p-2.5 rounded-lg hover:bg-white/10 transition">*/}
                    {/*            <MoreVertical size={20} />*/}
                    {/*        </button>*/}
                    {/*    </TooltipTrigger>*/}
                    {/*    <TooltipContent>More options</TooltipContent>*/}
                    {/*</Tooltip>*/}

                    {/*<UserPanel />*/}
                </div>
            </div>
            {showTodoList && <TodoList />}
        </div>
    );
}