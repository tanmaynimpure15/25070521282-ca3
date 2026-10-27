import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { StatusBadge, CategoryBadge, RoleBadge } from '../components/common/Badge';
import { 
  ShieldCheck, 
  Check, 
  X, 
  Users, 
  Calendar, 
  AlertCircle, 
  CheckCircle,
  Clock,
  Sparkles,
  Award,
  Loader2 
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('events'); // 'events' | 'users'
  const [events, setEvents] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [actionInProgress, setActionInProgress] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [eventsRes, usersRes] = await Promise.all([
        api.getAdminEvents(),
        api.getUsers(),
      ]);
      setEvents(eventsRes.events || []);
      setUsersList(usersRes.users || []);
    } catch (err) {
      setError(err.message || 'Failed to load administrative data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/auth?tab=login');
      return;
    }
    if (!isAdmin) {
      navigate('/dashboard');
      return;
    }
    loadData();
  }, [user, isAdmin, navigate]);

  const handleReviewEvent = async (eventId, status) => {
    let rejectionReason = null;
    if (status === 'rejected') {
      rejectionReason = window.prompt('Enter reason for rejecting this event submission (optional):');
      if (rejectionReason === null) return;
    }

    setActionInProgress(eventId);
    setError('');
    setMessage('');

    try {
      await api.reviewEvent(eventId, {
        status,
        rejection_reason: rejectionReason,
      });
      setMessage(`Event submission marked as ${status}.`);
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to review event.');
    } finally {
      setActionInProgress(null);
    }
  };

  const handleRoleChange = async (targetUserId, newRole) => {
    setActionInProgress(`user-${targetUserId}`);
    setError('');
    setMessage('');

    try {
      await api.updateUserRole(targetUserId, newRole);
      setMessage(`User permissions successfully updated to ${newRole}.`);
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to update user role.');
    } finally {
      setActionInProgress(null);
    }
  };

  const pendingEvents = events.filter(e => e.status === 'pending');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 animate-fade-in bg-[#FBF8F1]">
      {/* Governance Console Header: Ivory + Gold + Dark Blue */}
      <div className="bg-[#FAF6ED] rounded-2xl p-8 sm:p-10 text-[#0B192C] relative overflow-hidden shadow-sm border border-[#C69214]/30 card-hover-lift">
        {/* Subtle decorative campus watermark */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.06]">
          <img
            src="https://images.unsplash.com/photo-1562774053-701939374585?w=1200&auto=format&fit=crop&q=80"
            alt="Campus Administration Building"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-black bg-[#C69214]/15 text-[#8C6207] border border-[#C69214]/30">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C69214]" />
              <span>Campus Administration & Moderation</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-[#0B192C]">
              Administrative Command Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Scrutinize student event proposals, enforce SIT regulations, and manage organizer privileges.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex bg-[#F4ECE1] p-1.5 rounded-xl border border-[#C69214]/30 text-xs self-start md:self-auto shadow-xs">
            <button
              onClick={() => setActiveTab('events')}
              className={`px-4 py-2 rounded-lg font-black transition-all ${
                activeTab === 'events'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#C69214] text-[#070F1E] shadow-xs'
                  : 'text-[#0B192C] hover:text-[#C69214]'
              }`}
            >
              Event Submissions ({pendingEvents.length})
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-lg font-black transition-all ${
                activeTab === 'users'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#C69214] text-[#070F1E] shadow-xs'
                  : 'text-[#0B192C] hover:text-[#C69214]'
              }`}
            >
              User Directory ({usersList.length})
            </button>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="relative z-10 grid grid-cols-3 gap-6 pt-8 mt-8 border-t border-[#EBE5D8] max-w-xl">
          <div>
            <p className="text-3xl font-black text-[#0B192C]">{events.length}</p>
            <p className="text-[11px] font-bold text-[#0B192C] mt-0.5">Total Submissions</p>
          </div>
          <div>
            <p className="text-3xl font-black text-[#0B192C]">{pendingEvents.length}</p>
            <p className="text-[11px] font-bold text-[#0B192C] mt-0.5">Awaiting Review</p>
          </div>
          <div>
            <p className="text-3xl font-black text-emerald-700">{usersList.length}</p>
            <p className="text-[11px] font-bold text-[#0B192C] mt-0.5">Campus Users</p>
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

      {/* TAB 1: EVENTS REVIEW QUEUE */}
      {activeTab === 'events' && (
        <div className="space-y-5">
          <div className="border-b border-[#EBE5D8] pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-[#0B192C]">
                Event Moderation Queue ({events.length} Total)
              </h2>
              <p className="text-xs text-slate-500">
                Approve events to publish them to students or reject with notes
              </p>
            </div>
            {pendingEvents.length > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-[#FBF0D9] text-[#0B192C] border border-[#C69214]/60">
                <Clock className="w-3.5 h-3.5 text-[#C69214] animate-spin" />
                {pendingEvents.length} Pending Review
              </span>
            )}
          </div>

          {loading ? (
            <div className="py-16 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-[#C69214]" />
              Loading moderation queue...
            </div>
          ) : events.length > 0 ? (
            <div className="bg-[#FFFDF9] rounded-2xl border border-[#EBE5D8] overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[#EBE5D8] text-left text-xs">
                  <thead className="bg-[#FAF6ED] text-[#0B192C] font-black uppercase tracking-wider text-[11px]">
                    <tr>
                      <th scope="col" className="px-6 py-4">Event Details & Organizer</th>
                      <th scope="col" className="px-6 py-4">Category</th>
                      <th scope="col" className="px-6 py-4">Schedule & Venue</th>
                      <th scope="col" className="px-6 py-4">Capacity</th>
                      <th scope="col" className="px-6 py-4">Status</th>
                      <th scope="col" className="px-6 py-4 text-right">Moderation Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EBE5D8] bg-[#FFFDF9]">
                    {events.map((evt) => {
                      const startDate = new Date(evt.start_at).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                      });
                      const isPending = evt.status === 'pending';

                      return (
                        <tr key={evt.id} className={isPending ? 'bg-[#FBF0D9]/30' : 'hover:bg-[#FAF8F5] transition-colors'}>
                          <td className="px-6 py-5 font-bold text-[#0B192C] max-w-xs">
                            <div className="text-sm font-black text-[#0B192C]">{evt.title}</div>
                            <div className="text-[11px] font-normal text-slate-500 mt-1">
                              By {evt.organizer_name} ({evt.organizer_email})
                            </div>
                            {evt.rejection_reason && (
                              <div className="text-[11px] font-bold text-rose-600 mt-1">
                                Rejection feedback: {evt.rejection_reason}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <CategoryBadge category={evt.category} />
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-slate-600">
                            <div className="font-bold text-[#0B192C]">{startDate}</div>
                            <div className="text-[11px] text-slate-500 mt-0.5 truncate max-w-[150px]">{evt.venue}</div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap font-black text-[#0B192C]">
                            {evt.capacity} seats
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <StatusBadge status={evt.status} />
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-right space-x-2">
                            {evt.status !== 'approved' && (
                              <button
                                onClick={() => handleReviewEvent(evt.id, 'approved')}
                                disabled={actionInProgress === evt.id}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-xs disabled:opacity-50 transition"
                              >
                                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                Approve
                              </button>
                            )}
                            {evt.status !== 'rejected' && (
                              <button
                                onClick={() => handleReviewEvent(evt.id, 'rejected')}
                                disabled={actionInProgress === evt.id}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-xs disabled:opacity-50 transition"
                              >
                                <X className="w-3.5 h-3.5 stroke-[2.5]" />
                                Reject
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-[#EBE5D8] text-xs text-slate-500">
              No event submissions found in database.
            </div>
          )}
        </div>
      )}

      {/* TAB 2: USER DIRECTORY & ROLES */}
      {activeTab === 'users' && (
        <div className="space-y-5">
          <div className="border-b border-[#EBE5D8] pb-3">
            <h2 className="text-xl font-black text-[#0B192C]">
              Campus User Directory & Permissions ({usersList.length})
            </h2>
            <p className="text-xs text-slate-500">
              Promote students to club organizers or administrators based on departmental authorization
            </p>
          </div>

          <div className="bg-[#FFFDF9] rounded-2xl border border-[#EBE5D8] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#EBE5D8] text-left text-xs">
                <thead className="bg-[#FAF6ED] text-[#0B192C] font-black uppercase tracking-wider text-[11px]">
                  <tr>
                    <th scope="col" className="px-6 py-4">Full Student / Staff Name</th>
                    <th scope="col" className="px-6 py-4">Official SIT Email</th>
                    <th scope="col" className="px-6 py-4">Mailbox Verification</th>
                    <th scope="col" className="px-6 py-4">Assigned Role</th>
                    <th scope="col" className="px-6 py-4 text-right">Update Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EBE5D8] bg-[#FFFDF9]">
                  {usersList.map((u) => {
                    const isCurrentUser = u.id === user.id;

                    return (
                      <tr key={u.id} className="hover:bg-[#FAF8F5] transition-colors">
                        <td className="px-6 py-4 font-bold text-[#0B192C]">
                          {u.name}
                          {isCurrentUser && (
                            <span className="ml-2 text-[10px] font-black text-[#E5A93C] bg-[#0B192C] px-2.5 py-0.5 rounded-full border border-[#C69214]">
                              Current Admin
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 font-mono text-slate-600 text-xs">
                          {u.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {u.email_verified_at ? (
                            <span className="inline-flex items-center gap-1.5 text-emerald-700 font-bold text-xs">
                              <CheckCircle className="w-3.5 h-3.5" />
                              Verified
                            </span>
                          ) : (
                            <span className="text-amber-700 font-medium text-xs">
                              Unverified
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <RoleBadge role={u.role} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <select
                            value={u.role}
                            disabled={isCurrentUser || actionInProgress === `user-${u.id}`}
                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                            className="text-xs font-bold border border-[#EBE5D8] rounded-xl px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#C69214] shadow-xs disabled:opacity-50"
                          >
                            <option value="student">Student</option>
                            <option value="organizer">Organizer</option>
                            <option value="admin">Administrator</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
