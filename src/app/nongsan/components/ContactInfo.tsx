// components/FloatingContact.tsx
"use client";

import { useState } from "react";
import { MessageCircle, Facebook, X } from "lucide-react";

const ZALO_PHONE = "0386178586";
const FACEBOOK_LINK = "https://www.facebook.com/profile.php?id=100040226507152";

export default function ContactInfo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Nút nổi chính (FAB) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 
          shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 flex items-center justify-center
          focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-700"
        aria-label="Mở liên hệ nhanh"
      >
        {isOpen ? (
          <X className="w-8 h-8 text-white" />
        ) : (
          <MessageCircle className="w-8 h-8 text-white" />
        )}
      </button>

      {/* Popup nổi khi mở */}
      <div
        className={`fixed bottom-24 right-6 z-50 transition-all duration-300 ease-out origin-bottom-right
          ${isOpen 
            ? "scale-100 opacity-100 translate-y-0" 
            : "scale-95 opacity-0 translate-y-4 pointer-events-none"}`}
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 
          overflow-hidden min-w-[220px] p-5 relative"
        >
          {/* Mũi tên chỉ lên nút FAB */}
          <div className="absolute -bottom-2 right-8 w-0 h-0 border-l-8 border-l-transparent 
            border-r-8 border-r-transparent border-t-8 border-t-white dark:border-t-gray-800" 
          />

          <h4 className="font-bold text-lg text-center text-gray-800 dark:text-gray-100 mb-4">
            Liên hệ nhanh
          </h4>

          <div className="flex flex-col gap-5">
            {/* Zalo */}
            <a
              href={`https://zalo.me/${ZALO_PHONE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <MessageCircle className="w-8 h-8 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-gray-100">Chat Zalo</div>
                <div className="text-sm text-blue-600 dark:text-blue-400">{ZALO_PHONE}</div>
              </div>
            </a>

            {/* Facebook */}
            <a
              href={FACEBOOK_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 p-3 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Facebook className="w-8 h-8 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-gray-100">Facebook</div>
                <div className="text-sm text-indigo-600 dark:text-indigo-400 truncate max-w-[140px]">
                  {FACEBOOK_LINK.replace("https://www.", "")}
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}