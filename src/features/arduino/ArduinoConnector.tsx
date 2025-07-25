import React, { useState, useEffect, useRef } from "react";

export const ArduinoConnector: React.FC = () => {
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
      console.error("시리얼 포트 연결 중 오류 발생:", error);
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
      alert("포트가 연결되지 않았거나 쓰기 가능한 상태가 아닙니다.");
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
        console.error("데이터 읽기 중 오류 발생:", error);
      } finally {
        reader.releaseLock();
      }
    };

    readLoop();

    return () => {
      handleDisconnect();
    };
  }, [port]);

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>React + TypeScript 아두이노 시리얼 통신 🛰️</h2>
      {port ? (
        <button onClick={handleDisconnect}>연결 해제</button>
      ) : (
        <button onClick={handleConnect}>아두이노 연결</button>
      )}

      {port && (
        <div style={{ marginTop: "20px" }}>
          <button onClick={() => sendData("LED_ON")}>LED 켜기</button>
          <button
            onClick={() => sendData("LED_OFF")}
            style={{ marginLeft: "10px" }}
          >
            LED 끄기
          </button>
        </div>
      )}

      <div style={{ marginTop: "20px" }}>
        <h3>수신된 데이터:</h3>
        <pre
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            minHeight: "100px",
            background: "#f9f9f9",
          }}
        >
          {receivedData.join("") || "수신 대기 중..."}
        </pre>
      </div>
    </div>
  );
};

export default ArduinoConnector;
