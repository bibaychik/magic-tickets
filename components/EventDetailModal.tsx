"use client";

import Image from "next/image";
import { useEffect } from "react";
import type { Event } from "@/lib/events";

interface EventDetailModalProps {
  event: Event | null;
  onClose: () => void;
  onPurchase: () => void;
}

export default function EventDetailModal({
  event,
  onClose,
  onPurchase,
}: EventDetailModalProps) {
  useEffect(() => {
    if (!event) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [event, onClose]);

  if (!event) return null;

  const canPurchase =
    event.showTickets &&
    event.effectiveStatus !== "Отмена" &&
    event.effectiveStatus !== "Архив" &&
    event.effectiveStatus !== "Sold out";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-neutral-900 sm:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Закрыть"
          className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          onClick={onClose}
        >
          ✕
        </button>

        <div className="relative aspect-[4/5] w-full sm:aspect-auto sm:min-h-[480px] sm:w-2/5">
          <Image
            src={event.posterUrl}
            alt={event.title}
            fill
            className="rounded-t-3xl object-cover sm:rounded-l-3xl sm:rounded-tr-none"
            sizes="(max-width: 640px) 100vw, 40vw"
          />
        </div>

        <div className="flex flex-1 flex-col justify-between p-6 sm:p-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/40">
              {event.eventType}
            </p>
            <h2 className="mt-2 pr-8 text-2xl font-semibold leading-tight text-white sm:text-3xl">
              {event.title}
            </h2>
            <p className="mt-2 text-sm text-white/50">
              Статус: {event.effectiveStatus}
            </p>

            {event.description && (
              <p className="mt-4 text-sm leading-relaxed text-white/70">
                {event.description}
              </p>
            )}

            <div className="mt-6 space-y-3">
              <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                Расписание
              </p>
              <ul className="space-y-2">
                {event.schedule.map((stop) => (
                  <li
                    key={`${stop.city}-${stop.date}`}
                    className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-2 text-sm"
                  >
                    <span className="text-white/80">{stop.city}</span>
                    <span className="text-white/50">{stop.displayDate}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {canPurchase && (
            <div className="mt-8 flex justify-end">
              <button
                type="button"
                aria-label="Перейти к покупке"
                className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-white transition-colors hover:bg-orange-400"
                onClick={onPurchase}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
