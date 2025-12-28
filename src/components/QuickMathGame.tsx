"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Trophy,
    RotateCcw,
    Play,
    HelpCircle,
    Timer,
    Flame,
    Zap,
    Infinity,
} from "lucide-react";

type GameMode = "timed" | "unlimited";
type Difficulty = "easy" | "medium" | "hard";

interface MathProblem {
    question: string;
    answer: number;
    options: number[];
}

const DIFFICULTY_CONFIG = {
    easy: {
        timeLimit: 60,
        minNum: 1,
        maxNum: 20,
        operations: ["+", "-"] as const,
        pointsPerCorrect: 10,
        color: "from-emerald-500 to-teal-600",
    },
    medium: {
        timeLimit: 45,
        minNum: 10,
        maxNum: 50,
        operations: ["+", "-", "*"] as const,
        pointsPerCorrect: 20,
        color: "from-blue-500 to-indigo-600",
    },
    hard: {
        timeLimit: 30,
        minNum: 20,
        maxNum: 100,
        operations: ["+", "-", "*", "/"] as const,
        pointsPerCorrect: 30,
        color: "from-purple-500 to-pink-600",
    },
};

const UNLIMITED_QUESTION_COUNT = 20;

interface GameStats {
    totalPlays: number;
    bestScore: number;
    correctAnswers: number;
    totalAnswers: number;
    bestUnlimitedTime?: number;
}

const STORAGE_KEY = "quickmath_stats_v3";

export default function QuickMathGame({ embedded = false }: { embedded?: boolean }) {
    const [isOpen, setIsOpen] = useState(embedded);
    const [gameMode, setGameMode] = useState<GameMode>("timed");
    const [difficulty, setDifficulty] = useState<Difficulty>("medium");
    const [currentProblem, setCurrentProblem] = useState<MathProblem | null>(null);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [streak, setStreak] = useState(0);
    const [showHelp, setShowHelp] = useState(false);
    const [questionsAnswered, setQuestionsAnswered] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null); // Theo dõi lựa chọn hiện tại
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null); // null: chưa chọn, true: đúng, false: sai

    const [stats, setStats] = useState<GameStats>({
        totalPlays: 0,
        bestScore: 0,
        correctAnswers: 0,
        totalAnswers: 0,
        bestUnlimitedTime: undefined,
    });

    const correctThisRound = useRef(0);
    const totalThisRound = useRef(0);
    const startTime = useRef<number>(0);

    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) setStats(JSON.parse(saved));
        } catch (e) {
            console.warn("Failed to load stats");
        }
    }, []);

    const saveStats = useCallback((newStats: GameStats) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newStats));
            setStats(newStats);
        } catch (e) {
            console.warn("Failed to save stats");
        }
    }, []);

    const generateProblem = useCallback((diff: Difficulty): MathProblem => {
        const config = DIFFICULTY_CONFIG[diff];
        let num1: number, num2: number, operation: string;
        let question: string;
        let answer: number;

        do {
            operation = config.operations[Math.floor(Math.random() * config.operations.length)];

            if (operation === "*") {
                num1 = Math.floor(Math.random() * 12) + 1;
                num2 = Math.floor(Math.random() * 12) + 1;
            } else if (operation === "/") {
                num2 = Math.floor(Math.random() * 10) + 2;
                num1 = num2 * (Math.floor(Math.random() * 10) + 1);
            } else {
                num1 = Math.floor(Math.random() * (config.maxNum - config.minNum + 1)) + config.minNum;
                num2 = Math.floor(Math.random() * (config.maxNum - config.minNum + 1)) + config.minNum;
                if (operation === "-") [num1, num2] = [Math.max(num1, num2), Math.min(num1, num2)];
            }

            switch (operation) {
                case "+": answer = num1 + num2; question = `${num1} + ${num2}`; break;
                case "-": answer = num1 - num2; question = `${num1} - ${num2}`; break;
                case "*": answer = num1 * num2; question = `${num1} × ${num2}`; break;
                case "/": answer = num1 / num2; question = `${num1} ÷ ${num2}`; break;
                default: answer = num1 + num2; question = `${num1} + ${num2}`;
            }
        } while (answer < 0 || !Number.isInteger(answer));

        const options = new Set<number>([answer]);
        while (options.size < 4) {
            const wrong = answer + Math.floor(Math.random() * 20) - 10;
            if (wrong > 0 && wrong !== answer) options.add(wrong);
        }

        return {
            question,
            answer,
            options: Array.from(options).sort(() => Math.random() - 0.5),
        };
    }, []);

    const startGame = useCallback(() => {
        const config = DIFFICULTY_CONFIG[difficulty];
        setScore(0);
        setStreak(0);
        setQuestionsAnswered(0);
        setSelectedOption(null);
        setIsCorrect(null);
        correctThisRound.current = 0;
        totalThisRound.current = 0;

        if (gameMode === "timed") {
            setTimeLeft(config.timeLimit);
            setElapsedTime(0);
        } else {
            setTimeLeft(0);
            setElapsedTime(0);
            startTime.current = Date.now();
        }

        setCurrentProblem(generateProblem(difficulty));
    }, [difficulty, gameMode, generateProblem]);

    const handleAnswer = useCallback(
        (selected: number) => {
            if (!currentProblem) return;

            setSelectedOption(selected);

            const correct = selected === currentProblem.answer;
            setIsCorrect(correct);

            totalThisRound.current += 1; // Tăng mỗi lần click

            if (correct) {
                correctThisRound.current += 1;
                const points = DIFFICULTY_CONFIG[difficulty].pointsPerCorrect + streak * 5;
                setScore((prev) => prev + points);
                setStreak((prev) => prev + 1);
                setQuestionsAnswered((prev) => prev + 1);
                setTimeout(() => {
                    setCurrentProblem(generateProblem(difficulty));
                    setSelectedOption(null);
                    setIsCorrect(null);
                }, 500); // Delay 0.5s để thấy animation trước khi chuyển câu
            } else {
                setStreak(0);
                // Không chuyển câu, cho chọn lại
            }
        },
        [currentProblem, difficulty, streak, generateProblem]
    );

    useEffect(() => {
        if (gameMode === "timed" && timeLeft <= 0 && currentProblem) {
            endGame();
            return;
        }

        if (gameMode === "timed" && timeLeft > 0) {
            const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
            return () => clearInterval(id);
        }

        if (gameMode === "unlimited" && currentProblem) {
            const id = setInterval(() => {
                setElapsedTime(Math.floor((Date.now() - startTime.current) / 1000));
            }, 1000);
            return () => clearInterval(id);
        }
    }, [gameMode, timeLeft, currentProblem]);

    useEffect(() => {
        if (gameMode === "unlimited" && questionsAnswered >= UNLIMITED_QUESTION_COUNT && currentProblem) {
            endGame();
        }
    }, [questionsAnswered, gameMode, currentProblem]);

    const endGame = useCallback(() => {
        const newBestScore = Math.max(stats.bestScore, score);
        let newBestUnlimitedTime = stats.bestUnlimitedTime;

        if (gameMode === "unlimited" && correctThisRound.current === UNLIMITED_QUESTION_COUNT) {
            const timeTaken = elapsedTime;
            if (!newBestUnlimitedTime || timeTaken < newBestUnlimitedTime) {
                newBestUnlimitedTime = timeTaken;
            }
        }

        const updated: GameStats = {
            totalPlays: stats.totalPlays + 1,
            bestScore: newBestScore,
            correctAnswers: stats.correctAnswers + correctThisRound.current,
            totalAnswers: stats.totalAnswers + totalThisRound.current,
            bestUnlimitedTime: newBestUnlimitedTime,
        };

        saveStats(updated);
        setCurrentProblem(null);
    }, [stats, score, gameMode, elapsedTime, saveStats]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    const accuracy = useMemo(
        () => (stats.totalAnswers > 0 ? Math.round((stats.correctAnswers / stats.totalAnswers) * 100) : 0),
        [stats]
    );

    const isGameActive = !!currentProblem;
    const isGameOver = (gameMode === "timed" && timeLeft <= 0) ||
        (gameMode === "unlimited" && questionsAnswered >= UNLIMITED_QUESTION_COUNT);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-800"
            >
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <Zap className="text-yellow-400" size={32} />
                                Quick Math Challenge
                            </h2>
                            <p className="text-gray-400 text-sm mt-1">Rèn luyện tốc độ và tư duy toán học</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => setShowHelp(!showHelp)} className="p-2 rounded-lg hover:bg-white/10">
                                <HelpCircle className="text-gray-400" size={24} />
                            </button>
                            {!embedded && (
                                <button onClick={() => setIsOpen(false)} className="p-2 rounded-lg hover:bg-white/10">
                                    <X className="text-gray-400" size={24} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Help Modal */}
                    <AnimatePresence>
                        {showHelp && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="mb-6 overflow-hidden"
                            >
                                <div className="bg-blue-500/20 border border-blue-500/50 rounded-xl p-5 text-gray-300 space-y-3">
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        <HelpCircle /> Hướng dẫn chơi
                                    </h3>
                                    <ul className="space-y-2 text-sm list-disc list-inside">
                                        <li><strong>Có thời gian:</strong> Trả lời càng nhiều càng tốt trước khi hết giờ</li>
                                        <li><strong>{UNLIMITED_QUESTION_COUNT} câu hỏi:</strong> Hoàn thành 20 câu nhanh nhất có thể</li>
                                        <li>Nếu chọn sai, bạn có thể thử lại ngay trong cùng câu hỏi!</li>
                                        <li>Trả lời đúng liên tiếp để nhận bonus combo (+5 điểm mỗi cấp)</li>
                                    </ul>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Global Stats */}
                    {stats.totalPlays > 0 && !isGameActive && (
                        <div className="grid grid-cols-3 gap-3 mb-6">
                            <div className="bg-white/10 rounded-xl p-4 text-center">
                                <div className="text-2xl font-bold text-white">{stats.bestScore}</div>
                                <div className="text-xs text-gray-400">Điểm cao nhất</div>
                            </div>
                            <div className="bg-white/10 rounded-xl p-4 text-center">
                                <div className="text-2xl font-bold text-white">{stats.totalPlays}</div>
                                <div className="text-xs text-gray-400">Lần chơi</div>
                            </div>
                            <div className="bg-white/10 rounded-xl p-4 text-center">
                                <div className="text-2xl font-bold text-white">{accuracy}%</div>
                                <div className="text-xs text-gray-400">Độ chính xác</div>
                            </div>
                        </div>
                    )}

                    {/* Selector */}
                    {!isGameActive && (
                        <div className="mb-8 space-y-6">
                            <div>
                                <label className="block text-gray-300 font-medium mb-3">Chế độ chơi</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => setGameMode("timed")}
                                        className={`p-4 rounded-xl flex items-center justify-center gap-3 transition-all ${
                                            gameMode === "timed"
                                                ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-xl"
                                                : "bg-white/10 text-gray-300 hover:bg-white/20"
                                        }`}
                                    >
                                        <Timer size={20} />
                                        Có giới hạn thời gian
                                    </button>
                                    <button
                                        onClick={() => setGameMode("unlimited")}
                                        className={`p-4 rounded-xl flex items-center justify-center gap-3 transition-all ${
                                            gameMode === "unlimited"
                                                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-xl"
                                                : "bg-white/10 text-gray-300 hover:bg-white/20"
                                        }`}
                                    >
                                        <Infinity size={20} />
                                        {UNLIMITED_QUESTION_COUNT} câu hỏi
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-300 font-medium mb-3">Độ khó</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {(["easy", "medium", "hard"] as const).map((d) => {
                                        const cfg = DIFFICULTY_CONFIG[d];
                                        return (
                                            <button
                                                key={d}
                                                onClick={() => setDifficulty(d)}
                                                className={`p-4 rounded-xl transition-all ${
                                                    difficulty === d
                                                        ? `bg-gradient-to-r ${cfg.color} text-white shadow-xl scale-105`
                                                        : "bg-white/10 text-gray-300 hover:bg-white/20"
                                                }`}
                                            >
                                                <div className="font-bold capitalize">
                                                    {d === "easy" ? "Dễ" : d === "medium" ? "Trung bình" : "Khó"}
                                                </div>
                                                {gameMode === "timed" && <div className="text-xs mt-1 opacity-80">{cfg.timeLimit}s</div>}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* In-game Stats */}
                    {isGameActive && !isGameOver && (
                        <>
                            <div className="grid grid-cols-3 gap-3 mb-6">
                                <div className="bg-white/10 rounded-xl p-4 text-center">
                                    <div className="text-3xl font-bold text-white">{score}</div>
                                    <div className="text-xs text-gray-400">Điểm</div>
                                </div>
                                <div className="bg-white/10 rounded-xl p-4 text-center">
                                    <div className="text-3xl font-bold text-white flex items-center justify-center gap-1">
                                        {gameMode === "timed" ? <Timer size={24} /> : <Infinity size={24} />}
                                        {gameMode === "timed" ? `${timeLeft}s` : formatTime(elapsedTime)}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        {gameMode === "timed" ? "Còn lại" : "Đã chơi"}
                                    </div>
                                </div>
                                <div className="bg-white/10 rounded-xl p-4 text-center">
                                    <div className="text-3xl font-bold text-white flex items-center justify-center gap-1">
                                        {streak > 0 && <Flame className="text-orange-400" size={24} />}
                                        {streak}
                                    </div>
                                    <div className="text-xs text-gray-400">Combo</div>
                                </div>
                            </div>

                            {gameMode === "unlimited" && (
                                <div className="text-center text-gray-400 mb-4 font-medium">
                                    Câu {questionsAnswered} / {UNLIMITED_QUESTION_COUNT}
                                </div>
                            )}

                            {gameMode === "timed" && (
                                <div className="h-3 bg-gray-800 rounded-full overflow-hidden mb-6">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"
                                        animate={{ width: `${(timeLeft / DIFFICULTY_CONFIG[difficulty].timeLimit) * 100}%` }}
                                        transition={{ ease: "linear", duration: 0.8 }}
                                    />
                                </div>
                            )}
                        </>
                    )}

                    {/* Problem */}
                    <AnimatePresence mode="wait">
                        {isGameActive && !isGameOver && currentProblem && (
                            <motion.div
                                key={currentProblem.question}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="mb-8"
                            >
                                <div className="bg-white/10 rounded-2xl p-10 text-center mb-8">
                                    <h3 className="text-5xl font-black text-white">
                                        {currentProblem.question} = ?
                                    </h3>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {currentProblem.options.map((opt, i) => {
                                        const isSelected = selectedOption === opt;
                                        const buttonClass = `
                      text-white text-3xl font-bold py-6 rounded-2xl shadow-xl transition-all
                      ${isSelected
                                            ? (isCorrect === true
                                                ? "bg-green-500 scale-105"
                                                : isCorrect === false
                                                    ? "bg-red-500 animate-shake"
                                                    : "bg-indigo-600")
                                            : "bg-indigo-600 hover:bg-indigo-500"
                                        }
                    `;

                                        return (
                                            <motion.button
                                                key={i}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleAnswer(opt)}
                                                className={buttonClass}
                                            >
                                                {opt}
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Game Over */}
                    <AnimatePresence>
                        {isGameOver && (
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-center mb-8 py-8"
                            >
                                <Trophy className="w-24 h-24 text-yellow-400 mx-auto mb-6" />
                                <h3 className="text-3xl font-bold text-white mb-4">
                                    {gameMode === "timed" ? "Hết giờ!" : "Hoàn thành!"}
                                </h3>
                                <p className="text-5xl font-black text-yellow-400 mb-6">{score} điểm</p>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-white/10 rounded-xl p-4">
                                        <div className="text-gray-400 text-sm">Số câu đúng</div>
                                        <div className="text-3xl font-bold text-green-400">
                                            {correctThisRound.current} / {gameMode === "timed" ? totalThisRound.current : UNLIMITED_QUESTION_COUNT}
                                        </div>
                                    </div>
                                    <div className="bg-white/10 rounded-xl p-4">
                                        <div className="text-gray-400 text-sm">
                                            {gameMode === "timed" ? "Combo cao nhất" : "Thời gian hoàn thành"}
                                        </div>
                                        <div className="text-3xl font-bold text-white">
                                            {gameMode === "timed" ? streak : formatTime(elapsedTime)}
                                        </div>
                                    </div>
                                </div>

                                {gameMode === "unlimited" && correctThisRound.current === UNLIMITED_QUESTION_COUNT && stats.bestUnlimitedTime !== undefined && (
                                    <p className="text-sm text-cyan-400 mb-4">
                                        Kỷ lục nhanh nhất: <span className="font-bold">{formatTime(stats.bestUnlimitedTime)}</span>
                                    </p>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        {isGameActive && !isGameOver ? (
                            <button
                                onClick={endGame}
                                className="flex-1 bg-red-600/80 hover:bg-red-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all"
                            >
                                <RotateCcw size={24} />
                                Dừng chơi
                            </button>
                        ) : (
                            <button
                                onClick={startGame}
                                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 rounded-xl shadow-xl flex items-center justify-center gap-3 transition-all"
                            >
                                <Play size={24} />
                                {isGameOver ? "Chơi lại" : "Bắt đầu chơi"}
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}