// components/MiniYoutubePlayer.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Radio, X } from "lucide-react";

export default function MiniYoutubePlayer() {
    const [isMusicOn, setIsMusicOn] = useState(false);        // đã bật nhạc chưa
    const [isPlayerOpen, setIsPlayerOpen] = useState(false);  // popup đang mở không
    const [url, setUrl] = useState("https://youtu.be/sw3MweqjSuI");

    const iframeRef = useRef<HTMLIFrameElement>(null);

    // Lấy video ID từ URL
    const getVideoId = (url: string): string => {
        try {
            const match = url.match(/(?:youtu\.be\/|v=|embed\/)([^#&?]{11})/);
            return match ? match[1] : "sw3MweqjSuI";
        } catch {
            return "sw3MweqjSuI";
        }
    };

    const videoId = getVideoId(url);
    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&mute=0&controls=1&rel=0&modestbranding=1&fs=1&color=white&enablejsapi=1&iv_load_policy=3`;

    // Chỉ load iframe 1 lần khi bật nhạc lần đầu
    useEffect(() => {
        if (isMusicOn && iframeRef.current) {
            // Nếu đổi link → chỉ cập nhật src (iframe tự reload nhẹ, không làm gián đoạn)
            iframeRef.current.src = embedUrl;
        }
    }, [url, embedUrl, isMusicOn]);

    // Xử lý click nút chính
    const togglePlayer = () => {
        if (!isMusicOn) {
            setIsMusicOn(true);
            setIsPlayerOpen(true); // lần đầu bật → mở luôn popup
        } else {
            setIsPlayerOpen(prev => !prev); // đã bật rồi → chỉ mở/đóng popup
        }
    };

    return (
        <>
            {/* Nút nổi cố định góc dưới trái */}
            <button
                onClick={togglePlayer}
                className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 transition-all hover:scale-110 group relative focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label={isMusicOn ? (isPlayerOpen ? "Đóng YouTube player" : "Mở YouTube player") : "Bật YouTube player"}
                aria-expanded={isPlayerOpen}
            >
                {isMusicOn && isPlayerOpen ? (
                    <X size={24} aria-hidden="true" />
                ) : (
                    <Radio size={24} aria-hidden="true" />
                )}
            </button>

            {/* Mini Player - chỉ render 1 lần khi bật nhạc */}
            {isMusicOn && (
                <div
                    className={`fixed bottom-20 left-4 max-h-[calc(100dvh-6rem)] w-96 max-w-[calc(100vw-2rem)] overflow-y-auto transition-all duration-500 ease-out origin-bottom-left sm:left-5 ${
                        isPlayerOpen
                            ? 'translate-y-0 opacity-100 scale-100'
                            : 'translate-y-8 opacity-0 scale-95 pointer-events-none'
                    }`}
                    style={{ zIndex: 310 }}
                >
                    <div className="bg-black/90 backdrop-blur-3xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-900/50 to-pink-900/50">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                <span className="text-sm font-semibold text-white">Now Playing</span>
                            </div>
                            <button
                                onClick={() => setIsPlayerOpen(false)}
                                className="text-white/60 hover:text-white transition"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Input đổi link */}
                        <div className="p-4 pt-3 ">
                            <input
                                type="text"
                                placeholder="Dán link YouTube ở đây...và enter"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-sm"
                            />
                        </div>

                        {/* YouTube Player - luôn tồn tại, chỉ ẩn bằng opacity + scale */}
                        <div className="aspect-video bg-black">
                            <iframe
                                ref={iframeRef}
                                src={isMusicOn ? embedUrl : undefined}
                                className="w-full h-full rounded-b-2xl"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                title="Mini YouTube Player"
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
