export interface EventItem {
  title: string;
  image: string;
  date: string;
  time: string;
  location: string;
  url: string;
  slug: string;
}

export const events: EventItem[] = [
  {
    title: "React Summit",
    image: "/images/event1.png",
    date: "June 10-12, 2026",
    time: "09:00–18:00 CEST",
    location: "Amsterdam, NL",
    url: "https://reactsummit.com/",
    slug: "1"
  },
  {
    title: "KubeCon + CloudNativeCon",
    image: "/images/event2.png",
    date: "May 5-8, 2026",
    time: "10:00–17:30 PDT",
    location: "San Diego, CA",
    url: "https://events.linuxfoundation.org/kubecon-cloudnativecon/",
    slug: "2"
  },
  {
    title: "JSConf EU",
    image: "/images/event3.png",
    date: "September 2026",
    time: "09:30–18:00 CEST",
    location: "Berlin, DE",
    url: "https://jsconf.eu/",
    slug: "3"
  },
  {
    title: "HackMIT",
    image: "/images/event4.png",
    date: "November 14-16, 2026",
    time: "18:00–09:00 ET (overnight hack)",
    location: "Cambridge, MA",
    url: "https://hackmit.org/",
    slug: "4"
  },
  {
    title: "Microsoft Build",
    image: "/images/event5.png",
    date: "May 2026",
    time: "09:00–17:00 PDT",
    location: "Seattle, WA",
    url: "https://mybuild.microsoft.com/",
    slug: "5"
  },
  {
    title: "AWS re:Invent",
    image: "/images/event6.png",
    date: "December 2026",
    time: "08:30–18:00 PST",
    location: "Las Vegas, NV",
    url: "https://reinvent.awsevents.com/",
    slug: "6"
  },
  {
    title: "Local Dev Meetup — React & Next",
    image: "/images/event-full.png",
    date: "Monthly",
    time: "18:30–20:30 Local",
    location: "Remote / Hybrid",
    url: "https://www.meetup.com/",
    slug: "7"
  }
];

export default events;
