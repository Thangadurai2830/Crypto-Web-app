import { useCallback, useRef } from "react";
import { toPng } from "html-to-image";

export function useChartExport(containerRef: React.RefObject<HTMLDivElement | null>) {
  const exportChart = useCallback(async (filename = "chart.png") => {
    const el = containerRef.current;
    if (!el) return;
    try {
      const dataUrl = await toPng(el, {
        cacheBust: true,
        backgroundColor: "var(--color-bg-card)",
        pixelRatio: 2,
      });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = filename;
      a.click();
    } catch (e) {
      console.error("Chart export failed:", e);
    }
  }, [containerRef]);

  return { exportChart };
}
