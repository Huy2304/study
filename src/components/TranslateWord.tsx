// src/components/TranslatePro.tsx
"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Globe, ArrowUpDown, Volume2, Copy, Check, X, Languages, Eraser } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const LANGUAGES = [
    { code: "auto", name: "Phát hiện ngôn ngữ", flag: "🌐" },
    { code: "vi", name: "Tiếng Việt", flag: "🇻🇳" },
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "zh", name: "中文 (Tiếng Trung)", flag: "🇨🇳" },
    { code: "ja", name: "日本語 (Tiếng Nhật)", flag: "🇯🇵" },
    { code: "ko", name: "한국어 (Tiếng Hàn)", flag: "🇰🇷" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "ru", name: "Русский", flag: "🇷🇺" },
    { code: "th", name: "ไทย (Tiếng Thái)", flag: "🇹🇭" },
    { code: "id", name: "Bahasa Indonesia", flag: "🇮🇩" },
    { code: "pt", name: "Português", flag: "🇵🇹" },
    { code: "it", name: "Italiano", flag: "🇮🇹" },
    { code: "hi", name: "हिन्दी (Tiếng Hindi)", flag: "🇮🇳" },
    { code: "ar", name: "العربية (Tiếng Ả Rập)", flag: "🇸🇦" },
    { code: "ms", name: "Bahasa Melayu", flag: "🇲🇾" },
    { code: "tr", name: "Türkçe", flag: "🇹🇷" },
    { code: "nl", name: "Nederlands", flag: "🇳🇱" },
    { code: "pl", name: "Polski", flag: "🇵🇱" },
] as const

type LangCode = typeof LANGUAGES[number]["code"]

export default function TranslatePro() {
    const [open, setOpen] = React.useState(false)
    const [sourceLang, setSourceLang] = React.useState<LangCode>("auto")
    const [targetLang, setTargetLang] = React.useState<LangCode>("vi")
    const [input, setInput] = React.useState("")
    const [output, setOutput] = React.useState("")
    const [detectedLang, setDetectedLang] = React.useState("")
    const [loading, setLoading] = React.useState(false)
    const [copied, setCopied] = React.useState(false)
    const textareaRef = React.useRef<HTMLTextAreaElement>(null)

    // Auto-focus textarea khi mở
    React.useEffect(() => {
        if (open && textareaRef.current) {
            textareaRef.current.focus()
        }
    }, [open])

    const swapLanguages = () => {
        if (sourceLang === "auto") return
        setSourceLang(targetLang)
        setTargetLang(sourceLang as LangCode)
        setInput(output)
        setOutput(input)
    }

    const translateText = async () => {
        if (!input.trim()) {
            setOutput("")
            setDetectedLang("")
            return
        }

        setLoading(true)
        try {
            const sl = sourceLang === "auto" ? "auto" : sourceLang
            const res = await fetch(
                `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${targetLang}&dt=t&q=${encodeURIComponent(input)}`
            )
            const data = await res.json()
            const translated = data[0]?.map((item: any) => item[0]).join("") || ""
            const detected = data[2] || ""

            setOutput(translated)
            if (sourceLang === "auto" && detected) {
                const langName = LANGUAGES.find(l => l.code === detected)?.name || detected
                setDetectedLang(`Phát hiện: ${langName}`)
            } else {
                setDetectedLang("")
            }
        } catch {
            setOutput("Lỗi kết nối, thử lại nhé!")
        } finally {
            setLoading(false)
        }
    }

    React.useEffect(() => {
        const timer = setTimeout(translateText, 600)
        return () => clearTimeout(timer)
    }, [input, sourceLang, targetLang])

    const speak = (text: string, lang: string) => {
        if (!text) return
        const utter = new SpeechSynthesisUtterance(text)
        utter.lang = lang === "zh" ? "zh-CN" : lang === "ja" ? "ja-JP" : `${lang}-${lang.toUpperCase()}`
        speechSynthesis.cancel()
        speechSynthesis.speak(utter)
    }

    const copy = () => {
        navigator.clipboard.writeText(output)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const clearInput = () => {
        setInput("")
        setOutput("")
        setDetectedLang("")
        textareaRef.current?.focus()
    }

    return (
        <>
            {/* Nút mở - to hơn, gradient đẹp */}
            <Button
                size="lg"
                className="fixed bottom-30 left-30 rounded-full h-16 w-16 p-0 z-50
                   bg-gradient-to-r 0
                   shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => setOpen(!open)}
            >
                {open ? <Languages className="h-8 w-8" /> : <Globe className="h-8 w-8" />}
            </Button>

            {/* Popup dịch - nền trong suốt */}
            {open && (
                <>
                    <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setOpen(false)} />

                    <Card
                        className="fixed bottom-24 left-6 w-96 max-w-[calc(100vw-2rem)]
                      bg-white/10
                      z-50 animate-in slide-in-from-bottom-8 duration-300
                      "
                    >
                        <CardContent className="p-4 space-y-5">
                            {/* Header */}
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-xl flex items-center gap-2 text-white/90">
                                    <Globe className="h-6 w-6 text-blue-400" />
                                    Dịch nhanh
                                </h3>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="text-white/70 hover:text-white hover:bg-white/10"
                                    onClick={() => setOpen(false)}
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>

                            {/* Chọn ngôn ngữ */}
                            <div className="flex items-center gap-3">
                                <Select value={sourceLang} onValueChange={(v) => setSourceLang(v as LangCode)}>
                                    <SelectTrigger className="w-36 bg-white/20 border-white/30 text-white/90">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white/95 dark:bg-gray-900/95">
                                        {LANGUAGES.map((lang) => (
                                            <SelectItem key={lang.code} value={lang.code}>
                        <span className="flex items-center gap-2">
                          <span className="text-lg">{lang.flag}</span>
                          <span className="text-sm">{lang.name}</span>
                        </span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="bg-white/20 border-white/30 hover:bg-white/30"
                                    onClick={swapLanguages}
                                    disabled={sourceLang === "auto"}
                                >
                                    <ArrowUpDown className="h-5 w-5 text-white/90" />
                                </Button>

                                <Select value={targetLang} onValueChange={(v) => setTargetLang(v as LangCode)}>
                                    <SelectTrigger className="w-36 bg-white/20 border-white/30 text-white/90">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white/95 dark:bg-gray-900/95">
                                        {LANGUAGES.filter(l => l.code !== "auto").map((lang) => (
                                            <SelectItem key={lang.code} value={lang.code}>
                        <span className="flex items-center gap-2">
                          <span className="text-lg">{lang.flag}</span>
                          <span className="text-sm">{lang.name}</span>
                        </span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {detectedLang && (
                                <p className="text-xs font-medium text-blue-300">{detectedLang}</p>
                            )}

                            {/* Input */}
                            <div className="relative">
                                <Textarea
                                    ref={textareaRef}
                                    placeholder="Nhập văn bản cần dịch..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    className="min-h-36 resize-none bg-white/15 border-white/25
                             text-white placeholder:text-white/50 focus:ring-2
                             focus:ring-blue-400/50 focus:border-blue-400
                             rounded-xl p-4"
                                />
                                {input && (
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="absolute top-2 right-2 text-white/70 hover:text-white hover:bg-white/20"
                                        onClick={clearInput}
                                    >
                                        <Eraser className="h-5 w-5" />
                                    </Button>
                                )}
                            </div>

                            {/* Output */}
                            <div className="bg-white/15 rounded-xl p-5 min-h-36 max-h-48 overflow-y-auto">
                                {loading ? (
                                    <p className="text-sm text-white/70 animate-pulse">Đang dịch...</p>
                                ) : output ? (
                                    <>
                                        <p className="text-base text-white/90 leading-relaxed">{output}</p>
                                        <div className="flex gap-3 mt-3">
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                className="bg-blue-500/30 hover:bg-blue-500/50 text-white"
                                                onClick={() => speak(output, targetLang)}
                                            >
                                                <Volume2 className="h-4 w-4 mr-2" /> Nghe
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                className="bg-blue-500/30 hover:bg-blue-500/50 text-white"
                                                onClick={copy}
                                            >
                                                {copied ? (
                                                    <>
                                                        <Check className="h-4 w-4 mr-2" /> Đã copy
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="h-4 w-4 mr-2" /> Copy
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-sm text-white/50 italic">Kết quả ...</p>
                                )}
                            </div>

                            <p className="text-xs text-center text-white/60">
                                Powered by Google Translate • Miễn phí
                            </p>
                        </CardContent>
                    </Card>
                </>
            )}
        </>
    )
}