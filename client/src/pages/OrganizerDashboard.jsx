import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { StatusBadge, CategoryBadge } from '../components/common/Badge';
import { 
  Calendar, 
  PlusCircle, 
  Users, 
  Edit3, 
  Eye, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  MapPin, 
  Layers,
  Sparkles,
  Award,
  Loader2 
} from 'lucide-react';

const CATEGORIES = ['Technical', 'Cultural', 'Sports', 'Academic', 'Workshop', 'Social'];

export default function OrganizerDashboard() {
  const { user, isOrganizer } = useAuth();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Creation / Editing Form State
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Technical',
    venue: '',
    start_at: '',
    end_at: '',
    capacity: 50,
    poster_url: '',
  });
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Attendees Modal State
  const [showAttendeesModal, setShowAttendeesModal] = useState(false);
  const [attendeesData, setAttendeesData] = useState(null);
  const [attendeesLoading, setAttendeesLoading] = useState(false);

  const loadOrganizerEvents = async () => {
    try {
      setError('');
      const data = await api.getOrganizerEvents();
      setEvents(data.events || []);
    } catch (err) {
      setError(err.message || 'Failed to load your events.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/auth?tab=login');
      return;
    }
    if (!isOrganizer) {
      navigate('/dashboard');
      return;
    }
    loadOrganizerEvents();
  }, [user, isOrganizer, navigate]);

  const handleOpenCreate = () => {
    setEditingEventId(null);
    setFormData({
      title: '',
      description: '',
      category: 'Technical',
      venue: '',
      start_at: '',
      end_at: '',
      capacity: 50,
      poster_url: '',
    });
    setShowFormModal(true);
  };

  const handleOpenEdit = (evt) => {
    setEditingEventId(evt.id);
    const startIso = new Date(evt.start_at).toISOString().slice(0, 16);
    const endIso = new Date(evt.end_at).toISOString().slice(0, 16);
    setFormData({
      title: evt.title,
      description: evt.description,
      category: evt.category,
      venue: evt.venue,
      start_at: startIso,
      end_at: endIso,
      capacity: evt.capacity,
      poster_url: evt.poster_url || '',
    });
    setShowFormModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setError('');
    setSuccess('');

    try {
      if (editingEventId) {
        await api.updateEvent(editingEventId, formData);
        setSuccess('Event updated successfully.');
      } else {
        const res = await api.createEvent(formData);
        setSuccess(res.message || 'Event submitted for administrator review.');
      }
      setShowFormModal(false);
      await loadOrganizerEvents();
    } catch (err) {
      setError(err.message || 'Failed to save event.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleViewAttendees = async (eventId) => {
    setShowAttendeesModal(true);
    setAttendeesLoading(true);
    setAttendeesData(null);
    try {
      const data = await api.getEventAttendees(eventId);
      setAttendeesData(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch attendee records.');
    } finally {
      setAttendeesLoading(false);
    }
  };

  const totalRegistrations = events.reduce((sum, e) => sum + (e.registered_count || 0), 0);
  const pendingCount = events.filter(e => e.status === 'pending').length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 animate-fade-in bg-[#FBF8F1]">
      {/* Attraction Command Bar: Ivory + Gold + Dark Blue */}
      <div className="bg-[#FAF6ED] rounded-2xl p-8 sm:p-10 text-[#0B192C] relative overflow-hidden shadow-sm border border-[#C69214]/30 card-hover-lift">
        {/* Subtle decorative campus watermark */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.06]">
          <img
            src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&auto=format&fit=crop&q=80"
            alt="Campus Architecture"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-black bg-[#C69214]/15 text-[#8C6207] border border-[#C69214]/30">
              <Layers className="w-3.5 h-3.5 text-[#C69214]" />
              <span>Campus Club & Event Management</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-[#0B192C]">
              Organizer Operations Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Submit events for faculty review, track registration rosters, and monitor venue capacity.
            </p>
          </div>

          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-xs font-black text-[#070F1E] bg-gradient-to-r from-[#D4AF37] to-[#C69214] hover:from-[#E5A93C] hover:to-[#D4AF37] shadow-sm transition-all transform hover:-translate-y-0.5 whitespace-nowrap self-start md:self-auto border border-amber-300"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.5]" />
            <span>Create New Event</span>
          </button>
        </div>

        {/* Stats Strip */}
        <div className="relative z-10 grid grid-cols-3 gap-6 pt-8 mt-8 border-t border-[#EBE5D8] max-w-xl">
          <div>
            <p className="text-3xl font-black text-[#0B192C]">{events.length}</p>
            <p className="text-[11px] font-bold text-[#0B192C] mt-0.5">Events Managed</p>
          </div>
          <div>
            <p className="text-3xl font-black text-emerald-700">{totalRegistrations}</p>
            <p className="text-[11px] font-bold text-[#0B192C] mt-0.5">Student Attendees</p>
          </div>
          <div>
            <p className="text-3xl font-black text-[#0B192C]">{pendingCount}</p>
            <p className="text-[11px] font-bold text-[#0B192C] mt-0.5">Pending Approvals</p>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {success && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-950 p-4 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs animate-fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="bg-rose-50 border border-rose-300 text-rose-950 p-4 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs animate-fade-in">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Events Table Section */}
      <div className="space-y-5">
        <div className="border-b border-[#EBE5D8] pb-3 flex items-center justify-between">
          <h2 className="text-xl font-black text-[#0B192C]">
            Events Managed by You ({events.length})
          </h2>
        </div>

        {loading ? (
          <div className="py-16 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#C69214]" />
            Loading organizer events...
          </div>
        ) : events.length > 0 ? (
          <div className="bg-[#FFFDF9] rounded-2xl border border-[#EBE5D8] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#EBE5D8] text-left text-xs">
                <thead className="bg-[#FAF6ED] text-[#0B192C] font-black uppercase tracking-wider text-[11px]">
                  <tr>
                    <th scope="col" className="px-6 py-4">Event Title</th>
                    <th scope="col" className="px-6 py-4">Category</th>
                    <th scope="col" className="px-6 py-4">Schedule & Venue</th>
                    <th scope="col" className="px-6 py-4">Registrations</th>
                    <th scope="col" className="px-6 py-4">Status</th>
                    <th scope="col" className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EBE5D8] bg-[#FFFDF9]">
                  {events.map((evt) => {
                    const startDate = new Date(evt.start_at);
                    const formattedDate = startDate.toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                    });

                    return (
                      <tr key={evt.id} className="hover:bg-[#FAF8F5] transition-colors">
                        <td className="px-6 py-5 font-bold text-[#0B192C] max-w-xs">
                          <Link to={`/events/${evt.id}`} className="hover:text-[#C69214] transition font-black text-sm">
                            {evt.title}
                          </Link>
                          {evt.rejection_reason && (
                            <span className="block text-[11px] font-medium text-rose-600 mt-1">
                              Note: {evt.rejection_reason}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <CategoryBadge category={evt.category} />
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-slate-600">
                          <div className="font-bold text-[#0B192C]">{formattedDate}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5 truncate max-w-[150px]">{evt.venue}</div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <span className="font-black text-[#0B192C] text-sm">
                            {evt.registered_count}
                          </span>
                          <span className="text-slate-400"> / {evt.capacity} seats</span>
                          <div className="text-[11px] text-[#0B192C] font-bold mt-0.5">
                            {evt.available_seats} remaining
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <StatusBadge status={evt.status} />
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-right space-x-2">
                          <button
                            onClick={() => handleViewAttendees(evt.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF8F5] text-[#0B192C] hover:bg-[#FBF0D9] hover:border-[#C69214] border border-[#EBE5D8] font-bold text-xs transition"
                          >
                            <Users className="w-3.5 h-3.5 text-[#C69214]" />
                            Roster ({evt.registered_count})
                          </button>
                          <button
                            onClick={() => handleOpenEdit(evt)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF8F5] text-slate-700 hover:bg-slate-100 border border-[#EBE5D8] font-bold text-xs transition"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            Edit
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
              <Calendar className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-black text-[#0B192C]">No events created yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
                Click the "Create New Event" button to submit your first college event for review.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* CREATE / EDIT EVENT MODAL */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#070F1E]/70 backdrop-blur-xs p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-2xl border border-[#EBE5D8] shadow-2xl max-w-xl w-full p-8 space-y-6 my-8 animate-scale-up">
            <div className="flex items-center justify-between border-b border-[#EBE5D8] pb-4">
              <div>
                <h3 className="text-lg font-black text-[#0B192C]">
                  {editingEventId ? 'Edit Event Details' : 'Submit College Event'}
                </h3>
                <p className="text-xs text-slate-500">Provide complete specifications for SIT students</p>
              </div>
              <button
                onClick={() => setShowFormModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#0B192C] mb-1.5">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Annual SIT Nagpur Coding Marathon"
                  className="w-full px-3.5 py-2.5 border border-[#EBE5D8] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#C69214]/15 focus:border-[#C69214]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#0B192C] mb-1.5">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-[#EBE5D8] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#C69214]/15 focus:border-[#C69214] bg-white"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#0B192C] mb-1.5">
                    Max Capacity (Participants) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value, 10) || '' })}
                    className="w-full px-3.5 py-2.5 border border-[#EBE5D8] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#C69214]/15 focus:border-[#C69214]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#0B192C] mb-1.5">
                  Campus Venue *
                </label>
                <input
                  type="text"
                  required
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  placeholder="e.g. Computing Lab 2, Academic Block B"
                  className="w-full px-3.5 py-2.5 border border-[#EBE5D8] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#C69214]/15 focus:border-[#C69214]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#0B192C] mb-1.5">
                    Start Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.start_at}
                    onChange={(e) => setFormData({ ...formData, start_at: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-[#EBE5D8] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#C69214]/15 focus:border-[#C69214]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0B192C] mb-1.5">
                    End Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.end_at}
                    onChange={(e) => setFormData({ ...formData, end_at: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-[#EBE5D8] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#C69214]/15 focus:border-[#C69214]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#0B192C] mb-1.5">
                  Poster Image URL (Internet image URL)
                </label>
                <input
                  type="url"
                  value={formData.poster_url}
                  onChange={(e) => setFormData({ ...formData, poster_url: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3.5 py-2.5 border border-[#EBE5D8] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#C69214]/15 focus:border-[#C69214]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0B192C] mb-1.5">
                  Detailed Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="State prerequisites, rules, schedule, and team requirements..."
                  className="w-full px-3.5 py-2.5 border border-[#EBE5D8] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#C69214]/15 focus:border-[#C69214]"
                />
              </div>

              <div className="pt-4 border-t border-[#EBE5D8] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="px-4 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-6 py-2.5 rounded-xl text-[#070F1E] bg-gradient-to-r from-[#D4AF37] to-[#C69214] font-black shadow-md shadow-[#C69214]/25 disabled:opacity-50 flex items-center gap-2 border border-amber-300"
                >
                  {formSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {editingEventId ? 'Save Changes' : 'Submit for Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ATTENDEE LIST ROSTER MODAL */}
      {showAttendeesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#070F1E]/70 backdrop-blur-xs p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-2xl border border-[#EBE5D8] shadow-2xl max-w-2xl w-full p-8 space-y-6 my-8 animate-scale-up">
            <div className="flex items-center justify-between border-b border-[#EBE5D8] pb-4">
              <div>
                <h3 className="text-lg font-black text-[#0B192C]">
                  Confirmed Attendee Roster
                </h3>
                {attendeesData && (
                  <p className="text-xs text-slate-500 mt-0.5">
                    {attendeesData.event.title} ({attendeesData.event.total_registered} / {attendeesData.event.capacity} seats filled)
                  </p>
                )}
              </div>
              <button
                onClick={() => setShowAttendeesModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {attendeesLoading ? (
              <div className="py-12 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#C69214]" />
                Loading attendee records...
              </div>
            ) : attendeesData?.attendees.length > 0 ? (
              <div className="max-h-96 overflow-y-auto border border-[#EBE5D8] rounded-xl">
                <table className="min-w-full divide-y divide-[#EBE5D8] text-left text-xs">
                  <thead className="bg-[#FAF8F5] text-[#0B192C] font-black uppercase text-[11px]">
                    <tr>
                      <th className="px-5 py-3">#</th>
                      <th className="px-5 py-3">Student Name</th>
                      <th className="px-5 py-3">SIT Batch Email</th>
                      <th className="px-5 py-3">Registered At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EBE5D8] bg-white">
                    {attendeesData.attendees.map((att, idx) => (
                      <tr key={att.registration_id}>
                        <td className="px-5 py-3 text-slate-400 font-bold">{idx + 1}</td>
                        <td className="px-5 py-3 font-bold text-[#0B192C]">{att.student_name}</td>
                        <td className="px-5 py-3 font-mono text-slate-600">{att.student_email}</td>
                        <td className="px-5 py-3 text-slate-500">
                          {new Date(att.registered_at).toLocaleString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-slate-500">
                No students have registered for this event yet.
              </div>
            )}

            <div className="pt-4 border-t border-[#EBE5D8] text-right">
              <button
                type="button"
                onClick={() => setShowAttendeesModal(false)}
                className="px-5 py-2 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200"
              >
                Close Roster
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
