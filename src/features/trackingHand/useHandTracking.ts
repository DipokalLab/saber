import { useEffect, useRef, useState } from "react";
import { Hands } from "@mediapipe/hands";
import type { Results } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
import { useHandStore } from "./store";

export const useHandTracking = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isTrackingEnabled, setIsTrackingEnabled] = useState(false);
  const setLandmarks = useHandStore((state) => state.setLandmarks);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let hands: Hands | null = null;
    let camera: Camera | null = null;

    if (isTrackingEnabled && videoRef.current) {
      const videoElement = videoRef.current;
      navigator.mediaDevices.getUserMedia({ video: true }).then((s) => {
        stream = s;
        videoElement.srcObject = stream;
        videoElement.play();

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

        camera = new Camera(videoElement, {
          onFrame: async () => {
            await hands!.send({ image: videoElement });
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
  }, [isTrackingEnabled, setLandmarks]);

  return { videoRef, isTrackingEnabled, setIsTrackingEnabled };
};
