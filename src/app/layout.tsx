"use client"
import "./globals.css";
import { useState, useEffect } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { FocusModeProvider } from "@/lib/FocusModeContext";
import { BackgroundProvider, useBackground } from "@/lib/BackgroundContext";
import { Analytics } from "@vercel/analytics/next";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { NongsanProvider } from "@/app/nongsan/contexts/FruitContext";

// Component con để render background từ Context
function DynamicBackground() {
    const { currentBg, backgrounds } = useBackground();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const [loadedBg, setLoadedBg] = useState(currentBg);

    // Preload next background images
    useEffect(() => {
        const preloadImages = async () => {
            try {
                await Promise.all(
                    backgrounds.map(bg => {
                        return new Promise((resolve, reject) => {
                            const img = new Image();
                            img.onload = resolve;
                            img.onerror = reject;
                            img.src = bg.url;
                        });
                    })
                );
            } catch (err) {
                console.warn('Failed to preload some backgrounds');
            }
        };
        preloadImages();
    }, [backgrounds]);

    // Handle background change with smooth transition
    useEffect(() => {
        if (currentBg !== loadedBg) {
            setIsLoading(true);
            setError(false);
            const img = new Image();
            img.onload = () => {
                setLoadedBg(currentBg);
                setIsLoading(false);
            };
            img.onerror = () => {
                setError(true);
                setIsLoading(false);
            };
            img.src = currentBg;
        }
    }, [currentBg, loadedBg]);

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden">
            {isLoading && (
                <div className="fixed inset-0 -z-10 h-full w-full bg-gradient-to-br from-purple-900/20 via-black to-pink-900/20 animate-pulse" />
            )}
            {!error && (
                <img
                    src={loadedBg}
                    alt="Study background"
                    className="fixed inset-0 -z-10 h-full w-full object-cover object-center scale-105 brightness-90 contrast-110 saturate-110 transition-opacity duration-1000"
                    style={{ opacity: isLoading ? 0 : 1 }}
                    loading="eager"
                    fetchPriority="high"
                />
            )}
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
                        <ErrorBoundary>
                            <FocusModeProvider>
                                <NongsanProvider>
                                    <TooltipProvider>
                                        {children}
                                        <Analytics />
                                    </TooltipProvider>
                                </NongsanProvider>
                            </FocusModeProvider>
                        </ErrorBoundary>
                    </main>
                </BackgroundProvider>
            </body>
        </html>
    );
}