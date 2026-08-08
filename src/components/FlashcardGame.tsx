"use client";

import Link from "next/link";
import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { motion } from "framer-motion";
import {
    BookOpen,
    Languages,
    LoaderCircle,
    Play,
    RotateCcw,
    Search,
    Sparkles,
    Trophy,
    Volume2,
} from "lucide-react";

import { submitGameRun } from "@/lib/api/game";
import {
    getCategoryLabel,
    VOCABULARY,
    VOCABULARY_CATEGORIES,
    VOCABULARY_LEVELS,
    type VocabularyCategory,
    type VocabularyItem,
    type VocabularyLevel,
} from "@/lib/vocabulary";

type GameState = "idle" | "playing" | "gameOver";
type GameMode = "vi-to-en" | "en-to-vi";
type SyncState = "idle" | "saving" | "saved" | "sign-in" | "error";
type SelectedLevel = VocabularyLevel | "all";
type SelectedCategory = VocabularyCategory | "all";
type LookupState = "idle" | "loading" | "ready" | "error";

interface GameStats {
    totalPlays: number;
    bestScore: number;
    correctAnswers: number;
    totalAnswers: number;
}

interface DictionaryResult {
    word: string;
    phonetic: string;
    audio: string;
    definitions: Array<{
        partOfSpeech: string;
        definition: string;
        example: string;
    }>;
}

const MAX_QUESTIONS = 10;
const STORAGE_KEY = "flashcard_game_stats";
const DEFAULT_STATS: GameStats = {
    totalPlays: 0,
    bestScore: 0,
    correctAnswers: 0,
    totalAnswers: 0,
};

function getStoredStats(): GameStats {
    if (typeof window === "undefined") return DEFAULT_STATS;

    try {
        const saved = window.localStorage.getItem(STORAGE_KEY);

        if (!saved) return DEFAULT_STATS;

        const parsed = JSON.parse(saved) as Partial<GameStats>;

        return {
            totalPlays: Number.isFinite(parsed.totalPlays)
                ? Number(parsed.totalPlays)
                : 0,
            bestScore: Number.isFinite(parsed.bestScore)
                ? Number(parsed.bestScore)
                : 0,
            correctAnswers: Number.isFinite(parsed.correctAnswers)
                ? Number(parsed.correctAnswers)
                : 0,
            totalAnswers: Number.isFinite(parsed.totalAnswers)
                ? Number(parsed.totalAnswers)
                : 0,
        };
    } catch {
        return DEFAULT_STATS;
    }
}

function shuffle<T>(items: T[]) {
    return [...items].sort(() => Math.random() - 0.5);
}

function getSuggestedVocabularyLevel(
    grade: number
): VocabularyLevel {
    if (grade <= 5) return "A1";
    if (grade <= 8) return "A2";
    return "B1";
}

export default function FlashcardGame({
    embedded = false,
    grade = 6,
}: {
    embedded?: boolean;
    grade?: number;
}) {
    const [gameState, setGameState] = useState<GameState>("idle");
    const [gameMode, setGameMode] = useState<GameMode>("vi-to-en");
    const [selectedLevel, setSelectedLevel] =
        useState<SelectedLevel>(() =>
            getSuggestedVocabularyLevel(grade)
        );
    const [selectedCategory, setSelectedCategory] =
        useState<SelectedCategory>("all");
    const [currentWord, setCurrentWord] = useState<VocabularyItem | null>(
        null
    );
    const [options, setOptions] = useState<string[]>([]);
    const [score, setScore] = useState(0);
    const [questionCount, setQuestionCount] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);
    const [streak, setStreak] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [answerLocked, setAnswerLocked] = useState(false);
    const [stats, setStats] = useState<GameStats>(getStoredStats);
    const [syncState, setSyncState] = useState<SyncState>("idle");
    const [lookupInput, setLookupInput] = useState("");
    const [lookupState, setLookupState] = useState<LookupState>("idle");
    const [lookupResult, setLookupResult] =
        useState<DictionaryResult | null>(null);
    const [lookupError, setLookupError] = useState("");

    const statsRef = useRef<GameStats>(stats);
    const correctThisRoundRef = useRef(0);
    const totalThisRoundRef = useRef(0);
    const answerLockedRef = useRef(false);
    const roundFinishedRef = useRef(false);
    const startedAtRef = useRef(0);
    const clientRunIdRef = useRef<string | null>(null);
    const usedWordIdsRef = useRef<Set<string>>(new Set());
    const nextQuestionTimerRef = useRef<number | null>(null);

    const activeVocabulary = useMemo(
        () =>
            VOCABULARY.filter(
                (word) =>
                    (selectedLevel === "all" ||
                        word.level === selectedLevel) &&
                    (selectedCategory === "all" ||
                        word.category === selectedCategory)
            ),
        [selectedCategory, selectedLevel]
    );

    const availableCategories = useMemo(
        () =>
            VOCABULARY_CATEGORIES.filter(
                (category) =>
                    selectedLevel === "all" ||
                    category.level === selectedLevel
            ),
        [selectedLevel]
    );

    useEffect(() => {
        return () => {
            if (nextQuestionTimerRef.current) {
                window.clearTimeout(nextQuestionTimerRef.current);
            }
        };
    }, []);

    const saveStats = useCallback((nextStats: GameStats) => {
        statsRef.current = nextStats;
        setStats(nextStats);

        try {
            window.localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(nextStats)
            );
        } catch {
            // Vẫn hiển thị kết quả trong phiên hiện tại.
        }
    }, []);

    const generateQuestion = useCallback(() => {
        const unusedWords = activeVocabulary.filter(
            (word) => !usedWordIdsRef.current.has(word.id)
        );
        const source = unusedWords.length > 0 ? unusedWords : activeVocabulary;
        const word = source[Math.floor(Math.random() * source.length)];

        if (!word) return null;

        usedWordIdsRef.current.add(word.id);

        const correctAnswer =
            gameMode === "vi-to-en" ? word.english : word.vietnamese;
        const wrongOptions = shuffle(
            activeVocabulary.filter((candidate) => {
                const candidateAnswer =
                    gameMode === "vi-to-en"
                        ? candidate.english
                        : candidate.vietnamese;

                return (
                    candidate.id !== word.id &&
                    candidateAnswer !== correctAnswer
                );
            })
        )
            .slice(0, 3)
            .map((candidate) =>
                gameMode === "vi-to-en"
                    ? candidate.english
                    : candidate.vietnamese
            );

        return {
            word,
            options: shuffle([correctAnswer, ...wrongOptions]),
        };
    }, [activeVocabulary, gameMode]);

    const showNextQuestion = useCallback(() => {
        const question = generateQuestion();

        if (!question) return;

        setCurrentWord(question.word);
        setOptions(question.options);
        setFlipped(false);
        answerLockedRef.current = false;
        setAnswerLocked(false);
    }, [generateQuestion]);

    const finishGame = useCallback(
        (finalScore: number) => {
            if (roundFinishedRef.current) return;

            roundFinishedRef.current = true;
            answerLockedRef.current = true;
            setAnswerLocked(true);

            const previousStats = statsRef.current;
            const nextStats: GameStats = {
                totalPlays: previousStats.totalPlays + 1,
                bestScore: Math.max(previousStats.bestScore, finalScore),
                correctAnswers:
                    previousStats.correctAnswers + correctThisRoundRef.current,
                totalAnswers:
                    previousStats.totalAnswers + totalThisRoundRef.current,
            };

            saveStats(nextStats);
            setGameState("gameOver");

            const clientRunId = clientRunIdRef.current;

            if (!clientRunId || totalThisRoundRef.current === 0) return;

            setSyncState("saving");

            void submitGameRun({
                clientRunId,
                gameType: "flashcard",
                gameMode,
                difficulty:
                    selectedLevel === "all" ? "mixed" : selectedLevel,
                score: finalScore,
                correctAnswers: correctThisRoundRef.current,
                totalAnswers: totalThisRoundRef.current,
                durationSeconds: Math.max(
                    0,
                    Math.floor((Date.now() - startedAtRef.current) / 1000)
                ),
            })
                .then(() => {
                    if (clientRunIdRef.current === clientRunId) {
                        setSyncState("saved");
                    }
                })
                .catch((error: unknown) => {
                    if (clientRunIdRef.current !== clientRunId) return;

                    setSyncState(
                        error instanceof Error &&
                            error.message === "Bạn chưa đăng nhập"
                            ? "sign-in"
                            : "error"
                    );
                });
        },
        [gameMode, saveStats, selectedLevel]
    );

    const startGame = useCallback(() => {
        if (activeVocabulary.length < 4) return;

        if (nextQuestionTimerRef.current) {
            window.clearTimeout(nextQuestionTimerRef.current);
            nextQuestionTimerRef.current = null;
        }

        roundFinishedRef.current = false;
        answerLockedRef.current = false;
        correctThisRoundRef.current = 0;
        totalThisRoundRef.current = 0;
        usedWordIdsRef.current = new Set();
        startedAtRef.current = Date.now();
        clientRunIdRef.current = crypto.randomUUID();

        setScore(0);
        setQuestionCount(0);
        setCorrectCount(0);
        setStreak(0);
        setFlipped(false);
        setAnswerLocked(false);
        setSyncState("idle");
        setGameState("playing");
        showNextQuestion();
    }, [activeVocabulary.length, showNextQuestion]);

    const handleAnswer = useCallback(
        (selectedAnswer: string) => {
            if (
                gameState !== "playing" ||
                !currentWord ||
                answerLockedRef.current ||
                roundFinishedRef.current
            ) {
                return;
            }

            answerLockedRef.current = true;
            setAnswerLocked(true);

            const correctAnswer =
                gameMode === "vi-to-en"
                    ? currentWord.english
                    : currentWord.vietnamese;
            const isCorrect = selectedAnswer === correctAnswer;
            const nextQuestionCount = totalThisRoundRef.current + 1;
            const nextCorrectCount =
                correctThisRoundRef.current + (isCorrect ? 1 : 0);
            const nextStreak = isCorrect ? streak + 1 : 0;
            const nextScore = isCorrect
                ? score + 10 + (nextStreak > 1 ? nextStreak * 2 : 0)
                : score;

            totalThisRoundRef.current = nextQuestionCount;
            correctThisRoundRef.current = nextCorrectCount;
            setQuestionCount(nextQuestionCount);
            setCorrectCount(nextCorrectCount);
            setStreak(nextStreak);
            setScore(nextScore);

            nextQuestionTimerRef.current = window.setTimeout(() => {
                if (nextQuestionCount >= MAX_QUESTIONS) {
                    finishGame(nextScore);
                    return;
                }

                showNextQuestion();
            }, 450);
        },
        [
            currentWord,
            finishGame,
            gameMode,
            gameState,
            score,
            showNextQuestion,
            streak,
        ]
    );

    const lookupWord = useCallback(
        async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();

            const word = lookupInput.trim().toLowerCase();

            if (!word) return;

            setLookupState("loading");
            setLookupError("");
            setLookupResult(null);

            try {
                const response = await fetch(
                    `/api/dictionary/${encodeURIComponent(word)}`
                );
                const data = (await response.json()) as
                    | DictionaryResult
                    | { error?: string };

                if (!response.ok || !("word" in data)) {
                    throw new Error(
                        "error" in data
                            ? data.error
                            : "Không thể tra từ này"
                    );
                }

                setLookupResult(data);
                setLookupState("ready");
            } catch (error) {
                setLookupError(
                    error instanceof Error
                        ? error.message
                        : "Không thể tra từ này"
                );
                setLookupState("error");
            }
        },
        [lookupInput]
    );

    const playPronunciation = useCallback((audioUrl: string) => {
        if (!audioUrl) return;

        const audio = new Audio(audioUrl);
        void audio.play().catch(() => undefined);
    }, []);

    const accuracy =
        stats.totalAnswers > 0
            ? Math.round((stats.correctAnswers / stats.totalAnswers) * 100)
            : 0;

    return (
        <div className="flex h-full w-full flex-col overflow-hidden rounded-3xl bg-black/80 backdrop-blur-3xl">
            {!embedded && (
                <div className="flex-shrink-0 border-b border-white/10 px-5 py-4">
                    <h2 className="flex items-center gap-2 text-xl font-semibold text-white">
                        <BookOpen
                            size={22}
                            className="text-purple-300"
                            aria-hidden="true"
                        />
                        Từ vựng tiếng Anh
                    </h2>
                </div>
            )}

            <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
                {gameState === "idle" && (
                    <div className="mx-auto max-w-2xl">
                        <header className="mb-6 rounded-2xl border border-purple-400/20 bg-gradient-to-br from-purple-500/20 to-cyan-500/10 p-4 sm:p-5">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="flex items-center gap-2 text-sm font-medium text-purple-200">
                                        <Sparkles size={16} aria-hidden="true" />
                                        Tiếng Anh
                                    </p>
                                    <h3 className="mt-2 text-2xl font-semibold text-white">
                                        Học theo cấp độ, không học vẹt
                                    </h3>
                                    <p className="mt-2 max-w-xl text-sm leading-6 text-white/60">
                                        Lớp {grade} bắt đầu từ mức {getSuggestedVocabularyLevel(grade)}. Bộ từ có {VOCABULARY.length} từ A1–B1, chia theo chủ đề; mỗi lượt gồm {MAX_QUESTIONS} câu không lặp từ.
                                    </p>
                                </div>
                                <Languages
                                    size={34}
                                    className="flex-shrink-0 text-purple-200"
                                    aria-hidden="true"
                                />
                            </div>
                        </header>

                        {stats.totalPlays > 0 && (
                            <div className="mb-6 grid grid-cols-3 gap-3 text-center">
                                <MiniStat value={stats.bestScore} label="Điểm cao" />
                                <MiniStat value={stats.totalPlays} label="Lượt chơi" />
                                <MiniStat value={`${accuracy}%`} label="Chính xác" />
                            </div>
                        )}

                        <section className="mb-5">
                            <p className="mb-2 text-sm font-semibold text-white/75">Hướng luyện</p>
                            <div className="grid grid-cols-2 gap-3">
                                <ChoiceButton
                                    active={gameMode === "vi-to-en"}
                                    label="Việt → Anh"
                                    description="Nhớ mặt chữ tiếng Anh"
                                    onClick={() => setGameMode("vi-to-en")}
                                />
                                <ChoiceButton
                                    active={gameMode === "en-to-vi"}
                                    label="Anh → Việt"
                                    description="Hiểu nghĩa nhanh"
                                    onClick={() => setGameMode("en-to-vi")}
                                />
                            </div>
                        </section>

                        <section className="mb-5">
                            <p className="mb-2 text-sm font-semibold text-white/75">Cấp độ</p>
                            <div className="grid grid-cols-4 gap-2">
                                <LevelButton
                                    active={selectedLevel === "all"}
                                    label="Tất cả"
                                    onClick={() => {
                                        setSelectedLevel("all");
                                        setSelectedCategory("all");
                                    }}
                                />
                                {VOCABULARY_LEVELS.map((level) => (
                                    <LevelButton
                                        key={level.id}
                                        active={selectedLevel === level.id}
                                        label={level.id}
                                        title={level.description}
                                        onClick={() => {
                                            setSelectedLevel(level.id);
                                            setSelectedCategory("all");
                                        }}
                                    />
                                ))}
                            </div>
                        </section>

                        <section className="mb-6">
                            <div className="mb-2 flex items-baseline justify-between gap-3">
                                <p className="text-sm font-semibold text-white/75">Chủ đề</p>
                                <span className="text-xs text-cyan-200">{activeVocabulary.length} từ</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <CategoryButton
                                    active={selectedCategory === "all"}
                                    label="Tất cả"
                                    onClick={() => setSelectedCategory("all")}
                                />
                                {availableCategories.map((category) => (
                                    <CategoryButton
                                        key={category.id}
                                        active={selectedCategory === category.id}
                                        label={category.label}
                                        onClick={() => setSelectedCategory(category.id)}
                                    />
                                ))}
                            </div>
                        </section>

                        <button
                            type="button"
                            onClick={startGame}
                            disabled={activeVocabulary.length < 4}
                            className="flex min-h-14 w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-4 text-lg font-bold text-white transition hover:from-purple-400 hover:to-pink-400 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <Play size={24} aria-hidden="true" />
                            Bắt đầu luyện {activeVocabulary.length} từ
                        </button>

                        <section className="mt-7 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                            <div className="flex items-center gap-2">
                                <Search size={18} className="text-cyan-300" aria-hidden="true" />
                                <h3 className="font-semibold text-white">Tra từ bất kỳ</h3>
                            </div>
                            <p className="mt-1 text-sm text-white/50">
                                Lấy phiên âm, audio, định nghĩa và ví dụ từ Free Dictionary.
                            </p>

                            <form className="mt-4 flex gap-2" onSubmit={lookupWord}>
                                <input
                                    value={lookupInput}
                                    onChange={(event) => setLookupInput(event.target.value)}
                                    placeholder="Ví dụ: sustainable"
                                    maxLength={60}
                                    className="min-w-0 flex-1 rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-cyan-300/60"
                                />
                                <button
                                    type="submit"
                                    disabled={lookupState === "loading" || !lookupInput.trim()}
                                    className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-cyan-400 text-black transition hover:bg-cyan-300 disabled:opacity-45"
                                    aria-label="Tra từ"
                                >
                                    {lookupState === "loading" ? (
                                        <LoaderCircle size={20} className="animate-spin" aria-hidden="true" />
                                    ) : (
                                        <Search size={20} aria-hidden="true" />
                                    )}
                                </button>
                            </form>

                            {lookupState === "error" && (
                                <p className="mt-3 text-sm text-red-300">{lookupError}</p>
                            )}

                            {lookupResult && (
                                <div className="mt-4 border-t border-white/10 pt-4">
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                                        <p className="text-xl font-semibold text-white">{lookupResult.word}</p>
                                        {lookupResult.phonetic && <p className="text-sm text-cyan-200">{lookupResult.phonetic}</p>}
                                        {lookupResult.audio && (
                                            <button
                                                type="button"
                                                onClick={() => playPronunciation(lookupResult.audio)}
                                                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white/75 transition hover:bg-white/20"
                                                aria-label={`Nghe phát âm từ ${lookupResult.word}`}
                                            >
                                                <Volume2 size={18} aria-hidden="true" />
                                            </button>
                                        )}
                                    </div>
                                    <ol className="mt-3 space-y-3">
                                        {lookupResult.definitions.map((item, index) => (
                                            <li key={`${item.definition}-${index}`} className="text-sm leading-6 text-white/70">
                                                {item.partOfSpeech && <span className="mr-2 rounded bg-cyan-400/10 px-1.5 py-0.5 text-xs text-cyan-200">{item.partOfSpeech}</span>}
                                                {item.definition}
                                                {item.example && <p className="mt-1 italic text-white/45">“{item.example}”</p>}
                                            </li>
                                        ))}
                                    </ol>
                                </div>
                            )}
                        </section>
                    </div>
                )}

                {gameState === "playing" && currentWord && (
                    <div className="mx-auto flex max-w-md flex-col items-center">
                        <div className="mb-3 flex w-full items-center justify-between text-sm">
                            <p className="text-purple-200">Câu {questionCount + 1}/{MAX_QUESTIONS} · Điểm {score}</p>
                            <p className="text-white/50">Combo {streak}</p>
                        </div>
                        <p className="mb-4 rounded-full bg-purple-400/10 px-3 py-1 text-xs font-medium text-purple-100">
                            {currentWord.level} · {getCategoryLabel(currentWord.category)}
                        </p>
                        <div className="mb-6 mt-1 w-full [perspective:1200px]">
                            <motion.button
                                type="button"
                                className="relative h-52 w-full cursor-pointer [transform-style:preserve-3d] focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-200"
                                onClick={() => setFlipped((value) => !value)}
                                animate={{ rotateY: flipped ? 180 : 0 }}
                                transition={{ duration: 0.55, type: "spring" }}
                                aria-label="Lật thẻ để xem nghĩa"
                            >
                                <span className="absolute inset-0 flex [backface-visibility:hidden] flex-col items-center justify-center rounded-2xl border-4 border-purple-400/50 bg-gradient-to-br from-purple-600/90 to-pink-600/90 p-6">
                                    <span className="mb-2 text-sm text-purple-200">Chạm để lật</span>
                                    <span className="text-center text-3xl font-bold text-white">
                                        {gameMode === "vi-to-en" ? currentWord.vietnamese : currentWord.english}
                                    </span>
                                </span>
                                <span className="absolute inset-0 flex [backface-visibility:hidden] [transform:rotateY(180deg)] flex-col items-center justify-center rounded-2xl border-4 border-cyan-400/50 bg-gradient-to-br from-cyan-600/90 to-purple-600/90 p-6">
                                    <span className="text-center text-3xl font-bold text-white">
                                        {gameMode === "vi-to-en" ? currentWord.english : currentWord.vietnamese}
                                    </span>
                                </span>
                            </motion.button>
                        </div>

                        <div className="grid w-full grid-cols-2 gap-3">
                            {options.map((option) => (
                                <motion.button
                                    key={option}
                                    type="button"
                                    disabled={answerLocked}
                                    onClick={() => handleAnswer(option)}
                                    className="min-h-16 rounded-2xl bg-gradient-to-r from-purple-600/80 to-pink-600/80 px-3 py-4 text-base font-bold text-white transition hover:from-purple-500 hover:to-pink-500 disabled:cursor-not-allowed disabled:opacity-60"
                                    whileHover={answerLocked ? undefined : { scale: 1.02 }}
                                    whileTap={answerLocked ? undefined : { scale: 0.97 }}
                                >
                                    {option}
                                </motion.button>
                            ))}
                        </div>
                    </div>
                )}

                {gameState === "gameOver" && (
                    <div className="mx-auto max-w-md py-8 text-center">
                        <Trophy size={70} className="mx-auto mb-4 text-yellow-400" aria-hidden="true" />
                        <h3 className="text-2xl font-bold text-white">HOÀN THÀNH!</h3>
                        <p className="mt-2 text-4xl font-bold text-yellow-400">{score} ĐIỂM</p>
                        <p className="mt-2 text-sm text-white/55">{correctCount}/{MAX_QUESTIONS} câu đúng</p>

                        <div className="mt-4 min-h-5 text-sm" aria-live="polite">
                            {syncState === "saving" && <p className="text-white/50">Đang lưu điểm lên bảng xếp hạng…</p>}
                            {syncState === "saved" && <p className="text-emerald-300">Điểm đã được lưu vào bảng xếp hạng.</p>}
                            {syncState === "sign-in" && <p className="text-amber-200"><Link href="/login" className="underline underline-offset-4 hover:text-amber-100">Đăng nhập</Link>{" "}để lưu điểm và xuất hiện trên bảng xếp hạng.</p>}
                            {syncState === "error" && <p className="text-red-300">Không thể đồng bộ điểm lúc này.</p>}
                        </div>

                        <button
                            type="button"
                            onClick={startGame}
                            className="mt-6 inline-flex min-h-12 items-center gap-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-3 text-lg font-bold text-white transition hover:from-purple-400 hover:to-pink-400"
                        >
                            <RotateCcw size={22} aria-hidden="true" /> Chơi lại
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

function ChoiceButton({
    active,
    label,
    description,
    onClick,
}: {
    active: boolean;
    label: string;
    description: string;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`min-h-20 rounded-xl border p-3 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-200 ${
                active
                    ? "border-purple-300/60 bg-purple-500/20 text-white"
                    : "border-white/10 bg-white/[0.035] text-white/65 hover:bg-white/[0.08]"
            }`}
        >
            <span className="block font-semibold">{label}</span>
            <span className="mt-1 block text-xs opacity-70">{description}</span>
        </button>
    );
}

function LevelButton({
    active,
    label,
    title,
    onClick,
}: {
    active: boolean;
    label: string;
    title?: string;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            title={title}
            onClick={onClick}
            className={`min-h-11 rounded-xl border px-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-200 ${
                active
                    ? "border-cyan-300/60 bg-cyan-400/15 text-cyan-100"
                    : "border-white/10 bg-white/[0.035] text-white/65 hover:bg-white/[0.08]"
            }`}
        >
            {label}
        </button>
    );
}

function CategoryButton({
    active,
    label,
    onClick,
}: {
    active: boolean;
    label: string;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`min-h-10 rounded-full border px-3 text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-200 ${
                active
                    ? "border-purple-300/60 bg-purple-500/20 text-purple-100"
                    : "border-white/10 bg-white/[0.035] text-white/60 hover:bg-white/[0.08]"
            }`}
        >
            {label}
        </button>
    );
}

function MiniStat({ value, label }: { value: string | number; label: string }) {
    return (
        <div className="rounded-xl border border-white/10 bg-white/[0.035] px-2 py-3">
            <p className="text-lg font-semibold tabular-nums text-white">{value}</p>
            <p className="mt-1 text-[11px] uppercase tracking-wide text-white/45">{label}</p>
        </div>
    );
}
