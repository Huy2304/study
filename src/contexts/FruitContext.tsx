"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Fruit } from '@/lib/fruit-data';
import { getFruits, addFruit, updateFruit, deleteFruit } from '@/app/action/fruits';

interface FruitContextType {
    fruits: Fruit[];
    loading: boolean;
    refreshFruits: () => Promise<void>;
    addFruit: (fruit: Omit<Fruit, 'id'>) => Promise<void>;
    updateFruit: (fruit: Fruit) => Promise<void>;
    deleteFruit: (id: number) => Promise<void>;
}

const FruitContext = createContext<FruitContextType | undefined>(undefined);

export function FruitProvider({ children }: { children: ReactNode }) {
    const [fruits, setFruits] = useState<Fruit[]>([]);
    const [loading, setLoading] = useState(true);

    const refreshFruits = async () => {
        setLoading(true);
        const data = await getFruits();
        setFruits(data);
        setLoading(false);
    };

    useEffect(() => {
        refreshFruits();
    }, []);

    const handleAdd = async (newFruit: Omit<Fruit, 'id'>) => {
        const added = await addFruit(newFruit);
        if (added) {
            setFruits(prev => [added, ...prev]); // optimistic update
        }
    };

    const handleUpdate = async (updatedFruit: Fruit) => {
        const updated = await updateFruit(updatedFruit);
        if (updated) {
            setFruits(prev =>
                prev.map(f => (f.id === updated.id ? updated : f))
            );
        }
    };

    const handleDelete = async (id: number) => {
        const success = await deleteFruit(id);
        if (success) {
            setFruits(prev => prev.filter(f => f.id !== id));
        }
    };

    return (
        <FruitContext.Provider
            value={{
                fruits,
                loading,
                refreshFruits,
                addFruit: handleAdd,
                updateFruit: handleUpdate,
                deleteFruit: handleDelete,
            }}
        >
            {children}
        </FruitContext.Provider>
    );
}

export function useFruit() {
    const context = useContext(FruitContext);
    if (!context) {
        throw new Error('useFruit must be used within a FruitProvider');
    }
    return context;
}