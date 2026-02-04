"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const CORRECT_KEY = "admin123"; // <-- thay bằng key bạn muốn (hoặc để trong .env sau)

export function AccessKeyDialog({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(true);
    const [key, setKey] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (key === CORRECT_KEY) {
            localStorage.setItem("admin_access", "granted");
            setIsOpen(false);
        } else {
            setError("Key không đúng!");
        }
    };

    useEffect(() => {
        const hasAccess = localStorage.getItem("admin_access") === "granted";
        if (hasAccess) {
            setIsOpen(false);
        }
    }, []);

    if (!isOpen) return <>{children}</>;

    return (
        <Dialog open={isOpen} onOpenChange={() => {}}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Nhập key để truy cập Admin</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        type="password"
                        placeholder="Nhập key..."
                        value={key}
                        onChange={(e) => {
                            setKey(e.target.value);
                            setError("");
                        }}
                        autoFocus
                    />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <div className="flex justify-end">
                        <Button type="submit">Xác nhận</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}