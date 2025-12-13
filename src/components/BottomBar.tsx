"use client"
import { Zap } from "lucide-react";
import { ReactElement, useMemo, memo, useCallback } from "react";
import { MusicTooltip } from "@/components/MusicTooltip";
import MiniYoutubePlayer from "@/components/MiniYoutubePlayer";
import BackgroundChanger from "@/components/BackgroundChanger";
import { useFocusMode } from "@/lib/FocusModeContext";
import Support from "@/components/Support";
import TranslatePro from "@/components/TranslateWord";
import { Z_INDEX } from "@/lib/zIndexManager";

export interface BottomBarItem {
    id: string;
    component: ReactElement;
    priority?: number; // Độ ưu tiên hiển thị (số càng nhỏ càng ưu tiên)
}

interface BottomBarProps {
    items?: BottomBarItem[];
    actionButton?: ReactElement;
}

function BottomBar({ items, actionButton }: BottomBarProps) {
    const { isSuperFocus, toggleSuperFocus } = useFocusMode();
    
    // Memoize default items để tránh re-create mỗi render
    const defaultItems: BottomBarItem[] = useMemo(() => [
        { id: 'music', component: <MusicTooltip />, priority: 1 },
        { id: 'youtube', component: <MiniYoutubePlayer />, priority: 2 },
        { id: 'background', component: <BackgroundChanger />, priority: 3 },
        { id: 'support', component: <Support />, priority: 4 },
        { id: 'translate', component: <TranslatePro asIconButton />, priority: 5}
    ], []);
    
    // Memoize toggle handler
    const handleToggleFocus = useCallback(() => {
        toggleSuperFocus();
    }, [toggleSuperFocus]);

    // Sử dụng items truyền vào hoặc default items
    const displayItems = items || defaultItems;
    
    // Memoize sorted items
    const sortedItems = useMemo(() => 
        [...displayItems].sort((a, b) => (a.priority || 999) - (b.priority || 999)),
        [displayItems]
    );

    // Memoize default action button
    const defaultActionButton = useMemo(() => (
        <button
            className="text-white rounded-full bg-gradient-to-r from-purple-600 to-pink-600 p-3 shadow-lg hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent"
            onClick={handleToggleFocus}
            aria-label={isSuperFocus ? "Tắt chế độ tập trung" : "Bật chế độ tập trung"}
        >
            <Zap size={24} />
        </button>
    ), [handleToggleFocus, isSuperFocus]);

    return (
        <div className="fixed inset-x-0 bottom-0" style={{ zIndex: Z_INDEX.BOTTOM_BAR }}>
            <div className="flex flex-col sm:flex-row items-center justify-between py-3 sm:py-4 px-4 sm:px-6 gap-3 sm:gap-0">
                {/* Icons container - tự động wrap và responsive */}
                <div 
                    className={`
                        flex flex-wrap items-center justify-center sm:justify-start
                        gap-3 sm:gap-4 md:gap-6 lg:gap-8
                        ${isSuperFocus ? 'invisible' : ''}
                        w-full sm:w-auto
                    `}
                >
                    {sortedItems.map((item) => (
                        <div key={item.id} className="flex-shrink-0">
                            {item.component}
                        </div>
                    ))}
                </div>
                
                {/* Action button - luôn hiển thị */}
                <div className="flex-shrink-0">
                    {actionButton || defaultActionButton}
                </div>
            </div>
        </div>
    );
}

// Memoize component để tránh re-render không cần thiết
export default memo(BottomBar);