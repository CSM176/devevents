import EventCard from "./components/EventCard"
import ExploreBtn from "./components/ExploreBtn"
import events from "@/lib/constants"

const Home = () => {
  console.log('What type of a component am i?')


  return (
    <main>
      <section>
        <h1 className="text-center">The hub for every dev <br /> event you can't miss.</h1>
        <p className="text-center mt-5">Hackathons, meetups, conferences, all in one place.</p>
        <ExploreBtn />

        <div className="mt-20 space-y-7">
          <h3>Featured Events</h3>

          <ul className="events">{events.map((event) => (
            <EventCard title={event.title} image={event.image} slug={event.slug} location={event.location} date={event.date} time={event.time}  />
          ))}</ul>
        </div>
      </section>
    </main>

  )
}

export default Home