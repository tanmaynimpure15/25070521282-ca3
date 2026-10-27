import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, ArrowRight, Sparkles } from 'lucide-react';
import { CategoryBadge } from '../common/Badge';

export default function EventCard({ event }) {
  const startDate = new Date(event.start_at);
  const formattedDate = startDate.toLocaleDateString('en-IN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const formattedTime = startDate.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const isFull = event.available_seats <= 0;
  const percentFilled = Math.min(
    100,
    Math.round((event.registered_count / event.capacity) * 100)
  );

  return (
    <div className="group bg-[#FFFDF9] rounded-2xl border border-[#E5DCCB] overflow-hidden card-hover-lift flex flex-col h-full relative shadow-xs hover:border-[#C69214] transition-all">
      {/* Golden Accent Strip */}
      <div className="h-1.5 w-full bg-[#C69214]" />

      {/* Event Poster with Internet Imagery */}
      <div className="h-52 bg-[#F2ECE0] relative overflow-hidden">
        {event.poster_url ? (
          <img
            src={event.poster_url}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-106"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#F2ECE0] text-[#0B192C]/40">
            <Calendar className="w-12 h-12 stroke-1" />
          </div>
        )}

        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

        {/* Category Badge */}
        <div className="absolute top-3.5 left-3.5">
          <CategoryBadge category={event.category} />
        </div>

        {/* Availability Badge */}
        {isFull ? (
          <div className="absolute top-3.5 right-3.5 bg-rose-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-md">
            Event Full
          </div>
        ) : event.available_seats <= 15 ? (
          <div className="absolute top-3.5 right-3.5 bg-[#C69214] text-[#070F1E] text-[11px] font-black px-2.5 py-1 rounded-md shadow-md animate-pulse border border-[#D8A938]">
            {event.available_seats} Seats Left
          </div>
        ) : null}

        {/* Date Tag Floating over Image */}
        <div className="absolute bottom-3 left-3.5 flex items-center gap-2 text-white text-xs font-bold drop-shadow-md">
          <Calendar className="w-3.5 h-3.5 text-[#E5A93C]" />
          <span>{formattedDate} · {formattedTime}</span>
        </div>
      </div>

      {/* Card Content in Warm Ivory Canvas */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4 bg-[#FFFDF9]">
        <div>
          <h3 className="font-extrabold text-lg text-[#0B192C] group-hover:text-[#C69214] transition-colors leading-snug line-clamp-2">
            {event.title}
          </h3>
          <p className="text-xs text-slate-700 mt-2 line-clamp-2 leading-relaxed">
            {event.description}
          </p>

          {/* Venue & Organizer Details */}
          <div className="mt-4 pt-4 border-t border-[#E5DCCB] space-y-2 text-xs text-slate-700">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-md bg-[#F2ECE0] border border-[#E5DCCB] text-[#C69214] flex items-center justify-center shrink-0">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <span className="truncate font-semibold text-[#0B192C]">{event.venue}</span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-md bg-[#F2ECE0] border border-[#E5DCCB] text-[#0B192C] flex items-center justify-center shrink-0">
                <Users className="w-3.5 h-3.5" />
              </div>
              <span className="truncate">
                Organized by <strong className="text-[#0B192C] font-semibold">{event.organizer_name}</strong>
              </span>
            </div>
          </div>

          {/* Seat Capacity Bar */}
          <div className="mt-4 pt-3 border-t border-[#E5DCCB]">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-600 font-medium">Reserved Seats</span>
              <span className="font-bold text-[#0B192C]">
                {isFull ? (
                  <span className="text-rose-600">Full</span>
                ) : (
                  <span>
                    <strong className="text-[#0B192C] font-bold">{event.available_seats}</strong> of {event.capacity} free
                  </span>
                )}
              </span>
            </div>
            <div className="w-full h-2 bg-[#F2ECE0] rounded-full overflow-hidden border border-[#E5DCCB]">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isFull 
                    ? 'bg-rose-500' 
                    : percentFilled > 80 
                    ? 'bg-amber-600' 
                    : 'bg-[#C69214]'
                }`}
                style={{ width: `${percentFilled}%` }}
              />
            </div>
          </div>
        </div>

        {/* Action Link with Gold Button */}
        <div className="pt-4 border-t border-[#E5DCCB] flex items-center justify-between">
          <span className="text-[11px] font-bold text-[#0B192C] uppercase tracking-wider">
            Verified Event
          </span>
          <Link
            to={`/events/${event.id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black text-[#070F1E] bg-[#C69214] hover:bg-[#AF7F0E] hover:text-white border border-[#D8A938] transition-all shadow-2xs"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </Link>
        </div>
      </div>
    </div>
  );
}
