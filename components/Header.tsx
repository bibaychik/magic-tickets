"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

const cities = ["Алматы", "Астана", "Караганда", "Шымкент"];

const NEON_COLORS = ["#06b6d4", "#ec4899", "#a855f7", "#f97316"];
const MAX_SPARKS = 15;

interface MouseSpark {
  id: number;
  x: number;
  y: number;
  endX: number;
  endY: number;
  color: string;
  size: number;
}

function createSpark(x: number, y: number, id: number): MouseSpark {
  return {
    id,
    x,
    y,
    endX: (Math.random() - 0.5) * 40,
    endY: -(20 + Math.random() * 50),
    color: NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)],
    size: 1 + Math.floor(Math.random() * 2),
  };
}

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const sparkIdRef = useRef(0);
  const lastSparkTime = useRef(0);
  const [isMounted, setIsMounted] = useState(false);
  const [sparks, setSparks] = useState<MouseSpark[]>([]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const removeSpark = useCallback((id: number) => {
    setSparks((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!isMounted || !headerRef.current) return;

    const now = Date.now();
    if (now - lastSparkTime.current < 80) return;
    lastSparkTime.current = now;

    const rect = headerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const batchSize = 2 + Math.floor(Math.random() * 2);
    const batch = Array.from({ length: batchSize }, () =>
      createSpark(x, y, sparkIdRef.current++),
    );

    setSparks((prev) => [...prev, ...batch].slice(-MAX_SPARKS));
  };

  return (
    <header
      ref={headerRef}
      className="fixed top-0 right-0 left-0 z-50 bg-black"
      onMouseMove={handleMouseMove}
    >
      <div className="pointer-events-none absolute inset-0 z-[-1] animate-pulse bg-gradient-to-t from-cyan-500/10 via-purple-500/5 to-transparent" />

      {isMounted && (
        <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
          <AnimatePresence>
            {sparks.map((spark) => (
              <motion.div
                key={spark.id}
                className="absolute rounded-full"
                style={{
                  left: spark.x,
                  top: spark.y,
                  width: spark.size,
                  height: spark.size,
                  backgroundColor: spark.color,
                  boxShadow: `0 0 ${spark.size * 4}px ${spark.color}`,
                }}
                initial={{ x: 0, y: 0, opacity: 0.8 }}
                animate={{ x: spark.endX, y: spark.endY, opacity: 0 }}
                transition={{ duration: 2, ease: "easeOut" }}
                onAnimationComplete={() => removeSpark(spark.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      <div className="relative z-10 mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <a href="/" className="text-lg font-semibold tracking-wide text-white">
          MagicConcerts
        </a>

        <label className="flex items-center gap-2 text-sm text-white/80">
          <span className="hidden sm:inline">Город</span>
          <select
            defaultValue={cities[0]}
            className="cursor-pointer rounded-md border border-white/20 bg-white/5 px-3 py-1.5 text-white outline-none transition-colors hover:border-white/40 focus:border-white/50"
          >
            {cities.map((city) => (
              <option key={city} value={city} className="bg-black text-white">
                {city}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="magic-border absolute right-0 bottom-0 left-0 z-[5] h-[2px] shadow-[0_0_20px_rgba(6,182,212,0.5),0_0_40px_rgba(236,72,153,0.45)]" />
    </header>
  );
}
