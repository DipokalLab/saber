"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { Play, Scale, SquareCode } from "lucide-react";
import AnimatedTitle from "@/features/title/Title";
import { useInGameStore } from "@/features/inGame/store";
import { useMouseTracker } from "@/features/trackingMouse/useMouseTracker";
import { HitVignette } from "@/features/hit/HitVignette";
import { GameOverScreen } from "@/features/endGame/GameOverScreen";
import { HeartsDisplay } from "@/features/heart/Display";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AssetLicenseList } from "@/components/License";
import { Setting } from "@/features/setting/Setting";

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(true);
  const [isLicenseOpen, setIsLicenseOpen] = useState(false);
  const setIsStart = useInGameStore((state) => state.setIsStart);
  useMouseTracker();

  const handleStartGame = () => {
    setIsVisible(false);
    setIsStart(true);
  };

  const mainClasses = clsx(
    "absolute",
    "inset-0",
    "flex",
    "z-40",
    "flex-col",
    "items-center",
    "justify-center",
    "p-4",
    "bg-black/80",
    "backdrop-blur-2xl",
    "transition-opacity",
    "duration-700",
    "ease-in-out",
    {
      "opacity-100": isVisible,
      "opacity-0 pointer-events-none": !isVisible,
    }
  );

  return (
    <>
      <Setting />
      <HitVignette />
      <GameOverScreen />
      <HeartsDisplay />

      <main className={mainClasses}>
        <section className="text-center max-w-3xl text-white">
          <AnimatedTitle className="mb-4">Light Saber Simulator</AnimatedTitle>
          <p className="text-xl text-slate-300 mb-8">Press Start to Begin</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button onClick={handleStartGame} variant="secondary" size="lg">
              <Play className="mr-2 h-5 w-5" />
              Game Start
            </Button>

            <Button asChild size="lg">
              <a
                href="https://github.com/DipokalLab/saber"
                target="_blank"
                rel="noopener noreferrer"
              >
                <SquareCode className="mr-2 h-5 w-5" />
                GitHub
              </a>
            </Button>

            <Button size="lg" onClick={() => setIsLicenseOpen(true)}>
              <Scale className="mr-2 h-5 w-5" />
              License
            </Button>
          </div>
        </section>
      </main>

      <Dialog open={isLicenseOpen} onOpenChange={setIsLicenseOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Licenses</DialogTitle>
          </DialogHeader>
          <AssetLicenseList />
        </DialogContent>
      </Dialog>
    </>
  );
}
