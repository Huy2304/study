// GameHub.tsx - Icon toggle giữ nguyên 100% gốc, full file
"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gamepad2, Calculator, Languages, X } from "lucide-react";
import QuickMathGame from "@/components/QuickMathGame";
import FlashcardGame from "@/components/FlashcardGame";

type SelectedGame = "none" | "math" | "flashcard";

export default function GameHub() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedGame, setSelectedGame] = useState<SelectedGame>("none");

    return (
        <>
            {/* Icon toggle giữ nguyên hoàn toàn như file gốc */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative text-white rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 p-3 shadow-lg hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-transparent"
                aria-label="Mở Game Hub"
            >
                <Gamepad2 size={24} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed inset-0 bg-black/90 backdrop-blur-2xl flex items-center justify-center z-50 p-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                    >
                        <motion.div
                            className="relative w-full max-w-5xl h-[90vh] rounded-3xl overflow-hidden bg-gradient-to-br from-black/90 via-purple-900/30 to-cyan-900/30 border border-cyan-500/40 shadow-2xl backdrop-blur-3xl"
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 blur-3xl" />

                            <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between border-b border-white/10 bg-black/40 p-6 backdrop-blur-xl">
                                <h2 className="flex items-center gap-3 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                                    <Gamepad2 size={36} className="text-cyan-400" />
                                    {selectedGame === "none" ? "GAME HUB" : selectedGame === "math" ? "QUICK MATH" : "FLASHCARD"}
                                </h2>
                                <div className="flex items-center gap-4">
                                    {selectedGame !== "none" && (
                                        <button
                                            onClick={() => setSelectedGame("none")}
                                            className="rounded-2xl bg-white/10 px-5 py-2 text-cyan-300 backdrop-blur-lg hover:bg-white/20"
                                        >
                                            ← MENU
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="rounded-2xl bg-white/10 p-3 backdrop-blur-lg hover:bg-red-500/30"
                                    >
                                        <X size={28} className="text-cyan-300" />
                                    </button>
                                </div>
                            </div>

                            <div className="h-full px-8 pb-8 pt-24 overflow-y-auto">
                                <AnimatePresence mode="wait">
                                    {selectedGame === "none" ? (
                                        <motion.div
                                            key="menu"
                                            className="grid h-full grid-cols-1 md:grid-cols-2 gap-10"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                        >
                                            <motion.div
                                                onClick={() => setSelectedGame("math")}
                                                className="group relative cursor-pointer rounded-3xl overflow-hidden"
                                                whileHover={{ scale: 1.04 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-600/30 to-cyan-600/30 blur-xl group-hover:blur-2xl transition" />
                                                <div className="relative flex h-full flex-col items-center justify-center gap-6 rounded-3xl border border-cyan-500/50 bg-black/70 p-10 backdrop-blur-2xl">
                                                    <Calculator size={80} className="text-cyan-400" />
                                                    <h3 className="text-3xl font-bold text-cyan-300">QUICK MATH</h3>
                                                    <p className="text-center text-base text-cyan-400">Rèn luyện tốc độ tính toán</p>
                                                </div>
                                            </motion.div>

                                            <motion.div
                                                onClick={() => setSelectedGame("flashcard")}
                                                className="group relative cursor-pointer rounded-3xl overflow-hidden"
                                                whileHover={{ scale: 1.04 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-600/30 to-pink-600/30 blur-xl group-hover:blur-2xl transition" />
                                                <div className="relative flex h-full flex-col items-center justify-center gap-6 rounded-3xl border border-purple-500/50 bg-black/70 p-10 backdrop-blur-2xl">
                                                    <Languages size={80} className="text-purple-400" />
                                                    <h3 className="text-3xl font-bold text-purple-300">FLASHCARD</h3>
                                                    <p className="text-center text-base text-purple-400">Ôn từ vựng tiếng Anh</p>
                                                </div>
                                            </motion.div>
                                        </motion.div>
                                    ) : selectedGame === "math" ? (
                                        <QuickMathGame embedded />
                                    ) : (
                                        <FlashcardGame embedded />
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}