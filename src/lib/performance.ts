// lib/performance.ts - Utilities cho performance optimization
import { useCallback } from 'react';

// Debounce function
export function debounce<TArgs extends unknown[], TResult>(
    func: (...args: TArgs) => TResult,
    wait: number
): (...args: TArgs) => void {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    return function executedFunction(...args: TArgs) {
        const later = () => {
            timeout = null;
            func(...args);
        };
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function
export function throttle<TArgs extends unknown[], TResult>(
    func: (...args: TArgs) => TResult,
    limit: number
): (...args: TArgs) => void {
    let inThrottle: boolean;
    return function executedFunction(...args: TArgs) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

// Preload image
export function preloadImage(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = src;
    });
}

// Hook để memoize expensive computations
export function useStableCallback<TArgs extends unknown[], TResult>(
    callback: (...args: TArgs) => TResult
): (...args: TArgs) => TResult {
    return useCallback(
        (...args: TArgs) => callback(...args),
        [callback]
    );
}

