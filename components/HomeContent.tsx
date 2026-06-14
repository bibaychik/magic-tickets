"use client";

import { useState } from "react";
import type { Event } from "@/lib/events";
import HeroSection from "./HeroSection";
import EventGrid from "./EventGrid";
import EventDetailModal from "./EventDetailModal";

interface HomeContentProps {
  featuredEvent: Event | null;
  activeEvents: Event[];
  archivedEvents: Event[];
}

export default function HomeContent({
  featuredEvent,
  activeEvents,
  archivedEvents,
}: HomeContentProps) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const handlePurchase = () => {
    if (!selectedEvent) return;
    alert(`Покупка билетов: ${selectedEvent.title}`);
  };

  const handleQuickBuy = (event: Event) => {
    alert(`Быстрая покупка: ${event.title}`);
  };

  return (
    <>
      {featuredEvent && (
        <HeroSection
          event={featuredEvent}
          onOpenDetail={() => setSelectedEvent(featuredEvent)}
        />
      )}

      <EventGrid
        activeEvents={activeEvents}
        archivedEvents={archivedEvents}
        onOpenDetail={setSelectedEvent}
        onQuickBuy={handleQuickBuy}
      />

      <EventDetailModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onPurchase={handlePurchase}
      />
    </>
  );
}
