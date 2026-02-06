// app/nongsan/layout.tsx
import type { ReactNode } from 'react';

export default function NongsanLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Nếu bạn có Header chung cho phần Nông sản thì đặt ở đây */}
      {/* <Header /> */}

      <main className="flex-1 pt-6 pb-10">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
          {children}
        </div>
      </main>

      <footer className="bg-green-800 text-white py-5 text-center text-sm">
        <p>Nông sản chất lượng cao © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}