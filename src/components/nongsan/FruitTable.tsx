"use client";

import React from 'react';
import { Fruit } from '@/lib/fruit-data';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';

interface FruitTableProps {
    fruits: Fruit[];
    onEdit?: (fruit: Fruit) => void;
    onDelete?: (id: number) => void;
    isAdmin?: boolean;
}

export function FruitTable({ fruits, onEdit, onDelete, isAdmin = false }: FruitTableProps) {
    return (
        <div className="w-full overflow-x-auto rounded-lg border border-gray-200 shadow-sm bg-white dark:bg-gray-900 dark:border-gray-800">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 uppercase font-medium">
                    <tr>
                        <th className="px-4 py-3 text-center w-16">STT</th>
                        <th className="px-4 py-3">Tên trái</th>
                        <th className="px-4 py-3">Nhiễm thể</th>
                        <th className="px-4 py-3 text-center">Số lượng</th>
                        <th className="px-4 py-3">Biến thể</th>
                        {isAdmin && <th className="px-4 py-3 text-center">Hành động</th>}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {fruits.length === 0 ? (
                        <tr>
                            <td colSpan={isAdmin ? 6 : 5} className="px-4 py-8 text-center text-gray-500">
                                Không có dữ liệu
                            </td>
                        </tr>
                    ) : (
                        fruits.map((fruit, index) => (
                            <tr key={fruit.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                <td className="px-4 py-3 text-center font-medium text-gray-900 dark:text-white">
                                    {index + 1}
                                </td>
                                <td className="px-4 py-3 font-semibold text-gray-800 dark:text-gray-100">
                                    {fruit.name}
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border
                                        ${fruit.type === 'Logia' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                                            fruit.type === 'Zoan' ? 'bg-green-100 text-green-800 border-green-200' :
                                                'bg-blue-100 text-blue-800 border-blue-200'}`}>
                                        {fruit.type}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-center font-mono text-gray-600 dark:text-gray-300">
                                    {fruit.quantity}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex flex-wrap gap-1.5">
                                        {fruit.variants.map((v, i) => (
                                            <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                                                {v}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                {isAdmin && (
                                    <td className="px-4 py-3 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-8 w-8 p-0 border-blue-200 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                onClick={() => onEdit?.(fruit)}
                                                title="Sửa"
                                            >
                                                <Edit size={14} />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-8 w-8 p-0 border-red-200 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => onDelete?.(fruit.id)}
                                                title="Xóa"
                                            >
                                                <Trash2 size={14} />
                                            </Button>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
