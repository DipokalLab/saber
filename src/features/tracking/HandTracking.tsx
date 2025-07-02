import React, { useEffect, useRef, useState } from "react";
import { Hands } from "@mediapipe/hands";
import type { Results } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
import { Button } from "@/components/ui/button";
import { useHandStore } from "./store";
import { useInGameStore } from "../inGame/store";

const CameraToggle: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [enabled, setEnabled] = useState(false);
  const setLandmarks = useHandStore((state) => state.setLandmarks);
  const setControlMode = useInGameStore((state) => state.setControlMode);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let hands: Hands | null = null;
    let camera: Camera | null = null;

    if (enabled && videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: true }).then((s) => {
        stream = s;
        videoRef.current!.srcObject = stream;
        videoRef.current!.play();

        hands = new Hands({
          locateFile: (file) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
        });
        hands.setOptions({
          maxNumHands: 2,
          modelComplexity: 1,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });
        hands.onResults((results: Results) => {
          setLandmarks(results.multiHandLandmarks ?? []);
        });

        camera = new Camera(videoRef.current!, {
          onFrame: async () => {
            await hands!.send({ image: videoRef.current! });
          },
          width: 640,
          height: 480,
        });
        camera.start();
      });
    }

    return () => {
      if (camera) {
        camera.stop();
        hands!.close();
      }
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [enabled, setLandmarks]);

  const handleClick = () => {
    if (enabled) {
      setControlMode("mouse");
    } else {
      setControlMode("hand");
    }
    setEnabled(!enabled);
  };

  return (
    <>
      <video ref={videoRef} className="hidden" autoPlay playsInline muted />
      <Button className="absolute top-4 right-4 z-300" onClick={handleClick}>
        {enabled ? "Disable Camera" : "Enable Camera"}
      </Button>
    </>
  );
};

export default CameraToggle;
