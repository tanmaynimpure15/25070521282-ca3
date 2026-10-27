import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { 
  Lock, 
  Mail, 
  User, 
  AlertCircle, 
  CheckCircle, 
  ShieldCheck, 
  Loader2, 
  GraduationCap
} from 'lucide-react';

export default function Auth() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, login, register, verifyEmail, refreshUser } = useAuth();

  const tab = searchParams.get('tab') || 'login';
  const tokenParam = searchParams.get('token') || '';

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Status & message states
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationPendingData, setVerificationPendingData] = useState(null);

  // If already logged in and verified, redirect to dashboard or home
  useEffect(() => {
    if (user && user.email_verified_at && tab !== 'verify') {
      navigate('/dashboard');
    }
  }, [user, tab, navigate]);

  // Handle URL token verification
  useEffect(() => {
    if (tab === 'verify' && tokenParam) {
      handleTokenVerification(tokenParam);
    }
  }, [tab, tokenParam]);

  const handleTokenVerification = async (tokenToVerify) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const data = await api.verifyEmail(tokenToVerify);
      setSuccess(data.message || 'Email verified successfully! You can now register for campus events.');
      await refreshUser();
    } catch (err) {
      setError(err.message || 'Verification link expired or invalid.');
    } finally {
      setLoading(false);
    }
  };

  const setTab = (newTab) => {
    setError('');
    setSuccess('');
    setVerificationPendingData(null);
    setSearchParams({ tab: newTab });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const data = await register(name, email, password);
      setSuccess(data.message || 'Account created! Please verify your college email address.');
      if (data.verificationToken) {
        setVerificationPendingData({
          token: data.verificationToken,
          link: data.verificationLink,
          email: data.user.email
        });
      }
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 animate-fade-in bg-[#FBF8F1]">
      <div className="bg-[#FFFDF9] rounded-2xl border border-[#E5DCCB] shadow-sm overflow-hidden card-hover-lift">
        {/* Ivory Header with Gold & Dark Blue Branding */}
        <div className="p-8 text-center bg-[#FAF6ED] border-b border-[#E5DCCB]">
          <div className="w-14 h-14 rounded-2xl bg-[#C69214] text-[#070F1E] flex items-center justify-center mx-auto mb-3 shadow-sm border border-[#D8A938]">
            <GraduationCap className="w-8 h-8 stroke-[2.5]" />
          </div>

          <h2 className="text-2xl font-black text-[#0B192C] tracking-tight">
            SIT Student Portal
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Symbiosis Institute of Technology, Nagpur
          </p>

          {/* Tab Switcher */}
          <div className="flex bg-[#F2ECE0] p-1.5 rounded-xl mt-6 border border-[#E5DCCB] max-w-xs mx-auto">
            <button
              type="button"
              onClick={() => setTab('login')}
              className={`flex-1 py-2 text-xs font-black rounded-lg transition-all ${
                tab === 'login'
                  ? 'bg-[#C69214] text-[#070F1E] shadow-2xs'
                  : 'text-[#0B192C]/80 hover:text-[#0B192C]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setTab('register')}
              className={`flex-1 py-2 text-xs font-black rounded-lg transition-all ${
                tab === 'register'
                  ? 'bg-[#C69214] text-[#070F1E] shadow-2xs'
                  : 'text-[#0B192C]/80 hover:text-[#0B192C]'
              }`}
            >
              Register
            </button>
          </div>

          <div className="mt-3 text-center">
            <Link
              to="/neural-login"
              className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#C69214] hover:text-[#B8860B] transition"
            >
              <span>⚡ Switch to Neural Liquid Stream Login →</span>
            </Link>
          </div>
        </div>

        <div className="p-8 space-y-6 bg-[#FFFDF9]">
          {/* Error Banner */}
          {error && (
            <div className="bg-rose-50 border border-rose-300 text-rose-950 p-4 rounded-xl text-xs flex items-start gap-3 animate-fade-in shadow-2xs">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <span className="font-semibold leading-relaxed">{error}</span>
            </div>
          )}

          {/* Success Banner */}
          {success && (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-950 p-4 rounded-xl text-xs flex items-start gap-3 animate-fade-in shadow-2xs">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <span className="font-bold">{success}</span>
            </div>
          )}

          {/* Verification Box */}
          {verificationPendingData && (
            <div className="bg-[#FAF6ED] border border-[#C69214] rounded-xl p-5 text-xs space-y-3 animate-fade-in shadow-2xs">
              <div className="flex items-center gap-2 font-black text-[#0B192C] text-sm">
                <ShieldCheck className="w-5 h-5 text-[#C69214]" />
                <span>Simulated Mailbox Verification</span>
              </div>
              <p className="text-slate-700 leading-relaxed font-medium">
                In production, a link is sent to <strong className="text-[#0B192C] font-bold">{verificationPendingData.email}</strong>. 
                For instant evaluation and testing, verify your mailbox immediately:
              </p>
              <button
                type="button"
                onClick={() => handleTokenVerification(verificationPendingData.token)}
                className="w-full py-2.5 px-4 bg-[#C69214] hover:bg-[#AF7F0E] hover:text-white text-[#070F1E] font-black rounded-lg text-xs flex items-center justify-center gap-2 shadow-xs transition-all border border-[#D8A938]"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Verify {verificationPendingData.email}</span>
              </button>
            </div>
          )}

          {/* SIGN IN FORM */}
          {tab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0B192C] mb-1.5">
                  SIT College Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="firstname.lastname.batchYYYY@sitnagpur.siu.edu"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs border border-[#E5DCCB] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#C69214]/15 focus:border-[#C69214] bg-[#FAF8F5] text-[#0B192C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B192C] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs border border-[#E5DCCB] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#C69214]/15 focus:border-[#C69214] bg-[#FAF8F5] text-[#0B192C]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-[#C69214] hover:bg-[#AF7F0E] hover:text-white text-[#070F1E] font-black rounded-xl text-xs transition-all shadow-md shadow-[#C69214]/20 disabled:opacity-50 flex items-center justify-center gap-2 transform hover:-translate-y-0.5 border border-[#D8A938]"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Log In to CampusConnect'}
              </button>

              {/* 1-Click Demo Accounts */}
              <div className="pt-6 border-t border-[#E5DCCB] text-center space-y-2">
                <p className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
                  1-Click Demo Accounts (Password: Password123!)
                </p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('aswin.binu.batch2024@sitnagpur.siu.edu', 'Password123!')}
                    className="p-2 bg-[#FAF6ED] border border-[#E5DCCB] rounded-lg text-[#0B192C] hover:border-[#C69214] transition font-bold"
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('tanmay.deshmukh.batch2023@sitnagpur.siu.edu', 'Password123!')}
                    className="p-2 bg-[#FAF6ED] border border-[#E5DCCB] rounded-lg text-[#0B192C] hover:border-[#C69214] transition font-bold"
                  >
                    Organizer
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('admin.office@sitnagpur.siu.edu', 'Password123!')}
                    className="p-2 bg-[#FAF6ED] text-[#0B192C] border border-[#E5DCCB] rounded-lg hover:border-[#C69214] transition font-bold"
                  >
                    Admin
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* REGISTER FORM */}
          {tab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0B192C] mb-1.5">
                  Full Student Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Tanmay Deshmukh"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs border border-[#E5DCCB] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#C69214]/15 focus:border-[#C69214] bg-[#FAF8F5] text-[#0B192C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B192C] mb-1.5">
                  Official SIT Nagpur Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="firstname.lastname.batchYYYY@sitnagpur.siu.edu"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs border border-[#E5DCCB] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#C69214]/15 focus:border-[#C69214] bg-[#FAF8F5] text-[#0B192C]"
                  />
                </div>
                <div className="mt-2 text-[11px] text-[#0B192C]/80 bg-[#FAF6ED] p-3 rounded-lg border border-[#E5DCCB] leading-relaxed">
                  <strong className="text-[#0B192C] block font-bold">Required Student Pattern:</strong>
                  <code className="text-[#0B192C] font-mono font-bold bg-[#F4ECE1] px-1 py-0.5 rounded">firstname.lastname.batchYYYY@sitnagpur.siu.edu</code>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0B192C] mb-1.5">
                  Password (min. 8 characters)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs border border-[#E5DCCB] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#C69214]/15 focus:border-[#C69214] bg-[#FAF8F5] text-[#0B192C]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-[#C69214] hover:bg-[#AF7F0E] hover:text-white text-[#070F1E] font-black rounded-xl text-xs transition-all shadow-md shadow-[#C69214]/20 disabled:opacity-50 flex items-center justify-center gap-2 transform hover:-translate-y-0.5 border border-[#D8A938]"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Student Account'}
              </button>
            </form>
          )}

          {/* VERIFY TAB */}
          {tab === 'verify' && (
            <div className="space-y-4 py-4 text-center">
              <div className="w-12 h-12 rounded-xl bg-[#FAF6ED] text-[#0B192C] flex items-center justify-center mx-auto border border-[#E5DCCB]">
                <ShieldCheck className="w-6 h-6 text-[#C69214]" />
              </div>
              <h3 className="text-base font-black text-[#0B192C]">Mailbox Verification</h3>
              <p className="text-xs text-slate-600 max-w-xs mx-auto">
                Confirming student mailbox ownership for Symbiosis Institute of Technology access.
              </p>

              {loading && <p className="text-xs text-[#0B192C] font-bold">Verifying security token...</p>}

              <div className="pt-4">
                <Link to="/events" className="text-xs font-black text-[#0B192C] hover:text-[#C69214]">
                  Return to Events Directory →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
