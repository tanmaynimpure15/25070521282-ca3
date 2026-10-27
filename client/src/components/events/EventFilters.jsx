import React from 'react';
import { Search, X, Sparkles, Laptop, Music, Trophy, BookOpen, Users, Compass } from 'lucide-react';

const CATEGORIES = [
  { name: 'All', icon: Compass },
  { name: 'Technical', icon: Laptop },
  { name: 'Cultural', icon: Music },
  { name: 'Sports', icon: Trophy },
  { name: 'Workshop', icon: Sparkles },
  { name: 'Academic', icon: BookOpen },
  { name: 'Social', icon: Users },
];

export default function EventFilters({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  totalCount,
}) {
  return (
    <div className="space-y-4">
      {/* Search Input Bar with Gold Focus Glow */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4 text-[#C69214]" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by event title, topics, venue, or keywords..."
          className="w-full pl-11 pr-11 py-3 bg-white border border-[#EBE5D8] rounded-xl text-sm text-[#0B192C] placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-[#C69214]/15 focus:border-[#C69214] shadow-xs transition-all"
        />
        {searchTerm && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.name;
          const Icon = cat.icon;

          return (
            <button
              key={cat.name}
              onClick={() => onCategoryChange(cat.name)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 border shadow-2xs ${
                isSelected
                  ? 'bg-[#0B192C] text-[#E5A93C] border-[#C69214] shadow-sm'
                  : 'bg-white text-slate-700 border-[#EBE5D8] hover:border-[#C69214]/60 hover:bg-[#FAF8F5]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.name}</span>
            </button>
          );
        })}

        {totalCount !== undefined && (
          <span className="text-xs font-bold text-[#0B192C] ml-auto hidden sm:block shrink-0 bg-[#F5F1E9] px-3.5 py-1 rounded-full border border-[#EBE5D8]">
            {totalCount} {totalCount === 1 ? 'event' : 'events'}
          </span>
        )}
      </div>
    </div>
  );
}
