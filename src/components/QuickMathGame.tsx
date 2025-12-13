"use client"
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy, RotateCcw, Play, HelpCircle, Timer } from "lucide-react";
import { Z_INDEX } from "@/lib/zIndexManager";

type GameState = "idle" | "playing" | "paused" | "gameOver";
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
        operations: ["+", "-"],
        pointsPerCorrect: 10,
    },
    medium: {
        timeLimit: 45,
        minNum: 10,
        maxNum: 50,
        operations: ["+", "-", "*"],
        pointsPerCorrect: 20,
    },
    hard: {
        timeLimit: 30,
        minNum: 20,
        maxNum: 100,
        operations: ["+", "-", "*", "/"],
        pointsPerCorrect: 30,
    },
};

export default function QuickMathGame() {
    const [isOpen, setIsOpen] = useState(false);
    const [gameState, setGameState] = useState<GameState>("idle");
    const [difficulty, setDifficulty] = useState<Difficulty>("medium");
    const [currentProblem, setCurrentProblem] = useState<MathProblem | null>(null);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [streak, setStreak] = useState(0);
    const [bestScore, setBestScore] = useState(0);
    const [showHelp, setShowHelp] = useState(false);

    // Generate random math problem
    const generateProblem = useCallback((diff: Difficulty): MathProblem => {
        const config = DIFFICULTY_CONFIG[diff];
        const num1 = Math.floor(Math.random() * (config.maxNum - config.minNum + 1)) + config.minNum;
        const num2 = Math.floor(Math.random() * (config.maxNum - config.minNum + 1)) + config.minNum;
        const operation = config.operations[Math.floor(Math.random() * config.operations.length)];
        
        let answer: number;
        let question: string;
        
        switch (operation) {
            case "+":
                answer = num1 + num2;
                question = `${num1} + ${num2}`;
                break;
            case "-":
                const larger = Math.max(num1, num2);
                const smaller = Math.min(num1, num2);
                answer = larger - smaller;
                question = `${larger} - ${smaller}`;
                break;
            case "*":
                const factor1 = Math.floor(Math.random() * 12) + 1;
                const factor2 = Math.floor(Math.random() * 12) + 1;
                answer = factor1 * factor2;
                question = `${factor1} × ${factor2}`;
                break;
            case "/":
                const divisor = Math.floor(Math.random() * 10) + 2;
                const quotient = Math.floor(Math.random() * 10) + 1;
                const dividend = divisor * quotient;
                answer = quotient;
                question = `${dividend} ÷ ${divisor}`;
                break;
            default:
                answer = num1 + num2;
                question = `${num1} + ${num2}`;
        }

        // Generate wrong options
        const options = new Set<number>([answer]);
        while (options.size < 4) {
            const wrongAnswer = answer + (Math.floor(Math.random() * 20) - 10);
            if (wrongAnswer !== answer && wrongAnswer > 0) {
                options.add(wrongAnswer);
            }
        }

        // Shuffle options
        const shuffledOptions = Array.from(options).sort(() => Math.random() - 0.5);

        return {
            question,
            answer,
            options: shuffledOptions,
        };
    }, []);

    // Start game
    const startGame = useCallback(() => {
        const config = DIFFICULTY_CONFIG[difficulty];
        setGameState("playing");
        setScore(0);
        setStreak(0);
        setTimeLeft(config.timeLimit);
        setCurrentProblem(generateProblem(difficulty));
    }, [difficulty, generateProblem]);

    // Handle answer selection
    const handleAnswer = useCallback((selectedAnswer: number) => {
        if (gameState !== "playing" || !currentProblem) return;

        const config = DIFFICULTY_CONFIG[difficulty];
        
        if (selectedAnswer === currentProblem.answer) {
            // Correct answer
            setScore(prev => prev + config.pointsPerCorrect + streak * 5);
            setStreak(prev => prev + 1);
            setCurrentProblem(generateProblem(difficulty));
        } else {
            // Wrong answer
            setStreak(0);
            setCurrentProblem(generateProblem(difficulty));
        }
    }, [gameState, currentProblem, difficulty, generateProblem, streak]);

    // Timer countdown
    useEffect(() => {
        if (gameState !== "playing" || timeLeft <= 0) {
            if (timeLeft <= 0 && gameState === "playing") {
                setGameState("gameOver");
                setBestScore(prev => Math.max(prev, score));
            }
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [gameState, timeLeft, score]);

    // Format time
    const formatTime = (seconds: number) => {
        return seconds.toString().padStart(2, "0");
    };

    // Calculate percentage
    const timePercentage = gameState === "playing" && DIFFICULTY_CONFIG[difficulty]
        ? (timeLeft / DIFFICULTY_CONFIG[difficulty].timeLimit) * 100
        : 100;

    return (
        <>
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative text-white rounded-full bg-gradient-to-r from-green-600 to-blue-600 p-3 shadow-lg hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-transparent"
                aria-label="Mở Quick Math Game"
            >
                <Trophy size={24} />
            </button>

            {/* Game Modal */}
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
                            className="bg-gradient-to-br from-gray-900 via-green-900 to-gray-900 rounded-2xl shadow-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                        <Trophy className="text-yellow-400" />
                                        Quick Math Challenge
                                    </h2>
                                    <p className="text-gray-400 text-sm mt-1">
                                        Rèn luyện tư duy và tốc độ tính toán
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
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>
                            </div>

                            {/* Help Modal */}
                            <AnimatePresence>
                                {showHelp && (
                                    <motion.div
                                        className="mb-6 bg-blue-500/20 border border-blue-500/50 rounded-xl p-6"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                    >
                                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                            <HelpCircle className="text-blue-400" />
                                            Hướng dẫn chơi
                                        </h3>
                                        <div className="space-y-3 text-gray-300">
                                            <div>
                                                <strong className="text-white">Mục tiêu:</strong> Giải các bài toán càng nhanh càng tốt!
                                            </div>
                                            <div>
                                                <strong className="text-white">Cách chơi:</strong>
                                                <ul className="list-disc list-inside mt-2 ml-2 space-y-1">
                                                    <li>Chọn đáp án đúng cho mỗi câu hỏi</li>
                                                    <li>Trả lời đúng để tăng điểm và combo</li>
                                                    <li>Combo càng cao, điểm bonus càng nhiều</li>
                                                    <li>Thời gian có giới hạn, cố gắng trả lời nhiều nhất có thể!</li>
                                                </ul>
                                            </div>
                                            <div>
                                                <strong className="text-white">Điểm số:</strong>
                                                <ul className="list-disc list-inside mt-2 ml-2 space-y-1">
                                                    <li>Dễ: 10 điểm/câu đúng</li>
                                                    <li>Trung bình: 20 điểm/câu đúng</li>
                                                    <li>Khó: 30 điểm/câu đúng</li>
                                                    <li>Bonus: +5 điểm cho mỗi combo liên tiếp</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Game Stats */}
                            {gameState === "playing" && (
                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    <div className="bg-white/10 rounded-lg p-3 text-center">
                                        <div className="text-2xl font-bold text-white">{score}</div>
                                        <div className="text-xs text-gray-400">Điểm</div>
                                    </div>
                                    <div className="bg-white/10 rounded-lg p-3 text-center">
                                        <div className="text-2xl font-bold text-white flex items-center justify-center gap-1">
                                            <Timer size={20} />
                                            {formatTime(timeLeft)}s
                                        </div>
                                        <div className="text-xs text-gray-400">Thời gian</div>
                                    </div>
                                    <div className="bg-white/10 rounded-lg p-3 text-center">
                                        <div className="text-2xl font-bold text-white">{streak}</div>
                                        <div className="text-xs text-gray-400">Combo</div>
                                    </div>
                                </div>
                            )}

                            {/* Timer Progress Bar */}
                            {gameState === "playing" && (
                                <div className="mb-6">
                                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-green-500 to-yellow-500"
                                            initial={{ width: "100%" }}
                                            animate={{ width: `${timePercentage}%` }}
                                            transition={{ duration: 1, ease: "linear" }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Best Score */}
                            {bestScore > 0 && gameState !== "playing" && (
                                <div className="mb-6 bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-3 text-center">
                                    <div className="text-sm text-gray-400">Điểm cao nhất</div>
                                    <div className="text-3xl font-bold text-yellow-400">{bestScore}</div>
                                </div>
                            )}

                            {/* Difficulty Selector */}
                            {gameState === "idle" && (
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-300 mb-3">
                                        Độ khó:
                                    </label>
                                    <div className="flex gap-2">
                                        {(["easy", "medium", "hard"] as Difficulty[]).map((diff) => {
                                            const config = DIFFICULTY_CONFIG[diff];
                                            return (
                                                <button
                                                    key={diff}
                                                    onClick={() => setDifficulty(diff)}
                                                    className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all text-left ${
                                                        difficulty === diff
                                                            ? "bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg"
                                                            : "bg-white/10 text-gray-300 hover:bg-white/20"
                                                    }`}
                                                >
                                                    <div className="font-bold">
                                                        {diff === "easy" && "Dễ"}
                                                        {diff === "medium" && "Trung bình"}
                                                        {diff === "hard" && "Khó"}
                                                    </div>
                                                    <div className="text-xs opacity-75">
                                                        {config.timeLimit}s • {config.pointsPerCorrect} điểm/câu
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Math Problem */}
                            {gameState === "playing" && currentProblem && (
                                <motion.div
                                    className="mb-6"
                                    key={currentProblem.question}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ type: "spring", stiffness: 200 }}
                                >
                                    <div className="bg-white/10 rounded-xl p-8 text-center mb-4">
                                        <div className="text-5xl font-bold text-white mb-2">
                                            {currentProblem.question} = ?
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        {currentProblem.options.map((option, index) => (
                                            <motion.button
                                                key={index}
                                                onClick={() => handleAnswer(option)}
                                                className="bg-gradient-to-r from-green-600/80 to-blue-600/80 hover:from-green-500 hover:to-blue-500 text-white py-4 px-6 rounded-xl font-bold text-2xl transition-all hover:scale-105 active:scale-95 shadow-lg"
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
                                            Hết thời gian! ⏰
                                        </h3>
                                        <p className="text-gray-300 mb-4">
                                            Điểm số của bạn: <span className="font-bold text-yellow-400 text-3xl">{score}</span>
                                        </p>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <div className="text-gray-400">Combo cao nhất</div>
                                                <div className="text-white font-bold text-xl">{streak}</div>
                                            </div>
                                            <div>
                                                <div className="text-gray-400">Độ khó</div>
                                                <div className="text-white font-bold text-xl">
                                                    {difficulty === "easy" && "Dễ"}
                                                    {difficulty === "medium" && "Trung bình"}
                                                    {difficulty === "hard" && "Khó"}
                                                </div>
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
                                        className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg"
                                    >
                                        <Play size={20} />
                                        Bắt đầu chơi
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => {
                                                setGameState("idle");
                                                setCurrentProblem(null);
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
                                                className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition-all shadow-lg"
                                            >
                                                Chơi tiếp
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

