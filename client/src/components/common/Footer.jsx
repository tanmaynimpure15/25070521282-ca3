import React from 'react';
import { Calendar, MapPin, Mail, ExternalLink, Award, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#FAF6ED] text-[#0B192C] border-t border-[#E5DCCB] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Column 1: College & Project Identity */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#C69214] text-[#070F1E] flex items-center justify-center font-black text-sm shadow-sm border border-[#D8A938]">
                <Calendar className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="font-extrabold text-lg text-[#0B192C] tracking-tight flex items-center gap-2">
                CampusConnect
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#EFE8D8] text-[#C69214] border border-[#E5DCCB]">SIT Nagpur</span>
              </span>
            </div>
            <p className="text-sm text-slate-700 max-w-md leading-relaxed">
              Official centralized campus event and registration platform for the students and faculty of 
              <strong className="text-[#0B192C] font-semibold"> Symbiosis Institute of Technology (SIT), Nagpur</strong>.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-600 pt-1">
              <MapPin className="w-4 h-4 text-[#C69214] shrink-0" />
              <span>Mouza - Wathoda, Nagpur, Maharashtra 440008</span>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-[#0B192C] uppercase tracking-wider">
              Quick Portals
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-700">
              <li>
                <Link to="/" className="hover:text-[#C69214] transition font-medium">Home</Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-[#C69214] transition font-medium">Explore Events Directory</Link>
              </li>
              <li>
                <Link to="/auth?tab=login" className="hover:text-[#C69214] transition font-medium">Student Portal Sign In</Link>
              </li>
              <li>
                <Link to="/auth?tab=register" className="hover:text-[#C69214] transition font-medium">New Account Registration</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: College Email Guidelines */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-[#0B192C] uppercase tracking-wider">
              Student Email Rules
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed">
              Registrations require an official student batch email address:
            </p>
            <code className="text-[11px] bg-white px-3 py-1.5 rounded-md text-[#0B192C] font-mono font-bold border border-[#E5DCCB] block max-w-xs shadow-2xs">
              *.batchYYYY@sitnagpur.siu.edu
            </code>
            <div className="pt-2 text-xs text-slate-600">
              Technical Support: <br />
              <a href="mailto:admin.office@sitnagpur.siu.edu" className="text-[#0B192C] hover:text-[#C69214] underline font-mono font-bold">
                admin.office@sitnagpur.siu.edu
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-[#E5DCCB] mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} CampusConnect · Symbiosis Institute of Technology, Nagpur.</p>
          <p className="flex items-center gap-1.5 text-[#0B192C] font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C69214]" />
            Ivory, Gold & Dark Blue Theme
          </p>
        </div>
      </div>
    </footer>
  );
}
