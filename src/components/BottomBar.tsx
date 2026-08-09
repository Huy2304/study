"use client";

import dynamic from "next/dynamic";
import {
    MoreHorizontal,
    Zap,
} from "lucide-react";
import {
    memo,
    type ReactElement,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import { createPortal } from "react-dom";

import BackgroundChanger from "@/components/BackgroundChanger";
import AiTutor from "@/components/AiTutor";
import { MusicTooltip } from "@/components/MusicTooltip";
import { useFocusMode } from "@/lib/FocusModeContext";
import { Z_INDEX } from "@/lib/zIndexManager";

const GameHub = dynamic(() => import("@/components/GameHub"), {
    ssr: false,
    loading: () => <ToolLoading ariaLabel="Đang tải trò chơi" />,
});

const MiniYoutubePlayer = dynamic(
    () => import("@/components/MiniYoutubePlayer"),
    {
        ssr: false,
        loading: () => <ToolLoading ariaLabel="Đang tải YouTube" />,
    }
);

const Support = dynamic(() => import("@/components/Support"), {
    ssr: false,
    loading: () => <ToolLoading ariaLabel="Đang tải phản hồi" />,
});

const TranslatePro = dynamic(
    () => import("@/components/TranslateWord"),
    {
        ssr: false,
        loading: () => <ToolLoading ariaLabel="Đang tải dịch nhanh" />,
    }
);

export interface BottomBarItem {
    id: string;
    component: ReactElement;
    priority?: number;
}

interface BottomBarProps {
    items?: BottomBarItem[];
    actionButton?: ReactElement;
}

function ToolLoading({ ariaLabel }: { ariaLabel: string }) {
    return (
        <div
            aria-label={ariaLabel}
            className="flex h-12 w-12 animate-pulse items-center justify-center rounded-xl border border-white/15 bg-white/10"
        >
            <span className="h-4 w-4 rounded-full bg-white/30" />
        </div>
    );
}

function MoreTools() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!open) return;

        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setOpen(false);
            }
        };

        document.addEventListener("keydown", closeOnEscape);
        return () =>
            document.removeEventListener("keydown", closeOnEscape);
    }, [open]);

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen((current) => !current)}
                className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white/75 backdrop-blur-xl transition hover:scale-105 hover:bg-white/20 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                aria-label="Mở thêm công cụ"
                aria-expanded={open}
            >
                <MoreHorizontal size={24} aria-hidden="true" />
            </button>

            {open &&
                typeof document !== "undefined" &&
                createPortal(
                    <>
                        <button
                            type="button"
                            className="fixed inset-0 bg-black/55 backdrop-blur-sm"
                            style={{ zIndex: Z_INDEX.MODAL }}
                            onClick={() => setOpen(false)}
                            aria-label="Đóng thêm công cụ"
                        />

                        <section
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="more-tools-title"
                            className="fixed bottom-20 left-0 right-0 mx-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-white/15 bg-zinc-950 p-5 text-white shadow-2xl"
                            style={{ zIndex: Z_INDEX.MODAL + 1 }}
                        >
                            <h2
                                id="more-tools-title"
                                className="text-lg font-semibold"
                            >
                                Công cụ khác
                            </h2>
                            <p className="mt-1 text-sm text-white/55">
                                Chọn một công cụ để dùng trong lúc học.
                            </p>

                            <div className="mt-4 grid grid-cols-3 gap-3">
                                <ToolShortcut label="YouTube">
                                    <MiniYoutubePlayer />
                                </ToolShortcut>
                                <ToolShortcut label="Dịch nhanh">
                                    <TranslatePro asIconButton />
                                </ToolShortcut>
                                <ToolShortcut label="Góp ý">
                                    <Support />
                                </ToolShortcut>
                            </div>
                        </section>
                    </>,
                    document.body
                )}
        </>
    );
}

function ToolShortcut({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-2 py-3">
            {children}
            <span className="text-xs text-white/65">{label}</span>
        </div>
    );
}

function BottomBar({ items, actionButton }: BottomBarProps) {
    const { isSuperFocus, toggleSuperFocus } = useFocusMode();

    const defaultItems: BottomBarItem[] = useMemo(
        () => [
            {
                id: "music",
                component: <MusicTooltip />,
                priority: 1,
            },
            {
                id: "background",
                component: <BackgroundChanger />,
                priority: 2,
            },
            {
                id: "games",
                component: <GameHub />,
                priority: 3,
            },
            {
                id: "ai-tutor",
                component: <AiTutor />,
                priority: 4,
            },
            {
                id: "more-tools",
                component: <MoreTools />,
                priority: 5,
            },
        ],
        []
    );

    const handleToggleFocus = useCallback(() => {
        toggleSuperFocus();
    }, [toggleSuperFocus]);

    const displayItems = items ?? defaultItems;

    const sortedItems = useMemo(
        () =>
            [...displayItems].sort(
                (a, b) => (a.priority ?? 999) - (b.priority ?? 999)
            ),
        [displayItems]
    );

    const defaultActionButton = useMemo(
        () => (
            <button
                type="button"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-300 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                onClick={handleToggleFocus}
                aria-label={
                    isSuperFocus
                        ? "Tắt chế độ tập trung"
                        : "Bật chế độ tập trung"
                }
            >
                <Zap size={24} aria-hidden="true" />
            </button>
        ),
        [handleToggleFocus, isSuperFocus]
    );

    return (
        <nav
            aria-label="Công cụ học tập"
            className="fixed inset-x-0 bottom-0"
            style={{ zIndex: Z_INDEX.BOTTOM_BAR }}
        >
            <div className="flex min-w-0 items-center justify-between gap-2 px-3 py-3 sm:gap-3 sm:px-6 sm:py-4">
                <div
                    className={`flex min-w-0 flex-1 items-center gap-2 overflow-x-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-4 ${
                        isSuperFocus ? "invisible" : ""
                    }`}
                >
                    {sortedItems.map((item) => (
                        <div key={item.id} className="flex-shrink-0">
                            {item.component}
                        </div>
                    ))}
                </div>

                <div className="flex-shrink-0">
                    {actionButton ?? defaultActionButton}
                </div>
            </div>
        </nav>
    );
}

export default memo(BottomBar);
