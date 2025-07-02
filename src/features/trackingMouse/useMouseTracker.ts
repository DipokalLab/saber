import { useEffect } from "react";
import { useMouseStore } from "./stote";

export function useMouseTracker() {
  const setMouse = useMouseStore((state) => state.setMouse);

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

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("pointerlockchange", handlePointerLockChange);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener(
        "pointerlockchange",
        handlePointerLockChange
      );
    };
  }, [setMouse]);
}
