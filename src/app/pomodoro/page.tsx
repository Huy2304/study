import type { Metadata } from "next";

import BottomBar from "@/components/BottomBar";
import { CLockDown } from "@/components/CLockDown";
import HeaderBar from "@/components/HeaderBar";

export const metadata: Metadata = {
    title: "Đồng hồ Pomodoro miễn phí",
    description:
        "Dùng đồng hồ Pomodoro StudyHay để lập mục tiêu, tập trung theo phiên 25, 50 hoặc 90 phút và nghỉ đúng lúc.",
    alternates: {
        canonical: "/pomodoro",
    },
    openGraph: {
        title: "Đồng hồ Pomodoro miễn phí | StudyHay",
        description:
            "Tập trung theo phiên Pomodoro, ghi mục tiêu và nghỉ đúng lúc cùng StudyHay.",
        url: "/pomodoro",
    },
};

export default function PomodoroPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <section className="sr-only">
                <h1>Đồng hồ Pomodoro online miễn phí</h1>
                <p>
                    StudyHay hỗ trợ các phiên tập trung 25, 50 và 90 phút, cùng
                    thời gian nghỉ ngắn để bạn duy trì nhịp học hiệu quả.
                </p>
            </section>
            <HeaderBar />
            <CLockDown />
            <BottomBar />
        </div>
    );
}
