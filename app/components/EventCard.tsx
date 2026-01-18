import Image from "next/image";
import Link from "next/link";

interface props{
    title: string;
    image: string;
    slug: string;
    time: string;
    date: string;
    location: string;
}

const EventCard = ({ title, image, slug, time, date, location}: props) => {
    return (
        <Link href={`/events/${slug}`} id="event-card">
            <Image src={image} alt={title} width={410} height={300} className="poster" />
            <div className="flex flex-row gap-2">
                <Image src="/icons/pin.svg" alt="location" width={14} height={14} />
                <p>{location}</p>
            </div>
            <h2 className='title'>{title}</h2>

            <div className="datetime">
                <div>
                    <Image src="/icons/calendar.svg" alt="date" width={14} height={14} />
                    <p>{date}</p>
                </div>
                <div>
                    <Image src="/icons/clock.svg" alt="time" width={14} height={14} />
                    <p>{time}</p>
                </div>
            </div>
        </Link>
    )
}

export default EventCard