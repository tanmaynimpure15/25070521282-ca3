import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api/client';
import EventCard from '../components/events/EventCard';
import EventFilters from '../components/events/EventFilters';
import { CalendarX, Sparkles, Compass, Award } from 'lucide-react';

export default function ExploreEvents() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCat = searchParams.get('category') || 'All';

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCat);

  useEffect(() => {
    if (searchParams.get('category')) {
      setSelectedCategory(searchParams.get('category'));
    }
  }, [searchParams]);

  useEffect(() => {
    async function fetchFilteredEvents() {
      setLoading(true);
      try {
        const data = await api.getEvents({
          search: searchTerm,
          category: selectedCategory,
        });
        setEvents(data.events || []);
      } catch (err) {
        console.error('Failed to load events:', err);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      fetchFilteredEvents();
    }, 200);

    return () => clearTimeout(timer);
  }, [searchTerm, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 animate-fade-in bg-[#FBF8F1]">
      {/* Header Banner: Ivory Background with Gold & Dark Blue */}
      <div className="relative rounded-2xl overflow-hidden shadow-sm border border-[#E5DCCB] bg-[#FAF6ED] p-8 sm:p-12">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-black bg-[#FBF0D9] text-[#0B192C] border border-[#C69214]">
            <Award className="w-3.5 h-3.5 text-[#C69214]" />
            <span>SIT Nagpur Events Directory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#0B192C]">
            Explore Campus Gatherings
          </h1>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
            Filter through technical hackathons, cultural festivals, sports fixtures, and hands-on workshops. 
            All events are officially vetted and open for SIT Nagpur student registrations.
          </p>
        </div>

        {/* Decorative corner ivory accent */}
        <div className="absolute right-0 top-0 w-80 h-full opacity-10 pointer-events-none overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80"
            alt="Students"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Filter & Search Bar in Warm Ivory */}
      <div className="bg-[#FFFDF9] p-6 rounded-2xl border border-[#E5DCCB] shadow-2xs">
        <EventFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={(cat) => {
            setSelectedCategory(cat);
            setSearchParams(cat === 'All' ? {} : { category: cat });
          }}
          totalCount={events.length}
        />
      </div>

      {/* Event Cards Grid */}
      {loading ? (
        <div className="py-24 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-3 border-[#C69214] border-t-transparent mb-3" />
          <p className="text-sm font-bold text-[#0B192C]">Searching events database...</p>
        </div>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((evt) => (
            <EventCard key={evt.id} event={evt} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-20 bg-[#FFFDF9] rounded-2xl border border-[#E5DCCB] px-4 shadow-2xs">
          <div className="w-16 h-16 rounded-2xl bg-[#FAF6ED] text-[#C69214] flex items-center justify-center mx-auto mb-4 border border-[#E5DCCB]">
            <CalendarX className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-black text-[#0B192C]">No events found</h3>
          <p className="text-sm text-slate-600 max-w-sm mx-auto mt-2 leading-relaxed">
            {searchTerm || selectedCategory !== 'All'
              ? 'We couldn\'t find any college events matching your current search or category filter.'
              : 'There are currently no approved upcoming events in this category.'}
          </p>
          {(searchTerm || selectedCategory !== 'All') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
                setSearchParams({});
              }}
              className="mt-5 px-5 py-2.5 text-xs font-black text-[#070F1E] bg-[#C69214] hover:bg-[#AF7F0E] hover:text-white rounded-xl transition shadow-xs border border-[#D8A938]"
            >
              Reset All Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
