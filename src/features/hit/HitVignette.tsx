import { useEffect } from "react";
import { useHeartStore } from "../heart/store";
import "./style.css";
export function HitVignette() {
  const justHit = useHeartStore((state) => state.justHit);
  const clearHit = useHeartStore((state) => state.clearHit);

  useEffect(() => {
    if (justHit) {
      const timer = setTimeout(() => {
        clearHit();
      }, 600);

      return () => clearTimeout(timer);
    }
  }, [justHit, clearHit]);

  const vignetteClassName = `hit-vignette-overlay ${justHit ? "active" : ""}`;

  return <div className={vignetteClassName} />;
}
