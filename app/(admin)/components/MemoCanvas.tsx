"use client";

import { useRef, useState, useCallback, useEffect } from "react";

type Mode = "pen" | "keyboard";

export default function MemoCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<Mode>("pen");
  const [isDrawing, setIsDrawing] = useState(false);
  const [textContent, setTextContent] = useState("");
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  const getCoordinates = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    },
    []
  );

  const draw = useCallback(
    (x: number, y: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      if (lastPosRef.current) {
        ctx.beginPath();
        ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
      lastPosRef.current = { x, y };
    },
    []
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const pos = getCoordinates(e);
      lastPosRef.current = pos;
      setIsDrawing(true);
    },
    [getCoordinates]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDrawing) return;
      const pos = getCoordinates(e);
      draw(pos.x, pos.y);
    },
    [isDrawing, getCoordinates, draw]
  );

  const handleMouseUp = useCallback(() => {
    setIsDrawing(false);
    lastPosRef.current = null;
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsDrawing(false);
    lastPosRef.current = null;
  }, []);

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  const handleClearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  const handleClearText = useCallback(() => {
    setTextContent("");
  }, []);

  const handleClear = useCallback(() => {
    if (mode === "pen") {
      handleClearCanvas();
    } else {
      handleClearText();
    }
  }, [mode, handleClearCanvas, handleClearText]);

  useEffect(() => {
    if (canvasRef.current) {
      initCanvas();
    }
  }, [initCanvas]);

  const canvasRefCallback = useCallback(
    (el: HTMLCanvasElement | null) => {
      (canvasRef as React.MutableRefObject<HTMLCanvasElement | null>).current =
        el;
      if (el) {
        initCanvas();
        const resizeObserver = new ResizeObserver(() => {
          initCanvas();
        });
        resizeObserver.observe(el);
      }
    },
    [initCanvas]
  );

  return (
    <div className="mt-24 w-full max-w-4xl mx-auto rounded-xl border border-slate-200 bg-white shadow-md overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-200 bg-slate-50/80">
        <span className="text-sm font-medium text-slate-700">메모장</span>
      </div>
      <div className="p-3">
        <div className="relative rounded-lg border-2 border-dashed border-slate-300 overflow-hidden" style={{ backgroundColor: "#fffbeb" }}>
          {/* 펜/키보드 선택 */}
          <div className="absolute top-3 left-3 flex gap-1 z-10">
          <button
            type="button"
            onClick={() => setMode("keyboard")}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
              mode === "keyboard"
                ? "bg-slate-700 text-white"
                : "bg-white/90 text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            키보드
          </button>
          <button
            type="button"
            onClick={() => setMode("pen")}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
              mode === "pen"
                ? "bg-slate-700 text-white"
                : "bg-white/90 text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            펜
          </button>
          </div>

        {/* 펜 모드: 캔버스 */}
        {mode === "pen" && (
          <canvas
            ref={canvasRefCallback}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            className="block w-full h-[280px] memo-canvas-pen touch-none"
            style={{ backgroundColor: "#fffbeb" }}
          />
        )}

        {/* 키보드 모드: 직접 입력 영역 */}
        {mode === "keyboard" && (
          <textarea
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            placeholder="여기에 메모를 입력하세요"
            className="block w-full h-[280px] p-4 pt-12 text-sm text-slate-700 resize-none border-none outline-none placeholder:text-slate-400"
            style={{ backgroundColor: "#fffbeb" }}
          />
        )}

        <button
          type="button"
          onClick={handleClear}
          className="absolute bottom-3 right-3 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white/90 hover:bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow transition"
        >
          지우기
        </button>
        </div>
      </div>
    </div>
  );
}
