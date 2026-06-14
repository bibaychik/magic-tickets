"use client";

import { useState } from "react";
import type { Event } from "@/lib/events";
import EventCard from "./EventCard";

interface EventGridProps {
  activeEvents: Event[];
  archivedEvents: Event[];
  onOpenDetail: (event: Event) => void;
  onQuickBuy: (event: Event) => void;
}

export default function EventGrid({
  activeEvents,
  archivedEvents,
  onOpenDetail,
  onQuickBuy,
}: EventGridProps) {
  const [showArchive, setShowArchive] = useState(false);

  return (
    <section className="px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-8 text-2xl font-semibold tracking-tight text-white">
          Ближайшие концерты
        </h2>

        {activeEvents.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {activeEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onOpenDetail={() => onOpenDetail(event)}
                onQuickBuy={() => onQuickBuy(event)}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-white/50">Скоро появятся новые события.</p>
        )}

        {archivedEvents.length > 0 && (
          <div className="mt-16 border-t border-white/10 pt-8">
            <button
              type="button"
              onClick={() => setShowArchive((prev) => !prev)}
              className="text-sm tracking-wide text-white/40 transition-colors hover:text-white/70"
            >
              {showArchive ? "Скрыть историю" : "История"}
            </button>

            {showArchive && (
              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {archivedEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onOpenDetail={() => onOpenDetail(event)}
                    onQuickBuy={() => onQuickBuy(event)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
