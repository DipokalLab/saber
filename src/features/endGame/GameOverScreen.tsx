import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useHeartStore } from "../heart/store";
import { RotateCcw } from "lucide-react";

export function GameOverScreen() {
  const heart = useHeartStore((state) => state.hearts);
  const resetHearts = useHeartStore((state) => state.resetHearts);

  if (heart > 0) {
    return null;
  }

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in-0">
      <Card className="w-[380px]">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold">
            Game Over
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex justify-center">
          <Button onClick={resetHearts} size="lg">
            <RotateCcw /> Repeat
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
