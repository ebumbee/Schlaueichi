import React, { useRef, useEffect, useState } from 'react';
import { Eraser, CheckCircle2 } from 'lucide-react';
import { GermanFontStyle } from '../types';

interface GermanTracingCanvasProps {
  letter: string;
  fontStyle: GermanFontStyle;
  color: string;
  onComplete: () => void;
}

export default function GermanTracingCanvas({ letter, fontStyle, color, onComplete }: GermanTracingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasStartedTracing, setHasStartedTracing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        // Important: don't resize if size hasn't actually changed to avoid unnecessary clearing
        if (canvas.width === container.clientWidth && canvas.height === container.clientHeight) return;
        
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        clearCanvas();
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });

    const container = canvas.parentElement;
    if (container) {
      resizeObserver.observe(container);
    }

    resizeCanvas();
    return () => resizeObserver.disconnect();
  }, [letter, fontStyle]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasStartedTracing(false);
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    setHasStartedTracing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx) ctx.beginPath();
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    let x, y;

    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    ctx.lineWidth = 15;
    ctx.lineCap = 'round';
    ctx.strokeStyle = color;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto">
      <div className="relative w-full h-[350px] md:h-[500px] bg-gray-50 rounded-[32px] md:rounded-[40px] overflow-hidden border-4 border-dashed border-gray-200">
        {/* Ghost Letter - Dashed and Opaque */}
        <svg 
          viewBox="0 0 400 400"
          preserveAspectRatio="xMidYMid meet"
          className="absolute inset-0 w-full h-full pointer-events-none select-none"
        >
          <text
            x="200"
            y="200"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="300"
            className={fontStyle === 'CURSIVE' ? 'font-school' : 'font-display font-medium'}
            fill="none"
            stroke="#D1D5DB"
            strokeWidth="3"
            strokeDasharray="10,8"
          >
            {letter}
          </text>
        </svg>

        {/* Drawing Canvas */}
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
        />
      </div>

      {/* Controls - Outside the drawing area */}
      <div className="flex justify-between items-center px-2">
        <button
          onClick={clearCanvas}
          className="p-4 bg-white rounded-2xl kid-shadow kid-shadow-hover text-gray-400 hover:text-brand-red transition-all active:scale-95"
          title="Radieren"
        >
          <Eraser className="w-8 h-8" />
        </button>
        <button
          onClick={onComplete}
          disabled={!hasStartedTracing}
          className={`px-10 py-4 rounded-2xl kid-shadow transition-all flex items-center gap-3 font-display font-bold text-white
            ${hasStartedTracing ? 'bg-brand-green scale-105 active:scale-95' : 'bg-gray-300 opacity-50 cursor-not-allowed'}
          `}
        >
          <CheckCircle2 className="w-8 h-8" />
          <span className="text-xl">Fertig!</span>
        </button>
      </div>
    </div>
  );
}
