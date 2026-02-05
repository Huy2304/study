"use client";

import HeaderBar from "@/components/HeaderBar";
import { NongsanList } from "@/app/nongsan/components/NongSanList";
import { useNongsan } from "@/app/nongsan/contexts/FruitContext";

export default function NongSanPage() {
  const { loading } = useNongsan();

  return (
    <>
      <div className="pt-24 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">
            Danh sách Nông sản
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Xem và theo dõi các loại nông sản chất lượng cao
          </p>
        </div>

        {/* Content */}
        <div className=" dark:bg-gray-900 rounded-xl p-6 shadow-lg border">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin h-10 w-10 rounded-full border-b-2 border-emerald-600" />
            </div>
          ) : (
            <NongsanList />
          )}
        </div>
      </div>
    </>
  );
}
