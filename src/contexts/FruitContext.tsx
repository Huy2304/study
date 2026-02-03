"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Fruit, mockFruits } from '@/lib/fruit-data';

interface FruitContextType {
    fruits: Fruit[];
    addFruit: (fruit: Omit<Fruit, 'id'>) => void;
    updateFruit: (fruit: Fruit) => void;
    deleteFruit: (id: number) => void;
}

const FruitContext = createContext<FruitContextType | undefined>(undefined);

export function FruitProvider({ children }: { children: ReactNode }) {
    const [fruits, setFruits] = useState<Fruit[]>(mockFruits);

    const addFruit = (newFruit: Omit<Fruit, 'id'>) => {
        const id = Math.max(...fruits.map(f => f.id), 0) + 1;
        setFruits([...fruits, { ...newFruit, id }]);
    };

    const updateFruit = (updatedFruit: Fruit) => {
        setFruits(fruits.map(f => f.id === updatedFruit.id ? updatedFruit : f));
    };

    const deleteFruit = (id: number) => {
        setFruits(fruits.filter(f => f.id !== id));
    };

    return (
        <FruitContext.Provider value={{ fruits, addFruit, updateFruit, deleteFruit }}>
            {children}
        </FruitContext.Provider>
    );
}

export function useFruit() {
    const context = useContext(FruitContext);
    if (context === undefined) {
        throw new Error('useFruit must be used within a FruitProvider');
    }
    return context;
}
