import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import EventCard from '../components/events/EventCard';
import { 
  Calendar, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Users, 
  Flame, 
  Award,
  Laptop,
  Music,
  Trophy,
  BookOpen,
  MapPin,
  CheckCircle2
} from 'lucide-react';

const CATEGORY_CARDS = [
  {
    name: 'Technical',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80',
    desc: 'Hackathons, coding challenges, and AI symposiums',
    tag: 'ACM & IEEE Chapters',
  },
  {
    name: 'Cultural',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
    desc: 'Dance, drama, music bands, and art exhibitions',
    tag: 'Aura Flagship Fest',
  },
  {
    name: 'Sports',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80',
    desc: 'Badminton, basketball, cricket, and athletics',
    tag: 'SIT Spardha League',
  },
  {
    name: 'Workshop',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80',
    desc: 'Hands-on developer bootcamps & robotics',
    tag: 'Skill Certifications',
  },
  {
    name: 'Academic',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80',
    desc: 'Research paper presentations and guest talks',
    tag: 'Faculty & Scholars',
  },
];

const CAMPUS_GALLERY = [
  {
    title: 'High-Performance Computing Lab',
    desc: 'Hosts our 24-hour hackathons and hands-on AI bootcamps.',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
    tag: 'Tech Arena',
  },
  {
    title: 'Open Air Amphitheatre',
    desc: 'Flagship venue for musical performances and Aura cultural night.',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80',
    tag: 'Cultural Hub',
  },
  {
    title: 'Indoor Sports Complex',
    desc: 'Multi-court arena for badminton, table tennis, and tournaments.',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80',
    tag: 'Athletics',
  },
  {
    title: 'Central Academic Library',
    desc: 'Research archives, study carrels, and symposium conference rooms.',
    image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&auto=format&fit=crop&q=80',
    tag: 'Research',
  },
];

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await api.getEvents();
        setEvents(data.events || []);
      } catch (err) {
        console.error('Failed to load events:', err);
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, []);

  const featuredEvent = events[0] || null;
  const upcomingEvents = events.slice(1, 4);

  return (
    <div className="space-y-16 pb-20 bg-[#FBF8F1]">
      {/* 1. HERO SECTION: Main Background is Ivory with Gold & Dark Blue */}
      <section className="bg-[#FAF6ED] border-b border-[#E5DCCB] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 animate-fade-in">
              {/* Gold & Dark Blue Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-[#FBF0D9] text-[#0B192C] border border-[#C69214]">
                <Award className="w-4 h-4 text-[#C69214]" />
                <span>Symbiosis Institute of Technology, Nagpur</span>
                <span className="text-[#C69214]">|</span>
                <span className="text-slate-600 font-medium">Campus Events</span>
              </div>

              {/* Bold Navy Blue Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0B192C] tracking-tight leading-[1.12]">
                Elevate Your Campus Life. <br />
                <span className="text-[#0B192C]">
                  Connect. Compete. Celebrate.
                </span>
              </h1>

              {/* Readable Navy Blue Content */}
              <p className="text-base sm:text-lg text-[#0B192C]/80 max-w-xl leading-relaxed font-normal">
                CampusConnect is the dedicated student event gateway for SIT Nagpur. Discover annual hackathons, 
                cultural evenings, robotics competitions, and sports tournaments with guaranteed seat reservation.
              </p>

              {/* Action Buttons with Proper Gold Coloring */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  to="/events"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-black text-[#070F1E] bg-[#C69214] hover:bg-[#AF7F0E] hover:text-white shadow-md shadow-[#C69214]/25 transition-all duration-200 border border-[#D8A938]"
                >
                  <span>Browse All Events</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </Link>
                <Link
                  to="/auth?tab=register"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-[#0B192C] bg-white border border-[#E5DCCB] hover:border-[#C69214] hover:bg-[#FAF8F5] transition-all duration-200 shadow-2xs"
                >
                  <span>Student Registration</span>
                </Link>
              </div>

              {/* Quick Metrics in Navy Blue */}
              <div className="pt-8 grid grid-cols-3 gap-6 max-w-md border-t border-[#E5DCCB]">
                <div>
                  <p className="text-3xl font-black text-[#0B192C]">500+</p>
                  <p className="text-xs font-bold text-[#0B192C] mt-0.5">Active Students</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-[#0B192C]">6</p>
                  <p className="text-xs font-bold text-[#0B192C] mt-0.5">Event Domains</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-[#0B192C]">100%</p>
                  <p className="text-xs font-bold text-emerald-800 mt-0.5">Verified Students</p>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card (Internet Imagery, No Empty Space) */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border-2 border-[#E5DCCB] shadow-xl bg-white p-2">
                <img
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1000&auto=format&fit=crop&q=80"
                  alt="Students Collaborating at SIT Nagpur"
                  className="w-full h-80 sm:h-96 object-cover rounded-xl"
                />
                <div className="absolute bottom-6 left-6 right-6 bg-[#FAF6ED]/95 backdrop-blur-md p-4 rounded-xl border border-[#E5DCCB] shadow-md flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black text-[#0B192C]">SIT Nagpur Campus Quad</p>
                    <p className="text-[11px] text-slate-600">Central Student Hub & Plaza</p>
                  </div>
                  <span className="text-[11px] font-black px-2.5 py-1 rounded bg-[#C69214] text-[#070F1E]">
                    Verified
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. CATEGORY SHOWCASE CARDS (Rich Imagery, No empty gaps) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5DCCB] pb-4">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-[#0B192C]">
              Campus Domains
            </span>
            <h2 className="text-2xl font-black text-[#0B192C] mt-0.5">
              Explore Events by Category
            </h2>
          </div>
          <Link
            to="/events"
            className="text-xs font-bold text-[#0B192C] hover:text-[#C69214] flex items-center gap-1.5 transition"
          >
            <span>View all categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 5 Column Image Cards with Ivory Canvas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {CATEGORY_CARDS.map((cat) => (
            <Link
              key={cat.name}
              to={`/events?category=${cat.name}`}
              className="group relative rounded-2xl overflow-hidden h-64 border border-[#E5DCCB] card-hover-lift shadow-xs flex flex-col justify-end p-5 text-white"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
              
              <div className="relative z-10 space-y-1">
                <span className="inline-block text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-[#C69214] text-[#070F1E] mb-1">
                  {cat.tag}
                </span>
                <h3 className="text-lg font-black text-white group-hover:text-[#E5A93C] transition">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-slate-200 line-clamp-2 leading-relaxed">
                  {cat.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FEATURED SPOTLIGHT EVENT (Ivory Container with Dark Blue & Gold) */}
      {featuredEvent && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center justify-between border-b border-[#E5DCCB] pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#FAF6ED] text-[#0B192C] border border-[#E5DCCB]">
                <Flame className="w-5 h-5 text-[#C69214]" />
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-[#0B192C]">
                  Highlight
                </span>
                <h2 className="text-2xl font-black text-[#0B192C]">
                  Flagship Event of the Semester
                </h2>
              </div>
            </div>
            <span className="text-xs font-bold text-[#070F1E] bg-[#FBF0D9] border border-[#C69214] px-3.5 py-1 rounded-full shadow-2xs">
              Fast Filling
            </span>
          </div>

          <div className="bg-[#FFFDF9] rounded-2xl border border-[#E5DCCB] overflow-hidden grid grid-cols-1 md:grid-cols-12 shadow-sm card-hover-lift">
            <div className="md:col-span-5 h-80 md:h-auto bg-[#F2ECE0] relative overflow-hidden group">
              {featuredEvent.poster_url && (
                <img
                  src={featuredEvent.poster_url}
                  alt={featuredEvent.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-106"
                />
              )}
            </div>

            <div className="md:col-span-7 p-8 sm:p-12 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-xs font-black px-3 py-1 rounded-full bg-[#FAF6ED] text-[#0B192C] border border-[#C69214]">
                    {featuredEvent.category}
                  </span>
                  <span className="text-xs text-slate-600">
                    Organized by <strong className="text-[#0B192C] font-semibold">{featuredEvent.organizer_name}</strong>
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-[#0B192C] leading-snug">
                  {featuredEvent.title}
                </h3>

                <p className="text-sm text-[#0B192C]/80 leading-relaxed font-normal">
                  {featuredEvent.description}
                </p>
              </div>

              <div className="pt-6 border-t border-[#E5DCCB] flex flex-wrap items-center justify-between gap-4">
                <div className="text-xs text-slate-700 space-y-1.5">
                  <p className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#C69214]" />
                    <span className="font-semibold text-[#0B192C]">{featuredEvent.venue}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#C69214]" />
                    <span>
                      <strong className="text-[#0B192C] font-bold">{featuredEvent.available_seats}</strong> seats available of {featuredEvent.capacity}
                    </span>
                  </p>
                </div>

                <Link
                  to={`/events/${featuredEvent.id}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black text-[#070F1E] bg-[#C69214] hover:bg-[#AF7F0E] hover:text-white shadow-md shadow-[#C69214]/25 transition-all border border-[#D8A938]"
                >
                  <span>Reserve Seat</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. UPCOMING EVENTS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between border-b border-[#E5DCCB] pb-4">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-[#0B192C]">
              Schedule
            </span>
            <h2 className="text-2xl font-black text-[#0B192C] mt-0.5">
              Upcoming College Activities
            </h2>
          </div>
          <Link
            to="/events"
            className="text-xs font-bold text-[#0B192C] hover:text-[#C69214] flex items-center gap-1.5 transition"
          >
            <span>Explore full calendar ({events.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="py-20 text-center text-sm font-semibold text-slate-600">
            Loading campus schedule...
          </div>
        ) : upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((evt) => (
              <EventCard key={evt.id} event={evt} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#FFFDF9] rounded-2xl border border-[#E5DCCB] text-sm text-slate-600">
            No upcoming events scheduled right now.
          </div>
        )}
      </section>

      {/* 5. CAMPUS LIFE GALLERY (Rich Imagery, No empty space) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="border-b border-[#E5DCCB] pb-4">
          <span className="text-xs font-black uppercase tracking-wider text-[#0B192C]">
            Campus Venues
          </span>
          <h2 className="text-2xl font-black text-[#0B192C] mt-0.5">
            Life at Symbiosis Institute of Technology
          </h2>
          <p className="text-xs text-[#0B192C]/80 mt-1">
            State-of-the-art campus infrastructure hosting student innovation, cultural nights, and athletic championships.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CAMPUS_GALLERY.map((gal) => (
            <div
              key={gal.title}
              className="bg-[#FFFDF9] rounded-2xl border border-[#E5DCCB] overflow-hidden card-hover-lift shadow-2xs flex flex-col"
            >
              <div className="h-44 relative overflow-hidden bg-[#F2ECE0]">
                <img
                  src={gal.image}
                  alt={gal.title}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-108"
                />
                <span className="absolute top-3 left-3 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded bg-[#FAF6ED] text-[#0B192C] border border-[#E5DCCB] shadow-xs">
                  {gal.tag}
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-[#0B192C] leading-snug">
                    {gal.title}
                  </h3>
                  <p className="text-xs text-[#0B192C]/75 mt-1.5 leading-relaxed">
                    {gal.desc}
                  </p>
                </div>
                <div className="pt-3 mt-3 border-t border-[#E5DCCB] flex items-center justify-between text-[11px] text-[#0B192C] font-bold">
                  <span>SIT Nagpur Facility</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. TRUST & VERIFICATION STRIP (Warm Ivory with Gold borders) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF6ED] rounded-2xl border border-[#E5DCCB] p-8 sm:p-12 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-white border border-[#E5DCCB] text-[#0B192C] flex items-center justify-center shrink-0 shadow-2xs">
                <ShieldCheck className="w-6 h-6 text-[#C69214]" />
              </div>
              <div>
                <h4 className="text-base font-black text-[#0B192C]">Student Batch Email Only</h4>
                <p className="text-xs text-[#0B192C]/80 mt-1.5 leading-relaxed">
                  Only verified <code className="text-[#0B192C] font-mono font-bold bg-[#F4ECE1] px-1 py-0.5 rounded">*.batchYYYY@sitnagpur.siu.edu</code> addresses can register.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-white border border-[#E5DCCB] text-[#C69214] flex items-center justify-center shrink-0 shadow-2xs">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-black text-[#0B192C]">ACID Seat Locking</h4>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  PostgreSQL database transactions with row-level locks prevent overbooking and protect seat counts.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-white border border-[#E5DCCB] text-[#C69214] flex items-center justify-center shrink-0 shadow-2xs">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-black text-[#0B192C]">Dean & Faculty Oversight</h4>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  All organizer and club submissions are reviewed and authorized by campus administration before publication.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
