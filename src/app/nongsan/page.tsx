"use client";

import React from 'react';
import HeaderBar from '@/components/HeaderBar';
import { FruitTable } from '@/components/nongsan/FruitTable';
import { useFruit } from '@/contexts/FruitContext';

export default function NongSanPage() {
    const { fruits } = useFruit();

    return (
        <div className="min-h-screen bg-transparent">
            <HeaderBar />
            <div className="pt-24 px-4 md:px-8 max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white drop-shadow-md">Danh sách Nông sản</h1>
                        <p className="text-white/80 mt-1">Quản lý và theo dõi các loại trái cây đặc biệt</p>
                    </div>
                </div>

                <div className="bg-white/90 dark:bg-black/80 backdrop-blur-md rounded-xl p-6 shadow-xl border border-white/20">
                    <FruitTable fruits={fruits} />
                </div>
            </div>
        </div>
    );
}
