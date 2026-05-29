"use client";

import { useEffect, useImperativeHandle, useRef, useState, forwardRef } from "react";
import { cn } from "@/lib/cn";

export type SignaturePadHandle = {
  isEmpty: () => boolean;
  clear: () => void;
  toDataURL: () => string;
};

type Props = {
  onChange?: (empty: boolean) => void;
  className?: string;
  height?: number;
  ariaLabel?: string;
};

type Point = { x: number; y: number };

/** Accessible canvas signature pad (pointer events, DPR-aware). Themed for a
 *  light surface — reads its own background + the --color-ink token so the
 *  drawing surface blends with the card it sits in. */
export const SignaturePad = forwardRef<SignaturePadHandle, Props>(
  function SignaturePad({ onChange, className, height = 220, ariaLabel = "Signature pad" }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const drawing = useRef(false);
    const lastPoint = useRef<Point | null>(null);
    const hasContent = useRef(false);
    const dpr = useRef(1);
    const [empty, setEmpty] = useState(true);

    const colors = () => {
      const container = containerRef.current;
      const root = getComputedStyle(document.documentElement);
      const bgRaw = container ? getComputedStyle(container).backgroundColor : "";
      const fill = bgRaw && bgRaw !== "rgba(0, 0, 0, 0)" ? bgRaw : "#f4efe6";
      const stroke = root.getPropertyValue("--color-ink").trim() || "#16140f";
      return { fill, stroke };
    };

    const setCanvasSize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;
      const rect = container.getBoundingClientRect();
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      dpr.current = ratio;
      canvas.width = Math.floor(rect.width * ratio);
      canvas.height = Math.floor(height * ratio);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${height}px`;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.scale(ratio, ratio);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      const { fill, stroke } = colors();
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 2.2;
      ctx.fillStyle = fill;
      ctx.fillRect(0, 0, rect.width, height);
    };

    useEffect(() => {
      setCanvasSize();
      const onResize = () => {
        const wasEmpty = !hasContent.current;
        setCanvasSize();
        if (!wasEmpty) {
          hasContent.current = false;
          setEmpty(true);
          onChange?.(true);
        }
      };
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [height]);

    const getPoint = (e: PointerEvent | React.PointerEvent): Point => {
      const canvas = canvasRef.current!;
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
      e.preventDefault();
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.setPointerCapture(e.pointerId);
      drawing.current = true;
      const p = getPoint(e);
      lastPoint.current = p;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      if (e.pointerType === "pen" && e.pressure) {
        ctx.lineWidth = Math.max(1.2, Math.min(3.4, e.pressure * 3.4));
      } else {
        ctx.lineWidth = 2.2;
      }
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x + 0.01, p.y + 0.01);
      ctx.stroke();
      hasContent.current = true;
      if (empty) {
        setEmpty(false);
        onChange?.(false);
      }
    };

    const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!drawing.current) return;
      e.preventDefault();
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const p = getPoint(e);
      const prev = lastPoint.current ?? p;
      if (e.pointerType === "pen" && e.pressure) {
        ctx.lineWidth = Math.max(1.2, Math.min(3.4, e.pressure * 3.4));
      }
      const mid = { x: (prev.x + p.x) / 2, y: (prev.y + p.y) / 2 };
      ctx.quadraticCurveTo(prev.x, prev.y, mid.x, mid.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(mid.x, mid.y);
      lastPoint.current = p;
    };

    const end = (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!drawing.current) return;
      const canvas = canvasRef.current;
      try {
        canvas?.releasePointerCapture(e.pointerId);
      } catch {}
      drawing.current = false;
      lastPoint.current = null;
    };

    const clearRef = useRef<() => void>(() => {});
    clearRef.current = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = colors().fill;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
      ctx.beginPath();
      hasContent.current = false;
      if (!empty) {
        setEmpty(true);
        onChange?.(true);
      }
    };
    const clear = () => clearRef.current();

    useImperativeHandle(
      ref,
      (): SignaturePadHandle => ({
        isEmpty: () => !hasContent.current,
        clear: () => clearRef.current(),
        toDataURL: () => canvasRef.current?.toDataURL("image/png") ?? "",
      }),
      [],
    );

    return (
      <div
        ref={containerRef}
        className={cn("relative w-full select-none overflow-hidden rounded-card border border-hairline bg-panel", className)}
        style={{ height }}
      >
        <canvas
          ref={canvasRef}
          aria-label={ariaLabel}
          role="img"
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={end}
          onPointerCancel={end}
          onPointerLeave={end}
          className="block h-full w-full touch-none rounded-card"
          style={{ touchAction: "none", cursor: "crosshair" }}
        />
        {empty && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-baseline justify-between border-t border-hairline px-4 py-3">
            <span className="font-display italic text-muted">Sign here</span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-muted">Use a finger, mouse, or stylus</span>
          </div>
        )}
        {!empty && (
          <button
            type="button"
            onClick={clear}
            className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-hairline bg-panel/90 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-muted transition-colors hover:border-tungsten hover:text-ink"
          >
            Clear
          </button>
        )}
      </div>
    );
  },
);
