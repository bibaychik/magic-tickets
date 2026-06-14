import Header from "@/components/Header";
import HomeContent from "@/components/HomeContent";
import Footer from "@/components/Footer";
import {
  getEvents,
  pickFeaturedEvent,
  splitEventsByArchive,
} from "@/lib/events";

export const dynamic = "force-dynamic";

export default async function Home() {
  const events = await getEvents();
  const { active, archived } = splitEventsByArchive(events);
  const featuredEvent = pickFeaturedEvent(events);

  return (
    <>
      <Header />
      <main>
        <HomeContent
          featuredEvent={featuredEvent}
          activeEvents={active}
          archivedEvents={archived}
        />
      </main>
      <Footer />
    </>
  );
}
