import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Pages
import Home from './pages/Home';
import ExploreEvents from './pages/ExploreEvents';
import EventDetails from './pages/EventDetails';
import Auth from './pages/Auth';
import StudentDashboard from './pages/StudentDashboard';
import OrganizerDashboard from './pages/OrganizerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Demo from '@/components/ui/demo';

function AppLayout() {
  const location = useLocation();
  
  // Footer is intentionally omitted on login/sign-in pages per requirement
  const authRoutes = ['/auth', '/verify-email', '/signin-demo', '/neural-login'];
  const hideFooter = authRoutes.some((route) => location.pathname.startsWith(route));

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF8F1] text-[#0B192C] font-sans selection:bg-[#C69214]/25 selection:text-[#0B192C]">
      <Navbar />
      
      <main className="flex-1 bg-[#FBF8F1]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<ExploreEvents />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/verify-email" element={<Auth />} />
          <Route path="/signin-demo" element={<Demo />} />
          <Route path="/neural-login" element={<Demo />} />
          
          {/* Authenticated Dashboards */}
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/organizer" element={<OrganizerDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Render Footer only where necessary (omitted from login/auth pages) */}
      {!hideFooter && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </BrowserRouter>
  );
}
