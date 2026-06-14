import type { EventCity, EventStatus } from "@/sanity/schemaTypes/event";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";

export interface EventScheduleItem {
  city: EventCity | string;
  date: string;
  displayDate: string;
}

export interface Event {
  id: string;
  title: string;
  slug: string;
  eventType: string;
  status: EventStatus;
  effectiveStatus: EventStatus;
  posterUrl: string;
  heroPosterUrl: string;
  videoUrl?: string;
  description?: string;
  isMain: boolean;
  schedule: EventScheduleItem[];
  showTickets: boolean;
  date: string;
  createdAt: string;
}

interface SanityEventRaw {
  _id: string;
  _createdAt: string;
  title: string;
  slug: { current: string };
  eventType: string;
  status: EventStatus;
  poster?: { asset?: { _ref: string } };
  mainPoster?: { asset?: { _ref: string } };
  videoFile?: { asset?: { url: string } };
  description?: string;
  isMain?: boolean;
  schedule?: Array<{ _key: string; city: string; date: string }>;
  showTickets?: boolean;
}

// Поправили запрос: теперь берем videoUrl из videoFile.asset->url
const EVENTS_QUERY = `*[_type == "event"] | order(_createdAt desc) {
  _id,
  _createdAt,
  title,
  slug,
  eventType,
  status,
  poster,
  mainPoster,
  isMain,
  "videoUrl": videoFile.asset->url,
  description,
  schedule[]{
    _key,
    city,
    date
  },
  showTickets
}`;

const FETCH_OPTIONS = {
  cache: "no-store" as const,
  next: { revalidate: 0 },
};

function formatDisplayDate(isoDate: string): string {
  return new Date(isoDate).toLocaleString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getArchiveStartDate(eventDate: Date): Date {
  const archiveStart = new Date(eventDate);
  archiveStart.setDate(archiveStart.getDate() + 1);
  archiveStart.setHours(0, 0, 0, 0);
  return archiveStart;
}

export function isScheduleFullyPast(schedule: Pick<EventScheduleItem, "date">[]): boolean {
  if (schedule.length === 0) return false;
  const now = new Date();
  return schedule.every((item) => {
    const archiveStart = getArchiveStartDate(new Date(item.date));
    return now >= archiveStart;
  });
}

export function resolveEffectiveStatus(cmsStatus: EventStatus, schedule: Pick<EventScheduleItem, "date">[]): EventStatus {
  if (isScheduleFullyPast(schedule)) return "Архив";
  return cmsStatus;
}

function getDisplayDate(schedule: EventScheduleItem[]): string {
  if (schedule.length === 0) return "";
  const now = new Date();
  const upcoming = schedule
    .map((item) => ({ item, archiveStart: getArchiveStartDate(new Date(item.date)) }))
    .filter(({ archiveStart }) => now < archiveStart)
    .sort((a, b) => new Date(a.item.date).getTime() - new Date(b.item.date).getTime());

  return upcoming.length > 0 ? upcoming[0].item.displayDate : schedule[schedule.length - 1].displayDate;
}

function buildPosterUrl(image: SanityEventRaw["poster"], width: number, height: number): string | null {
  if (!image) return null;
  return urlFor(image).width(width).height(height).quality(90).url();
}

function transformEvent(doc: SanityEventRaw): Event {
  const schedule: EventScheduleItem[] = (doc.schedule ?? []).map((item) => ({
    city: item.city,
    date: item.date,
    displayDate: formatDisplayDate(item.date),
  }));

  const posterUrl = buildPosterUrl(doc.poster, 800, 1000) ?? "/placeholder-poster.jpg";
  const heroPosterUrl = buildPosterUrl(doc.mainPoster, 1920, 1080) ?? buildPosterUrl(doc.poster, 1920, 1080) ?? posterUrl;
  const effectiveStatus = resolveEffectiveStatus(doc.status, schedule);

  // doc.videoUrl теперь приходит заполненным из запроса
  return {
    id: doc._id,
    title: doc.title,
    slug: doc.slug.current,
    eventType: doc.eventType,
    status: doc.status,
    effectiveStatus,
    posterUrl,
    heroPosterUrl,
    videoUrl: (doc as any).videoUrl, 
    description: doc.description,
    isMain: doc.isMain ?? false,
    schedule,
    showTickets: doc.showTickets ?? true,
    date: getDisplayDate(schedule),
    createdAt: doc._createdAt,
  };
}

export async function getEvents(): Promise<Event[]> {
  const docs = await client.withConfig({ useCdn: false }).fetch<SanityEventRaw[]>(EVENTS_QUERY, {}, FETCH_OPTIONS);
  return docs.map(transformEvent);
}

export function splitEventsByArchive(events: Event[]) {
  const active = events.filter((event) => event.effectiveStatus !== "Архив");
  const archived = events.filter((event) => event.effectiveStatus === "Архив");
  return { active, archived };
}

export function pickFeaturedEvent(events: Event[]): Event | null {
  if (events.length === 0) return null;
  const mainEvent = events.find((event) => event.isMain);
  if (mainEvent) return mainEvent;
  const latest = [...events].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return latest[0] ?? null;
}