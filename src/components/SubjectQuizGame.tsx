"use client";

import Link from "next/link";
import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import { motion } from "framer-motion";
import {
    CheckCircle2,
    Play,
    RotateCcw,
    Square,
    Trophy,
    XCircle,
} from "lucide-react";

import { submitGameRun } from "@/lib/api/game";
import {
    SUBJECT_GAMES,
    type SubjectGameId,
    type SubjectQuestion,
} from "@/lib/subject-games";

type GameState = "idle" | "playing" | "gameOver";
type SyncState = "idle" | "saving" | "saved" | "sign-in" | "error";

interface SubjectQuizGameProps {
    subjectId: SubjectGameId;
    embedded?: boolean;
    grade?: number;
}

const ANSWER_FEEDBACK_TIME = 900;

function shuffle<T>(items: T[]) {
    const shuffled = [...items];

    for (let index = shuffled.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        [shuffled[index], shuffled[swapIndex]] = [
            shuffled[swapIndex],
            shuffled[index],
        ];
    }

    return shuffled;
}

export default function SubjectQuizGame({
    subjectId,
    embedded = false,
    grade = 6,
}: SubjectQuizGameProps) {
    const subject = SUBJECT_GAMES[subjectId];
    const [gameState, setGameState] = useState<GameState>("idle");
    const [questions, setQuestions] = useState<SubjectQuestion[]>([]);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [totalAnswers, setTotalAnswers] = useState(0);
    const [streak, setStreak] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(
        null
    );
    const [answerLocked, setAnswerLocked] = useState(false);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [syncState, setSyncState] = useState<SyncState>("idle");

    const startedAtRef = useRef(0);
    const roundFinishedRef = useRef(false);
    const answerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
        null
    );
    const clientRunIdRef = useRef<string | null>(null);
    const correctAnswersRef = useRef(0);
    const totalAnswersRef = useRef(0);

    useEffect(() => {
        return () => {
            if (answerTimerRef.current) {
                clearTimeout(answerTimerRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (gameState !== "playing") return;

        const timer = window.setInterval(() => {
            setElapsedSeconds(
                Math.floor((Date.now() - startedAtRef.current) / 1_000)
            );
        }, 250);

        return () => window.clearInterval(timer);
    }, [gameState]);

    const finishRound = useCallback(
        (
            finalScore: number,
            finalCorrect: number,
            finalTotal: number
        ) => {
            if (roundFinishedRef.current) return;

            roundFinishedRef.current = true;

            if (answerTimerRef.current) {
                clearTimeout(answerTimerRef.current);
                answerTimerRef.current = null;
            }

            const durationSeconds = Math.max(
                0,
                Math.floor((Date.now() - startedAtRef.current) / 1_000)
            );
            const clientRunId = clientRunIdRef.current;

            setElapsedSeconds(durationSeconds);
            setAnswerLocked(false);
            setGameState("gameOver");

            if (!clientRunId || finalTotal === 0) return;

            setSyncState("saving");

            void submitGameRun({
                clientRunId,
                gameType: "subject-quiz",
                gameMode: subject.id,
                difficulty: "core",
                score: finalScore,
                correctAnswers: finalCorrect,
                totalAnswers: finalTotal,
                durationSeconds,
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
        [subject.id]
    );

    const startGame = useCallback(() => {
        if (answerTimerRef.current) {
            clearTimeout(answerTimerRef.current);
            answerTimerRef.current = null;
        }

        const roundQuestions = shuffle(subject.questions);

        roundFinishedRef.current = false;
        clientRunIdRef.current = crypto.randomUUID();
        correctAnswersRef.current = 0;
        totalAnswersRef.current = 0;
        startedAtRef.current = Date.now();

        setQuestions(roundQuestions);
        setQuestionIndex(0);
        setScore(0);
        setCorrectAnswers(0);
        setTotalAnswers(0);
        setStreak(0);
        setSelectedAnswer(null);
        setAnswerLocked(false);
        setElapsedSeconds(0);
        setSyncState("idle");
        setGameState("playing");
    }, [subject.questions]);

    const handleAnswer = useCallback(
        (answer: string) => {
            const currentQuestion = questions[questionIndex];

            if (
                !currentQuestion ||
                answerLocked ||
                roundFinishedRef.current
            ) {
                return;
            }

            const isCorrect = answer === currentQuestion.correctAnswer;
            const nextTotal = totalAnswersRef.current + 1;
            const nextStreak = isCorrect ? streak + 1 : 0;
            const points = isCorrect ? 100 + Math.max(0, nextStreak - 1) * 20 : 0;
            const nextScore = score + points;
            const nextCorrect =
                correctAnswersRef.current + (isCorrect ? 1 : 0);

            totalAnswersRef.current = nextTotal;
            correctAnswersRef.current = nextCorrect;
            setSelectedAnswer(answer);
            setAnswerLocked(true);
            setScore(nextScore);
            setStreak(nextStreak);
            setCorrectAnswers(nextCorrect);
            setTotalAnswers(nextTotal);

            answerTimerRef.current = setTimeout(() => {
                if (roundFinishedRef.current) return;

                if (nextTotal >= questions.length) {
                    finishRound(nextScore, nextCorrect, nextTotal);
                    return;
                }

                setQuestionIndex((index) => index + 1);
                setSelectedAnswer(null);
                setAnswerLocked(false);
            }, ANSWER_FEEDBACK_TIME);
        },
        [
            answerLocked,
            finishRound,
            questionIndex,
            questions,
            score,
            streak,
        ]
    );

    const currentQuestion = questions[questionIndex];
    const accuracy =
        totalAnswers > 0
            ? Math.round(
                  (correctAnswers / totalAnswers) * 100
              )
            : 0;

    return (
        <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl bg-white/[0.035]">
            {!embedded && (
                <div className="flex-shrink-0 border-b border-white/10 px-5 py-4">
                    <h2 className="text-xl font-semibold text-white">
                        {subject.title}
                    </h2>
                </div>
            )}

            <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
                {gameState === "idle" && (
                    <div className="mx-auto max-w-xl py-6">
                        <div className="rounded-3xl border border-cyan-300/20 bg-gradient-to-br from-cyan-500/15 via-blue-500/10 to-violet-500/10 p-6">
                            <p className="text-sm font-medium uppercase tracking-[0.16em] text-cyan-200">
                                {subject.shortTitle}
                            </p>
                            <h3 className="mt-3 text-3xl font-bold text-white">
                                {subject.title}
                            </h3>
                            <p className="mt-3 leading-7 text-white/65">
                                {subject.description}
                            </p>
                            <div className="mt-5 rounded-xl border border-white/10 bg-black/15 p-3 text-sm text-cyan-100/80">
                                {subject.playHint}
                            </div>
                        </div>

                            <p className="mt-5 text-center text-sm text-white/45">
                            Lớp {grade} · {subject.questions.length} câu nền tảng · phản hồi và lời giải ngay sau mỗi đáp án
                        </p>

                        <button
                            type="button"
                            onClick={startGame}
                            className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 py-4 font-semibold text-black transition hover:bg-cyan-300"
                        >
                            <Play size={20} aria-hidden="true" />
                            Bắt đầu chơi
                        </button>
                    </div>
                )}

                {gameState === "playing" && currentQuestion && (
                    <div className="mx-auto max-w-xl py-2">
                        <div className="mb-4 grid grid-cols-4 gap-2 text-center">
                            <MiniStat value={`${questionIndex + 1}/${questions.length}`} label="Câu" />
                            <MiniStat value={score} label="Điểm" />
                            <MiniStat value={streak} label="Combo" />
                            <MiniStat value={`${elapsedSeconds}s`} label="Thời gian" />
                        </div>

                        <motion.div
                            key={`${subject.id}-${questionIndex}`}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="rounded-2xl border border-white/10 bg-white/[0.055] p-5 sm:p-7"
                        >
                            <p className="text-xs font-medium uppercase tracking-[0.14em] text-cyan-200/80">
                                {subject.shortTitle}
                            </p>
                            <h3 className="mt-3 text-xl font-semibold leading-8 text-white sm:text-2xl">
                                {currentQuestion.question}
                            </h3>
                        </motion.div>

                        <div className="mt-4 grid gap-3">
                            {currentQuestion.options.map((option, index) => {
                                const isSelected = option === selectedAnswer;
                                const isCorrectOption =
                                    answerLocked &&
                                    option === currentQuestion.correctAnswer;
                                const isWrongOption =
                                    answerLocked &&
                                    isSelected &&
                                    !isCorrectOption;

                                return (
                                    <button
                                        key={option}
                                        type="button"
                                        disabled={answerLocked}
                                        onClick={() => handleAnswer(option)}
                                        className={`relative min-h-14 rounded-xl border px-4 py-4 pr-12 text-left text-base font-medium transition ${
                                            isCorrectOption
                                                ? "border-emerald-400 bg-emerald-500/25 text-emerald-50"
                                                : isWrongOption
                                                  ? "border-red-400 bg-red-500/25 text-red-50"
                                                  : answerLocked
                                                    ? "border-white/5 bg-white/[0.025] text-white/30"
                                                    : "border-white/10 bg-white/[0.05] text-white/80 hover:border-cyan-300/50 hover:bg-cyan-500/10"
                                        }`}
                                    >
                                        <span className="mr-3 text-xs font-bold text-white/35">
                                            {String.fromCharCode(65 + index)}.
                                        </span>
                                        {option}
                                        {isCorrectOption && (
                                            <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2" size={20} />
                                        )}
                                        {isWrongOption && (
                                            <XCircle className="absolute right-4 top-1/2 -translate-y-1/2" size={20} />
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {answerLocked && (
                            <div className="mt-4 rounded-xl border border-cyan-300/15 bg-cyan-400/[0.07] p-4 text-sm leading-6 text-cyan-50/85">
                                <span className="font-semibold text-cyan-200">Lời giải: </span>
                                {currentQuestion.explanation}
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={() =>
                                finishRound(
                                    score,
                                    correctAnswersRef.current,
                                    totalAnswersRef.current
                                )
                            }
                            className="mt-6 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] py-3 text-sm font-medium text-white/60 transition hover:bg-red-500/10 hover:text-red-300"
                        >
                            <Square size={16} aria-hidden="true" />
                            Dừng chơi
                        </button>
                    </div>
                )}

                {gameState === "gameOver" && (
                    <div className="mx-auto max-w-xl py-10 text-center">
                        <Trophy size={62} className="mx-auto text-yellow-300" aria-hidden="true" />
                        <p className="mt-4 text-sm font-medium uppercase tracking-[0.16em] text-white/45">
                            Hoàn thành
                        </p>
                        <h3 className="mt-2 text-4xl font-bold text-white">
                            {score} điểm
                        </h3>
                        <p className="mt-3 text-white/60">
                            {correctAnswers}/{totalAnswers} câu đúng · {accuracy}% chính xác · {elapsedSeconds}s
                        </p>

                        <div className="mt-4 min-h-5 text-sm" aria-live="polite">
                            {syncState === "saving" && <p className="text-white/50">Đang lưu điểm lên bảng xếp hạng…</p>}
                            {syncState === "saved" && <p className="text-emerald-300">Điểm đã được lưu vào bảng xếp hạng.</p>}
                            {syncState === "sign-in" && <p className="text-amber-200"><Link href="/login" className="underline underline-offset-4 hover:text-amber-100">Đăng nhập</Link>{" "}để lưu điểm và xuất hiện trên bảng xếp hạng.</p>}
                            {syncState === "error" && <p className="text-red-300">Không thể đồng bộ điểm lúc này.</p>}
                        </div>

                        <button
                            type="button"
                            onClick={startGame}
                            className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-xl bg-cyan-400 px-7 py-3 font-semibold text-black transition hover:bg-cyan-300"
                        >
                            <RotateCcw size={20} aria-hidden="true" />
                            Chơi lại
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

function MiniStat({
    value,
    label,
}: {
    value: string | number;
    label: string;
}) {
    return (
        <div className="rounded-xl border border-white/10 bg-white/[0.04] px-2 py-2">
            <p className="text-sm font-semibold tabular-nums text-white">{value}</p>
            <p className="mt-0.5 text-[10px] uppercase tracking-wide text-white/40">{label}</p>
        </div>
    );
}
