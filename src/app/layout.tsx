"use client"
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { FocusModeProvider } from "@/lib/FocusModeContext";
import { BackgroundProvider, useBackground } from "@/lib/BackgroundContext";
import { Analytics } from "@vercel/analytics/next"

// Component con để render background từ Context
function DynamicBackground() {
    const { currentBg } = useBackground();

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden">
            <img
                src={currentBg}
                alt="Chill nature background"
                className="fixed inset-0 -z-10 h-full w-full object-cover object-center scale-105 brightness-90 contrast-110 saturate-110 transition-all duration-1000"
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black/70 to-transparent" />
        </div>
    );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="h-full">
        <body className="h-full bg-black text-white antialiased">
        <BackgroundProvider>        {/* ĐÚNG TÊN */}
            <DynamicBackground />    {/* DÙNG BACKGROUND TỪ CONTEXT */}
            <main className="relative flex min-h-screen flex-col">
                <FocusModeProvider>
                    <TooltipProvider>
                        {children}
                        <Analytics />
                    </TooltipProvider>
                </FocusModeProvider>
            </main>
        </BackgroundProvider>
        </body>
        </html>
    );
}