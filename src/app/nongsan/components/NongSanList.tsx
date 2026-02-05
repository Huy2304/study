"use client";

import React, { useState, useMemo } from 'react';
import { useNongsan } from '@/app/nongsan/contexts/FruitContext'; // giả sử đã đổi tên context phù hợp
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Trash2, Plus, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import NongsanFormModal from '@/app/nongsan/components/NongsanFormModal';

interface NongsanListProps {
  isAdmin?: boolean;
}

export function NongsanList({ isAdmin = false }: NongsanListProps) {
  const { nongsans, loading, deleteNongsan } = useNongsan();

  const [selectedTraicay, setSelectedTraicay] = useState<string>('all');
  const [selectedBienthe, setSelectedBienthe] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Lấy danh sách unique để filter
  const traicayOptions = useMemo(() => {
    const set = new Set(nongsans.map(n => n.traicay?.name || '').filter(Boolean));
    return ['all', ...Array.from(set)];
  }, [nongsans]);

  const bientheOptions = useMemo(() => {
    const set = new Set<string>();
    nongsans.forEach(n => {
      n.bienthes?.forEach(b => {
        if (b.name) set.add(b.name);
      });
    });
    return ['all', ...Array.from(set)];
  }, [nongsans]);

  // Filter nâng cao: hỗ trợ nhiều biến thể
  const filteredNongsans = useMemo(() => {
    return nongsans.filter(n => {
      const matchTraicay = selectedTraicay === 'all' || n.traicay?.name === selectedTraicay;

      const matchBienthe =
        selectedBienthe === 'all' ||
        n.bienthes?.some(b => b.name === selectedBienthe);

      const matchSearch =
        !searchTerm ||
        n.traicay?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.bienthes?.some(b => b.name?.toLowerCase().includes(searchTerm.toLowerCase()));

      return matchTraicay && matchBienthe && matchSearch;
    });
  }, [nongsans, selectedTraicay, selectedBienthe, searchTerm]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Bộ lọc */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
        <div className="flex flex-col sm:flex-row gap-6 items-end flex-wrap">
          <div className="flex-1 min-w-[220px] space-y-2">
            <Label htmlFor="search">Tìm kiếm</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                id="search"
                placeholder="Tìm theo tên trái cây hoặc biến thể..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10 bg-background text-foreground
                placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div className="w-full sm:w-48 space-y-2">
            <Label>Trái cây</Label>
            <Select value={selectedTraicay} onValueChange={setSelectedTraicay}>
              <SelectTrigger className="bg-background text-foreground">
                <SelectValue placeholder="Tất cả" />
              </SelectTrigger>
              <SelectContent>
                {traicayOptions.map(opt => (
                  <SelectItem key={opt} value={opt}>
                    {opt === 'all' ? 'Tất cả' : opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full sm:w-48 space-y-2">
            <Label>Biến thể</Label>
            <Select value={selectedBienthe} onValueChange={setSelectedBienthe}>
              <SelectTrigger className="bg-background text-foreground">
                <SelectValue placeholder="Tất cả" />
              </SelectTrigger>
              <SelectContent>
                {bientheOptions.map(opt => (
                  <SelectItem key={opt} value={opt}>
                    {opt === 'all' ? 'Tất cả' : opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isAdmin && (
            <div className="w-full sm:w-auto">
              <NongsanFormModal
                trigger={
                  <Button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="mr-2 h-4 w-4" /> Thêm mới
                  </Button>
                }
                isCreate
              />
            </div>
          )}
        </div>
      </div>

      {/* Danh sách */}
      {filteredNongsans.length === 0 ? (
        <div className="text-center py-20 text-gray-500 dark:text-gray-400 text-xl font-medium">
          Không tìm thấy nông sản phù hợp
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredNongsans.map(n => (
            <Card
              key={n.id}
              className="overflow-hidden rounded-2xl border border-emerald-100 dark:border-emerald-900/30 shadow-md hover:shadow-2xl transition-all duration-300 dark:bg-gray-800"
            >
              <CardHeader className="pb-4 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800">
                <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex justify-between items-start gap-3">
                  <div>
                    <div className="line-clamp-1">{n.traicay?.name || 'Chưa xác định'}</div>
                    {n.bienthes?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {n.bienthes.map(b => (
                          <Badge
                            key={b.id}
                            variant="secondary"
                            className="text-xs bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300"
                          >
                            {b.name}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {isAdmin && (
                    <div className="flex gap-1 shrink-0">
                      <NongsanFormModal
                        trigger={
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit size={16} />
                          </Button>
                        }
                        initialData={n}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => {
                          if (confirm('Xác nhận xóa nông sản này?')) {
                            deleteNongsan(n.id);
                          }
                        }}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-5 space-y-5">
                <div className="flex justify-between items-center flex-wrap gap-4">
                  <Badge
                    variant="outline"
                    className="text-base px-5 py-2 font-medium border-emerald-300 text-emerald-700 dark:border-emerald-600 dark:text-emerald-300"
                  >
                    {n.quantity}
                  </Badge>
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {n.price.toLocaleString('vi-VN')} ₫
                  </div>
                </div>

                <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                  Ngày tạo: {n.created_at ? new Date(n.created_at).toLocaleDateString('vi-VN') : '—'}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}