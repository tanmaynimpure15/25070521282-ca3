import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { RoleBadge } from './Badge';
import { Calendar, User, LogOut, Menu, X, ShieldAlert, Award } from 'lucide-react';

export default function Navbar() {
  const { user, logout, isEmailVerified, isStudent, isOrganizer, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-[#FAF6ED] text-[#0B192C] border-b border-[#E5DCCB] sticky top-0 z-40 shadow-xs">
      {/* Unverified email alert banner */}
      {user && !isEmailVerified && (
        <div className="bg-[#C69214] text-[#070F1E] px-4 py-2 text-xs flex items-center justify-between shadow-xs font-semibold">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            <ShieldAlert className="w-4 h-4 shrink-0 animate-bounce" />
            <span>
              Your college email (<strong className="underline">{user.email}</strong>) is not verified. 
              Email verification is required before you can reserve seats for campus events.
            </span>
            <Link 
              to="/auth?tab=verify" 
              className="ml-auto bg-[#0B192C] text-[#FAF8F5] hover:bg-[#070F1E] px-3.5 py-0.5 rounded-full font-bold text-xs shrink-0 transition"
            >
              Verify now →
            </Link>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-[#C69214] text-[#070F1E] flex items-center justify-center font-black text-lg shadow-sm border border-[#D8A938] group-hover:scale-105 transition-transform">
                <Calendar className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <span className="font-black text-xl text-[#0B192C] tracking-tight group-hover:text-[#C69214] transition flex items-center gap-1.5">
                  CampusConnect
                  <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-[#EFE8D8] text-[#C69214] border border-[#E5DCCB]">SIT</span>
                </span>
                <span className="hidden sm:block text-[11px] text-slate-600 font-semibold tracking-wide leading-none mt-0.5">
                  Symbiosis Institute of Technology · Nagpur
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            <Link
              to="/"
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive('/') 
                  ? 'bg-[#C69214] text-[#070F1E] shadow-xs' 
                  : 'text-[#0B192C]/80 hover:text-[#0B192C] hover:bg-[#EFE8D8]'
              }`}
            >
              Home
            </Link>
            <Link
              to="/events"
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive('/events') 
                  ? 'bg-[#C69214] text-[#070F1E] shadow-xs' 
                  : 'text-[#0B192C]/80 hover:text-[#0B192C] hover:bg-[#EFE8D8]'
              }`}
            >
              Explore Events
            </Link>

            {/* Role specific links */}
            {user && (
              <>
                <Link
                  to="/dashboard"
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive('/dashboard') 
                      ? 'bg-[#C69214] text-[#070F1E] shadow-xs' 
                      : 'text-[#0B192C]/80 hover:text-[#0B192C] hover:bg-[#EFE8D8]'
                  }`}
                >
                  My Passes
                </Link>

                {isOrganizer && (
                  <Link
                    to="/organizer"
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      isActive('/organizer') 
                        ? 'bg-[#C69214] text-[#070F1E] shadow-xs' 
                        : 'text-[#0B192C] hover:bg-[#EFE8D8] border border-[#E5DCCB]'
                    }`}
                  >
                    Organizer Hub
                  </Link>
                )}

                {isAdmin && (
                  <Link
                    to="/admin"
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      isActive('/admin') 
                        ? 'bg-[#C69214] text-[#070F1E] shadow-xs' 
                        : 'text-[#0B192C] hover:bg-[#EFE8D8] border border-[#E5DCCB]'
                    }`}
                  >
                    Admin Console
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* User Profile / Auth buttons */}
          <div className="hidden md:flex items-center gap-3.5">
            {user ? (
              <div className="flex items-center gap-3 pl-3.5 border-l border-[#E5DCCB]">
                <div className="text-right">
                  <div className="flex items-center gap-1.5 justify-end">
                    <span className="text-xs font-bold text-[#0B192C] max-w-[150px] truncate">
                      {user.name}
                    </span>
                    <RoleBadge role={user.role} />
                  </div>
                  <span className="text-[11px] text-slate-600 font-mono block truncate max-w-[180px]">
                    {user.email}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  title="Log out"
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-[#EFE8D8] rounded-lg transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/auth?tab=login"
                  className="px-4 py-2 text-xs font-bold text-[#0B192C] hover:bg-[#EFE8D8] rounded-lg transition"
                >
                  Log in
                </Link>
                <Link
                  to="/auth?tab=register"
                  className="px-5 py-2 text-xs font-black text-[#070F1E] bg-[#C69214] hover:bg-[#AF7F0E] hover:text-white rounded-lg shadow-xs transition-all border border-[#D8A938]"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#0B192C] hover:bg-[#EFE8D8]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E5DCCB] bg-[#FAF6ED] px-5 pt-4 pb-6 space-y-3 animate-fade-in shadow-lg">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-bold text-[#0B192C] hover:bg-[#EFE8D8]"
          >
            Home
          </Link>
          <Link
            to="/events"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-bold text-[#0B192C] hover:bg-[#EFE8D8]"
          >
            Explore Events
          </Link>

          {user && (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-bold text-[#0B192C] hover:bg-[#EFE8D8]"
              >
                My Passes
              </Link>
              {isOrganizer && (
                <Link
                  to="/organizer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-bold text-[#0B192C] hover:bg-[#EFE8D8]"
                >
                  Organizer Hub
                </Link>
              )}
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-bold text-[#0B192C] hover:bg-[#EFE8D8]"
                >
                  Admin Console
                </Link>
              )}
            </>
          )}

          <div className="pt-4 border-t border-[#E5DCCB]">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between px-3">
                  <div>
                    <p className="text-sm font-bold text-[#0B192C]">{user.name}</p>
                    <p className="text-xs text-slate-600 font-mono">{user.email}</p>
                  </div>
                  <RoleBadge role={user.role} />
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-lg font-bold"
                >
                  Log out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-1">
                <Link
                  to="/auth?tab=login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-xs font-bold text-[#0B192C] border border-[#E5DCCB] rounded-lg bg-white"
                >
                  Log in
                </Link>
                <Link
                  to="/auth?tab=register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-xs font-black text-[#070F1E] bg-[#C69214] rounded-lg shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
