"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { Play, SquareCode } from "lucide-react";
import AnimatedTitle from "@/features/title/Title";
import HandTracking from "@/features/tracking/HandTracking";
import { useInGameStore } from "@/features/inGame/store";
import { useMouseTracker } from "@/features/mouse/useMouseTracker";

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(true);
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
      <HandTracking />
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
          </div>
        </section>
      </main>
    </>
  );
}
