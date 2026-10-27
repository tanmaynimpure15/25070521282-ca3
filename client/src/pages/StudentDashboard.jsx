import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { StatusBadge, CategoryBadge } from '../components/common/Badge';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Trash2, 
  ArrowRight, 
  CheckCircle, 
  AlertCircle, 
  Ticket,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  Award,
  Loader2 
} from 'lucide-react';

export default function StudentDashboard() {
  const { user, isEmailVerified } = useAuth();
  const navigate = useNavigate();

  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadRegistrations = async () => {
    try {
      setError('');
      const data = await api.getMyRegistrations();
      setRegistrations(data.registrations || []);
    } catch (err) {
      setError(err.message || 'Failed to load your event registrations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/auth?tab=login');
      return;
    }
    loadRegistrations();
  }, [user, navigate]);

  const handleCancelRegistration = async (registrationId, eventTitle) => {
    const confirmCancel = window.confirm(
      `Cancel your seat reservation for "${eventTitle}"? Your seat will be released immediately for other students.`
    );
    if (!confirmCancel) return;

    setCancellingId(registrationId);
    setError('');
    setMessage('');

    try {
      await api.cancelRegistration(registrationId);
      setMessage(`Cancelled reservation for "${eventTitle}". Your seat has been released.`);
      await loadRegistrations();
    } catch (err) {
      setError(err.message || 'Failed to cancel registration.');
    } finally {
      setCancellingId(null);
    }
  };

  const activeRegistrations = registrations.filter(r => r.registration_status === 'confirmed');
  const pastOrCancelled = registrations.filter(r => r.registration_status === 'cancelled');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 animate-fade-in bg-[#FBF8F1]">
      {/* Student Passport Header in Ivory + Gold + Dark Blue */}
      <div className="bg-[#FAF6ED] rounded-2xl p-8 sm:p-10 text-[#0B192C] relative overflow-hidden shadow-sm border border-[#C69214]/30 card-hover-lift">
        {/* Subtle decorative campus watermark */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.07]">
          <img
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80"
            alt="Students Studying"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-black bg-[#C69214]/15 text-[#8C6207] border border-[#C69214]/30">
              <GraduationCap className="w-3.5 h-3.5 text-[#C69214]" />
              <span>SIT Nagpur Student Portal</span>
            </div>
            <h1 className="text-3xl font-black text-[#0B192C] tracking-tight">
              Welcome back, {user?.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 flex flex-wrap items-center gap-2">
              <span className="font-mono bg-[#F4ECE1] px-2.5 py-0.5 rounded border border-[#C69214]/25 text-[#0B192C] font-semibold">{user?.email}</span>
              {isEmailVerified ? (
                <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> Verified Mailbox
                </span>
              ) : (
                <span className="text-amber-700 font-bold">
                  • Mailbox Unverified
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-[#FFFDF9] p-4 rounded-xl border border-[#C69214]/30 self-start sm:self-auto shadow-sm">
            <div className="text-center px-3">
              <p className="text-3xl font-black text-[#0B192C]">{activeRegistrations.length}</p>
              <p className="text-[11px] font-bold text-[#0B192C]">Active Passes</p>
            </div>
            <div className="h-8 w-px bg-[#EBE5D8]" />
            <Link
              to="/events"
              className="px-4 py-2 rounded-lg text-xs font-black bg-gradient-to-r from-[#D4AF37] to-[#C69214] text-[#070F1E] hover:from-[#E5A93C] hover:to-[#D4AF37] transition shadow-xs border border-amber-300"
            >
              Find Events →
            </Link>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {message && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-950 p-4 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs animate-fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="bg-rose-50 border border-rose-300 text-rose-950 p-4 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs animate-fade-in">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Confirmed Passes Section with Zero Wasted Space */}
      <div className="space-y-5">
        <div className="border-b border-[#EBE5D8] pb-3 flex items-center justify-between">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#0B192C]">
              Active Reservations
            </span>
            <h2 className="text-xl font-black text-[#0B192C] mt-0.5">
              Confirmed Event Passes ({activeRegistrations.length})
            </h2>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#C69214]" />
            Loading active passes...
          </div>
        ) : activeRegistrations.length > 0 ? (
          <div className="bg-[#FFFDF9] rounded-2xl border border-[#EBE5D8] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#EBE5D8] text-left text-xs">
                <thead className="bg-[#FAF6ED] text-[#0B192C] font-black uppercase tracking-wider text-[11px]">
                  <tr>
                    <th scope="col" className="px-6 py-4">Event Particulars</th>
                    <th scope="col" className="px-6 py-4">Category</th>
                    <th scope="col" className="px-6 py-4">Schedule & Venue</th>
                    <th scope="col" className="px-6 py-4">Status</th>
                    <th scope="col" className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EBE5D8] bg-[#FFFDF9]">
                  {activeRegistrations.map((reg) => {
                    const eventDate = new Date(reg.start_at);
                    const formattedDate = eventDate.toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    });

                    return (
                      <tr key={reg.registration_id} className="hover:bg-[#FAF8F5] transition-colors">
                        <td className="px-6 py-5 font-bold text-[#0B192C] max-w-xs">
                          <Link
                            to={`/events/${reg.event_id}`}
                            className="hover:text-[#C69214] transition font-black text-sm"
                          >
                            {reg.title}
                          </Link>
                          <span className="block text-[11px] font-normal text-slate-500 mt-1">
                            Organized by {reg.organizer_name}
                          </span>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <CategoryBadge category={reg.category} />
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-slate-600">
                          <div className="font-bold text-[#0B192C]">{formattedDate}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5 truncate max-w-[180px]">{reg.venue}</div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <StatusBadge status={reg.registration_status} />
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-right space-x-3">
                          <Link
                            to={`/events/${reg.event_id}`}
                            className="text-xs font-black text-[#0B192C] hover:text-[#C69214]"
                          >
                            Details
                          </Link>
                          <button
                            onClick={() => handleCancelRegistration(reg.registration_id, reg.title)}
                            disabled={cancellingId === reg.registration_id}
                            className="text-xs font-black text-rose-600 hover:text-rose-800 disabled:opacity-50"
                          >
                            {cancellingId === reg.registration_id ? 'Releasing...' : 'Release Seat'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#EBE5D8] p-8 shadow-xs space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#FAF8F5] text-[#C69214] flex items-center justify-center mx-auto border border-[#EBE5D8]">
              <Ticket className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-black text-[#0B192C]">No active event reservations</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
                You haven't reserved your seat for any upcoming events. Explore upcoming hackathons and fests.
              </p>
            </div>
            <Link
              to="/events"
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-black text-[#070F1E] bg-gradient-to-r from-[#D4AF37] to-[#C69214] rounded-xl shadow-md transition"
            >
              <span>Explore Campus Events</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>

      {/* History */}
      {pastOrCancelled.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-[#EBE5D8]">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">
            Previous Registrations ({pastOrCancelled.length})
          </h3>
          <div className="bg-white rounded-xl border border-[#EBE5D8] divide-y divide-[#EBE5D8] text-xs">
            {pastOrCancelled.map((hist) => (
              <div key={hist.registration_id} className="p-4 sm:px-6 flex items-center justify-between text-slate-500">
                <div>
                  <span className="font-bold text-slate-700">{hist.title}</span>
                  <span className="text-[11px] block text-slate-400 mt-0.5">Seat Released</span>
                </div>
                <Link
                  to={`/events/${hist.event_id}`}
                  className="text-[#0B192C] font-bold hover:text-[#C69214]"
                >
                  View Event
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
