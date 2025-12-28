"use client"
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, BookOpen, RotateCcw, Play, HelpCircle, Trophy } from "lucide-react";
import { Z_INDEX } from "@/lib/zIndexManager";

type GameState = "idle" | "playing" | "gameOver";
type GameMode = "vi-to-en" | "en-to-vi"; // Việt → Anh hoặc Anh → Việt

interface WordPair {
    vietnamese: string;
    english: string;
    category?: string;
}

interface GameStats {
    totalPlays: number;
    bestScore: number;
    correctAnswers: number;
    totalAnswers: number;
    lastPlayed?: string;
}

// Kho từ vựng mặc định
const DEFAULT_VOCABULARY: WordPair[] = [
    { vietnamese: "xin chào", english: "hello", category: "Chào hỏi" },
    { vietnamese: "cảm ơn", english: "thank you", category: "Chào hỏi" },
    { vietnamese: "tạm biệt", english: "goodbye", category: "Chào hỏi" },
    { vietnamese: "làm ơn", english: "please", category: "Chào hỏi" },
    { vietnamese: "xin lỗi", english: "sorry", category: "Chào hỏi" },
    { vietnamese: "học tập", english: "study", category: "Học tập" },
    { vietnamese: "sách", english: "book", category: "Học tập" },
    { vietnamese: "bút", english: "pen", category: "Học tập" },
    { vietnamese: "bài tập", english: "homework", category: "Học tập" },
    { vietnamese: "giáo viên", english: "teacher", category: "Học tập" },
    { vietnamese: "học sinh", english: "student", category: "Học tập" },
    { vietnamese: "trường học", english: "school", category: "Học tập" },
    { vietnamese: "yêu thích", english: "love", category: "Cảm xúc" },
    { vietnamese: "vui vẻ", english: "happy", category: "Cảm xúc" },
    { vietnamese: "buồn", english: "sad", category: "Cảm xúc" },
    { vietnamese: "giận dữ", english: "angry", category: "Cảm xúc" },
    { vietnamese: "đẹp", english: "beautiful", category: "Tính từ" },
    { vietnamese: "to lớn", english: "big", category: "Tính từ" },
    { vietnamese: "nhỏ bé", english: "small", category: "Tính từ" },
    { vietnamese: "nhanh", english: "fast", category: "Tính từ" },
    { vietnamese: "chậm", english: "slow", category: "Tính từ" },
    { vietnamese: "thông minh", english: "smart", category: "Tính từ" },
    { vietnamese: "ăn", english: "eat", category: "Động từ" },
    { vietnamese: "uống", english: "drink", category: "Động từ" },
    { vietnamese: "ngủ", english: "sleep", category: "Động từ" },
    { vietnamese: "chạy", english: "run", category: "Động từ" },
    { vietnamese: "đi bộ", english: "walk", category: "Động từ" },
    { vietnamese: "nhà", english: "house", category: "Nơi chốn" },
    { vietnamese: "thành phố", english: "city", category: "Nơi chốn" },
    { vietnamese: "quốc gia", english: "country", category: "Nơi chốn" },
    { vietnamese: "máy tính", english: "computer", category: "Công nghệ" },
    { vietnamese: "điện thoại", english: "phone", category: "Công nghệ" },
    { vietnamese: "internet", english: "internet", category: "Công nghệ" },
];

const STORAGE_KEY = "flashcard_game_stats";

interface FlashcardGameProps {
    embedded?: boolean;
}

export default function FlashcardGame({ embedded = false }: FlashcardGameProps) {
    const [isOpen, setIsOpen] = useState(embedded);
    const [gameState, setGameState] = useState<GameState>("idle");
    const [gameMode, setGameMode] = useState<GameMode>("vi-to-en");
    const [currentWord, setCurrentWord] = useState<WordPair | null>(null);
    const [options, setOptions] = useState<string[]>([]);
    const [score, setScore] = useState(0);
    const [questionCount, setQuestionCount] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);
    const [streak, setStreak] = useState(0);
    const [maxQuestions] = useState(10);
    const [showHelp, setShowHelp] = useState(false);
    const [stats, setStats] = useState<GameStats>({
        totalPlays: 0,
        bestScore: 0,
        correctAnswers: 0,
        totalAnswers: 0,
    });

    // Load stats from localStorage
    useEffect(() => {
        const savedStats = localStorage.getItem(STORAGE_KEY);
        if (savedStats) {
            try {
                const parsed = JSON.parse(savedStats);
                // Use a timeout to avoid synchronous setState
                setTimeout(() => {
                    setStats(parsed);
                }, 0);
            } catch (e) {
                console.error("Failed to load stats:", e);
            }
        }
    }, []);

    // Save stats to localStorage
    const saveStats = useCallback((newStats: GameStats) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newStats));
            setStats(newStats);
        } catch (e) {
            console.error("Failed to save stats:", e);
        }
    }, []);

    // Generate question with options
    const generateQuestion = useCallback((): { word: WordPair; options: string[] } => {
        const randomWord = DEFAULT_VOCABULARY[Math.floor(Math.random() * DEFAULT_VOCABULARY.length)];
        const wrongOptions = DEFAULT_VOCABULARY
            .filter(w => w !== randomWord)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map(w => gameMode === "vi-to-en" ? w.english : w.vietnamese);

        const correctAnswer = gameMode === "vi-to-en" ? randomWord.english : randomWord.vietnamese;
        const allOptions = [correctAnswer, ...wrongOptions].sort(() => Math.random() - 0.5);

        return {
            word: randomWord,
            options: allOptions,
        };
    }, [gameMode]);

    // Start game
    const startGame = useCallback(() => {
        setGameState("playing");
        setScore(0);
        setQuestionCount(0);
        setCorrectCount(0);
        setStreak(0);
        const question = generateQuestion();
        setCurrentWord(question.word);
        setOptions(question.options);
    }, [generateQuestion]);

    // Handle answer selection
    const handleAnswer = useCallback((selectedAnswer: string) => {
        if (gameState !== "playing" || !currentWord) return;

        const correctAnswer = gameMode === "vi-to-en" 
            ? currentWord.english 
            : currentWord.vietnamese;

        const isCorrect = selectedAnswer === correctAnswer;
        const newQuestionCount = questionCount + 1;
        const newCorrectCount = isCorrect ? correctCount + 1 : correctCount;
        const newStreak = isCorrect ? streak + 1 : 0;
        const newScore = isCorrect 
            ? score + 10 + (newStreak > 1 ? newStreak * 2 : 0)
            : score;

        setQuestionCount(newQuestionCount);
        setCorrectCount(newCorrectCount);
        setStreak(newStreak);
        setScore(newScore);

        // Check if game is over
        if (newQuestionCount >= maxQuestions) {
            // Update stats
            const updatedStats: GameStats = {
                totalPlays: stats.totalPlays + 1,
                bestScore: Math.max(stats.bestScore, newScore),
                correctAnswers: stats.correctAnswers + newCorrectCount,
                totalAnswers: stats.totalAnswers + newQuestionCount,
                lastPlayed: new Date().toISOString(),
            };
            saveStats(updatedStats);
            setGameState("gameOver");
        } else {
            // Next question
            setTimeout(() => {
                const nextQuestion = generateQuestion();
                setCurrentWord(nextQuestion.word);
                setOptions(nextQuestion.options);
            }, 500);
        }
    }, [gameState, currentWord, gameMode, questionCount, correctCount, streak, score, maxQuestions, stats, saveStats, generateQuestion]);

    // Calculate accuracy
    const accuracy = questionCount > 0 ? Math.round((correctCount / questionCount) * 100) : 0;

    // Shared game content
    const gameContent = (
        <>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <BookOpen className="text-purple-400" />
                        Flashcard Tiếng Anh
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">
                        Học từ vựng tiếng Anh qua flashcard
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowHelp(!showHelp)}
                        className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                        aria-label="Hướng dẫn"
                    >
                        <HelpCircle size={24} />
                    </button>
                    {!embedded && (
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                        >
                            <X size={24} />
                        </button>
                    )}
                </div>
            </div>

            {/* Help Modal */}
            <AnimatePresence>
                {showHelp && (
                    <motion.div
                        className="mb-6 bg-purple-500/20 border border-purple-500/50 rounded-xl p-6"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <HelpCircle className="text-purple-400" />
                            Hướng dẫn chơi
                        </h3>
                        <div className="space-y-3 text-gray-300">
                            <div>
                                <strong className="text-white">Mục tiêu:</strong> Học từ vựng tiếng Anh thông qua flashcard!
                            </div>
                            <div>
                                <strong className="text-white">Cách chơi:</strong>
                                <ul className="list-disc list-inside mt-2 ml-2 space-y-1">
                                    <li>Chọn chế độ chơi: Việt → Anh hoặc Anh → Việt</li>
                                    <li>Xem từ và chọn đáp án đúng trong 4 lựa chọn</li>
                                    <li>Trả lời đúng để tăng điểm và combo</li>
                                    <li>Hoàn thành {maxQuestions} câu hỏi để kết thúc game</li>
                                </ul>
                            </div>
                            <div>
                                <strong className="text-white">Điểm số:</strong>
                                <ul className="list-disc list-inside mt-2 ml-2 space-y-1">
                                    <li>Mỗi câu đúng: 10 điểm</li>
                                    <li>Combo bonus: +2 điểm cho mỗi combo (ví dụ: combo 3 = +6 điểm)</li>
                                    <li>Điểm cao nhất được lưu tự động</li>
                                </ul>
                            </div>
                            <div>
                                <strong className="text-white">Lưu ý:</strong>
                                <ul className="list-disc list-inside mt-2 ml-2 space-y-1">
                                    <li>Tất cả tiến độ được lưu tự động vào trình duyệt</li>
                                    <li>Có thể xem thống kê tổng số lần chơi, độ chính xác</li>
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Stats Display */}
            {(stats.totalPlays > 0 || gameState === "gameOver") && gameState !== "playing" && (
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-white/10 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-white">{stats.bestScore}</div>
                        <div className="text-xs text-gray-400">Điểm cao nhất</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-white">{stats.totalPlays}</div>
                        <div className="text-xs text-gray-400">Số lần chơi</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-white">
                            {stats.totalAnswers > 0 
                                ? Math.round((stats.correctAnswers / stats.totalAnswers) * 100) 
                                : 0}%
                        </div>
                        <div className="text-xs text-gray-400">Độ chính xác</div>
                    </div>
                </div>
            )}

            {/* Game Stats (while playing) */}
            {gameState === "playing" && (
                <div className="grid grid-cols-4 gap-3 mb-6">
                    <div className="bg-white/10 rounded-lg p-3 text-center">
                        <div className="text-xl font-bold text-white">{score}</div>
                        <div className="text-xs text-gray-400">Điểm</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3 text-center">
                        <div className="text-xl font-bold text-white">
                            {questionCount}/{maxQuestions}
                        </div>
                        <div className="text-xs text-gray-400">Câu hỏi</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3 text-center">
                        <div className="text-xl font-bold text-white">{streak}</div>
                        <div className="text-xs text-gray-400">Combo</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3 text-center">
                        <div className="text-xl font-bold text-white">{accuracy}%</div>
                        <div className="text-xs text-gray-400">Đúng</div>
                    </div>
                </div>
            )}

            {/* Progress Bar */}
            {gameState === "playing" && (
                <div className="mb-6">
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                            initial={{ width: "0%" }}
                            animate={{ width: `${(questionCount / maxQuestions) * 100}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                </div>
            )}

            {/* Mode Selector */}
            {gameState === "idle" && (
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                        Chế độ chơi:
                    </label>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setGameMode("vi-to-en")}
                            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                                gameMode === "vi-to-en"
                                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                                    : "bg-white/10 text-gray-300 hover:bg-white/20"
                            }`}
                        >
                            <div className="font-bold">Việt → Anh</div>
                            <div className="text-xs opacity-75">Xem tiếng Việt, chọn tiếng Anh</div>
                        </button>
                        <button
                            onClick={() => setGameMode("en-to-vi")}
                            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                                gameMode === "en-to-vi"
                                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                                    : "bg-white/10 text-gray-300 hover:bg-white/20"
                            }`}
                        >
                            <div className="font-bold">Anh → Việt</div>
                            <div className="text-xs opacity-75">Xem tiếng Anh, chọn tiếng Việt</div>
                        </button>
                    </div>
                </div>
            )}

            {/* Question Card */}
            {gameState === "playing" && currentWord && (
                <motion.div
                    className="mb-6"
                    key={`${currentWord.vietnamese}-${questionCount}`}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                >
                    <div className="bg-white/10 rounded-xl p-8 text-center mb-4 min-h-[120px] flex items-center justify-center">
                        <div>
                            <div className="text-sm text-gray-400 mb-2">
                                {gameMode === "vi-to-en" ? "Tiếng Việt" : "English"}
                            </div>
                            <div className="text-4xl font-bold text-white">
                                {gameMode === "vi-to-en" 
                                    ? currentWord.vietnamese 
                                    : currentWord.english}
                            </div>
                            {currentWord.category && (
                                <div className="text-xs text-purple-400 mt-2">
                                    {currentWord.category}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {options.map((option, index) => (
                            <motion.button
                                key={index}
                                onClick={() => handleAnswer(option)}
                                className="bg-gradient-to-r from-purple-600/80 to-pink-600/80 hover:from-purple-500 hover:to-pink-500 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all hover:scale-105 active:scale-95 shadow-lg"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {option}
                            </motion.button>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Game Over */}
            <AnimatePresence>
                {gameState === "gameOver" && (
                    <motion.div
                        className="mb-6 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/50 rounded-xl p-6 text-center"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                        >
                            <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                        </motion.div>
                        <h3 className="text-2xl font-bold text-white mb-2">
                            Hoàn thành! 🎉
                        </h3>
                        <p className="text-gray-300 mb-4">
                            Điểm số của bạn: <span className="font-bold text-yellow-400 text-3xl">{score}</span>
                        </p>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                                <div className="text-gray-400">Đúng</div>
                                <div className="text-white font-bold text-xl">
                                    {correctCount}/{maxQuestions}
                                </div>
                            </div>
                            <div>
                                <div className="text-gray-400">Độ chính xác</div>
                                <div className="text-white font-bold text-xl">{accuracy}%</div>
                            </div>
                            <div>
                                <div className="text-gray-400">Combo cao nhất</div>
                                <div className="text-white font-bold text-xl">{streak}</div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="flex gap-3">
                {gameState === "idle" ? (
                    <button
                        onClick={startGame}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center gap-2 shadow-lg"
                    >
                        <Play size={20} />
                        Bắt đầu chơi
                    </button>
                ) : (
                    <>
                        <button
                            onClick={() => {
                                setGameState("idle");
                                setCurrentWord(null);
                            }}
                            className="flex-1 bg-white/10 text-white py-3 px-6 rounded-lg font-semibold hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                        >
                            <RotateCcw size={20} />
                            Chơi lại
                        </button>
                        {gameState === "gameOver" && (
                            <button
                                onClick={() => {
                                    startGame();
                                }}
                                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
                            >
                                Chơi tiếp
                            </button>
                        )}
                    </>
                )}
            </div>
        </>
    );

    return (
        <>
            {!embedded && (
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="relative text-white rounded-full bg-gradient-to-r from-purple-600 to-pink-600 p-3 shadow-lg hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent"
                    aria-label="Mở Flashcard Game"
                >
                    <BookOpen size={24} />
                </button>
            )}

            {/* Embedded Content */}
            {embedded ? (
                <div className="w-full">
                    <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 rounded-xl p-6 w-full max-h-[70vh] overflow-y-auto">
                        {gameContent}
                    </div>
                </div>
            ) : (
                /* Modal Version */
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                            style={{ zIndex: Z_INDEX.MODAL + 10 }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={(e) => {
                                if (e.target === e.currentTarget) setIsOpen(false);
                            }}
                        >
                            <motion.div
                                className="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 rounded-2xl shadow-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                {gameContent}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            )}
        </>
    );
}
