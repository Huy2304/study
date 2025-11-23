// components/Support.tsx
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Send, X, CheckCircle } from "lucide-react";

export default function Support() {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!message.trim()) return;

        setLoading(true);

        // Thay email của bạn vào đây
        const yourEmail = "huyblack2304@gmail.com"; // ← SỬA THÀNH EMAIL CỦA BẠN

        const subject = encodeURIComponent(`[Phản hồi từ StudyFocus] ${name || "Người dùng ẩn danh"}`);
        const body = encodeURIComponent(
            `Tên: ${name || "Không cung cấp"}\n` +
            `Email: ${email || "Không cung cấp"}\n\n` +
            `Nội dung:\n${message}\n\n` +
            `---\nGửi từ StudyFocus Web App\nThời gian: ${new Date().toLocaleString("vi-VN")}`
        );

        // Mở app email mặc định (Gmail, Outlook, v.v.)
        window.location.href = `mailto:${yourEmail}?subject=${subject}&body=${body}`;

        setSent(true);
        setLoading(false);

        // Tự đóng sau 3 giây
        setTimeout(() => {
            setOpen(false);
            setSent(false);
            setName("");
            setEmail("");
            setMessage("");
        }, 3000);
    };

    if (!open) {
        return (
            <button
                onClick={() => setOpen(true)}
                className="fixed bottom-24 right-6 z-40 flex items-center gap-3 rounded-full bg-white/10 backdrop-blur-xl px-5 py-3 text-white hover:bg-white/20 transition shadow-xl border border-white/20"
            >
                <Mail size={20} />
                <span className="font-medium">Góp ý / Báo lỗi</span>
            </button>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="relative w-full max-w-lg rounded-2xl bg-gray-900 border border-white/20 p-8 shadow-2xl">
                {/* Nút đóng */}
                <button
                    onClick={() => setOpen(false)}
                    className="absolute top-4 right-4 text-white/60 hover:text-white transition"
                >
                    <X size={24} />
                </button>

                <div className="flex items-center gap-3 mb-6">
                    <Mail size={28} className="text-purple-400" />
                    <h2 className="text-2xl font-bold text-white">Gửi phản hồi cho mình</h2>
                </div>

                {sent ? (
                    <div className="text-center py-12">
                        <CheckCircle size={64} className="mx-auto mb-4 text-green-400" />
                        <p className="text-xl text-white">Đã mở app email!</p>
                        <p className="text-white/70 mt-2">Chỉ cần nhấn Gửi là tới tay mình nhé</p>
                    </div>
                ) : (
                    <div className="space-y-5">
                        <div>
                            <Label htmlFor="name" className="text-white/90">Tên (không bắt buộc)</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Ví dụ: Minh, Anh Khoa, ..."
                                className="mt-2 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                            />
                        </div>

                        <div>
                            <Label htmlFor="email" className="text-white/90">Email (nếu muốn mình trả lời)</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="abc@gmail.com"
                                className="mt-2 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                            />
                        </div>

                        <div>
                            <Label htmlFor="message" className="text-white/90">Nội dung góp ý / lỗi gặp phải</Label>
                            <Textarea
                                id="message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Mình thấy phần này hay / bị lỗi / đề xuất thêm tính năng..."
                                rows={6}
                                className="mt-2 bg-white/10 border-white/20 text-white placeholder:text-white/40 resize-none"
                            />
                        </div>

                        <Button
                            onClick={handleSubmit}
                            disabled={loading || !message.trim()}
                            className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium py-6 text-lg"
                        >
                            {loading ? "Đang mở email..." : (
                                <>
                                    <Send size={20} className="mr-2" />
                                    Mở email để gửi
                                </>
                            )}
                        </Button>

                        <p className="text-center text-white/50 text-sm">
                            Sẽ mở app Gmail/Outlook của bạn để gửi
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}