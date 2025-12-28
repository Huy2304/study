"use client"
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gamepad2, Trophy, BookOpen } from "lucide-react";
import { Z_INDEX } from "@/lib/zIndexManager";
import QuickMathGame from "@/components/QuickMathGame";
import FlashcardGame from "@/components/FlashcardGame";

type SelectedGame = "none" | "math" | "flashcard";

export default function GameHub() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedGame, setSelectedGame] = useState<SelectedGame>("none");

    const handleClose = () => {
        setSelectedGame("none");
        setIsOpen(false);
    };

    const handleSelectGame = (game: "math" | "flashcard") => {
        setSelectedGame(game);
    };

    const handleBackToMenu = () => {
        setSelectedGame("none");
    };

    return (
        <>
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative text-white rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 p-3 shadow-lg hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-transparent"
                aria-label="Mở Game Hub"
            >
                <Gamepad2 size={24} />
            </button>

            {/* Game Hub Modal */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        style={{ zIndex: Z_INDEX.MODAL + 10 }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={(e) => {
                            if (e.target === e.currentTarget) handleClose();
                        }}
                    >
                        <motion.div
                            className="bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 rounded-2xl shadow-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6 flex-shrink-0">
                                <div>
                                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                        <Gamepad2 className="text-indigo-400" />
                                        {selectedGame === "none" && "Game Hub"}
                                        {selectedGame === "math" && "Quick Math Challenge"}
                                        {selectedGame === "flashcard" && "Flashcard Tiếng Anh"}
                                    </h2>
                                    <p className="text-gray-400 text-sm mt-1">
                                        {selectedGame === "none" && "Chọn trò chơi để bắt đầu"}
                                        {selectedGame === "math" && "Rèn luyện tư duy và tốc độ tính toán"}
                                        {selectedGame === "flashcard" && "Học từ vựng tiếng Anh qua flashcard"}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {selectedGame !== "none" && (
                                        <button
                                            onClick={handleBackToMenu}
                                            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg text-sm font-medium"
                                        >
                                            ← Về menu
                                        </button>
                                    )}
                                    <button
                                        onClick={handleClose}
                                        className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>
                            </div>

                            {/* Content Area */}
                            <div className="flex-1 overflow-y-auto">
                                <AnimatePresence mode="wait">
                                    {selectedGame === "none" ? (
                                        <motion.div
                                            key="menu"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            transition={{ duration: 0.2 }}
                                            className="grid md:grid-cols-2 gap-6"
                                        ><QuickMathGame embedded />
                                            {/* Quick Math Game Card */}
                                            <motion.div
                                                className="bg-gradient-to-br from-green-600/20 to-blue-600/20 border border-green-500/50 rounded-xl p-6 cursor-pointer hover:scale-105 transition-transform"
                                                onClick={() => handleSelectGame("math")}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <div className="flex items-center gap-4 mb-4">
                                                    <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-4">
                                                        <Trophy className="text-white" size={32} />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl font-bold text-white">Quick Math Challenge</h3>
                                                        <p className="text-gray-400 text-sm">Tính toán nhanh</p>
                                                    </div>
                                                </div>
                                                <p className="text-gray-300 text-sm mb-4">
                                                    Rèn luyện tư duy toán học với các phép tính cộng, trừ, nhân, chia trong thời gian giới hạn. 
                                                    Trả lời càng nhanh, điểm càng cao!
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded">
                                                        3 độ khó
                                                    </span>
                                                    <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded">
                                                        Timer
                                                    </span>
                                                    <span className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-1 rounded">
                                                        Combo
                                                    </span>
                                                </div>
                                            </motion.div>

                                            {/* Flashcard Game Card */}
                                            <motion.div
                                                className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/50 rounded-xl p-6 cursor-pointer hover:scale-105 transition-transform"
                                                onClick={() => handleSelectGame("flashcard")}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <div className="flex items-center gap-4 mb-4">
                                                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-4">
                                                        <BookOpen className="text-white" size={32} />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl font-bold text-white">Flashcard Tiếng Anh</h3>
                                                        <p className="text-gray-400 text-sm">Học từ vựng</p>
                                                    </div>
                                                </div>
                                                <p className="text-gray-300 text-sm mb-4">
                                                    Học từ vựng tiếng Anh thông qua flashcard. Chọn giữa chế độ Việt → Anh 
                                                    hoặc Anh → Việt để rèn luyện từ vựng hiệu quả.
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    <span className="bg-purple-500/20 text-purple-400 text-xs px-2 py-1 rounded">
                                                        33 từ vựng
                                                    </span>
                                                    <span className="bg-pink-500/20 text-pink-400 text-xs px-2 py-1 rounded">
                                                        2 chế độ
                                                    </span>
                                                    <span className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-1 rounded">
                                                        LocalStorage
                                                    </span>
                                                </div>
                                            </motion.div>
                                        </motion.div>
                                    ): (
                                        <motion.div
                                            key="flashcard"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <FlashcardGame embedded />
                                        </motion.div>
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

