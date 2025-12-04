import { CLockDown } from "@/components/CLockDown";
import BottomBar from "@/components/BottomBar";
import HeaderBar from "@/components/HeaderBar";
import TranslatePro from "@/components/TranslateWord";

export default function Home() {
      return (
          <div className="flex-1 flex flex-col justify-center items-center min-h-screen px-4 pb-32">
              <HeaderBar />
            <div className="mb-16 text-center">
              <CLockDown />
                <TranslatePro />
            </div>
            <BottomBar />
          </div>
      );
}