// lib/FocusModeContext.tsx  ← Chỉ sửa file này một chút
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface FocusModeContextType {
    isSuperFocus: boolean;
    toggleSuperFocus: () => void;
}

const FocusModeContext = createContext<FocusModeContextType>({
    isSuperFocus: false,
    toggleSuperFocus: () => {},
});

export function FocusModeProvider({ children }: { children: ReactNode }) {
    const [isSuperFocus, setIsSuperFocus] = useState(false);

    const toggleSuperFocus = () => {
        setIsSuperFocus(prev => !prev);
    };

    return (
        <FocusModeContext.Provider value={{ isSuperFocus, toggleSuperFocus }}>
            {children}
        </FocusModeContext.Provider>
    );
}

export const useFocusMode = () => useContext(FocusModeContext);