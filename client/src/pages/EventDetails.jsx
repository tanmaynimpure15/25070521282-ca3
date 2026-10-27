import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { CategoryBadge, StatusBadge } from '../components/common/Badge';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  User, 
  Mail, 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle,
  ShieldAlert,
  Loader2,
  Ticket,
  Award,
  Info
} from 'lucide-react';

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isEmailVerified } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const loadEvent = async () => {
    try {
      setError('');
      const data = await api.getEventById(id);
      setEvent(data.event);
    } catch (err) {
      setError(err.message || 'Failed to load event details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvent();
  }, [id, user]);

  const handleRegister = async () => {
    if (!user) {
      navigate('/auth?tab=login');
      return;
    }

    if (!isEmailVerified) {
      setError('Please verify your college email address before registering for events.');
      return;
    }

    setActionLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const data = await api.registerForEvent(event.id);
      setSuccessMessage(data.message || 'Successfully registered for this event!');
      await loadEvent();
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-28 text-center animate-fade-in bg-[#FBF8F1]">
        <Loader2 className="w-10 h-10 animate-spin text-[#C69214] mx-auto mb-4" />
        <p className="text-sm font-bold text-[#0B192C]">Loading event particulars from database...</p>
      </div>
    );
  }

  if (error && !event) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center animate-fade-in bg-[#FBF8F1]">
        <div className="bg-[#FFFDF9] p-10 rounded-2xl border border-[#E5DCCB] shadow-sm space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-black text-[#0B192C]">Event Not Available</h2>
          <p className="text-sm text-slate-700 max-w-sm mx-auto">{error}</p>
          <div className="pt-4">
            <Link
              to="/events"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black text-[#070F1E] bg-[#C69214] hover:bg-[#AF7F0E] hover:text-white transition shadow-sm border border-[#D8A938]"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
              <span>Return to Events Directory</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const startDate = new Date(event.start_at);
  const endDate = new Date(event.end_at);
  const formattedDate = startDate.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const startTime = startDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const endTime = endDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const isFull = event.available_seats <= 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in bg-[#FBF8F1]">
      {/* Top Breadcrumb */}
      <div>
        <Link
          to="/events"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#0B192C] hover:text-[#C69214] transition"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          <span>Back to Explore Events</span>
        </Link>
      </div>

      {/* Success banner */}
      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-950 px-5 py-4 rounded-xl text-sm flex items-center gap-3 shadow-2xs animate-fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">{successMessage}</span>
          <Link to="/dashboard" className="ml-auto font-black text-xs text-[#0B192C] underline hover:text-[#C69214]">
            View My Passes →
          </Link>
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="bg-rose-50 border border-rose-300 text-rose-950 px-5 py-4 rounded-xl text-sm flex items-center gap-3 shadow-2xs animate-fade-in">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span className="font-semibold">{error}</span>
        </div>
      )}

      {/* Main Event Showcase Surface: Warm Ivory */}
      <div className="bg-[#FFFDF9] rounded-2xl border border-[#E5DCCB] overflow-hidden shadow-sm">
        {/* Poster Header */}
        {event.poster_url && (
          <div className="h-80 sm:h-96 w-full bg-[#F2ECE0] overflow-hidden relative">
            <img
              src={event.poster_url}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-8 sm:left-12 flex items-center gap-2">
              <span className="text-xs font-black px-3 py-1 rounded-full bg-[#C69214] text-[#070F1E] shadow-sm border border-[#D8A938]">
                Official Campus Event
              </span>
            </div>
          </div>
        )}

        <div className="p-8 sm:p-12 space-y-10">
          {/* Header Row */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <CategoryBadge category={event.category} />
              {event.status !== 'approved' && (
                <StatusBadge status={event.status} />
              )}
              {event.is_registered && (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black bg-[#FBF0D9] text-[#0B192C] border border-[#C69214] shadow-2xs">
                  <CheckCircle className="w-3.5 h-3.5 text-[#C69214]" />
                  Your Participant Seat is Confirmed
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-[#0B192C] tracking-tight leading-tight">
              {event.title}
            </h1>

            <p className="text-xs text-slate-600">
              Coordinated by <strong className="text-[#0B192C] font-semibold">{event.organizer_name}</strong>
              {event.organizer_email && ` (${event.organizer_email})`}
            </p>
          </div>

          {/* Quick Specifications in Ivory Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4.5 rounded-xl bg-[#FAF6ED] border border-[#E5DCCB] flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-white text-[#0B192C] shrink-0 border border-[#E5DCCB] shadow-2xs">
                <Calendar className="w-4 h-4 text-[#C69214]" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-[#0B192C]">Date</p>
                <p className="text-xs font-bold text-[#0B192C] mt-0.5">{formattedDate}</p>
              </div>
            </div>

            <div className="p-4.5 rounded-xl bg-[#FAF6ED] border border-[#E5DCCB] flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-white text-[#0B192C] shrink-0 border border-[#E5DCCB] shadow-2xs">
                <Clock className="w-4 h-4 text-[#C69214]" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-[#0B192C]">Schedule</p>
                <p className="text-xs font-bold text-[#0B192C] mt-0.5">{startTime} – {endTime}</p>
              </div>
            </div>

            <div className="p-4.5 rounded-xl bg-[#FAF6ED] border border-[#E5DCCB] flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-white text-[#0B192C] shrink-0 border border-[#E5DCCB] shadow-2xs">
                <MapPin className="w-4 h-4 text-[#C69214]" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-[#0B192C]">Campus Venue</p>
                <p className="text-xs font-bold text-[#0B192C] mt-0.5">{event.venue}</p>
              </div>
            </div>

            <div className="p-4.5 rounded-xl bg-[#FAF6ED] border border-[#E5DCCB] flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-white text-[#0B192C] shrink-0 border border-[#E5DCCB] shadow-2xs">
                <Users className="w-4 h-4 text-[#C69214]" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-[#0B192C]">Availability</p>
                <p className="text-xs font-bold text-[#0B192C] mt-0.5">
                  <span className="text-[#0B192C] font-black">{event.available_seats}</span> of {event.capacity} free
                </p>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-3 pt-2">
            <h2 className="text-base font-black text-[#0B192C] flex items-center gap-2">
              <Info className="w-4 h-4 text-[#C69214]" />
              Event Description & Guidelines
            </h2>
            <div className="text-sm text-slate-700 whitespace-pre-line leading-relaxed bg-[#FAF6ED] p-6 rounded-xl border border-[#E5DCCB]">
              {event.description}
            </div>
          </div>

          {/* Registration Action Box in Warm Ivory Canvas */}
          <div className="pt-6 border-t border-[#E5DCCB]">
            {event.is_registered ? (
              <div className="bg-[#FAF6ED] border border-[#C69214] p-6 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-[#0B192C]">
                  <div className="w-10 h-10 rounded-full bg-[#C69214] text-[#070F1E] flex items-center justify-center shrink-0">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-black">Your Seat is Reserved</p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Your registration is confirmed in PostgreSQL. You can view or release your seat on your dashboard.
                    </p>
                  </div>
                </div>
                <Link
                  to="/dashboard"
                  className="px-6 py-2.5 text-xs font-black text-[#070F1E] bg-[#C69214] hover:bg-[#AF7F0E] hover:text-white rounded-xl transition whitespace-nowrap shadow-xs border border-[#D8A938]"
                >
                  Go to Student Passes
                </Link>
              </div>
            ) : isFull ? (
              <div className="bg-[#FAF6ED] border border-[#E5DCCB] p-6 rounded-xl text-center">
                <p className="font-black text-[#0B192C]">Event Capacity Reached</p>
                <p className="text-xs text-slate-600 mt-1">
                  All {event.capacity} seats for this event have been reserved.
                </p>
              </div>
            ) : !user ? (
              <div className="bg-[#FAF6ED] border border-[#E5DCCB] p-6 sm:p-8 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
                <div>
                  <p className="text-base font-black text-[#0B192C]">Ready to attend this campus event?</p>
                  <p className="text-xs text-slate-600 mt-1">
                    Sign in with your official SIT Nagpur student email to reserve your seat instantly.
                  </p>
                </div>
                <Link
                  to="/auth?tab=login"
                  className="px-7 py-3 text-xs font-black text-[#070F1E] bg-[#C69214] hover:bg-[#AF7F0E] hover:text-white rounded-xl shadow-xs transition whitespace-nowrap border border-[#D8A938]"
                >
                  Log In to Register
                </Link>
              </div>
            ) : !isEmailVerified ? (
              <div className="bg-[#FAF6ED] border border-[#C69214] p-6 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#C69214] text-[#070F1E] flex items-center justify-center shrink-0">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-[#0B192C]">Mailbox Verification Required</p>
                    <p className="text-xs text-slate-700 mt-0.5">
                      Please verify your SIT student email ({user.email}) before registering for campus events.
                    </p>
                  </div>
                </div>
                <Link
                  to="/auth?tab=verify"
                  className="px-6 py-2.5 text-xs font-black text-[#070F1E] bg-[#C69214] hover:bg-[#AF7F0E] hover:text-white rounded-xl transition whitespace-nowrap shadow-xs border border-[#D8A938]"
                >
                  Verify Mailbox
                </Link>
              </div>
            ) : (
              <div className="bg-[#FAF6ED] p-6 sm:p-8 rounded-xl border border-[#E5DCCB] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <Ticket className="w-5 h-5 text-[#C69214]" />
                    <span className="text-sm font-black text-[#0B192C]">Complimentary Student Seat</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Free participation for verified SIT Nagpur students. {event.available_seats} remaining seats.
                  </p>
                </div>
                <button
                  onClick={handleRegister}
                  disabled={actionLoading}
                  className="w-full sm:w-auto px-8 py-3 rounded-xl text-sm font-black text-[#070F1E] bg-[#C69214] hover:bg-[#AF7F0E] hover:text-white shadow-md shadow-[#C69214]/25 disabled:opacity-50 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 border border-[#D8A938]"
                >
                  {actionLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Reserving Seat...
                    </>
                  ) : (
                    'Confirm My Registration'
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
