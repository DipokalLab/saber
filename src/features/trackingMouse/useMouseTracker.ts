import { useEffect, useRef } from "react";
import { useMouseStore } from "./stote";

export function useMouseTracker() {
  const setMouse = useMouseStore((state) => state.setMouse);
  const lastTouch = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouse({
        x: e.clientX,
        y: e.clientY,
        dx: e.movementX,
        dy: e.movementY,
      });
    };

    const handleMouseDown = () => setMouse({ isDown: true });
    const handleMouseUp = () => setMouse({ isDown: false });
    const handlePointerLockChange = () => {
      setMouse({ isLocked: !!document.pointerLockElement });
    };

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;

      setMouse({ isDown: true, x: touch.clientX, y: touch.clientY });
      lastTouch.current = { x: touch.clientX, y: touch.clientY };
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch || !lastTouch.current) return;

      const dx = touch.clientX - lastTouch.current.x;
      const dy = touch.clientY - lastTouch.current.y;

      setMouse({
        x: touch.clientX,
        y: touch.clientY,
        dx,
        dy,
      });

      lastTouch.current = { x: touch.clientX, y: touch.clientY };
    };

    const handleTouchEnd = () => {
      setMouse({ isDown: false });
      lastTouch.current = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("pointerlockchange", handlePointerLockChange);

    const touchOptions = { passive: false };
    window.addEventListener("touchstart", handleTouchStart, touchOptions);
    window.addEventListener("touchmove", handleTouchMove, touchOptions);
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("touchcancel", handleTouchEnd);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener(
        "pointerlockchange",
        handlePointerLockChange
      );

      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [setMouse]);
}
