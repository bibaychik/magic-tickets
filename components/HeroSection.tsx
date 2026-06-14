import Image from "next/image";
import type { Event } from "@/lib/events";

interface HeroSectionProps {
  event: Event;
  onOpenDetail: () => void;
}

export default function HeroSection({ event, onOpenDetail }: HeroSectionProps) {
  return (
    <section className="relative h-[75vh] w-full">
      <Image
        src={event.heroPosterUrl}
        alt={event.title}
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

      <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-24 pt-32">
        <div className="mx-auto w-full max-w-7xl">
          <p className="mb-3 text-sm uppercase tracking-[0.2em] text-white/60">
            Главное событие
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl md:text-6xl">
            {event.title}
          </h1>
          <p className="mt-4 text-lg text-white/70">{event.date}</p>
          <button
            type="button"
            onClick={onOpenDetail}
            className="mt-8 rounded-full bg-white px-8 py-3 text-sm font-medium tracking-wide text-black transition-opacity hover:opacity-90"
          >
            Купить билет
          </button>
        </div>
      </div>
    </section>
  );
}
