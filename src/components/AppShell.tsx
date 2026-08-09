"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Analytics } from "@vercel/analytics/next";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
    BackgroundProvider,
    useBackground,
} from "@/lib/BackgroundContext";
import { FocusModeProvider } from "@/lib/FocusModeContext";

interface BackgroundMediaProps {
    src: string;
    className?: string;
    priority?: boolean;
    onReady?: () => void;
    onError?: () => void;
}

function isVideoBackground(src: string) {
    return /\.(webm|mp4)(\?.*)?$/i.test(src);
}

function BackgroundMedia({
    src,
    className = "",
    priority = false,
    onReady,
    onError,
}: BackgroundMediaProps) {
    const mediaClassName = [
        "absolute inset-0 h-full w-full object-cover object-center",
        "brightness-100 contrast-105 saturate-110",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    if (isVideoBackground(src)) {
        const basePath = src.replace(/\.(webm|mp4)(\?.*)?$/i, "");
        const posterPath = `/images/${basePath.split("/").pop()}-poster.webp`;

        return (
            <video
                key={src}
                autoPlay
                muted
                loop
                playsInline
                disablePictureInPicture
                preload={priority ? "auto" : "metadata"}
                poster={posterPath}
                className={mediaClassName}
                onLoadedData={onReady}
                onCanPlay={onReady}
                onError={onError}
                aria-hidden="true"
            >
                <source src={`${basePath}.webm`} type="video/webm" />
                <source src={`${basePath}.mp4`} type="video/mp4" />
            </video>
        );
    }

    return (
        <Image
            key={src}
            src={src}
            alt=""
            fill
            sizes="100vw"
            priority={priority}
            unoptimized={src.endsWith(".gif")}
            className={mediaClassName}
            onLoad={onReady}
            onError={onError}
            aria-hidden="true"
        />
    );
}

function DynamicBackground() {
    const { currentBg } = useBackground();
    const [baseBg, setBaseBg] = useState(currentBg);
    const [nextBg, setNextBg] = useState<string | null>(null);
    const [showNext, setShowNext] = useState(false);

    useEffect(() => {
        if (!currentBg || currentBg === baseBg) return;

        // eslint-disable-next-line react-hooks/set-state-in-effect -- Stage the new media before cross-fading it.
        setShowNext(false);
        setNextBg(currentBg);
    }, [currentBg, baseBg]);

    useEffect(() => {
        if (!nextBg || !showNext) return;

        const transitionTimer = window.setTimeout(() => {
            setBaseBg(nextBg);
            setNextBg(null);
            setShowNext(false);
        }, 500);

        return () => window.clearTimeout(transitionTimer);
    }, [nextBg, showNext]);

    return (
        <div
            className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-black"
            aria-hidden="true"
        >
            <BackgroundMedia
                src={baseBg}
                priority
                className="opacity-100"
            />

            {nextBg && (
                <BackgroundMedia
                    src={nextBg}
                    onReady={() => setShowNext(true)}
                    onError={() => {
                        setNextBg(null);
                        setShowNext(false);
                    }}
                    className={[
                        "transition-opacity duration-500 ease-out",
                        showNext ? "opacity-100" : "opacity-0",
                    ].join(" ")}
                />
            )}

            <div className="absolute inset-0 bg-black/15" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/45" />
        </div>
    );
}

export default function AppShell({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <BackgroundProvider>
            <DynamicBackground />

            <main className="relative z-10 flex min-h-screen flex-col">
                <ErrorBoundary>
                    <FocusModeProvider>
                        <TooltipProvider>
                            {children}
                            <Analytics />
                        </TooltipProvider>
                    </FocusModeProvider>
                </ErrorBoundary>
            </main>
        </BackgroundProvider>
    );
}
