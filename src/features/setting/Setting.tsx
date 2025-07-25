import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInGameStore } from "../inGame/store";
import { useHandTracking } from "../trackingHand/useHandTracking";
import { Settings } from "lucide-react";

function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

export function Setting() {
  const { videoRef, setIsTrackingEnabled } = useHandTracking();
  const setControlMode = useInGameStore((state) => state.setControlMode);
  const controlMode = useInGameStore((state) => state.controlMode);

  const handleClickCamera = () => {
    setIsTrackingEnabled(true);

    setControlMode("hand");
  };

  const handleClickMouse = () => {
    setControlMode("mouse");
    setIsTrackingEnabled(false);
  };

  const handleClickArduino = () => {
    setControlMode("arduino");
  };

  if (isMobile()) {
    return null;
  }

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="absolute top-4 right-4 z-300">
            <Settings />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Setting</DialogTitle>

            <Tabs defaultValue={controlMode}>
              <TabsList>
                <TabsTrigger value="mouse" onClick={handleClickMouse}>
                  Mouse
                </TabsTrigger>
                <TabsTrigger value="hand" onClick={handleClickCamera}>
                  Camera
                </TabsTrigger>
                <TabsTrigger value="arduino" onClick={handleClickArduino}>
                  Arduino
                </TabsTrigger>
              </TabsList>
              <TabsContent value="mouse"></TabsContent>
              <TabsContent value="hand"></TabsContent>
              <TabsContent value="arduino"></TabsContent>
            </Tabs>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <video ref={videoRef} className="hidden" autoPlay playsInline muted />
    </>
  );
}
