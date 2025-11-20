// app/page.tsx
import { Timer } from "@/components/Timer";
import BottomBar from "@/components/BottomBar";
import HeaderBar from "@/components/HeaderBar";

export default function Home() {
  return (
      <div className="flex-1 flex flex-col justify-center items-center min-h-screen px-4 pb-32">
        <HeaderBar/>
        {/* Timer lớn */}
        <div className="mb-16 text-center">
          <Timer />
        </div>

        {/* Nội dung giữa */}
        <div className="w-full max-w-md space-y-8 text-center">
          <p className="text-white/70 text-sm tracking-wide">
            What are you working on?
          </p>
        </div>

        {/* Bottom Bar */}
        <BottomBar />
      </div>
  );
}