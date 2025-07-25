import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInGameStore } from "../inGame/store";
import { useHandTracking } from "../trackingHand/useHandTracking";
import { Settings } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

export function Setting() {
  const { videoRef, setIsTrackingEnabled } = useHandTracking();
  const setControlMode = useInGameStore((state) => state.setControlMode);
  const controlMode = useInGameStore((state) => state.controlMode);
  const [port, setPort] = useState<SerialPort | null>(null);
  const [receivedData, setReceivedData] = useState<string[]>([]);
  const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(
    null
  );

  const handleConnect = async () => {
    try {
      const serialPort = await navigator.serial.requestPort();
      await serialPort.open({ baudRate: 9600 });
      setPort(serialPort);
    } catch (error) {
      console.error("error:", error);
    }
  };

  const handleDisconnect = async () => {
    if (readerRef.current) {
      await readerRef.current.cancel();
      readerRef.current.releaseLock();
      readerRef.current = null;
    }
    if (port) {
      await port.close();
      setPort(null);
    }
    setReceivedData([]);
  };

  const sendData = async (data: string) => {
    if (!port?.writable) {
      return;
    }
    const writer = port.writable.getWriter();
    await writer.write(new TextEncoder().encode(data + "\n"));
    writer.releaseLock();
  };

  useEffect(() => {
    if (!port) return;

    const readLoop = async () => {
      readerRef.current = port.readable?.getReader() ?? null;
      if (!readerRef.current) return;

      const reader = readerRef.current;
      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            break;
          }
          const text = new TextDecoder().decode(value);
          setReceivedData((prev) => [...prev, text]);
        }
      } catch (error) {
        console.error("error:", error);
      } finally {
        reader.releaseLock();
      }
    };

    readLoop();

    return () => {
      handleDisconnect();
    };
  }, [port]);

  const handleClickCamera = () => {
    setControlMode("hand");

    setIsTrackingEnabled(true);
  };

  const handleClickMouse = () => {
    setControlMode("mouse");
    setIsTrackingEnabled(false);
  };

  const handleClickArduino = () => {
    setControlMode("arduino");
    handleConnect();
    setIsTrackingEnabled(false);
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
            <DialogDescription>
              You can change the control mode by selecting the button below.
            </DialogDescription>

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

              <TabsContent value="arduino">
                <div>
                  {port ? (
                    <Button onClick={handleDisconnect}>Disconnect</Button>
                  ) : (
                    <Button onClick={handleConnect}>Connect</Button>
                  )}

                  {port && (
                    <div style={{ marginTop: "20px" }}>
                      <Button onClick={() => sendData("LED_ON")}>LED On</Button>
                      <Button
                        onClick={() => sendData("LED_OFF")}
                        style={{ marginLeft: "10px" }}
                      >
                        LED Off
                      </Button>
                    </div>
                  )}

                  <div style={{ marginTop: "20px" }}>
                    <pre
                      style={{
                        border: "1px solid #ccc",
                        padding: "10px",
                        minHeight: "100px",
                        background: "#f9f9f9",
                      }}
                    >
                      {receivedData.join("") || "..."}
                    </pre>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <video ref={videoRef} className="hidden" autoPlay playsInline muted />
    </>
  );
}
