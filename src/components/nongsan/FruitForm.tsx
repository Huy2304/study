"use client";

import React, { useState, useEffect } from 'react';
import { Fruit } from '@/lib/fruit-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X, Save } from 'lucide-react';

interface FruitFormProps {
    initialData?: Fruit | null;
    onSave: (fruit: Omit<Fruit, 'id'> | Fruit) => void;
    onCancel: () => void;
}

export function FruitForm({ initialData, onSave, onCancel }: FruitFormProps) {
    const [name, setName] = useState('');
    const [type, setType] = useState('Paramecia');
    const [quantity, setQuantity] = useState(1);
    const [variants, setVariants] = useState<string[]>([]);
    const [newVariant, setNewVariant] = useState('');

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setType(initialData.type);
            setQuantity(initialData.quantity);
            setVariants(initialData.variants || []);
        } else {
            // Reset form for create mode
            setName('');
            setType('Paramecia');
            setQuantity(1);
            setVariants([]);
        }
    }, [initialData]);

    const handleAddVariant = () => {
        if (newVariant.trim()) {
            setVariants([...variants, newVariant.trim()]);
            setNewVariant('');
        }
    };

    const handleRemoveVariant = (index: number) => {
        setVariants(variants.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const fruitData = {
            name,
            type,
            quantity,
            variants
        };

        if (initialData) {
            onSave({ ...fruitData, id: initialData.id });
        } else {
            onSave(fruitData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5 p-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Tên trái</Label>
                    <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ví dụ: Trái Lửa"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="type">Nhiễm thể</Label>
                    <Select value={type} onValueChange={setType}>
                        <SelectTrigger>
                            <SelectValue placeholder="Chọn loại" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Paramecia">Paramecia</SelectItem>
                            <SelectItem value="Zoan">Zoan</SelectItem>
                            <SelectItem value="Logia">Logia</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="quantity">Số lượng</Label>
                    <Input
                        id="quantity"
                        type="number"
                        min="0"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label>Biến thể</Label>
                <div className="flex gap-2">
                    <Input
                        value={newVariant}
                        onChange={(e) => setNewVariant(e.target.value)}
                        placeholder="Nhập tên biến thể..."
                        className="flex-1"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddVariant();
                            }
                        }}
                    />
                    <Button type="button" onClick={handleAddVariant} variant="secondary">
                        <Plus size={18} /> Thêm
                    </Button>
                </div>

                {variants.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                        {variants.map((v, i) => (
                            <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm shadow-sm group">
                                {v}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveVariant(i)}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex w-full justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Hủy bỏ
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]">
                    <Save size={18} className="mr-2" />
                    {initialData ? 'Cập nhật' : 'Thêm mới'}
                </Button>
            </div>
        </form>
    );
}
