import type { Metadata, Viewport } from "next";

import "./globals.css";

import AppShell from "@/components/AppShell";
import { getSiteUrl } from "@/lib/site";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
        default: "StudyHay – Tập trung học và luyện kỹ năng mỗi ngày",
        template: "%s | StudyHay",
    },
    description:
        "StudyHay là không gian học tập tối giản với Pomodoro, việc cần làm, ghi chú và trò chơi Toán học, Tiếng Anh, Lịch sử, Địa lý, Khoa học, Tin học.",
    applicationName: "StudyHay",
    alternates: {
        canonical: "/",
    },
    openGraph: {
        type: "website",
        locale: "vi_VN",
        url: "/",
        siteName: "StudyHay",
        title: "StudyHay – Tập trung học và luyện kỹ năng mỗi ngày",
        description:
            "Pomodoro, việc cần làm, ghi chú và trò chơi học tập gọn trong một nơi.",
    },
    twitter: {
        card: "summary",
        title: "StudyHay – Tập trung học và luyện kỹ năng mỗi ngày",
        description:
            "Pomodoro, việc cần làm, ghi chú và trò chơi học tập gọn trong một nơi.",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
        },
    },
};

export const viewport: Viewport = {
    themeColor: "#09090b",
    colorScheme: "dark",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="vi">
            <body className="min-h-full overflow-x-hidden bg-black text-white antialiased">
                <AppShell>{children}</AppShell>
            </body>
        </html>
    );
}
