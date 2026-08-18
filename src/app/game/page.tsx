import type { Metadata } from "next";

import GameHub from "@/components/GameHub";

export const metadata: Metadata = {
    title: "Trò chơi học tập",
    description:
        "Luyện Toán, Tiếng Anh và các môn học khác với trò chơi ngắn của StudyHay.",
    alternates: {
        canonical: "/game",
    },
    openGraph: {
        title: "Trò chơi học tập | StudyHay",
        description:
            "Chơi ngắn, luyện tập nhanh cùng các trò chơi học tập của StudyHay.",
        url: "/game",
    },
};

export default function GamePage() {
    return <GameHub standalone />;
}
