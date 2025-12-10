import { sanityFetch } from "@/sanity/lib/fetch";
import { eventsQuery } from "@/sanity/lib/queries";
import DateComponent from "@/src/components/date";

export default async function EventsPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params
    const events = await sanityFetch({ query: eventsQuery, params: { language: locale } })

    return (
        <div className="container mx-auto px-5">
            <h1 className="mb-12 text-6xl font-bold md:text-7xl lg:text-8xl">Events</h1>
            <div>
                {events?.map((event) => (
                    <div key={event._id} className="mb-4">
                        <div className="font-bold">{event.title}</div>
                        <div>{event.type}</div>
                        <div>{event.location}</div>
                        {event.start && <DateComponent dateString={event.start} />}
                    </div>
                ))}
            </div>
        </div>
    )
}