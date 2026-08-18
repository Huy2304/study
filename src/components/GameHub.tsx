// components/GameHub.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import {
    AnimatePresence,
    motion,
    useReducedMotion,
} from "framer-motion";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    BookOpenText,
    Calculator,
    Code2,
    FlaskConical,
    Gamepad2,
    Landmark,
    Languages,
    MapPinned,
    ShieldCheck,
    X,
} from "lucide-react";

import QuickMathGame from "@/components/QuickMathGame";
import FlashcardGame from "@/components/FlashcardGame";
import SubjectQuizGame from "@/components/SubjectQuizGame";
import { type SubjectGameId } from "@/lib/subject-games";

type SelectedGame = "none" | "math" | "english" | SubjectGameId;

interface GameCardProps {
    title: string;
    description: string;
    details: string;
    icon: React.ReactNode;
    accent:
        | "cyan"
        | "purple"
        | "amber"
        | "emerald"
        | "rose"
        | "blue"
        | "orange"
        | "lime";
    onClick: () => void;
}

function GameCard({
    title,
    description,
    details,
    icon,
    accent,
    onClick,
}: GameCardProps) {
    const accentClasses = {
        cyan: {
            icon: "bg-cyan-500/15 text-cyan-300",
            border: "hover:border-cyan-400/50",
            badge: "bg-cyan-500/10 text-cyan-300",
        },
        purple: {
            icon: "bg-purple-500/15 text-purple-300",
            border: "hover:border-purple-400/50",
            badge: "bg-purple-500/10 text-purple-300",
        },
        amber: {
            icon: "bg-amber-500/15 text-amber-200",
            border: "hover:border-amber-300/50",
            badge: "bg-amber-500/10 text-amber-100",
        },
        emerald: {
            icon: "bg-emerald-500/15 text-emerald-200",
            border: "hover:border-emerald-300/50",
            badge: "bg-emerald-500/10 text-emerald-100",
        },
        rose: {
            icon: "bg-rose-500/15 text-rose-200",
            border: "hover:border-rose-300/50",
            badge: "bg-rose-500/10 text-rose-100",
        },
        blue: {
            icon: "bg-blue-500/15 text-blue-200",
            border: "hover:border-blue-300/50",
            badge: "bg-blue-500/10 text-blue-100",
        },
        orange: {
            icon: "bg-orange-500/15 text-orange-200",
            border: "hover:border-orange-300/50",
            badge: "bg-orange-500/10 text-orange-100",
        },
        lime: {
            icon: "bg-lime-500/15 text-lime-200",
            border: "hover:border-lime-300/50",
            badge: "bg-lime-500/10 text-lime-100",
        },
    }[accent];

    return (
        <motion.button
            type="button"
            onClick={onClick}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
            className={`
                group flex min-h-48 w-full flex-col
                rounded-2xl border border-white/10
                bg-white/[0.045] p-5 text-left
                transition-colors duration-200
                hover:bg-white/[0.075]
                focus:outline-none focus-visible:ring-2
                focus-visible:ring-white/60
                sm:min-h-56 sm:p-6
                ${accentClasses.border}
            `}
        >
            <div className="flex w-full items-start justify-between gap-4">
                <div
                    className={`
                        flex h-14 w-14 flex-shrink-0
                        items-center justify-center rounded-2xl
                        ${accentClasses.icon}
                    `}
                >
                    {icon}
                </div>

                <span
                    className={`
                        rounded-full px-3 py-1
                        text-xs font-medium
                        ${accentClasses.badge}
                    `}
                >
                    {details}
                </span>
            </div>

            <div className="mt-auto pt-6">
                <h3 className="text-xl font-semibold text-white sm:text-2xl">
                    {title}
                </h3>

                <p className="mt-2 max-w-md text-sm leading-6 text-white/60">
                    {description}
                </p>

                <div className="mt-5 flex items-center gap-2 text-sm font-medium text-white/80">
                    <span>Bắt đầu chơi</span>
                    <span
                        className="
                            transition-transform duration-200
                            group-hover:translate-x-1
                        "
                    >
                        →
                    </span>
                </div>
            </div>
        </motion.button>
    );
}

interface GameHubProps {
    standalone?: boolean;
}

export default function GameHub({ standalone = false }: GameHubProps) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(standalone);
    const [selectedGame, setSelectedGame] =
        useState<SelectedGame>("none");
    const [selectedGrade, setSelectedGrade] = useState(() => {
        if (typeof window === "undefined") return 6;

        const storedGrade = Number(
            window.localStorage.getItem("studyhay_selected_grade")
        );

        return Number.isInteger(storedGrade) &&
            storedGrade >= 1 &&
            storedGrade <= 12
            ? storedGrade
            : 6;
    });

    const reduceMotion = useReducedMotion();

    const closeGameHub = useCallback(() => {
        if (standalone) {
            router.push("/");
            return;
        }

        setIsOpen(false);

        // Đợi modal đóng xong rồi mới trở về menu.
        window.setTimeout(() => {
            setSelectedGame("none");
        }, 200);
    }, [router, standalone]);

    /*
     * Khóa scroll của trang khi Game Hub mở.
     */
    useEffect(() => {
        if (!isOpen) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [isOpen]);

    useEffect(() => {
        window.localStorage.setItem(
            "studyhay_selected_grade",
            String(selectedGrade)
        );
    }, [selectedGrade]);

    /*
     * Đóng Game Hub bằng phím Escape.
     */
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                closeGameHub();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [closeGameHub, isOpen]);

    const title =
        selectedGame === "math"
            ? "Toán học"
            : selectedGame === "english"
              ? "Tiếng Anh"
              : selectedGame === "history"
                ? "Sử Việt 60s"
                : selectedGame === "geography"
                  ? "Bản đồ tốc độ"
                  : selectedGame === "literature"
                    ? "Thám tử câu chữ"
                    : selectedGame === "science"
                      ? "Phòng thí nghiệm mini"
                      : selectedGame === "informatics"
                        ? "Code Flow"
                        : selectedGame === "life-skills"
                          ? "Quyết định trong 10 giây"
                          : "Trò chơi học tập";

    return (
        <>
            {!standalone && (
                <button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    aria-label="Mở trò chơi học tập"
                    aria-expanded={isOpen}
                    className="
                        group relative flex h-12 w-12
                        items-center justify-center rounded-xl
                        border border-white/20 bg-white/10
                        text-white/70 backdrop-blur-xl
                        transition-all duration-200
                        hover:scale-105 hover:bg-white/20
                        hover:text-white
                        focus:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-white/60
                    "
                >
                    <Gamepad2
                        size={23}
                        aria-hidden="true"
                    />
                </button>
            )}

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="
                            fixed inset-0 z-[400]
                            flex items-center justify-center
                            bg-black/75
                            p-0 sm:p-4
                        "
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                            duration: reduceMotion ? 0 : 0.2,
                        }}
                    >
                        <motion.section
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="game-hub-title"
                            className="
                                relative flex h-[100dvh] w-full
                                flex-col overflow-hidden bg-zinc-950
                                sm:h-[min(780px,92dvh)]
                                sm:max-w-5xl
                                sm:rounded-3xl
                                sm:border sm:border-white/10
                                sm:shadow-2xl
                            "
                            initial={
                                reduceMotion
                                    ? { opacity: 1 }
                                    : {
                                          opacity: 0,
                                          scale: 0.98,
                                          y: 12,
                                      }
                            }
                            animate={{
                                opacity: 1,
                                scale: 1,
                                y: 0,
                            }}
                            exit={
                                reduceMotion
                                    ? { opacity: 0 }
                                    : {
                                          opacity: 0,
                                          scale: 0.98,
                                          y: 12,
                                      }
                            }
                            transition={{
                                duration: reduceMotion ? 0 : 0.22,
                                ease: "easeOut",
                            }}
                        >
                            {/* Header duy nhất */}
                            <header
                                className="
                                    flex h-16 flex-shrink-0
                                    items-center justify-between
                                    border-b border-white/10
                                    bg-zinc-950/95 px-4
                                    sm:h-[72px] sm:px-6
                                "
                            >
                                <div className="flex min-w-0 items-center gap-3">
                                    {selectedGame !== "none" ? (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setSelectedGame("none")
                                            }
                                            aria-label="Quay lại danh sách trò chơi"
                                            className="
                                                flex h-10 w-10 flex-shrink-0
                                                items-center justify-center
                                                rounded-xl text-white/65
                                                transition
                                                hover:bg-white/10
                                                hover:text-white
                                                focus:outline-none
                                                focus-visible:ring-2
                                                focus-visible:ring-white/60
                                            "
                                        >
                                            <ArrowLeft
                                                size={21}
                                                aria-hidden="true"
                                            />
                                        </button>
                                    ) : (
                                        <div
                                            className="
                                                flex h-10 w-10 flex-shrink-0
                                                items-center justify-center
                                                rounded-xl bg-white/10
                                                text-white
                                            "
                                        >
                                            <Gamepad2
                                                size={21}
                                                aria-hidden="true"
                                            />
                                        </div>
                                    )}

                                    <div className="min-w-0">
                                        <h2
                                            id="game-hub-title"
                                            className="
                                                truncate text-lg
                                                font-semibold text-white
                                                sm:text-xl
                                            "
                                        >
                                            {title}
                                        </h2>

                                        <p className="hidden text-xs text-white/45 sm:block">
                                            Chơi ngắn, luyện tập nhanh
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={closeGameHub}
                                    aria-label="Đóng trò chơi"
                                    className="
                                        flex h-10 w-10 flex-shrink-0
                                        items-center justify-center
                                        rounded-xl text-white/65
                                        transition
                                        hover:bg-red-500/15
                                        hover:text-red-300
                                        focus:outline-none
                                        focus-visible:ring-2
                                        focus-visible:ring-white/60
                                    "
                                >
                                    <X
                                        size={22}
                                        aria-hidden="true"
                                    />
                                </button>
                            </header>

                            {/* Chỉ có một vùng scroll */}
                            <main className="min-h-0 flex-1 overflow-y-auto">
                                <AnimatePresence mode="wait">
                                    {selectedGame === "none" && (
                                        <motion.div
                                            key="game-menu"
                                            className="mx-auto w-full max-w-4xl p-4 sm:p-7"
                                            initial={{
                                                opacity: 0,
                                                y: reduceMotion ? 0 : 8,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                y: 0,
                                            }}
                                            exit={{
                                                opacity: 0,
                                                y: reduceMotion ? 0 : -8,
                                            }}
                                            transition={{
                                                duration: reduceMotion
                                                    ? 0
                                                    : 0.18,
                                            }}
                                        >
                                            <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-4 sm:flex-row sm:items-center sm:justify-between">
                                                <div>
                                                    <p className="font-semibold text-white">
                                                        Học theo lớp
                                                    </p>
                                                    <p className="mt-1 text-sm text-white/50">
                                                        Chọn lớp để điều chỉnh
                                                        mức bắt đầu của Toán học
                                                        và Tiếng Anh.
                                                    </p>
                                                </div>
                                                <label className="flex w-full items-center gap-3 sm:w-auto">
                                                    <span className="text-sm text-white/60">
                                                        Lớp
                                                    </span>
                                                    <select
                                                        value={selectedGrade}
                                                        onChange={(event) =>
                                                            setSelectedGrade(
                                                                Number(
                                                                    event.target
                                                                        .value
                                                                )
                                                            )
                                                        }
                                                        className="min-h-11 flex-1 rounded-xl border border-cyan-300/35 bg-zinc-900 px-3 font-semibold text-cyan-100 outline-none transition focus:border-cyan-300 sm:w-24"
                                                        aria-label="Chọn lớp đang học"
                                                    >
                                                        {Array.from(
                                                            { length: 12 },
                                                            (_, index) =>
                                                                index + 1
                                                        ).map((grade) => (
                                                            <option
                                                                key={grade}
                                                                value={grade}
                                                            >
                                                                Lớp {grade}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </label>
                                            </div>

                                            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/45">
                                                Nền tảng
                                            </h4>
                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                <GameCard
                                                    title="Toán học"
                                                    description="Tính nhanh, luyện câu sai và thử thách toán mỗi ngày."
                                                    details="1–3 phút"
                                                    accent="cyan"
                                                    icon={
                                                        <Calculator
                                                            size={30}
                                                            aria-hidden="true"
                                                        />
                                                    }
                                                    onClick={() =>
                                                        setSelectedGame("math")
                                                    }
                                                />

                                                <GameCard
                                                    title="Tiếng Anh"
                                                    description="Luyện 240 từ A1–B1 theo cấp độ, chủ đề và tra nghĩa–phát âm ngay trong game."
                                                    details="A1–B1"
                                                    accent="purple"
                                                    icon={
                                                        <Languages
                                                            size={30}
                                                            aria-hidden="true"
                                                        />
                                                    }
                                                    onClick={() =>
                                                        setSelectedGame(
                                                            "english"
                                                        )
                                                    }
                                                />
                                            </div>

                                            <h4 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wide text-white/45">
                                                Khám phá môn học
                                            </h4>
                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                <GameCard
                                                    title="Sử Việt 60s"
                                                    description="Chinh phục mốc thời gian và sự kiện lịch sử Việt Nam."
                                                    details="8 câu"
                                                    accent="amber"
                                                    icon={<Landmark size={30} aria-hidden="true" />}
                                                    onClick={() => setSelectedGame("history")}
                                                />
                                                <GameCard
                                                    title="Bản đồ tốc độ"
                                                    description="Khám phá địa lý Việt Nam và thế giới qua dữ kiện nhanh."
                                                    details="8 câu"
                                                    accent="emerald"
                                                    icon={<MapPinned size={30} aria-hidden="true" />}
                                                    onClick={() => setSelectedGame("geography")}
                                                />
                                                <GameCard
                                                    title="Thám tử câu chữ"
                                                    description="Săn từ loại, tu từ, chính tả và cách dùng câu đúng."
                                                    details="8 câu"
                                                    accent="rose"
                                                    icon={<BookOpenText size={30} aria-hidden="true" />}
                                                    onClick={() => setSelectedGame("literature")}
                                                />
                                                <GameCard
                                                    title="Phòng thí nghiệm mini"
                                                    description="Dự đoán hiện tượng Vật lý, Hóa học và Sinh học."
                                                    details="8 câu"
                                                    accent="blue"
                                                    icon={<FlaskConical size={30} aria-hidden="true" />}
                                                    onClick={() => setSelectedGame("science")}
                                                />
                                                <GameCard
                                                    title="Code Flow"
                                                    description="Luyện thuật toán, sơ đồ khối và kỹ năng số an toàn."
                                                    details="8 câu"
                                                    accent="orange"
                                                    icon={<Code2 size={30} aria-hidden="true" />}
                                                    onClick={() => setSelectedGame("informatics")}
                                                />
                                                <GameCard
                                                    title="Quyết định trong 10 giây"
                                                    description="Xử lý tình huống giao thông, học đường và an toàn số."
                                                    details="8 câu"
                                                    accent="lime"
                                                    icon={<ShieldCheck size={30} aria-hidden="true" />}
                                                    onClick={() => setSelectedGame("life-skills")}
                                                />
                                            </div>
                                        </motion.div>
                                    )}

                                    {selectedGame === "math" && (
                                        <motion.div
                                            key="math-game"
                                            className="h-full min-h-full p-3 sm:p-5"
                                            initial={{
                                                opacity: 0,
                                                x: reduceMotion ? 0 : 12,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                x: 0,
                                            }}
                                            exit={{
                                                opacity: 0,
                                                x: reduceMotion ? 0 : -12,
                                            }}
                                            transition={{
                                                duration: reduceMotion
                                                    ? 0
                                                    : 0.18,
                                            }}
                                        >
                                            <QuickMathGame
                                                key={`math-${selectedGrade}`}
                                                grade={selectedGrade}
                                                embedded
                                            />
                                        </motion.div>
                                    )}

                                    {selectedGame === "english" && (
                                        <motion.div
                                            key="english-game"
                                            className="h-full min-h-full p-3 sm:p-5"
                                            initial={{
                                                opacity: 0,
                                                x: reduceMotion ? 0 : 12,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                x: 0,
                                            }}
                                            exit={{
                                                opacity: 0,
                                                x: reduceMotion ? 0 : -12,
                                            }}
                                            transition={{
                                                duration: reduceMotion
                                                    ? 0
                                                    : 0.18,
                                            }}
                                        >
                                            <FlashcardGame
                                                key={`english-${selectedGrade}`}
                                                grade={selectedGrade}
                                                embedded
                                            />
                                        </motion.div>
                                    )}

                                    {selectedGame !== "none" &&
                                        selectedGame !== "math" &&
                                        selectedGame !== "english" && (
                                            <motion.div
                                                key={`${selectedGame}-game`}
                                                className="h-full min-h-full p-3 sm:p-5"
                                                initial={{
                                                    opacity: 0,
                                                    x: reduceMotion ? 0 : 12,
                                                }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{
                                                    opacity: 0,
                                                    x: reduceMotion ? 0 : -12,
                                                }}
                                                transition={{
                                                    duration: reduceMotion ? 0 : 0.18,
                                                }}
                                            >
                                                <SubjectQuizGame
                                                    key={`${selectedGame}-${selectedGrade}`}
                                                    subjectId={selectedGame}
                                                    grade={selectedGrade}
                                                    embedded
                                                />
                                            </motion.div>
                                        )}
                                </AnimatePresence>
                            </main>
                        </motion.section>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
