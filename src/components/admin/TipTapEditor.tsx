"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import {
    Bold,
    Italic,
    Strikethrough,
    Heading1,
    Heading2,
    List,
    ListOrdered,
    Image as ImageIcon,
    LoaderCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { uploadImage } from "@/lib/supabase-client";

const MenuBar = ({ editor }: { editor: any }) => {
    const [isUploading, setIsUploading] = useState(false);
    if (!editor) {
        return null;
    }

    const addImageFromUrl = () => {
        const url = window.prompt("Nhập URL của ảnh:");
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const url = await uploadImage(file);
            editor.chain().focus().setImage({ src: url }).run();
        } catch (error) {
            alert("Lỗi tải ảnh lên. Hãy kiểm tra lại cấu hình Supabase Storage.");
        } finally {
            setIsUploading(false);
            event.target.value = "";
        }
    };

    return (
        <div className="flex flex-wrap items-center gap-1 border-b border-white/10 p-2">
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`rounded p-2 transition ${editor.isActive("bold") ? "bg-cyan-500/20 text-cyan-300" : "text-white/60 hover:bg-white/10 hover:text-white"}`}
                title="In đậm"
            >
                <Bold size={16} />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`rounded p-2 transition ${editor.isActive("italic") ? "bg-cyan-500/20 text-cyan-300" : "text-white/60 hover:bg-white/10 hover:text-white"}`}
                title="In nghiêng"
            >
                <Italic size={16} />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={`rounded p-2 transition ${editor.isActive("strike") ? "bg-cyan-500/20 text-cyan-300" : "text-white/60 hover:bg-white/10 hover:text-white"}`}
                title="Gạch ngang"
            >
                <Strikethrough size={16} />
            </button>

            <div className="mx-1 h-5 w-px bg-white/10"></div>

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`rounded p-2 transition ${editor.isActive("heading", { level: 2 }) ? "bg-cyan-500/20 text-cyan-300" : "text-white/60 hover:bg-white/10 hover:text-white"}`}
                title="Tiêu đề 2 (H2)"
            >
                <Heading1 size={16} />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={`rounded p-2 transition ${editor.isActive("heading", { level: 3 }) ? "bg-cyan-500/20 text-cyan-300" : "text-white/60 hover:bg-white/10 hover:text-white"}`}
                title="Tiêu đề 3 (H3)"
            >
                <Heading2 size={16} />
            </button>

            <div className="mx-1 h-5 w-px bg-white/10"></div>

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`rounded p-2 transition ${editor.isActive("bulletList") ? "bg-cyan-500/20 text-cyan-300" : "text-white/60 hover:bg-white/10 hover:text-white"}`}
                title="Danh sách dấu chấm"
            >
                <List size={16} />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`rounded p-2 transition ${editor.isActive("orderedList") ? "bg-cyan-500/20 text-cyan-300" : "text-white/60 hover:bg-white/10 hover:text-white"}`}
                title="Danh sách đánh số"
            >
                <ListOrdered size={16} />
            </button>

            <div className="mx-1 h-5 w-px bg-white/10"></div>

            <label
                className={`flex cursor-pointer items-center justify-center rounded p-2 transition ${isUploading ? "opacity-50" : "text-white/60 hover:bg-white/10 hover:text-white"}`}
                title="Tải ảnh lên từ máy"
            >
                {isUploading ? <LoaderCircle size={16} className="animate-spin" /> : <ImageIcon size={16} />}
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={isUploading} />
            </label>
        </div>
    );
};

export default function TipTapEditor({
    content,
    onChange,
}: {
    content: string;
    onChange: (html: string) => void;
}) {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            Image.configure({
                HTMLAttributes: {
                    class: "max-h-[30rem] w-auto rounded-lg mx-auto object-contain my-4",
                },
            }),
        ],
        content: content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: "prose prose-invert prose-cyan max-w-none min-h-[300px] outline-none p-4",
            },
        },
    });

    // Cập nhật lại nội dung khi prop thay đổi (ví dụ: bấm nút Sửa)
    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    return (
        <div className="mt-2 overflow-hidden rounded-xl border border-white/10 bg-white/[0.06] focus-within:border-cyan-400/60">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
}
