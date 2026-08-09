"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

export const BACKGROUNDS = [
    { url: "/images/1.jpg", name: "Rainy Window" },
    { url: "/images/2.jpg", name: "Cozy Library" },
    { url: "/images/3.jpg", name: "Night City" },
    { url: "/images/4.jpg", name: "Forest Cabin" },
    { url: "/images/forest.gif", name: "Forest" },
];

const DEFAULT_BACKGROUND = "/images/1.jpg";
const STORAGE_KEY = "studyhay-background";

interface BackgroundContextValue {
    currentBg: string;
    backgrounds: typeof BACKGROUNDS;
    setCurrentBg: (url: string) => void;
}

const BackgroundContext =
    createContext<BackgroundContextValue | null>(null);

export function BackgroundProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [currentBg, setCurrentBgState] =
        useState(DEFAULT_BACKGROUND);

    useEffect(() => {
        let frameId: number | undefined;

        try {
            const savedBg = localStorage.getItem(STORAGE_KEY);

            const isValid = BACKGROUNDS.some(
                (background) => background.url === savedBg
            );

            if (savedBg && isValid) {
                frameId = window.requestAnimationFrame(() => {
                    setCurrentBgState(savedBg);
                });
            }
        } catch {
            // Giữ background mặc định nếu localStorage không dùng được.
        }

        return () => {
            if (frameId !== undefined) {
                window.cancelAnimationFrame(frameId);
            }
        };
    }, []);

    const setCurrentBg = useCallback((url: string) => {
        const isValid = BACKGROUNDS.some(
            (background) => background.url === url
        );

        if (!isValid) return;

        setCurrentBgState(url);

        try {
            localStorage.setItem(STORAGE_KEY, url);
        } catch {
            // Vẫn đổi được background nếu localStorage bị chặn
        }
    }, []);

    return (
        <BackgroundContext.Provider
            value={{
                currentBg,
                backgrounds: BACKGROUNDS,
                setCurrentBg,
            }}
        >
            {children}
        </BackgroundContext.Provider>
    );
}

export function useBackground() {
    const context = useContext(BackgroundContext);

    if (!context) {
        throw new Error(
            "useBackground phải được sử dụng trong BackgroundProvider"
        );
    }

    return context;
}
