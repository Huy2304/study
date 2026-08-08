"use client";

import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    CalendarDays,
    CheckCircle2,
    Flame,
    Infinity,
    Keyboard,
    Lightbulb,
    Play,
    RotateCcw,
    Square,
    Timer,
    Trophy,
    XCircle,
} from "lucide-react";

import { submitGameRun } from "@/lib/api/game";
import {
    createDailyChallenge,
    DAILY_CHALLENGE_QUESTION_COUNT,
    generateMathProblem,
    getChallengeDate,
    getDailyChallengeGameMode,
    type MathDifficulty,
    type MathProblem,
} from "@/lib/math-challenge";

type GameMode = "timed" | "practice" | "daily";
type GameState = "idle" | "playing" | "gameOver";
type EndReason = "time" | "completed" | "stopped";
type SyncState =
    | "idle"
    | "saving"
    | "saved"
    | "already-played"
    | "sign-in"
    | "error";

interface GameStats {
    totalPlays: number;
    bestScore: number;
    correctAnswers: number;
    totalAnswers: number;
    bestUnlimitedTime?: number;
}

interface Mistake {
    problem: MathProblem;
    selectedAnswer: number;
}

interface QuickMathGameProps {
    embedded?: boolean;
    grade?: number;
}

const DIFFICULTY_CONFIG = {
    easy: {
        label: "Dễ",
        timeLimit: 60,
        pointsPerCorrect: 10,
    },
    medium: {
        label: "Trung bình",
        timeLimit: 45,
        pointsPerCorrect: 20,
    },
    hard: {
        label: "Khó",
        timeLimit: 30,
        pointsPerCorrect: 30,
    },
} as const;

const DIFFICULTIES: MathDifficulty[] = [
    "easy",
    "medium",
    "hard",
];
const PRACTICE_QUESTION_COUNT = 20;
const STORAGE_KEY = "quickmath_stats_v4";
const LEGACY_STORAGE_KEY = "quickmath_stats_v3";
const ANSWER_FEEDBACK_TIME = 700;

const DEFAULT_STATS: GameStats = {
    totalPlays: 0,
    bestScore: 0,
    correctAnswers: 0,
    totalAnswers: 0,
};

function moveDifficulty(
    difficulty: MathDifficulty,
    direction: 1 | -1
) {
    const currentIndex = DIFFICULTIES.indexOf(difficulty);
    const nextIndex = Math.min(
        DIFFICULTIES.length - 1,
        Math.max(0, currentIndex + direction)
    );

    return DIFFICULTIES[nextIndex];
}

function getSuggestedDifficulty(grade: number): MathDifficulty {
    if (grade <= 3) return "easy";
    if (grade <= 8) return "medium";
    return "hard";
}

export default function QuickMathGame({
    embedded = false,
    grade = 6,
}: QuickMathGameProps) {
    const [gameState, setGameState] =
        useState<GameState>("idle");
    const [gameMode, setGameMode] =
        useState<GameMode>("timed");
    const [difficulty, setDifficulty] =
        useState<MathDifficulty>(() => getSuggestedDifficulty(grade));
    const [activeDifficulty, setActiveDifficulty] =
        useState<MathDifficulty>("medium");
    const [currentProblem, setCurrentProblem] =
        useState<MathProblem | null>(null);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [streak, setStreak] = useState(0);
    const [questionsAnswered, setQuestionsAnswered] = useState(0);
    const [questionLimit, setQuestionLimit] = useState<number | null>(
        null
    );
    const [selectedOption, setSelectedOption] =
        useState<number | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [answerLocked, setAnswerLocked] = useState(false);
    const [endReason, setEndReason] =
        useState<EndReason>("completed");
    const [stats, setStats] =
        useState<GameStats>(DEFAULT_STATS);
    const [syncState, setSyncState] =
        useState<SyncState>("idle");
    const [roundSummary, setRoundSummary] = useState({
        correctAnswers: 0,
        totalAnswers: 0,
    });
    const [mistakes, setMistakes] = useState<Mistake[]>([]);
    const [isReviewRound, setIsReviewRound] = useState(false);
    const [adaptationMessage, setAdaptationMessage] = useState("");
    const [dailyChallengeDate, setDailyChallengeDate] = useState("");

    const statsRef = useRef<GameStats>(DEFAULT_STATS);
    const correctThisRound = useRef(0);
    const totalThisRound = useRef(0);
    const wrongStreakRef = useRef(0);
    const startTime = useRef(0);
    const roundEndedRef = useRef(false);
    const isReviewRoundRef = useRef(false);
    const reviewQueueRef = useRef<MathProblem[]>([]);
    const dailyChallengeRef = useRef<MathProblem[]>([]);
    const clientRunIdRef = useRef<string | null>(null);
    const nextQuestionTimerRef =
        useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        try {
            const saved =
                localStorage.getItem(STORAGE_KEY) ??
                localStorage.getItem(LEGACY_STORAGE_KEY);

            if (!saved) return;

            const parsed = JSON.parse(saved) as GameStats;
            const safeStats: GameStats = {
                totalPlays: Number.isFinite(parsed.totalPlays)
                    ? parsed.totalPlays
                    : 0,
                bestScore: Number.isFinite(parsed.bestScore)
                    ? parsed.bestScore
                    : 0,
                correctAnswers: Number.isFinite(parsed.correctAnswers)
                    ? parsed.correctAnswers
                    : 0,
                totalAnswers: Number.isFinite(parsed.totalAnswers)
                    ? parsed.totalAnswers
                    : 0,
                bestUnlimitedTime: Number.isFinite(
                    parsed.bestUnlimitedTime
                )
                    ? parsed.bestUnlimitedTime
                    : undefined,
            };

            statsRef.current = safeStats;
            // eslint-disable-next-line react-hooks/set-state-in-effect -- Hydrate client-only progress after mount.
            setStats(safeStats);
        } catch {
            statsRef.current = DEFAULT_STATS;
        }
    }, []);

    useEffect(() => {
        return () => {
            if (nextQuestionTimerRef.current) {
                clearTimeout(nextQuestionTimerRef.current);
            }
        };
    }, []);

    const saveStats = useCallback((newStats: GameStats) => {
        statsRef.current = newStats;
        setStats(newStats);

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newStats));
        } catch {
            // Game vẫn hoạt động khi localStorage bị chặn.
        }
    }, []);

    const finishGame = useCallback(
        (reason: EndReason, finalScore: number = score) => {
            if (
                gameState !== "playing" ||
                roundEndedRef.current
            ) {
                return;
            }

            roundEndedRef.current = true;

            if (nextQuestionTimerRef.current) {
                clearTimeout(nextQuestionTimerRef.current);
                nextQuestionTimerRef.current = null;
            }

            const wasReviewRound = isReviewRoundRef.current;

            if (!wasReviewRound) {
                const previousStats = statsRef.current;
                let bestUnlimitedTime = previousStats.bestUnlimitedTime;

                if (
                    gameMode === "practice" &&
                    reason === "completed" &&
                    (!bestUnlimitedTime ||
                        elapsedTime < bestUnlimitedTime)
                ) {
                    bestUnlimitedTime = elapsedTime;
                }

                saveStats({
                    totalPlays: previousStats.totalPlays + 1,
                    bestScore: Math.max(
                        previousStats.bestScore,
                        finalScore
                    ),
                    correctAnswers:
                        previousStats.correctAnswers +
                        correctThisRound.current,
                    totalAnswers:
                        previousStats.totalAnswers +
                        totalThisRound.current,
                    bestUnlimitedTime,
                });
            }

            setRoundSummary({
                correctAnswers: correctThisRound.current,
                totalAnswers: totalThisRound.current,
            });

            const shouldSync =
                !wasReviewRound &&
                totalThisRound.current > 0 &&
                (gameMode !== "daily" || reason === "completed");
            const clientRunId = clientRunIdRef.current;

            if (clientRunId && shouldSync) {
                const durationSeconds =
                    gameMode === "timed"
                        ? Math.max(
                              0,
                              DIFFICULTY_CONFIG[difficulty]
                                  .timeLimit - timeLeft
                          )
                        : elapsedTime;

                setSyncState("saving");

                void submitGameRun({
                    clientRunId,
                    gameType: "quick-math",
                    gameMode:
                        gameMode === "daily"
                            ? getDailyChallengeGameMode(
                                  dailyChallengeDate
                              )
                            : gameMode,
                    difficulty:
                        gameMode === "daily"
                            ? "mixed"
                            : difficulty,
                    score: finalScore,
                    correctAnswers: correctThisRound.current,
                    totalAnswers: totalThisRound.current,
                    durationSeconds,
                })
                    .then((result) => {
                        if (clientRunIdRef.current === clientRunId) {
                            setSyncState(
                                result.dailyAlreadyPlayed
                                    ? "already-played"
                                    : "saved"
                            );
                        }
                    })
                    .catch((error: unknown) => {
                        if (clientRunIdRef.current !== clientRunId) {
                            return;
                        }

                        setSyncState(
                            error instanceof Error &&
                                error.message === "Bạn chưa đăng nhập"
                                ? "sign-in"
                                : "error"
                        );
                    });
            }

            setEndReason(reason);
            setAnswerLocked(false);
            setCurrentProblem(null);
            setGameState("gameOver");
        },
        [
            dailyChallengeDate,
            difficulty,
            elapsedTime,
            gameMode,
            gameState,
            saveStats,
            score,
            timeLeft,
        ]
    );

    const startGame = useCallback(
        (reviewProblems?: MathProblem[]) => {
            if (nextQuestionTimerRef.current) {
                clearTimeout(nextQuestionTimerRef.current);
                nextQuestionTimerRef.current = null;
            }

            const startsReview = Boolean(reviewProblems?.length);
            const challengeDate = getChallengeDate();
            const dailyProblems =
                gameMode === "daily"
                    ? createDailyChallenge(challengeDate)
                    : [];

            reviewQueueRef.current = reviewProblems ?? [];
            dailyChallengeRef.current = dailyProblems;
            isReviewRoundRef.current = startsReview;
            roundEndedRef.current = false;
            clientRunIdRef.current = crypto.randomUUID();
            correctThisRound.current = 0;
            totalThisRound.current = 0;
            wrongStreakRef.current = 0;

            setScore(0);
            setStreak(0);
            setQuestionsAnswered(0);
            setSelectedOption(null);
            setIsCorrect(null);
            setAnswerLocked(false);
            setEndReason("completed");
            setSyncState("idle");
            setRoundSummary({ correctAnswers: 0, totalAnswers: 0 });
            setMistakes([]);
            setIsReviewRound(startsReview);
            setAdaptationMessage("");
            setDailyChallengeDate(challengeDate);

            if (startsReview) {
                const firstProblem = reviewProblems?.[0] ?? null;
                setQuestionLimit(reviewProblems?.length ?? 0);
                setActiveDifficulty(firstProblem?.difficulty ?? difficulty);
                setCurrentProblem(firstProblem);
            } else if (gameMode === "daily") {
                setQuestionLimit(DAILY_CHALLENGE_QUESTION_COUNT);
                setActiveDifficulty(dailyProblems[0].difficulty);
                setCurrentProblem(dailyProblems[0]);
            } else {
                setQuestionLimit(
                    gameMode === "practice"
                        ? PRACTICE_QUESTION_COUNT
                        : null
                );
                setActiveDifficulty(difficulty);
                setCurrentProblem(
                    generateMathProblem(
                        difficulty,
                        Math.random,
                        grade
                    )
                );
            }

            if (gameMode === "timed" && !startsReview) {
                setTimeLeft(DIFFICULTY_CONFIG[difficulty].timeLimit);
            } else {
                setTimeLeft(0);
            }

            setElapsedTime(0);
            startTime.current = Date.now();
            setGameState("playing");
        },
        [difficulty, gameMode, grade]
    );

    useEffect(() => {
        if (
            gameState !== "playing" ||
            gameMode !== "timed" ||
            isReviewRound
        ) {
            return;
        }

        const timerId = window.setInterval(() => {
            setTimeLeft((previous) => Math.max(0, previous - 1));
        }, 1_000);

        return () => window.clearInterval(timerId);
    }, [gameMode, gameState, isReviewRound]);

    useEffect(() => {
        if (
            gameState === "playing" &&
            gameMode === "timed" &&
            !isReviewRound &&
            timeLeft === 0
        ) {
            finishGame("time");
        }
    }, [
        finishGame,
        gameMode,
        gameState,
        isReviewRound,
        timeLeft,
    ]);

    useEffect(() => {
        if (
            gameState !== "playing" ||
            (gameMode === "timed" && !isReviewRound)
        ) {
            return;
        }

        const timerId = window.setInterval(() => {
            setElapsedTime(
                Math.floor((Date.now() - startTime.current) / 1_000)
            );
        }, 250);

        return () => window.clearInterval(timerId);
    }, [gameMode, gameState, isReviewRound]);

    const handleAnswer = useCallback(
        (selectedAnswer: number) => {
            if (
                gameState !== "playing" ||
                !currentProblem ||
                answerLocked ||
                roundEndedRef.current
            ) {
                return;
            }

            setAnswerLocked(true);
            setSelectedOption(selectedAnswer);

            const correct = selectedAnswer === currentProblem.answer;
            const nextQuestionCount = totalThisRound.current + 1;
            const currentRoundIsReview = isReviewRoundRef.current;
            let nextScore = score;
            let nextDifficulty = activeDifficulty;

            setIsCorrect(correct);
            totalThisRound.current = nextQuestionCount;
            setQuestionsAnswered(nextQuestionCount);

            if (correct) {
                const nextStreak = streak + 1;
                const earnedPoints =
                    DIFFICULTY_CONFIG[currentProblem.difficulty]
                        .pointsPerCorrect +
                    Math.max(0, nextStreak - 1) * 5;

                correctThisRound.current += 1;
                nextScore = score + earnedPoints;
                wrongStreakRef.current = 0;

                if (
                    !currentRoundIsReview &&
                    gameMode !== "daily" &&
                    nextStreak % 3 === 0 &&
                    activeDifficulty !== "hard"
                ) {
                    nextDifficulty = moveDifficulty(
                        activeDifficulty,
                        1
                    );
                    setAdaptationMessage(
                        `3 câu đúng liên tiếp — lên mức ${DIFFICULTY_CONFIG[nextDifficulty].label}`
                    );
                } else {
                    setAdaptationMessage("");
                }

                setScore(nextScore);
                setStreak(nextStreak);
            } else {
                wrongStreakRef.current += 1;
                setStreak(0);
                setMistakes((previous) => [
                    ...previous,
                    { problem: currentProblem, selectedAnswer },
                ]);

                if (
                    !currentRoundIsReview &&
                    gameMode !== "daily" &&
                    wrongStreakRef.current >= 2 &&
                    activeDifficulty !== "easy"
                ) {
                    nextDifficulty = moveDifficulty(
                        activeDifficulty,
                        -1
                    );
                    wrongStreakRef.current = 0;
                    setAdaptationMessage(
                        `Cùng ôn lại nhé — về mức ${DIFFICULTY_CONFIG[nextDifficulty].label}`
                    );
                } else {
                    setAdaptationMessage("");
                }
            }

            setActiveDifficulty(nextDifficulty);

            nextQuestionTimerRef.current = setTimeout(() => {
                if (roundEndedRef.current) return;

                const reachedLimit =
                    questionLimit !== null &&
                    nextQuestionCount >= questionLimit;

                if (reachedLimit) {
                    finishGame("completed", nextScore);
                    return;
                }

                const nextProblem = currentRoundIsReview
                    ? reviewQueueRef.current[nextQuestionCount]
                    : gameMode === "daily"
                      ? dailyChallengeRef.current[nextQuestionCount]
                      : generateMathProblem(
                            nextDifficulty,
                            Math.random,
                            grade
                        );

                setCurrentProblem(nextProblem ?? null);
                setSelectedOption(null);
                setIsCorrect(null);
                setAnswerLocked(false);
            }, ANSWER_FEEDBACK_TIME);
        },
        [
            activeDifficulty,
            answerLocked,
            currentProblem,
            finishGame,
            gameMode,
            grade,
            gameState,
            questionLimit,
            score,
            streak,
        ]
    );

    useEffect(() => {
        if (
            gameState !== "playing" ||
            answerLocked ||
            !currentProblem
        ) {
            return;
        }

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.repeat || !/^[1-4]$/.test(event.key)) {
                return;
            }

            const option = currentProblem.options[Number(event.key) - 1];

            if (option === undefined) return;

            event.preventDefault();
            handleAnswer(option);
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [answerLocked, currentProblem, gameState, handleAnswer]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        return `${minutes}:${remainingSeconds
            .toString()
            .padStart(2, "0")}`;
    };

    const accuracy =
        stats.totalAnswers > 0
            ? Math.round(
                  (stats.correctAnswers / stats.totalAnswers) * 100
              )
            : 0;
    const roundAccuracy =
        roundSummary.totalAnswers > 0
            ? Math.round(
                  (roundSummary.correctAnswers /
                      roundSummary.totalAnswers) *
                      100
              )
            : 0;
    const progress =
        questionLimit !== null
            ? Math.min(
                  100,
                  (questionsAnswered / questionLimit) * 100
              )
            : Math.min(
                  100,
                  (timeLeft /
                      DIFFICULTY_CONFIG[difficulty].timeLimit) *
                      100
              );
    const resultTitle = isReviewRound
        ? "Đã luyện lại"
        : endReason === "time"
          ? "Hết giờ"
          : endReason === "stopped"
            ? "Đã dừng"
            : "Hoàn thành";

    return (
        <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl bg-white/[0.035]">
            {!embedded && (
                <div className="flex-shrink-0 border-b border-white/10 px-5 py-4">
                    <h2 className="flex items-center gap-2 text-xl font-semibold text-white">
                        <span aria-hidden="true">⚡</span>
                        Toán học
                    </h2>
                </div>
            )}

            <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
                {gameState === "idle" && (
                    <div className="mx-auto max-w-2xl">
                        {stats.totalPlays > 0 && (
                            <div className="mb-6 grid grid-cols-3 gap-3">
                                <StatCard
                                    value={stats.bestScore}
                                    label="Điểm cao"
                                />
                                <StatCard
                                    value={stats.totalPlays}
                                    label="Lần chơi"
                                />
                                <StatCard
                                    value={`${accuracy}%`}
                                    label="Chính xác"
                                />
                            </div>
                        )}

                        <p className="mb-5 text-sm text-cyan-100/75">
                            Lớp {grade} · mức khởi đầu đề xuất: {" "}
                            {DIFFICULTY_CONFIG[
                                getSuggestedDifficulty(grade)
                            ].label}
                        </p>

                        <section className="mb-6">
                            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/55">
                                Chế độ chơi
                            </h3>

                            <div className="grid gap-3 sm:grid-cols-3">
                                <ModeButton
                                    active={gameMode === "timed"}
                                    title="Thời gian"
                                    description="Ghi điểm trước khi hết giờ"
                                    icon={<Timer size={23} />}
                                    onClick={() => setGameMode("timed")}
                                />
                                <ModeButton
                                    active={gameMode === "practice"}
                                    title="20 câu"
                                    description="Làm đủ 20 câu, có tính thời gian"
                                    icon={<Infinity size={23} />}
                                    onClick={() => setGameMode("practice")}
                                />
                                <ModeButton
                                    active={gameMode === "daily"}
                                    title="Thử thách ngày"
                                    description="10 câu chung, bảng xếp hạng riêng"
                                    icon={<CalendarDays size={23} />}
                                    onClick={() => setGameMode("daily")}
                                />
                            </div>
                        </section>

                        {gameMode === "daily" ? (
                            <div className="mb-7 rounded-2xl border border-amber-300/20 bg-amber-300/[0.07] p-4 text-sm leading-6 text-amber-50/80">
                                <p className="font-semibold text-amber-200">
                                    Đề ngày {getChallengeDate()}
                                </p>
                                <p className="mt-1">
                                    Mọi người đều nhận cùng 10 câu. Hoàn thành
                                    để ghi tên vào bảng xếp hạng ngày.
                                </p>
                                <Link
                                    href="/bang-xep-hang?tab=daily"
                                    className="mt-2 inline-flex font-medium text-cyan-200 underline underline-offset-4 hover:text-cyan-100"
                                >
                                    Xem bảng hôm nay
                                </Link>
                            </div>
                        ) : (
                            <section className="mb-7">
                                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/55">
                                    Mức bắt đầu
                                </h3>
                                <p className="mb-3 text-xs leading-5 text-white/40">
                                    Đúng 3 câu liên tiếp sẽ tăng mức; sai 2
                                    câu liên tiếp sẽ giảm nhẹ để bạn học vừa
                                    sức.
                                </p>
                                <div className="grid grid-cols-3 gap-3">
                                    {DIFFICULTIES.map((level) => (
                                        <button
                                            key={level}
                                            type="button"
                                            onClick={() =>
                                                setDifficulty(level)
                                            }
                                            className={`min-h-12 rounded-xl border px-3 py-3 text-sm font-semibold transition ${
                                                difficulty === level
                                                    ? "border-cyan-400/60 bg-cyan-500/15 text-cyan-200"
                                                    : "border-white/10 bg-white/[0.04] text-white/60 hover:bg-white/[0.08]"
                                            }`}
                                        >
                                            {
                                                DIFFICULTY_CONFIG[level]
                                                    .label
                                            }
                                        </button>
                                    ))}
                                </div>
                            </section>
                        )}

                        <button
                            type="button"
                            onClick={() => startGame()}
                            className="flex w-full items-center justify-center gap-3 rounded-xl bg-cyan-500 py-4 text-base font-semibold text-black transition hover:bg-cyan-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                        >
                            <Play size={22} />
                            {gameMode === "daily"
                                ? "Bắt đầu thử thách"
                                : "Bắt đầu"}
                        </button>
                    </div>
                )}

                {gameState === "playing" && currentProblem && (
                    <div className="mx-auto max-w-2xl">
                        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                            <StatCard value={score} label="Điểm" />
                            <StatCard
                                value={
                                    gameMode === "timed" &&
                                    !isReviewRound
                                        ? timeLeft
                                        : formatTime(elapsedTime)
                                }
                                label={
                                    gameMode === "timed" &&
                                    !isReviewRound
                                        ? "Giây"
                                        : "Thời gian"
                                }
                            />
                            <StatCard
                                value={streak}
                                label="Combo"
                                icon={
                                    streak > 1 ? (
                                        <Flame
                                            size={17}
                                            className="text-orange-300"
                                        />
                                    ) : undefined
                                }
                            />
                            <StatCard
                                value={
                                    questionLimit !== null
                                        ? `${questionsAnswered}/${questionLimit}`
                                        : questionsAnswered
                                }
                                label="Số câu"
                            />
                        </div>

                        <div className="mb-3 flex items-center justify-between text-xs text-white/45">
                            <span>
                                {isReviewRound
                                    ? "Đang luyện lại câu sai"
                                    : gameMode === "daily"
                                      ? "Thử thách ngày · đề chung cho mọi người"
                                      : `Mức hiện tại: ${DIFFICULTY_CONFIG[activeDifficulty].label}`}
                            </span>
                            {!isReviewRound && gameMode !== "daily" && (
                                <span className="hidden items-center gap-1 sm:inline-flex">
                                    <Keyboard size={13} /> 1–4 để chọn
                                </span>
                            )}
                        </div>

                        <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-white/10">
                            <div
                                className="h-full rounded-full bg-cyan-400 transition-[width] duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>

                        <motion.div
                            key={currentProblem.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-5 rounded-2xl border border-white/10 bg-white/[0.055] px-5 py-8 text-center"
                        >
                            <p className="mb-2 text-sm text-white/45">
                                Chọn đáp án đúng
                            </p>
                            <h3 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                                {currentProblem.question}
                            </h3>
                        </motion.div>

                        <div className="grid grid-cols-2 gap-3">
                            {currentProblem.options.map((option, index) => {
                                const correctOption =
                                    answerLocked &&
                                    option === currentProblem.answer;
                                const wrongSelected =
                                    answerLocked &&
                                    option === selectedOption &&
                                    option !== currentProblem.answer;
                                const inactiveOption =
                                    answerLocked &&
                                    !correctOption &&
                                    !wrongSelected;

                                return (
                                    <motion.button
                                        key={option}
                                        type="button"
                                        disabled={answerLocked}
                                        aria-keyshortcuts={`${index + 1}`}
                                        onClick={() => handleAnswer(option)}
                                        whileTap={
                                            answerLocked
                                                ? undefined
                                                : { scale: 0.97 }
                                        }
                                        className={`relative min-h-20 rounded-2xl border px-4 py-5 text-2xl font-bold text-white transition ${
                                            correctOption
                                                ? "border-emerald-400 bg-emerald-600"
                                                : wrongSelected
                                                  ? "border-red-400 bg-red-600"
                                                  : inactiveOption
                                                    ? "border-white/5 bg-white/[0.025] text-white/30"
                                                    : "border-white/10 bg-white/[0.075] hover:border-cyan-400/50 hover:bg-cyan-500/15"
                                        }`}
                                    >
                                        <span className="absolute left-3 top-3 text-xs font-medium text-white/35">
                                            {index + 1}
                                        </span>
                                        {option}
                                        {correctOption && (
                                            <CheckCircle2
                                                size={19}
                                                className="absolute right-3 top-3"
                                            />
                                        )}
                                        {wrongSelected && (
                                            <XCircle
                                                size={19}
                                                className="absolute right-3 top-3"
                                            />
                                        )}
                                    </motion.button>
                                );
                            })}
                        </div>

                        {answerLocked && (
                            <div
                                className={`mt-4 rounded-xl px-4 py-3 text-center text-sm font-medium ${
                                    isCorrect
                                        ? "bg-emerald-400/10 text-emerald-300"
                                        : "bg-red-400/10 text-red-200"
                                }`}
                            >
                                <p>
                                    {isCorrect
                                        ? "Chính xác"
                                        : `Đáp án đúng: ${currentProblem.answer}`}
                                </p>
                                {!isCorrect && (
                                    <p className="mt-1 text-xs font-normal text-red-100/75">
                                        {currentProblem.explanation}
                                    </p>
                                )}
                                {adaptationMessage && (
                                    <p className="mt-1 text-xs font-normal text-cyan-100/85">
                                        {adaptationMessage}
                                    </p>
                                )}
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={() => finishGame("stopped")}
                            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] py-3 text-sm font-medium text-white/60 transition hover:bg-red-500/10 hover:text-red-300"
                        >
                            <Square size={16} />
                            Dừng chơi
                        </button>
                    </div>
                )}

                {gameState === "gameOver" && (
                    <div className="mx-auto flex min-h-full max-w-xl flex-col items-center justify-center py-8 text-center">
                        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-500/15">
                            <Trophy size={42} className="text-yellow-300" />
                        </div>
                        <p className="text-sm font-medium uppercase tracking-wider text-white/45">
                            {resultTitle}
                        </p>
                        <h3 className="mt-2 text-4xl font-bold text-white">
                            {score} điểm
                        </h3>

                        {syncState === "saving" && (
                            <p className="mt-3 text-sm text-white/50">
                                Đang lưu điểm lên bảng xếp hạng…
                            </p>
                        )}
                        {syncState === "saved" && (
                            <p className="mt-3 text-sm text-emerald-300">
                                {gameMode === "daily"
                                    ? "Thành tích đã vào bảng thử thách hôm nay."
                                    : "Điểm đã được lưu vào bảng xếp hạng."}
                            </p>
                        )}
                        {syncState === "already-played" && (
                            <p className="mt-3 text-sm text-amber-200">
                                Thành tích thử thách hôm nay của bạn đã được
                                ghi nhận trước đó.
                            </p>
                        )}
                        {syncState === "sign-in" && (
                            <p className="mt-3 text-sm text-amber-200">
                                <Link
                                    href="/login"
                                    className="underline underline-offset-4 hover:text-amber-100"
                                >
                                    Đăng nhập
                                </Link>{" "}
                                để lưu điểm và xuất hiện trên bảng xếp hạng.
                            </p>
                        )}
                        {syncState === "error" && (
                            <p className="mt-3 text-sm text-red-300">
                                Không thể đồng bộ điểm lúc này. Bạn vẫn có thể
                                chơi lại.
                            </p>
                        )}

                        <div className="mt-6 grid w-full grid-cols-3 gap-3">
                            <StatCard
                                value={roundSummary.correctAnswers}
                                label="Trả lời đúng"
                            />
                            <StatCard
                                value={roundSummary.totalAnswers}
                                label="Tổng số câu"
                            />
                            <StatCard
                                value={`${roundAccuracy}%`}
                                label="Chính xác"
                            />
                        </div>

                        {mistakes.length > 0 && (
                            <section className="mt-6 w-full rounded-2xl border border-amber-300/20 bg-amber-300/[0.06] p-4 text-left">
                                <div className="flex items-start gap-3">
                                    <Lightbulb
                                        size={20}
                                        className="mt-0.5 shrink-0 text-amber-200"
                                    />
                                    <div>
                                        <h4 className="font-semibold text-amber-100">
                                            {mistakes.length} câu cần luyện lại
                                        </h4>
                                        <p className="mt-1 text-sm leading-5 text-amber-50/65">
                                            Xem cách giải rồi làm lại đúng các
                                            câu này. Lượt ôn không tính vào
                                            bảng xếp hạng.
                                        </p>
                                    </div>
                                </div>
                                <ul className="mt-4 space-y-2">
                                    {mistakes.map((mistake, index) => (
                                        <li
                                            key={`${mistake.problem.id}-${index}`}
                                            className="rounded-xl bg-black/15 px-3 py-2 text-sm text-white/70"
                                        >
                                            <span className="font-medium text-white">
                                                {mistake.problem.question} ={" "}
                                                {mistake.problem.answer}
                                            </span>
                                            <span className="ml-2 text-white/40">
                                                (bạn chọn {mistake.selectedAnswer})
                                            </span>
                                            <p className="mt-1 text-xs text-amber-100/70">
                                                {mistake.problem.explanation}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    type="button"
                                    onClick={() =>
                                        startGame(
                                            mistakes.map(
                                                (mistake) => mistake.problem
                                            )
                                        )
                                    }
                                    className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-amber-300 px-4 py-3 font-semibold text-amber-950 transition hover:bg-amber-200"
                                >
                                    <RotateCcw size={18} />
                                    Luyện lại {mistakes.length} câu sai
                                </button>
                            </section>
                        )}

                        <div className="mt-7 flex w-full flex-col gap-3 sm:flex-row">
                            <button
                                type="button"
                                onClick={() => startGame()}
                                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-500 py-4 font-semibold text-black transition hover:bg-cyan-400"
                            >
                                <RotateCcw size={20} />
                                Chơi lại
                            </button>
                            <button
                                type="button"
                                onClick={() => setGameState("idle")}
                                className="flex-1 rounded-xl border border-white/10 bg-white/[0.05] py-4 font-semibold text-white/70 transition hover:bg-white/[0.09] hover:text-white"
                            >
                                Đổi chế độ
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function StatCard({
    value,
    label,
    icon,
}: {
    value: string | number;
    label: string;
    icon?: React.ReactNode;
}) {
    return (
        <div className="rounded-xl border border-white/10 bg-white/[0.045] p-3 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xl font-semibold text-white">
                {icon}
                {value}
            </div>
            <div className="mt-1 text-[11px] font-medium uppercase tracking-wide text-white/40">
                {label}
            </div>
        </div>
    );
}

function ModeButton({
    active,
    title,
    description,
    icon,
    onClick,
}: {
    active: boolean;
    title: string;
    description: string;
    icon: React.ReactNode;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`min-h-36 rounded-2xl border p-4 text-left transition ${
                active
                    ? "border-cyan-400/60 bg-cyan-500/15"
                    : "border-white/10 bg-white/[0.04] hover:bg-white/[0.08]"
            }`}
        >
            <div className={active ? "text-cyan-300" : "text-white/55"}>
                {icon}
            </div>
            <p className="mt-3 font-semibold text-white">{title}</p>
            <p className="mt-1 text-xs leading-5 text-white/45">
                {description}
            </p>
        </button>
    );
}
