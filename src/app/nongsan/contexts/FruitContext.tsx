"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Nongsan } from '@/app/nongsan/data/fruit-data';
import {
  getNongsans,
  createNongsan,
  updateNongsan,
  deleteNongsan,
} from '@/app/nongsan/action/fruits';

interface NongsanContextType {
  nongsans: Nongsan[];
  loading: boolean;
  refreshNongsans: () => Promise<void>;
  addNongsan: (data: {
    traicay_id: number;
    bienthe_ids: number[];
    quantity: number;
    price: number;
  }) => Promise<Nongsan | null>;
  updateNongsan: (id: number, data: {
    traicay_id: number;
    bienthe_ids: number[];
    quantity: number;
    price: number;
  }) => Promise<Nongsan | null>;
  deleteNongsan: (id: number) => Promise<boolean>;
}

const NongsanContext = createContext<NongsanContextType | undefined>(undefined);

export function NongsanProvider({ children }: { children: ReactNode }) {
  const [nongsans, setNongsans] = useState<Nongsan[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshNongsans = async () => {
    setLoading(true);
    try {
      const data = await getNongsans();
      setNongsans(data);
    } catch (err) {
      console.error("Refresh nongsans failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshNongsans();
  }, []);

  const handleAdd = async (payload: {
    traicay_id: number;
    bienthe_ids: number[];
    quantity: number;
    price: number;
  }) => {
    try {
      const added = await createNongsan(payload);
      if (added) {
        setNongsans(prev => [added, ...prev]);
      }
      return added;
    } catch (err) {
      console.error("Add failed:", err);
      return null;
    }
  };

  const handleUpdate = async (
    id: number,
    payload: {
      traicay_id: number;
      bienthe_ids: number[];
      quantity: number;
      price: number;
    }
  ) => {
    try {
      const updated = await updateNongsan(id, payload);
      if (updated) {
        setNongsans(prev =>
          prev.map(item => (item.id === updated.id ? updated : item))
        );
      }
      return updated;
    } catch (err) {
      console.error("Update failed:", err);
      return null;
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const success = await deleteNongsan(id);
      if (success) {
        setNongsans(prev => prev.filter(item => item.id !== id));
      }
      return success;
    } catch (err) {
      console.error("Delete failed:", err);
      return false;
    }
  };

  return (
    <NongsanContext.Provider
      value={{
        nongsans,
        loading,
        refreshNongsans,
        addNongsan: handleAdd,
        updateNongsan: handleUpdate,
        deleteNongsan: handleDelete,
      }}
    >
      {children}
    </NongsanContext.Provider>
  );
}

export function useNongsan() {
  const context = useContext(NongsanContext);
  if (!context) {
    throw new Error('useNongsan must be used within NongsanProvider');
  }
  return context;
}