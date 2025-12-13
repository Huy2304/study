"use client"
import { useState, useEffect, useMemo, useCallback } from 'react';
import {LampDesk, Calendar, Book} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import TodoList from "@/components/TodoList";
import {useFocusMode} from "@/lib/FocusModeContext";
import UserPanel from "@/components/UserPanel";
import {RoomMeet} from "@/components/room/RoomMeet";


export default function HeaderBar() {
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

    // Memoize format function
    const formatDateTime = useCallback((date: Date) => {
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
    }, []);

    const { date, time } = useMemo(() => formatDateTime(now), [formatDateTime, now]);
    
    const toggleTodoList = useCallback(() => {
        setShowTodoList(prev => !prev);
    }, []);

    return (
        <div 
            className={`fixed inset-x-0 top-0 ${isSuperFocus ? 'hidden' : ''}`}
            style={{ zIndex: 50 }}
        >
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
                <div className="flex items-center gap-4 sm:gap-6 text-white/80">
                    {/* ĐỒNG HỒ THỰC + NGÀY THÁNG */}
                    <div 
                        className="flex items-center gap-2 bg-white/10 backdrop-blur-xl px-3 sm:px-4 py-2 rounded-full border border-white/20"
                        role="timer"
                        aria-live="polite"
                        aria-label={`Ngày ${date}, giờ ${time}`}
                    >
                        <Calendar size={16} className="text-white/70 flex-shrink-0" aria-hidden="true" />
                        <div className="text-right min-w-0">
                            <div className="text-xs text-white/70 leading-tight truncate">{date}</div>
                            <div className="text-base sm:text-lg font-mono text-white tracking-wider">{time}</div>
                        </div>
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 sm:gap-4">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                onClick={toggleTodoList}
                                className="relative p-2.5 rounded-lg hover:bg-white/10 transition focus:outline-none focus:ring-2 focus:ring-white/50"
                                aria-label={showTodoList ? 'Ẩn Todo List' : 'Hiện Todo List'}
                                aria-expanded={showTodoList}
                            >
                                <Book size={20} aria-hidden="true" />
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
                    {/*/!*<RoomMeet/>*!/ Đang phát triển*/}
                    <UserPanel />
                </div>
            </div>
            {showTodoList && <TodoList />}
        </div>
    );
}