import React, { useState, useEffect, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";
import { Calendar, ShieldCheck, ArrowRight, Lock, User, Sparkles } from "lucide-react";

/**
 * Basic Component as specified in prompt, styled with Ivory + Navy Blue + Gold
 */
export const Component = () => {
  const [count, setCount] = useState(0);

  return (
    <div className={cn("flex flex-col items-center gap-4 p-6 rounded-2xl bg-[#FFFDF9] border border-[#E5DCCB] shadow-sm max-w-sm mx-auto text-[#0B192C]")}>
      <div className="w-10 h-10 rounded-xl bg-[#C69214] text-[#070F1E] flex items-center justify-center font-black shadow-xs">
        <Sparkles className="w-5 h-5" />
      </div>
      <h1 className="text-xl font-black text-[#0B192C]">Component Counter</h1>
      <h2 className="text-3xl font-black text-[#C69214]">{count}</h2>
      <div className="flex gap-3">
        <button 
          onClick={() => setCount((prev) => prev - 1)}
          className="w-10 h-10 rounded-xl bg-[#FAF6ED] text-[#0B192C] font-bold border border-[#E5DCCB] hover:border-[#C69214] transition"
        >
          -
        </button>
        <button 
          onClick={() => setCount((prev) => prev + 1)}
          className="px-5 h-10 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C69214] text-[#070F1E] font-black shadow-xs hover:from-[#E5A93C] hover:to-[#D4AF37] transition"
        >
          + Increment
        </button>
      </div>
    </div>
  );
};

interface MercuryLoginProps {
  onSuccess?: (data: { identity: string }) => void;
}

/**
 * Mercury / Neural Access Login Component
 * Theme: Ivory Background (#FBF8F1), Navy Blue Font (#0B192C), Gold Buttons & Highlighted Text (#C69214)
 * Liquid physics simulation with interactive gooey parallax
 */
export const MercuryLogin: React.FC<MercuryLoginProps> = ({ onSuccess }) => {
  const [identity, setIdentity] = useState("");
  const [sequenceKey, setSequenceKey] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  // Static random blob parameters to prevent hydration / re-render jumps
  const blobsData = useMemo(() => {
    return Array.from({ length: 6 }).map(() => ({
      size: Math.random() * 220 + 160,
      left: Math.random() * 75 + 10,
      top: Math.random() * 75 + 10,
      animationDelay: Math.random() * -20,
      animationDuration: Math.random() * 14 + 14,
    }));
  }, []);

  const blobRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;

      blobRefs.current.forEach((blob, index) => {
        if (blob) {
          const speed = (index + 1) * 18;
          blob.style.marginLeft = `${x * speed}px`;
          blob.style.marginTop = `${y * speed}px`;
        }
      });
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity || !sequenceKey) {
      setStatusMsg("Please enter both campus identity and sequence key.");
      return;
    }
    setStatusMsg("Stream initialized! Authenticated with SIT Neural Portal.");
    if (onSuccess) {
      onSuccess({ identity });
    }
  };

  return (
    <div className="mercury-wrapper">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800;900&family=Space+Mono:wght@400;700&display=swap');

        :root {
          --bg-ivory: #FBF8F1;
          --ivory-surface: #FFFDF9;
          --ivory-card: #FAF6ED;
          --navy-blue: #0B192C;
          --navy-blue-muted: #243B55;
          --gold-accent: #C69214;
          --gold-bright: #D4AF37;
          --gold-glow: rgba(198, 146, 20, 0.45);
          --border-ivory: #E5DCCB;
          --filter-goo: url('#mercury-gooey');
        }

        .mercury-wrapper {
          background-color: var(--bg-ivory);
          color: var(--navy-blue);
          font-family: 'Inter', sans-serif;
          min-height: 100vh;
          width: 100%;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          padding: 24px;
        }

        .mercury-wrapper * {
          box-sizing: border-box;
          -webkit-font-smoothing: antialiased;
        }

        /* Real Campus Imagery Backdrop (Subtle Opacity) */
        .campus-backdrop {
          position: absolute;
          inset: 0;
          z-index: 0;
          opacity: 0.08;
          pointer-events: none;
        }

        .campus-backdrop img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* Background Liquid Gold & Ivory Physics Simulation */
        .mercury-stage {
          position: absolute;
          width: 100%;
          height: 100%;
          z-index: 1;
          filter: var(--filter-goo);
          opacity: 0.75;
          pointer-events: none;
        }

        .mercury-blob {
          position: absolute;
          background: linear-gradient(135deg, #F7E1A0, #D4AF37 40%, #C69214 75%, #8C6207);
          border-radius: 50%;
          filter: blur(22px);
          animation: mercuryFloat 18s infinite alternate ease-in-out;
          box-shadow: inset -10px -10px 25px rgba(11, 25, 44, 0.25), 
                      10px 10px 30px rgba(198, 146, 20, 0.35);
          transition: margin 0.1s ease-out;
        }

        @keyframes mercuryFloat {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(8vw, 15vh) scale(1.15); }
          66% { transform: translate(-6vw, 8vh) scale(0.85); }
          100% { transform: translate(6vw, -12vh) scale(1.1); }
        }

        /* Interface Card Container: Rich Ivory Glass */
        .auth-container {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 460px;
          padding: 44px 40px;
          background: rgba(255, 253, 249, 0.88);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid var(--border-ivory);
          border-radius: 28px;
          box-shadow: 0 20px 45px -15px rgba(11, 25, 44, 0.12),
                      0 0 0 1px rgba(198, 146, 20, 0.15);
        }

        .header {
          margin-bottom: 36px;
          text-align: left;
        }

        /* Highlighted Text in Gold */
        .brand-id {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--gold-accent);
          margin-bottom: 8px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        /* Main Headline in Bold Navy Blue */
        .header h1 {
          font-weight: 900;
          font-size: 2.75rem;
          line-height: 0.95;
          letter-spacing: -1.5px;
          color: var(--navy-blue);
          margin-top: 4px;
          margin-bottom: 0;
        }

        .header p {
          font-size: 12px;
          color: var(--navy-blue-muted);
          margin-top: 10px;
          font-weight: 500;
        }

        /* Form Elements with Navy Blue font and Gold Glow */
        .form-group {
          position: relative;
          margin-bottom: 26px;
          transition: transform 0.35s cubic-bezier(0.2, 1, 0.3, 1);
        }

        .form-group:focus-within {
          transform: translateX(6px);
        }

        .form-group label {
          display: block;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          font-weight: 700;
          color: var(--navy-blue);
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .form-group input {
          width: 100%;
          background: rgba(250, 246, 237, 0.6);
          border: 1px solid var(--border-ivory);
          border-radius: 12px;
          color: var(--navy-blue);
          padding: 12px 16px;
          font-size: 14px;
          font-family: 'Inter', sans-serif;
          outline: none;
          transition: border-color 0.3s, box-shadow 0.3s, background-color 0.3s;
        }

        .form-group input:focus {
          border-color: var(--gold-accent);
          background: #FFFDF9;
          box-shadow: 0 0 0 3px var(--gold-glow);
        }

        /* The Gold Button */
        .submit-wrap {
          margin-top: 36px;
          position: relative;
        }

        .btn-gold-stream {
          background: linear-gradient(135deg, #D4AF37, #C69214);
          color: #070F1E;
          border: 1px solid #F5D77F;
          padding: 16px 28px;
          font-size: 13px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 2px;
          cursor: pointer;
          width: 100%;
          border-radius: 14px;
          transition: all 0.25s ease;
          box-shadow: 0 10px 25px -8px rgba(198, 146, 20, 0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .btn-gold-stream:hover {
          background: linear-gradient(135deg, #E5A93C, #D4AF37);
          letter-spacing: 3px;
          transform: translateY(-2px);
          box-shadow: 0 14px 28px -6px rgba(198, 146, 20, 0.55);
        }

        .status-banner {
          margin-top: 16px;
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 700;
          background: #FAF6ED;
          border: 1px solid var(--gold-accent);
          color: var(--navy-blue);
          text-align: center;
        }

        /* Utility Footer Nav with Highlighted Gold Link */
        .footer-nav {
          margin-top: 32px;
          padding-top: 20px;
          border-top: 1px solid var(--border-ivory);
          display: flex;
          justify-content: space-between;
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          font-weight: 700;
        }

        .footer-nav a {
          color: var(--navy-blue);
          text-decoration: none;
          transition: color 0.2s;
        }

        .footer-nav a.highlight-gold {
          color: var(--gold-accent);
        }

        .footer-nav a:hover {
          color: var(--gold-accent);
          text-decoration: underline;
        }

        .svg-filter-hidden {
          position: absolute;
          width: 0;
          height: 0;
        }
      `}</style>

      {/* SVG Gooey Filter */}
      <svg className="svg-filter-hidden">
        <defs>
          <filter id="mercury-gooey">
            <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Real Campus Photography Backdrop */}
      <div className="campus-backdrop">
        <img
          src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&auto=format&fit=crop&q=80"
          alt="SIT Nagpur Academic Building"
        />
      </div>

      {/* Interactive Liquid Stage */}
      <div className="mercury-stage" id="stage">
        {blobsData.map((data, index) => (
          <div
            key={index}
            ref={(el) => {
              blobRefs.current[index] = el;
            }}
            className="mercury-blob"
            style={{
              width: `${data.size}px`,
              height: `${data.size}px`,
              left: `${data.left}%`,
              top: `${data.top}%`,
              animationDelay: `${data.animationDelay}s`,
              animationDuration: `${data.animationDuration}s`,
            }}
          />
        ))}
      </div>

      {/* Authentication Card */}
      <main className="auth-container">
        <header className="header">
          {/* Highlighted text in Gold */}
          <span className="brand-id">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SIT Node · 0x992</span>
          </span>
          <h1>
            NEURAL<br />
            ACCESS
          </h1>
          <p>
            Secure centralized authentication node for Symbiosis Institute of Technology.
          </p>
        </header>

        <form autoComplete="off" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Student Identity</label>
            <input
              type="text"
              placeholder="firstname.lastname.batchYYYY@sitnagpur.siu.edu"
              value={identity}
              onChange={(e) => setIdentity(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Sequence Key</label>
            <input
              type="password"
              placeholder="••••••••••••"
              value={sequenceKey}
              onChange={(e) => setSequenceKey(e.target.value)}
              required
            />
          </div>

          {/* Primary Action Button in Rich Gold */}
          <div className="submit-wrap">
            <button type="submit" className="btn-gold-stream">
              <span>Initialize Stream</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          {statusMsg && (
            <div className="status-banner">
              {statusMsg}
            </div>
          )}
        </form>

        <footer className="footer-nav">
          <a href="/auth?tab=login" className="highlight-gold">STANDARD LOGIN</a>
          <a href="/auth?tab=register">REGISTER ACCOUNT</a>
        </footer>
      </main>
    </div>
  );
};

export default MercuryLogin;
