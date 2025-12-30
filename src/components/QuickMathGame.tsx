// QuickMathGame.tsx - Full file, chữ nhỏ gọn dễ nhìn, ít scroll
"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, RotateCcw, Play, Timer, Flame, Infinity } from "lucide-react";

type GameMode = "timed" | "unlimited";
type Difficulty = "easy" | "medium" | "hard";

interface MathProblem {
    question: string;
    answer: number;
    options: number[];
}

const DIFFICULTY_CONFIG = {
    easy: { timeLimit: 60, pointsPerCorrect: 10 },
    medium: { timeLimit: 45, pointsPerCorrect: 20 },
    hard: { timeLimit: 30, pointsPerCorrect: 30 },
};

const UNLIMITED_QUESTION_COUNT = 20;
const STORAGE_KEY = "quickmath_stats_v3";

interface GameStats {
    totalPlays: number;
    bestScore: number;
    correctAnswers: number;
    totalAnswers: number;
    bestUnlimitedTime?: number;
}

export default function QuickMathGame({ embedded = false }: { embedded?: boolean }) {
    const [gameMode, setGameMode] = useState<GameMode>("timed");
    const [difficulty, setDifficulty] = useState<Difficulty>("medium");
    const [currentProblem, setCurrentProblem] = useState<MathProblem | null>(null);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [streak, setStreak] = useState(0);
    const [questionsAnswered, setQuestionsAnswered] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [stats, setStats] = useState<GameStats>({ totalPlays: 0, bestScore: 0, correctAnswers: 0, totalAnswers: 0 });

    const correctThisRound = useRef(0);
    const totalThisRound = useRef(0);
    const startTime = useRef<number>(0);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) setStats(JSON.parse(saved));
    }, []);

    const saveStats = useCallback((newStats: GameStats) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newStats));
        setStats(newStats);
    }, []);

    const generateProblem = useCallback((diff: Difficulty): MathProblem => {
        const config = DIFFICULTY_CONFIG[diff];
        const minNum = diff === "easy" ? 1 : diff === "medium" ? 10 : 20;
        const maxNum = diff === "easy" ? 20 : diff === "medium" ? 50 : 100;
        const operations = diff === "hard" ? ["+", "-", "*", "/"] : diff === "medium" ? ["+", "-", "*"] : ["+", "-"];
        let num1: number, num2: number, operation: string;
        let question: string = "";
        let answer: number = 0;

        do {
            operation = operations[Math.floor(Math.random() * operations.length)];
            if (operation === "*") {
                num1 = Math.floor(Math.random() * 12) + 1;
                num2 = Math.floor(Math.random() * 12) + 1;
            } else if (operation === "/") {
                num2 = Math.floor(Math.random() * 10) + 2;
                num1 = num2 * (Math.floor(Math.random() * 10) + 1);
            } else {
                num1 = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
                num2 = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
                if (operation === "-") [num1, num2] = [Math.max(num1, num2), Math.min(num1, num2)];
            }

            switch (operation) {
                case "+": answer = num1 + num2; question = `${num1} + ${num2}`; break;
                case "-": answer = num1 - num2; question = `${num1} - ${num2}`; break;
                case "*": answer = num1 * num2; question = `${num1} × ${num2}`; break;
                case "/": answer = num1 / num2; question = `${num1} ÷ ${num2}`; break;
            }
        } while (answer < 0 || !Number.isInteger(answer));

        const options = new Set<number>([answer]);
        while (options.size < 4) {
            const wrong = answer + Math.floor(Math.random() * 20) - 10;
            if (wrong > 0 && wrong !== answer) options.add(wrong);
        }

        return { question, answer, options: Array.from(options).sort(() => Math.random() - 0.5) };
    }, []);

    const startGame = useCallback(() => {
        setScore(0);
        setStreak(0);
        setQuestionsAnswered(0);
        setSelectedOption(null);
        setIsCorrect(null);
        correctThisRound.current = 0;
        totalThisRound.current = 0;

        if (gameMode === "timed") {
            setTimeLeft(DIFFICULTY_CONFIG[difficulty].timeLimit);
            setElapsedTime(0);
        } else {
            setElapsedTime(0);
            startTime.current = Date.now();
        }

        setCurrentProblem(generateProblem(difficulty));
    }, [difficulty, gameMode, generateProblem]);

    const handleAnswer = useCallback((selected: number) => {
        if (!currentProblem) return;
        setSelectedOption(selected);
        const correct = selected === currentProblem.answer;
        setIsCorrect(correct);
        totalThisRound.current += 1;

        if (correct) {
            correctThisRound.current += 1;
            const points = DIFFICULTY_CONFIG[difficulty].pointsPerCorrect + streak * 5;
            setScore(prev => prev + points);
            setStreak(prev => prev + 1);
            setQuestionsAnswered(prev => prev + 1);
            setTimeout(() => {
                setCurrentProblem(generateProblem(difficulty));
                setSelectedOption(null);
                setIsCorrect(null);
            }, 600);
        } else {
            setStreak(0);
        }
    }, [currentProblem, difficulty, streak, generateProblem]);

    useEffect(() => {
        if (gameMode === "timed" && timeLeft > 0 && currentProblem) {
            const id = setInterval(() => setTimeLeft(t => t - 1), 1000);
            return () => clearInterval(id);
        }
        if (gameMode === "unlimited" && currentProblem) {
            const id = setInterval(() => setElapsedTime(Math.floor((Date.now() - startTime.current) / 1000)), 1000);
            return () => clearInterval(id);
        }
    }, [gameMode, timeLeft, currentProblem]);

    const endGame = useCallback(() => {
        const newBestScore = Math.max(stats.bestScore, score);
        let newBestUnlimitedTime = stats.bestUnlimitedTime;
        if (gameMode === "unlimited" && correctThisRound.current === UNLIMITED_QUESTION_COUNT) {
            const timeTaken = elapsedTime;
            if (!newBestUnlimitedTime || timeTaken < newBestUnlimitedTime) newBestUnlimitedTime = timeTaken;
        }
        saveStats({
            totalPlays: stats.totalPlays + 1,
            bestScore: newBestScore,
            correctAnswers: stats.correctAnswers + correctThisRound.current,
            totalAnswers: stats.totalAnswers + totalThisRound.current,
            bestUnlimitedTime: newBestUnlimitedTime,
        });
        setCurrentProblem(null);
    }, [stats, score, gameMode, elapsedTime, saveStats]);

    useEffect(() => {
        if ((gameMode === "timed" && timeLeft <= 0) || (gameMode === "unlimited" && questionsAnswered >= UNLIMITED_QUESTION_COUNT)) endGame();
    }, [timeLeft, questionsAnswered, gameMode, endGame]);

    const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
    const isGameActive = !!currentProblem;
    const isGameOver = (gameMode === "timed" && timeLeft <= 0) || (gameMode === "unlimited" && questionsAnswered >= UNLIMITED_QUESTION_COUNT);

    return (
        <div className="h-full w-full rounded-3xl bg-black/80 backdrop-blur-3xl flex flex-col overflow-hidden">
            <div className="border-b border-cyan-500/30 bg-gradient-to-b from-cyan-500/20 to-transparent p-4">
                <h2 className="text-2xl font-bold text-cyan-300 flex items-center gap-2">
                    <motion.span
                        animate={{ rotate: [0, 15, -15, 0] }}
                        transition={{ repeat: 999999, duration: 3 }}
                    >
                        ⚡
                    </motion.span>
                    QUICK MATH
                </h2>
            </div>

            <div className="flex-1 p-4 overflow-y-auto">
                {!isGameActive ? (
                    <>
                        {stats.totalPlays > 0 && (
                            <div className="grid grid-cols-3 gap-3 mb-4">
                                <div className="bg-white/10 rounded-xl p-3 text-center"><div className="text-lg font-bold text-cyan-300">{stats.bestScore}</div><div className="text-xs text-cyan-400">ĐIỂM CAO</div></div>
                                <div className="bg-white/10 rounded-xl p-3 text-center"><div className="text-lg font-bold text-cyan-300">{stats.totalPlays}</div><div className="text-xs text-cyan-400">LẦN CHƠI</div></div>
                                <div className="bg-white/10 rounded-xl p-3 text-center"><div className="text-lg font-bold text-cyan-300">{Math.round((stats.correctAnswers / stats.totalAnswers || 0) * 100)}%</div><div className="text-xs text-cyan-400">CHÍNH XÁC</div></div>
                            </div>
                        )}

                        <div className="space-y-4 mb-6">
                            <div>
                                <h3 className="text-base font-bold text-cyan-300 mb-2">CHẾ ĐỘ</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <button onClick={() => setGameMode("timed")} className={`p-4 rounded-xl text-base font-bold ${gameMode === "timed" ? "bg-gradient-to-r from-orange-500 to-red-600 text-white" : "bg-white/10 text-cyan-300"}`}><Timer size={24} className="mx-auto mb-1" />THỜI GIAN</button>
                                    <button onClick={() => setGameMode("unlimited")} className={`p-4 rounded-xl text-base font-bold ${gameMode === "unlimited" ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white" : "bg-white/10 text-cyan-300"}`}><Infinity size={24} className="mx-auto mb-1" />20 CÂU</button>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-base font-bold text-cyan-300 mb-2">ĐỘ KHÓ</h3>
                                <div className="grid grid-cols-3 gap-3">
                                    {(["easy", "medium", "hard"] as const).map(d => (
                                        <button key={d} onClick={() => setDifficulty(d)} className={`p-4 rounded-xl text-base font-bold ${difficulty === d ? "bg-gradient-to-r from-cyan-500 to-emerald-500 text-white" : "bg-white/10 text-cyan-300"}`}>
                                            {d === "easy" ? "DỄ" : d === "medium" ? "TRUNG BÌNH" : "KHÓ"}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <button onClick={startGame} className="w-full py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white text-lg font-bold flex items-center justify-center gap-3">
                            <Play size={28} /> BẮT ĐẦU
                        </button>
                    </>
                ) : !isGameOver ? (
                    <>
                        <div className="grid grid-cols-3 gap-3 mb-4">
                            <div className="bg-white/10 rounded-xl p-3 text-center"><div className="text-2xl font-bold text-cyan-300">{score}</div><div className="text-xs text-cyan-400">ĐIỂM</div></div>
                            <div className="bg-white/10 rounded-xl p-3 text-center"><div className="text-2xl font-bold text-cyan-300">{gameMode === "timed" ? timeLeft : formatTime(elapsedTime)}</div><div className="text-xs text-cyan-400">{gameMode === "timed" ? "GIÂY" : "THỜI GIAN"}</div></div>
                            <div className="bg-white/10 rounded-xl p-3 text-center flex items-center justify-center gap-2">{streak > 0 && <Flame size={24} className="text-orange-400" />} <div className="text-2xl font-bold text-cyan-300">{streak}</div><div className="text-xs text-cyan-400">COMBO</div></div>
                        </div>

                        <motion.div key={currentProblem?.question} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
                            <div className="bg-white/10 rounded-2xl p-5 text-center"><h3 className="text-3xl font-bold text-white">{currentProblem?.question} = ?</h3></div>
                        </motion.div>

                        <div className="grid grid-cols-2 gap-3">
                            {currentProblem?.options.map(opt => {
                                const sel = selectedOption === opt;
                                const correct = isCorrect && sel;
                                const wrong = isCorrect === false && sel;
                                return (
                                    <motion.button
                                        key={opt}
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => handleAnswer(opt)}
                                        className={`py-5 text-2xl font-bold rounded-2xl text-white ${correct ? "bg-gradient-to-r from-green-500 to-emerald-500" : wrong ? "bg-red-600" : sel ? "bg-purple-600" : "bg-gradient-to-r from-cyan-600 to-indigo-600"}`}
                                    >
                                        {opt}
                                    </motion.button>
                                );
                            })}
                        </div>

                        <button onClick={endGame} className="mt-6 w-full py-3 rounded-xl bg-red-600/80 text-white text-base font-bold">DỪNG CHƠI</button>
                    </>
                ) : (
                    <div className="text-center py-6">
                        <Trophy size={70} className="text-yellow-400 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-white mb-2">{gameMode === "timed" ? "HẾT GIỜ!" : "HOÀN THÀNH!"}</h3>
                        <p className="text-4xl font-bold text-yellow-400 mb-6">{score} ĐIỂM</p>
                        <button onClick={startGame} className="py-4 px-8 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xl font-bold">CHƠI LẠI</button>
                    </div>
                )}
            </div>
        </div>
    );
}