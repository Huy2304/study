"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Save, X } from "lucide-react";
import { Bienthe, Nongsan, Traicay } from "@/app/nongsan/data/fruit-data";
import { getTraicays, getBienthes } from "@/app/nongsan/action/fruits";

interface NongsanFormProps {
  initialData?: Nongsan | null;
  onSave: (data: {
    traicay_id: number;
    bienthe_ids: number[];
    quantity: number;
    price: number;
  }) => Promise<void>;
  onCancel: () => void;
}

export function NongsanForm({
  initialData,
  onSave,
  onCancel,
}: NongsanFormProps) {
  /* =======================
     Form state
  ======================= */

  const [traicayId, setTraicayId] = useState<number | null>(
    initialData?.traicay_id ?? null
  );

  const [selectedBientheIds, setSelectedBientheIds] = useState<number[]>(
    initialData?.bienthes.map((b) => b.id) ?? []
  );

  const [quantity, setQuantity] = useState<number>(
    initialData?.quantity ?? 1
  );

  const [price, setPrice] = useState<number>(
    initialData?.price ?? 0
  );


  /* =======================
     Options
  ======================= */

  const [traicays, setTraicays] = useState<Traicay[]>([]);
  const [bienthes, setBienthes] = useState<Bienthe[]>([]);
  const [loadingOptions, setLoadingOptions] = useState<boolean>(true);

  /* =======================
     Load options
  ======================= */

  useEffect(() => {
    const load = async () => {
      setLoadingOptions(true);
      const [t, b] = await Promise.all([getTraicays(), getBienthes()]);
      setTraicays(t);
      setBienthes(b);
      setLoadingOptions(false);
    };
    load();
  }, []);

  /* =======================
     Handlers
  ======================= */

  const addBienthe = (val: string) => {
    const id = Number(val);
    setSelectedBientheIds((prev) =>
      prev.includes(id) ? prev : [...prev, id]
    );
  };

  const removeBienthe = (id: number) => {
    setSelectedBientheIds((prev) => prev.filter((i) => i !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!traicayId) {
      alert("Vui lòng caen trái cây");
      return;
    }

    if (!selectedBientheIds.length) {
      alert("Vui lòng chọn ít nhất 1 biến thể");
      return;
    }

    await onSave({
      traicay_id: traicayId,
      bienthe_ids: selectedBientheIds,
      quantity,
      price,
    });

    onCancel();
  };

  /* =======================
     Render
  ======================= */

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Trái cây */}
      <div className="space-y-2">
        <Label>Trái cây</Label>
        {loadingOptions ? (
          <div>Đang tải...</div>
        ) : (
          <Select
            value={traicayId?.toString() ?? ""}
            onValueChange={(v) => setTraicayId(Number(v))}
          >
            <SelectTrigger >
              <SelectValue placeholder="Chọn trái cây" />
            </SelectTrigger>
            <SelectContent>
              {traicays.map((t) => (
                <SelectItem key={t.id} value={t.id.toString()}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Biến thể */}
      <div className="space-y-2">
        <Label>Biến thể</Label>
        {loadingOptions ? (
          <div>Đang tải...</div>
        ) : (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2 min-h-8">
              {selectedBientheIds.map((id) => {
                const b = bienthes.find((x) => x.id === id);
                if (!b) return null;

                return (
                  <Badge
                    key={id}
                    variant="secondary"
                    className="gap-1 px-3 py-1"
                  >
                    {b.name}
                  <button
                    type="button"
                    onClick={() => removeBienthe(id)}
                    aria-label="Xóa biến thể"
                    title="Xóa biến thể"
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={14} />
                  </button>

                  </Badge>
                );
              })}
            </div>

            <Select onValueChange={addBienthe}>
              <SelectTrigger>
                <SelectValue placeholder="Thêm biến thể..." />
              </SelectTrigger>
              <SelectContent>
                {bienthes
                  .filter((b) => !selectedBientheIds.includes(b.id))
                  .map((b) => (
                    <SelectItem key={b.id} value={b.id.toString()}>
                      {b.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Quantity & Price */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="quantity">Số lượng</Label>
          <Input
            id="quantity"
            type="number"
            min={1}
            step={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value) || 0)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Giá (VNĐ)</Label>
          <Input
            id="price"
            type="number"
            min={0}
            step={1000}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value) || 0)}
            required
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="mr-2 h-4 w-4" />
          Hủy
        </Button>
        <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
          <Save className="mr-2 h-4 w-4" />
          {initialData ? "Cập nhật" : "Thêm mới"}
        </Button>
      </div>
    </form>
  );
}
