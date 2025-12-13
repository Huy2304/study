// components/TranslateIcon.tsx
'use client';

import { useState } from 'react';
import { Globe, Languages } from 'lucide-react';
import TranslatePro from '@/components/TranslateWord';

export function TranslateIcon() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 transition-all hover:scale-110 group relative"
                title="Dịch nhanh"
            >
                {isOpen ? (
                    <Languages size={22} className="text-white/70 group-hover:text-white transition" />
                ) : (
                    <Globe size={22} className="text-white/70 group-hover:text-white transition" />
                )}
            </button>
            
            {/* Render TranslatePro với state mở/đóng */}
            {isOpen && <TranslateProWrapper onClose={() => setIsOpen(false)} />}
        </>
    );
}

// Wrapper để điều khiển state của TranslatePro
function TranslateProWrapper({ onClose }: { onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-[999]" onClick={onClose}>
            <div onClick={(e) => e.stopPropagation()}>
                <TranslatePro />
            </div>
        </div>
    );
}

