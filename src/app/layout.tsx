// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import {TooltipProvider} from "@/components/ui/tooltip";
import {FocusModeProvider} from "@/lib/FocusModeContext";

export const metadata: Metadata = {
    title: "StudyFocus",
    description: "Focus timer with beautiful backgrounds",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="h-full">
        <body className="h-full bg-black text-white antialiased">

        {/* Full-screen Background – SIÊU NÉT & ĐẸP */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
            {/* 1. Ảnh nền chính – nét căng */}
            <img
                src="/images/thumb.jpg"           // để ảnh chất lượng cao 1920x1080 hoặc 4K vào public/images/
                alt="Study room background"
                className="h-full w-full object-cover object-center
               scale-105                  // zoom nhẹ để tránh viền trắng khi crop
               brightness-90 contrast-110 saturate-110
               transition-all duration-1000"
            />

            {/* 2. LỚP CHỈNH MÀU + TỐI NHẸ – bí kíp để ảnh NỔI và chữ trắng ĐỌC RÕ */}
            <div className="absolute inset-0 bg-black/40" />                     {/* Tối vừa phải */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* 3. (Tùy chọn) Thêm chút blur nhẹ ở đáy để chữ BottomBar nổi hơn */}
            <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black/70 to-transparent" />
        </div>

        {/* Nội dung chính */}
        <main className="relative flex min-h-screen flex-col">
            <FocusModeProvider>
            <TooltipProvider>
            {children}
            </TooltipProvider>
            </FocusModeProvider>
        </main>
        </body>
        </html>
    );
}