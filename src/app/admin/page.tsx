"use client";

import React, { useState } from 'react';
import HeaderBar from '@/components/HeaderBar';
import { FruitTable } from '@/components/nongsan/FruitTable';
import { FruitForm } from '@/components/nongsan/FruitForm';
import { useFruit } from '@/contexts/FruitContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { Fruit } from '@/lib/fruit-data';
import { AccessKeyDialog } from '@/components/AccessKeyDialog';

export default function AdminPage() {
    const { fruits, addFruit, updateFruit, deleteFruit } = useFruit();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingFruit, setEditingFruit] = useState<Fruit | null>(null);

    const handleAdd = () => {
        setEditingFruit(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (fruit: Fruit) => {
        setEditingFruit(fruit);
        setIsDialogOpen(true);
    };

    const handleDelete = (id: number) => {
        if (confirm('Bạn có chắc chắn muốn xóa nông sản này không?')) {
            deleteFruit(id);
        }
    };

    const handleSave = (fruitData: Fruit | Omit<Fruit, 'id'>) => {
        if ('id' in fruitData) {
            updateFruit(fruitData);
        } else {
            addFruit(fruitData);
        }
        setIsDialogOpen(false);
    };

    return (
        <AccessKeyDialog>
            <div className="min-h-screen bg-transparent">
                <HeaderBar />
                <div className="pt-24 px-4 md:px-8 max-w-7xl mx-auto space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-white drop-shadow-md">Trang Admin</h1>
                            <p className="text-white/80 mt-1">Quản lý thêm, sửa, xóa Nông sản</p>
                        </div>

                        <Button onClick={handleAdd} className="bg-green-600 hover:bg-green-700 text-white shadow-lg transition-transform hover:scale-105">
                            <Plus size={20} className="mr-2" /> Thêm Nông sản
                        </Button>
                    </div>

                    <div className="bg-white/90 dark:bg-black/80 backdrop-blur-md rounded-xl p-6 shadow-xl border border-white/20">
                        <FruitTable
                            fruits={fruits}
                            isAdmin
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    </div>

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>{editingFruit ? 'Chỉnh sửa Nông sản' : 'Thêm Nông sản mới'}</DialogTitle>
                            </DialogHeader>
                            <FruitForm
                                initialData={editingFruit}
                                onSave={handleSave}
                                onCancel={() => setIsDialogOpen(false)}
                            />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </AccessKeyDialog>
    );
}
