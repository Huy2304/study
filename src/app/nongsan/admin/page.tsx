"use client";

import HeaderBar from "@/components/HeaderBar";
import { NongsanList } from "@/app/nongsan/components/NongSanList";
import { useNongsan } from "@/app/nongsan/contexts/FruitContext";
import { AccessKeyDialog } from "@/components/AccessKeyDialog";

export default function AdminPage() {
  const { loading } = useNongsan();

  return (
    <AccessKeyDialog>
      <>
        <div className="pt-24 space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Trang Quản trị
            </h1>
            <p className="text-gray-600 mt-1">
              Quản lý nông sản (thêm, sửa, xóa)
            </p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-xl p-6 shadow-md border">
            {loading ? (
              <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600" />
              </div>
            ) : (
              <NongsanList isAdmin />
            )}
          </div>
        </div>
      </>
    </AccessKeyDialog>
  );
}
