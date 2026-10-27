import React from 'react';

const CATEGORY_STYLES = {
  Technical: {
    bg: 'bg-[#F2ECE0] text-[#0B192C] border-[#C69214]/60',
    dot: 'bg-[#C69214]',
  },
  Workshop: {
    bg: 'bg-emerald-50 text-emerald-900 border-emerald-400',
    dot: 'bg-emerald-600',
  },
  Cultural: {
    bg: 'bg-amber-50 text-amber-900 border-amber-400',
    dot: 'bg-amber-600',
  },
  Sports: {
    bg: 'bg-blue-50 text-[#0B192C] border-blue-400',
    dot: 'bg-[#0B192C]',
  },
  Academic: {
    bg: 'bg-[#FBF0D9] text-[#0B192C] border-[#C69214]',
    dot: 'bg-[#C69214]',
  },
  Social: {
    bg: 'bg-slate-100 text-slate-800 border-slate-300',
    dot: 'bg-slate-600',
  },
};

const STATUS_STYLES = {
  approved: {
    badge: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    dot: 'bg-emerald-600',
  },
  pending: {
    badge: 'bg-[#FBF0D9] text-[#0B192C] border-[#C69214]',
    dot: 'bg-[#C69214] animate-pulse',
  },
  rejected: {
    badge: 'bg-rose-50 text-rose-800 border-rose-300',
    dot: 'bg-rose-600',
  },
  confirmed: {
    badge: 'bg-[#FBF0D9] text-[#0B192C] border-[#C69214]',
    dot: 'bg-[#C69214]',
  },
  cancelled: {
    badge: 'bg-slate-100 text-slate-600 border-slate-300',
    dot: 'bg-slate-400',
  },
};

export function CategoryBadge({ category, showDot = true, className = '' }) {
  const style = CATEGORY_STYLES[category] || {
    bg: 'bg-[#F2ECE0] text-[#0B192C] border-[#C69214]/50',
    dot: 'bg-[#C69214]',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-2xs tracking-wide ${style.bg} ${className}`}
    >
      {showDot && (
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} />
      )}
      {category}
    </span>
  );
}

export function StatusBadge({ status, className = '' }) {
  const style = STATUS_STYLES[status] || {
    badge: 'bg-slate-100 text-slate-700 border-slate-300',
    dot: 'bg-slate-400',
  };
  const label = status ? status.charAt(0).toUpperCase() + status.slice(1) : '';

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold border ${style.badge} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} />
      {label}
    </span>
  );
}

export function RoleBadge({ role }) {
  const roles = {
    admin: 'bg-[#0B192C] text-[#FAF8F5] border-[#070F1E]',
    organizer: 'bg-[#C69214] text-[#070F1E] border-[#D8A938]',
    student: 'bg-[#F2ECE0] text-[#0B192C] border-[#E5DCCB]',
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-extrabold uppercase tracking-wider border shadow-2xs ${roles[role] || 'bg-slate-100 text-slate-700 border-slate-300'}`}
    >
      {role}
    </span>
  );
}
