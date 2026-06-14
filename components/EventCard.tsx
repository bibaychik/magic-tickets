"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Event } from "@/lib/events";
import type { EventStatus } from "@/sanity/schemaTypes/event";

const PARTICLE_COUNT = 18;
const GRADIENT_COLORS = ["#f97316", "#ec4899", "#06b6d4", "#a855f7"];

interface Particle {
  id: number;
  size: number;
  color: string;
  startX: string;
  startY: string;
  endX: number;
  endY: number;
  duration: number;
  delay: number;
}

function createParticles(colors: string[]): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, id) => {
    const fromEdge = Math.random() > 0.4;
    let startX: string;
    let startY: string;

    if (fromEdge) {
      const edge = Math.floor(Math.random() * 4);
      switch (edge) {
        case 0:
          startX = `${Math.random() * 100}%`;
          startY = "0%";
          break;
        case 1:
          startX = "100%";
          startY = `${Math.random() * 100}%`;
          break;
        case 2:
          startX = `${Math.random() * 100}%`;
          startY = "100%";
          break;
        default:
          startX = "0%";
          startY = `${Math.random() * 100}%`;
      }
    } else {
      startX = `${35 + Math.random() * 30}%`;
      startY = `${35 + Math.random() * 30}%`;
    }

    const angle = Math.random() * Math.PI * 2;
    const distance = 30 + Math.random() * 50;

    return {
      id,
      size: Math.random() > 0.5 ? 2 : 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      startX,
      startY,
      endX: Math.cos(angle) * distance,
      endY: Math.sin(angle) * distance,
      duration: 2 + Math.random() * 2,
      delay: Math.random() * 3,
    };
  });
}

function ParticleEmitter({ colors }: { colors: string[] }) {
  const particles = useMemo(() => createParticles(colors), [colors]);

  return (
    <div className="pointer-events-none absolute inset-0 z-[-1] overflow-visible">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: particle.startX,
            top: particle.startY,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
          }}
          initial={{ x: 0, y: 0, opacity: 0 }}
          animate={{ x: particle.endX, y: particle.endY, opacity: [0, 1, 0] }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function StatusRibbon({
  label,
  className,
}: {
  label: string;
  className: string;
}) {
  return (
    <div
      className={`absolute top-5 -right-9 z-20 w-36 rotate-45 py-1 text-center text-[10px] font-bold tracking-widest text-white shadow-lg ${className}`}
    >
      {label}
    </div>
  );
}

function getStatusConfig(status: EventStatus, isHovered: boolean) {
  switch (status) {
    case "Sold out":
      return {
        ribbon: { label: "SOLD OUT", className: "bg-red-600" },
        wrapperShadow: isHovered
          ? "shadow-[0_0_45px_rgba(249,115,22,0.65)]"
          : "",
        particleColors: ["#f97316", "#ef4444", "#fbbf24"],
        showParticles: isHovered,
      };
    case "Архив":
      return {
        wrapperShadow: "",
        particleColors: GRADIENT_COLORS,
        showParticles: isHovered,
      };
    case "Перенос":
      return {
        ribbon: { label: "ПЕРЕНОС", className: "bg-orange-500" },
        wrapperShadow: isHovered
          ? "shadow-[0_0_40px_rgba(249,115,22,0.5)]"
          : "",
        particleColors: ["#f97316", "#fb923c", "#fbbf24"],
        showParticles: isHovered,
      };
    case "Отмена":
      return {
        ribbon: { label: "ОТМЕНА", className: "bg-red-600" },
        wrapperShadow: "",
        particleColors: GRADIENT_COLORS,
        showParticles: false,
      };
    default:
      return {
        wrapperShadow: isHovered
          ? "shadow-[0_0_50px_rgba(139,92,246,0.5)]"
          : "",
        particleColors: GRADIENT_COLORS,
        showParticles: isHovered,
      };
  }
}

interface EventCardProps {
  event: Event;
  onOpenDetail: () => void;
  onQuickBuy: () => void;
}

export default function EventCard({
  event,
  onOpenDetail,
  onQuickBuy,
}: EventCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const status = event.effectiveStatus;
  const statusConfig = getStatusConfig(status, isHovered);
  const showBuyButton =
    event.showTickets && status !== "Отмена" && status !== "Архив";

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handlePointerEnter = () => {
    setIsHovered(true);
    const video = videoRef.current;
    if (!video) return;
    video.play().catch(() => {});
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;
  };

  return (
    <article
      className="group cursor-pointer"
      onClick={onOpenDetail}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <div
        className={`relative rounded-3xl p-[2px] transition-shadow duration-500 ${statusConfig.wrapperShadow}`}
      >
        <div
          className={`pointer-events-none absolute inset-0 overflow-hidden rounded-3xl transition-opacity duration-300 ${
            isHovered && status !== "Архив" ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute inset-[-50%] animate-[spin_10s_linear_infinite] bg-[conic-gradient(from_0deg,#f97316,#ec4899,#06b6d4,#a855f7,#f97316)]" />
        </div>

        <div className="relative overflow-visible rounded-3xl bg-black">
          {isMounted && statusConfig.showParticles && (
            <ParticleEmitter colors={statusConfig.particleColors ?? GRADIENT_COLORS} />
          )}

          <div className="relative z-[1] aspect-[4/5] w-full overflow-hidden rounded-3xl">
            {statusConfig.ribbon && (
              <StatusRibbon
                label={statusConfig.ribbon.label}
                className={statusConfig.ribbon.className}
              />
            )}

            <Image
              src={event.posterUrl}
              alt={event.title}
              fill
              className={`object-cover transition-all duration-500 ${
                isHovered ? "scale-105" : "scale-100"
              } ${
                status === "Архив"
                  ? isHovered
                    ? "grayscale-0"
                    : "grayscale"
                  : ""
              }`}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            />

            {event.videoUrl && (
              <video
                ref={videoRef}
                src={event.videoUrl}
                muted
                loop
                playsInline
                preload="none"
                className={`absolute inset-0 z-[1] h-full w-full object-cover transition-opacity duration-500 ${
                  isHovered ? "opacity-100" : "opacity-0"
                }`}
              />
            )}

            {showBuyButton && (
              <button
                type="button"
                aria-label="Быстрая покупка"
                className="absolute right-3 bottom-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-orange-500"
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickBuy();
                }}
              >
                ₸
              </button>
            )}
          </div>
        </div>
      </div>

      <h3 className="mt-3 text-sm font-medium leading-snug text-white">
        {event.title}
      </h3>
      <p className="mt-1 text-xs text-white/50">{event.date}</p>
    </article>
  );
}
