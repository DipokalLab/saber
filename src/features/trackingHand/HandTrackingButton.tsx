import React from "react";
import { Button } from "@/components/ui/button";
import { useInGameStore } from "../inGame/store";
import { useHandTracking } from "./useHandTracking";

function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

const HandTrackingButton: React.FC = () => {
  const { videoRef, isTrackingEnabled, setIsTrackingEnabled } =
    useHandTracking();
  const setControlMode = useInGameStore((state) => state.setControlMode);

  const handleClick = () => {
    const nextEnabledState = !isTrackingEnabled;
    setIsTrackingEnabled(nextEnabledState);

    if (nextEnabledState) {
      setControlMode("hand");
    } else {
      setControlMode("mouse");
    }
  };

  if (isMobile()) {
    return null;
  }

  return (
    <>
      <video ref={videoRef} className="hidden" autoPlay playsInline muted />
      <Button onClick={handleClick}>
        {isTrackingEnabled ? "Disable Camera" : "Enable Camera"}
      </Button>
    </>
  );
};

export default HandTrackingButton;
