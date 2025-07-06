import { Heart } from "lucide-react"; // 아이콘 라이브러리 (설치 필요)
import { useHeartStore } from "./store";
import { Progress } from "@/components/ui/progress";

export function HeartsDisplay() {
  const { hearts, maxHearts } = useHeartStore();

  // 체력 비율을 계산합니다 (0 ~ 100).
  const healthPercentage = (hearts / maxHearts) * 100;

  return (
    // 화면 좌측 상단에 위치시킵니다.
    <div className="absolute top-5 left-5 z-50 w-64">
      <div className="flex items-center gap-3">
        <Heart className="h-4 w-4 text-red-800 fill-red-800" />

        <div className="w-full">
          <div className="relative h-full w-full">
            <Progress value={healthPercentage} className="h-2 " />
          </div>
        </div>
      </div>
    </div>
  );
}
