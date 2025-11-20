// lib/BackgroundContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type Background = {
    id: string;
    url: string;
    name: string;
};

const backgrounds: Background[] = [
    { id: '1', url: '/images/thumb.jpg', name: 'Study Room Classic' },
    { id: '2', url: '/images/1.jpg', name: 'Rainy Window' },
    { id: '3', url: '/images/2.jpg', name: 'Cozy Library' },
    { id: '4', url: '/images/3.jpg', name: 'Night City' },
    { id: '5', url: '/images/4.jpg', name: 'Forest Cabin' },
    { id: '6', url: '/images/5.jpg', name: 'Ocean Sunset' },

];

type BackgroundContextType = {
    currentBg: string;
    setCurrentBg: (url: string) => void;
    backgrounds: Background[];
};

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined);

export function BackgroundProvider({ children }: { children: ReactNode }) {
    const [currentBg, setCurrentBg] = useState(backgrounds[0].url);

    return (
        <BackgroundContext.Provider value={{ currentBg, setCurrentBg, backgrounds }}>
            {children}
        </BackgroundContext.Provider>
    );
}

export const useBackground = () => {
    const context = useContext(BackgroundContext);
    if (!context) throw new Error('useBackground must be used within BackgroundProvider');
    return context;
};