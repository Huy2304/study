// FlashcardGame.tsx - Full file, chữ nhỏ gọn dễ nhìn
"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, RotateCcw, Play, Trophy } from "lucide-react";

type GameState = "idle" | "playing" | "gameOver";
type GameMode = "vi-to-en" | "en-to-vi";

interface WordPair {
    vietnamese: string;
    english: string;
    category?: string;
}

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

export default function FlashcardGame({ embedded = false }: { embedded?: boolean }) {
    const [gameState, setGameState] = useState<GameState>("idle");
    const [gameMode, setGameMode] = useState<GameMode>("vi-to-en");
    const [currentWord, setCurrentWord] = useState<WordPair | null>(null);
    const [options, setOptions] = useState<string[]>([]);
    const [score, setScore] = useState(0);
    const [questionCount, setQuestionCount] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);
    const [streak, setStreak] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [stats, setStats] = useState({ totalPlays: 0, bestScore: 0, correctAnswers: 0, totalAnswers: 0 });
    const maxQuestions = 10;

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) setStats(JSON.parse(saved));
    }, []);

    const saveStats = useCallback((newStats: typeof stats) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newStats));
        setStats(newStats);
    }, []);

    const generateQuestion = useCallback(() => {
        const randomWord = DEFAULT_VOCABULARY[Math.floor(Math.random() * DEFAULT_VOCABULARY.length)];
        const wrongOptions = DEFAULT_VOCABULARY
            .filter(w => w !== randomWord)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map(w => gameMode === "vi-to-en" ? w.english : w.vietnamese);

        const correctAnswer = gameMode === "vi-to-en" ? randomWord.english : randomWord.vietnamese;
        const allOptions = [correctAnswer, ...wrongOptions].sort(() => Math.random() - 0.5);

        return { word: randomWord, options: allOptions };
    }, [gameMode]);

    const startGame = useCallback(() => {
        setGameState("playing");
        setScore(0);
        setQuestionCount(0);
        setCorrectCount(0);
        setStreak(0);
        setFlipped(false);
        const question = generateQuestion();
        setCurrentWord(question.word);
        setOptions(question.options);
    }, [generateQuestion]);

    const handleAnswer = useCallback((selectedAnswer: string) => {
        if (gameState !== "playing" || !currentWord) return;

        const correctAnswer = gameMode === "vi-to-en" ? currentWord.english : currentWord.vietnamese;
        const isCorrect = selectedAnswer === correctAnswer;
        const newStreak = isCorrect ? streak + 1 : 0;
        const newScore = isCorrect ? score + 10 + (newStreak > 1 ? newStreak * 2 : 0) : score;

        setStreak(newStreak);
        setCorrectCount(prev => isCorrect ? prev + 1 : prev);
        setScore(newScore);
        setQuestionCount(prev => prev + 1);

        if (questionCount + 1 >= maxQuestions) {
            const updatedStats = {
                totalPlays: stats.totalPlays + 1,
                bestScore: Math.max(stats.bestScore, newScore),
                correctAnswers: stats.correctAnswers + (isCorrect ? correctCount + 1 : correctCount),
                totalAnswers: stats.totalAnswers + maxQuestions,
            };
            saveStats(updatedStats);
            setGameState("gameOver");
        } else {
            setTimeout(() => {
                const nextQuestion = generateQuestion();
                setCurrentWord(nextQuestion.word);
                setOptions(nextQuestion.options);
                setFlipped(false);
            }, 500);
        }
    }, [gameState, currentWord, gameMode, questionCount, correctCount, streak, score, stats, saveStats, generateQuestion]);

    return (
        <div className="h-full w-full rounded-3xl bg-black/80 backdrop-blur-3xl flex flex-col overflow-hidden">
            <div className="border-b border-purple-500/30 bg-gradient-to-b from-purple-500/20 to-transparent p-4">
                <h2 className="text-2xl font-bold text-purple-300 flex items-center gap-2">
                    <BookOpen size={28} className="text-purple-400" />
                    FLASHCARD
                </h2>
            </div>

            <div className="flex-1 p-4 overflow-y-auto">
                {gameState === "idle" && (
                    <>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <button onClick={() => setGameMode("vi-to-en")} className={`p-4 rounded-xl text-base font-bold ${gameMode === "vi-to-en" ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white" : "bg-white/10 text-purple-300"}`}>VIỆT → ANH</button>
                            <button onClick={() => setGameMode("en-to-vi")} className={`p-4 rounded-xl text-base font-bold ${gameMode === "en-to-vi" ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white" : "bg-white/10 text-purple-300"}`}>ANH → VIỆT</button>
                        </div>
                        <button onClick={startGame} className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg font-bold flex items-center justify-center gap-3">
                            <Play size={28} /> BẮT ĐẦU
                        </button>
                    </>
                )}

                {gameState === "playing" && currentWord && (
                    <div className="flex flex-col items-center">
                        <div className="w-full max-w-md perspective-1200 mb-6 mt-4">
                            <motion.div className="relative h-48 preserve-3d cursor-pointer" onClick={() => setFlipped(!flipped)}>
                                <motion.div className="absolute inset-0 preserve-3d" animate={{ rotateY: flipped ? 180 : 0 }} transition={{ duration: 0.6, type: "spring" }}>
                                    <div className="absolute inset-0 backface-hidden rounded-2xl bg-gradient-to-br from-purple-600/90 to-pink-600/90 border-4 border-purple-400/50 flex flex-col items-center justify-center p-6">
                                        <p className="text-sm text-purple-200 mb-2">Chạm để lật</p>
                                        <p className="text-2xl font-bold text-white text-center">
                                            {gameMode === "vi-to-en" ? currentWord.vietnamese : currentWord.english}
                                        </p>
                                        {currentWord.category && <p className="mt-2 text-purple-300 text-sm">{currentWord.category}</p>}
                                    </div>
                                    <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl bg-gradient-to-br from-cyan-600/90 to-purple-600/90 border-4 border-cyan-400/50 flex flex-col items-center justify-center p-6">
                                        <p className="text-2xl font-bold text-white text-center">
                                            {gameMode === "vi-to-en" ? currentWord.english : currentWord.vietnamese}
                                        </p>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                            {options.map((option) => (
                                <motion.button
                                    key={option}
                                    onClick={() => handleAnswer(option)}
                                    className="py-5 text-xl font-bold rounded-2xl bg-gradient-to-r from-purple-600/80 to-pink-600/80 text-white"
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    {option}
                                </motion.button>
                            ))}
                        </div>

                        <div className="mt-6 text-center text-purple-300 text-base">
                            Câu {questionCount + 1}/{maxQuestions} • Điểm: {score} • Combo: {streak}
                        </div>
                    </div>
                )}

                {gameState === "gameOver" && (
                    <div className="text-center py-8">
                        <Trophy size={70} className="text-yellow-400 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-white mb-2">HOÀN THÀNH!</h3>
                        <p className="text-4xl font-bold text-yellow-400 mb-6">{score} ĐIỂM</p>
                        <button onClick={startGame} className="py-4 px-8 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl font-bold">
                            CHƠI LẠI
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}