"use client";

import { useEffect } from "react";

export default function KeepAlive() {
    useEffect(() => {
        // Gửi request đến ping api mỗi 10 phút (600,000ms) để giữ cho Supabase project không bị pause.
        const interval = setInterval(() => {
            fetch("/api/ping").catch(() => {});
        }, 10 * 60 * 1000);

        return () => clearInterval(interval);
    }, []);

    return null;
}
