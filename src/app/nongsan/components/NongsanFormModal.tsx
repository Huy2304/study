"use client";

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { NongsanForm } from './NongsanForm';
import { Nongsan } from '@/app/nongsan/data/fruit-data';
import { useNongsan } from '@/app/nongsan/contexts/FruitContext';

interface Props {
  trigger: React.ReactNode;
  initialData?: Nongsan | null;
  isCreate?: boolean;
}

export default function NongsanFormModal({ trigger, initialData, isCreate }: Props) {
  const [open, setOpen] = useState(false);
  const { addNongsan, updateNongsan } = useNongsan();

  const handleSave = async (data: {
    traicay_id: number;
    bienthe_ids: number[];
    quantity: number;
    price: number;
  }) => {
    if (initialData?.id) {
      await updateNongsan(initialData.id, data);
    } else {
      await addNongsan(data);
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto bg-background text-foreground">
        <DialogHeader>
          <DialogTitle>{isCreate ? 'Thêm nông sản mới' : 'Sửa nông sản'}</DialogTitle>
        </DialogHeader>
        <NongsanForm
          initialData={initialData}
          onSave={handleSave}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}