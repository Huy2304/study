// app/nongsan/layout.tsx
import type { ReactNode } from 'react';

export default function NongsanLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
      <main className="pt-20 pb-12">
        {/* Có thể thêm sidebar, banner, hoặc provider đặc biệt */}
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          {children}
        </div>
      </main>
      <footer className="bg-green-800 text-white py-6 text-center">
        <p>Nông sản chất lượng cao © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}