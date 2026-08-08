"use client";

import { FormEvent, useState } from "react";
import {
    Bot,
    Send,
    Sparkles,
} from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export default function AiTutor() {
    const [message, setMessage] = useState("");
    const [notice, setNotice] = useState("");

    const submitQuestion = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!message.trim()) return;

        setNotice(
            "Trợ lý đang chờ được cấu hình OPENAI_API_KEY. Khi khóa được thêm, bạn có thể hỏi bài ngay tại đây."
        );
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button
                    type="button"
                    aria-label="Mở Trợ lý học tập AI"
                    className="group relative flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-300/45 bg-cyan-400/15 text-cyan-100 shadow-[0_0_24px_rgba(34,211,238,0.16)] backdrop-blur-xl transition hover:scale-105 hover:bg-cyan-400/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200"
                >
                    <Bot size={24} aria-hidden="true" />
                    <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-zinc-950 bg-cyan-300" />
                </button>
            </DialogTrigger>

            <DialogContent className="max-w-[calc(100%-2rem)] border-cyan-300/20 bg-zinc-950 p-5 text-white sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/15 text-cyan-200">
                            <Sparkles size={19} aria-hidden="true" />
                        </span>
                        Trợ lý học tập AI
                    </DialogTitle>
                    <DialogDescription className="text-white/55">
                        Hỏi bài, nhờ giải thích từng bước hoặc ôn nhanh theo lớp của bạn.
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-2 rounded-2xl border border-cyan-300/15 bg-cyan-400/[0.06] p-4 text-sm leading-6 text-cyan-50/85">
                    Chọn lớp trong Game Hub trước để Trợ lý có đúng ngữ cảnh học tập.
                </div>

                <form onSubmit={submitQuestion} className="mt-4 flex gap-2">
                    <label className="sr-only" htmlFor="ai-tutor-question">
                        Câu hỏi cho Trợ lý học tập AI
                    </label>
                    <input
                        id="ai-tutor-question"
                        value={message}
                        onChange={(event) => {
                            setMessage(event.target.value);
                            setNotice("");
                        }}
                        placeholder="Ví dụ: Giải thích phân số lớp 4"
                        className="min-h-12 min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.05] px-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-cyan-300/60"
                    />
                    <button
                        type="submit"
                        className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-cyan-400 text-black transition hover:bg-cyan-300"
                        aria-label="Gửi câu hỏi"
                    >
                        <Send size={19} aria-hidden="true" />
                    </button>
                </form>

                {notice && (
                    <p className="mt-3 text-sm leading-6 text-amber-200">
                        {notice}
                    </p>
                )}
            </DialogContent>
        </Dialog>
    );
}
