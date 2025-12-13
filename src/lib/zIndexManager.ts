// lib/zIndexManager.ts - Quản lý z-index để các tool không conflict
export const Z_INDEX = {
    // Base layers
    BACKGROUND: 0,
    CONTENT: 10,
    
    // UI Components
    HEADER: 50,
    BOTTOM_BAR: 50,
    
    // Overlays
    OVERLAY: 100,
    MODAL: 200,
    
    // Tool-specific (mỗi tool có z-index riêng để không conflict)
    TOOLS: {
        MUSIC_TOOLTIP: 300,
        YOUTUBE_PLAYER: 310,
        BACKGROUND_CHANGER: 320,
        SUPPORT: 330,
        TRANSLATE: 340,
        TODO_LIST: 350,
        TIMER_SETUP: 360,
    },
    
    // Highest priority
    NOTIFICATION: 999,
} as const;

