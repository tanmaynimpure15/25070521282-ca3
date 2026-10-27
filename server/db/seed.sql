-- Realistic seed data for CampusConnect (SIT Nagpur)
-- Password for all seed accounts is: Password123!
-- Hash: $2b$10$00.vidbXpYh9jMZ7XFmp7eLk1chiSWZb/32PqbrIReikIcPEcxvba

-- 1. Insert Seed Users
INSERT INTO users (name, email, password_hash, role, account_status, email_verified_at) VALUES
('Prof. Rajesh Sharma (Dean / Admin)', 'admin.office@sitnagpur.siu.edu', '$2b$10$00.vidbXpYh9jMZ7XFmp7eLk1chiSWZb/32PqbrIReikIcPEcxvba', 'admin', 'active', NOW()),
('Tanmay Deshmukh (ACM Chapter Lead)', 'tanmay.deshmukh.batch2023@sitnagpur.siu.edu', '$2b$10$00.vidbXpYh9jMZ7XFmp7eLk1chiSWZb/32PqbrIReikIcPEcxvba', 'organizer', 'active', NOW()),
('Aswin Binu (Student)', 'aswin.binu.batch2024@sitnagpur.siu.edu', '$2b$10$00.vidbXpYh9jMZ7XFmp7eLk1chiSWZb/32PqbrIReikIcPEcxvba', 'student', 'active', NOW()),
('Priya Nair (Student)', 'priya.nair.batch2024@sitnagpur.siu.edu', '$2b$10$00.vidbXpYh9jMZ7XFmp7eLk1chiSWZb/32PqbrIReikIcPEcxvba', 'student', 'active', NOW());

-- 2. Insert College Events (Organizer ID: 2)
INSERT INTO events (organizer_id, title, description, category, poster_url, venue, start_at, end_at, capacity, status) VALUES
(2, 'HackNagpur 2026: 24-Hour Annual Hackathon', 
 'Join the premier coding marathon of SIT Nagpur! Collaborate with fellow engineers to build solutions in AI, Web3, and Smart Campus infrastructure. Mentorship from industry engineers, food, and cash prizes worth ₹50,000.', 
 'Technical', 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80', 'Auditorium & Computing Lab 1', NOW() + INTERVAL '5 days', NOW() + INTERVAL '6 days', 120, 'approved'),

(2, 'Hands-on AI & Full-Stack Development Workshop', 
 'An intensive weekend workshop walking through modern React, Node.js, and integrating LLM APIs into production-ready web apps. Open to all branches; bring your laptop.', 
 'Workshop', 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80', 'Seminar Hall 2, Academic Block B', NOW() + INTERVAL '8 days', NOW() + INTERVAL '8 days 4 hours', 60, 'approved'),

(2, 'Aura 2026: Annual Inter-Departmental Cultural Night', 
 'Celebrate musical performances, street drama, classical dance, and band battles at our flagship cultural evening. Come cheer for your departmental teams!', 
 'Cultural', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80', 'Open Air Amphitheatre', NOW() + INTERVAL '14 days', NOW() + INTERVAL '14 days 6 hours', 250, 'approved'),

(2, 'SIT Spardha: Intra-College Badminton Championship', 
 'Annual singles and doubles badminton tournament for all B.Tech batches. Fixtures will be drawn after registrations close. Standard BAI tournament rules apply.', 
 'Sports', 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&auto=format&fit=crop&q=80', 'Indoor Sports Complex, Court 1 & 2', NOW() + INTERVAL '10 days', NOW() + INTERVAL '11 days', 32, 'approved'),

(2, 'Symbiosis Tech Symposium: Student Paper Presentations', 
 'Platform for student researchers and final-year innovators to present their capstone papers to external faculty judges and IEEE student chapter members.', 
 'Academic', 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop&q=80', 'Conference Hall A, Ground Floor', NOW() + INTERVAL '18 days', NOW() + INTERVAL '18 days 5 hours', 80, 'approved'),

(2, 'RoboWars & Autonomous Obstacle Navigation', 
 'High-octane robotics challenge featuring line follower bots and 15kg combat bots. Teams must bring their own safety goggles and battery packs.', 
 'Technical', 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80', 'Mechanical Workshop Yard', NOW() + INTERVAL '22 days', NOW() + INTERVAL '22 days 4 hours', 40, 'pending');

-- 3. Insert Initial Registrations
-- Aswin Binu registers for HackNagpur (Event 1) and Workshop (Event 2)
INSERT INTO registrations (event_id, student_id, status) VALUES
(1, 3, 'confirmed'),
(2, 3, 'confirmed'),
(1, 4, 'confirmed');
