"use client";

import * as React from "react";
import { useState } from "react";
import { Calendar, GraduationCap, Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";

interface SignInProps {
  onSuccess?: (credentials: { email: string; role?: string }) => void;
  defaultEmail?: string;
}

const SignIn1 = ({ onSuccess, defaultEmail = "" }: SignInProps) => {
  const [email, setEmail] = React.useState(defaultEmail);
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const validateEmail = (emailStr: string) => {
    // Supports student format: firstname.lastname.batchYYYY@sitnagpur.siu.edu or general email
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      setError("Please enter both SIT email and password.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid official college email address.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      if (onSuccess) {
        await onSuccess({ email });
      } else {
        alert(`Signed in successfully as ${email}`);
      }
    } catch (err: any) {
      setError(err?.message || "Sign in failed. Please check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center bg-[#FBF8F1] relative overflow-hidden w-full rounded-2xl py-12 px-4 selection:bg-[#C69214]/25 selection:text-[#0B192C]">
      {/* Decorative campus ambient rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[540px] h-[540px] bg-[#FAF6ED] rounded-full blur-3xl pointer-events-none opacity-80" />
      <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-[#C69214]/10 rounded-full blur-2xl pointer-events-none" />

      {/* Centered Ivory Glass Card */}
      <div className="relative z-10 w-full max-w-sm sm:max-w-md rounded-3xl bg-[#FFFDF9] border border-[#E5DCCB] shadow-xl p-8 sm:p-10 flex flex-col items-center">
        {/* SIT Nagpur Brand Logo */}
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#C69214] text-[#070F1E] mb-5 shadow-md border border-amber-300">
          <Calendar className="w-7 h-7 stroke-[2.5]" />
        </div>

        {/* Title in High-Contrast Navy Blue */}
        <h2 className="text-2xl font-black text-[#0B192C] tracking-tight mb-1 text-center">
          CampusConnect
        </h2>
        <p className="text-xs font-semibold text-slate-600 mb-6 text-center">
          Symbiosis Institute of Technology · Nagpur
        </p>

        {/* Form Container */}
        <div className="flex flex-col w-full gap-4">
          <div className="w-full flex flex-col gap-3">
            <div>
              <label className="block text-xs font-bold text-[#0B192C] mb-1.5">
                Official College Email
              </label>
              <div className="relative">
                <input
                  placeholder="firstname.lastname.batch2024@sitnagpur.siu.edu"
                  type="email"
                  value={email}
                  className="w-full px-4 py-3 rounded-xl bg-[#FAF6ED] text-[#0B192C] placeholder-slate-400 text-xs sm:text-sm border border-[#E5DCCB] focus:outline-none focus:ring-2 focus:ring-[#C69214] focus:border-[#C69214] transition"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0B192C] mb-1.5">
                Password
              </label>
              <input
                placeholder="••••••••••••"
                type="password"
                value={password}
                className="w-full px-4 py-3 rounded-xl bg-[#FAF6ED] text-[#0B192C] placeholder-slate-400 text-xs sm:text-sm border border-[#E5DCCB] focus:outline-none focus:ring-2 focus:ring-[#C69214] focus:border-[#C69214] transition"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg p-2.5 text-left animate-fade-in">
                {error}
              </div>
            )}
          </div>

          <hr className="border-[#E5DCCB] my-1" />

          <div>
            {/* Primary Gold Action Button */}
            <button
              onClick={handleSignIn}
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#D4AF37] to-[#C69214] hover:from-[#E5A93C] hover:to-[#D4AF37] text-[#070F1E] font-black px-5 py-3 rounded-xl shadow-md transition-all duration-200 mb-3 text-sm flex items-center justify-center gap-2 border border-amber-300 disabled:opacity-50"
            >
              <span>{loading ? "Authenticating..." : "Sign in with Campus ID"}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>

            {/* University SSO Button */}
            <button
              type="button"
              onClick={() => alert("Google SSO is linked with your @sitnagpur.siu.edu student account.")}
              className="w-full flex items-center justify-center gap-2.5 bg-[#FAF6ED] border border-[#E5DCCB] hover:border-[#C69214] hover:bg-[#F2ECE0] rounded-xl px-5 py-3 font-bold text-[#0B192C] shadow-2xs transition mb-2 text-xs sm:text-sm"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with SIU Google Workspace</span>
            </button>

            <div className="w-full text-center mt-3">
              <span className="text-xs text-slate-600">
                New SIT student?{" "}
                <a
                  href="/auth?tab=register"
                  className="font-bold text-[#0B192C] underline hover:text-[#C69214] transition"
                >
                  Create an account
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Verified Student Community & Avatars */}
      <div className="relative z-10 mt-8 flex flex-col items-center text-center">
        <p className="text-slate-600 text-xs sm:text-sm mb-2.5 font-medium">
          Join <span className="font-extrabold text-[#0B192C]">500+ SIT Nagpur students</span> collaborating across hackathons and fests.
        </p>
        <div className="flex items-center -space-x-2">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
            alt="Student 1"
            className="w-8 h-8 rounded-full border-2 border-[#FAF6ED] object-cover shadow-xs"
          />
          <img
            src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80"
            alt="Student 2"
            className="w-8 h-8 rounded-full border-2 border-[#FAF6ED] object-cover shadow-xs"
          />
          <img
            src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80"
            alt="Student 3"
            className="w-8 h-8 rounded-full border-2 border-[#FAF6ED] object-cover shadow-xs"
          />
          <img
            src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&auto=format&fit=crop&q=80"
            alt="Student 4"
            className="w-8 h-8 rounded-full border-2 border-[#FAF6ED] object-cover shadow-xs"
          />
          <div className="w-8 h-8 rounded-full bg-[#C69214] text-[#070F1E] font-black text-[10px] flex items-center justify-center border-2 border-[#FAF6ED] shadow-xs">
            +500
          </div>
        </div>
      </div>
    </div>
  );
};

export { SignIn1 };

export default SignIn1;
