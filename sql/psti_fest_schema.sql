-- PSTI FEST 2025 Database Schema
-- Database untuk sistem PSTI FEST 2025

-- Create database
CREATE DATABASE IF NOT EXISTS psti_fest_2025;
USE psti_fest_2025;

-- Table: users (untuk sistem autentikasi)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    university VARCHAR(100),
    major VARCHAR(100),
    student_id VARCHAR(50),
    profile_image VARCHAR(255) DEFAULT 'default-avatar.png',
    role ENUM('participant', 'admin', 'judge', 'village') DEFAULT 'participant',
    email_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    reset_token VARCHAR(255),
    reset_token_expires DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- Table: competitions (kategori kompetisi PSTI FEST)
CREATE TABLE competitions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    detailed_description LONGTEXT,
    category ENUM('ideathon', 'smartvillage', 'badminton', 'seminar') NOT NULL,
    max_participants INT DEFAULT 1000,
    current_participants INT DEFAULT 0,
    registration_fee DECIMAL(10,2) DEFAULT 0.00,
    prize_pool DECIMAL(15,2) NOT NULL,
    first_prize DECIMAL(15,2),
    second_prize DECIMAL(15,2),
    third_prize DECIMAL(15,2),
    registration_start DATETIME NOT NULL,
    registration_end DATETIME NOT NULL,
    competition_start DATETIME NOT NULL,
    competition_end DATETIME NOT NULL,
    requirements TEXT,
    rules TEXT,
    submission_format VARCHAR(255),
    contact_person VARCHAR(100),
    contact_email VARCHAR(100),
    google_form_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table: registrations (pendaftaran peserta)
CREATE TABLE registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    competition_id INT NOT NULL,
    team_name VARCHAR(100),
    team_members JSON, -- Untuk menyimpan data anggota tim dalam format JSON
    motivation TEXT,
    experience_level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
    portfolio_url VARCHAR(255),
    github_url VARCHAR(255),
    linkedin_url VARCHAR(255),
    institution VARCHAR(100),
    village_name VARCHAR(100), -- Khusus untuk Smart Village
    village_address TEXT, -- Khusus untuk Smart Village
    innovation_description TEXT, -- Khusus untuk Smart Village
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    payment_method VARCHAR(50),
    payment_reference VARCHAR(100),
    registration_status ENUM('pending', 'approved', 'rejected', 'cancelled') DEFAULT 'pending',
    submission_file VARCHAR(255),
    submission_url VARCHAR(255),
    submission_notes TEXT,
    video_url VARCHAR(255), -- Untuk video gagasan Ideathon
    proposal_file VARCHAR(255), -- Untuk proposal Ideathon
    submitted_at TIMESTAMP NULL,
    score DECIMAL(5,2) DEFAULT 0.00,
    rank INT DEFAULT 0,
    certificate_issued BOOLEAN DEFAULT FALSE,
    certificate_url VARCHAR(255),
    google_form_response_id VARCHAR(255), -- ID response dari Google Forms
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (competition_id) REFERENCES competitions(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_competition (user_id, competition_id)
);

-- Table: seminars (untuk seminar nasional)
CREATE TABLE seminars (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    speaker_name VARCHAR(100) NOT NULL,
    speaker_bio TEXT,
    speaker_image VARCHAR(255),
    speaker_company VARCHAR(100),
    speaker_position VARCHAR(100),
    seminar_date DATETIME NOT NULL,
    duration_minutes INT DEFAULT 120,
    max_participants INT DEFAULT 500,
    current_participants INT DEFAULT 0,
    venue VARCHAR(200),
    meeting_link VARCHAR(255),
    meeting_password VARCHAR(50),
    materials_url VARCHAR(255),
    recording_url VARCHAR(255),
    registration_fee DECIMAL(10,2) DEFAULT 0.00,
    google_form_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table: seminar_registrations (pendaftaran seminar)
CREATE TABLE seminar_registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    seminar_id INT NOT NULL,
    attendance_status ENUM('registered', 'attended', 'absent') DEFAULT 'registered',
    payment_status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
    payment_reference VARCHAR(100),
    certificate_issued BOOLEAN DEFAULT FALSE,
    certificate_url VARCHAR(255),
    feedback_rating INT CHECK (feedback_rating >= 1 AND feedback_rating <= 5),
    feedback_comment TEXT,
    google_form_response_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (seminar_id) REFERENCES seminars(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_seminar (user_id, seminar_id)
);

-- Table: smart_villages (untuk Smart Village Awards)
CREATE TABLE smart_villages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    village_name VARCHAR(100) NOT NULL,
    village_address TEXT NOT NULL,
    village_head VARCHAR(100),
    contact_person VARCHAR(100) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    contact_email VARCHAR(100) NOT NULL,
    population INT,
    innovation_title VARCHAR(200) NOT NULL,
    innovation_description LONGTEXT NOT NULL,
    technology_used TEXT,
    implementation_year YEAR,
    beneficiaries INT,
    economic_impact TEXT,
    social_impact TEXT,
    environmental_impact TEXT,
    sustainability_plan TEXT,
    collaboration_partners TEXT,
    replication_potential TEXT,
    documentation_url VARCHAR(255),
    video_url VARCHAR(255),
    images JSON, -- Array of image URLs
    score_innovation DECIMAL(5,2) DEFAULT 0.00,
    score_impact DECIMAL(5,2) DEFAULT 0.00,
    score_sustainability DECIMAL(5,2) DEFAULT 0.00,
    score_collaboration DECIMAL(5,2) DEFAULT 0.00,
    score_replication DECIMAL(5,2) DEFAULT 0.00,
    total_score DECIMAL(5,2) DEFAULT 0.00,
    rank INT DEFAULT 0,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    google_form_response_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table: announcements (pengumuman)
CREATE TABLE announcements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    type ENUM('general', 'competition', 'seminar', 'urgent', 'smartvillage') DEFAULT 'general',
    target_audience ENUM('all', 'participants', 'judges', 'admins', 'villages') DEFAULT 'all',
    competition_id INT NULL,
    is_published BOOLEAN DEFAULT FALSE,
    publish_date DATETIME,
    expire_date DATETIME,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (competition_id) REFERENCES competitions(id) ON DELETE SET NULL
);

-- Table: contact_messages (pesan kontak)
CREATE TABLE contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    user_id INT NULL,
    category ENUM('general', 'technical', 'competition', 'payment') DEFAULT 'general',
    status ENUM('new', 'read', 'replied', 'closed') DEFAULT 'new',
    replied_by INT NULL,
    reply_message TEXT,
    replied_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (replied_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Table: activity_logs (log aktivitas pengguna)
CREATE TABLE activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    description TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    additional_data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Table: settings (pengaturan sistem)
CREATE TABLE settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default competitions for PSTI FEST 2025
INSERT INTO competitions (name, slug, description, detailed_description, category, max_participants, prize_pool, first_prize, second_prize, third_prize, registration_start, registration_end, competition_start, competition_end, requirements, rules, google_form_url) VALUES
('Lomba Ideathon', 'ideathon', 'Kompetisi ide inovatif dengan tema Smart Village berbasis teknologi dan kearifan lokal.', 'Lomba Ideathon PSTI FEST 2025 mengundang peserta untuk mengembangkan ide inovatif dalam mewujudkan desa cerdas. Peserta akan mempresentasikan solusi teknologi yang dapat meningkatkan kualitas hidup masyarakat desa dengan tetap mempertahankan kearifan lokal.', 'ideathon', 30, 2250000.00, 1000000.00, 750000.00, 500000.00, '2025-06-16 00:00:00', '2025-06-25 23:59:59', '2025-07-24 08:00:00', '2025-07-24 14:00:00', 'Tim maksimal 3 orang, Mahasiswa/Pelajar/Umum, Proposal dan video gagasan', 'Format presentasi 15 menit, Tema Smart Village, Proposal maksimal 10 halaman', 'https://bit.ly/PendaftaranLombaIdeathonPSTI'),

('Smart Village Awards', 'smart-village-awards', 'Penghargaan untuk desa-desa di Kabupaten Purworejo yang menerapkan inovasi teknologi.', 'Smart Village Awards 2025 adalah bentuk apresiasi kepada desa-desa di Kabupaten Purworejo yang telah menerapkan teknologi inovatif untuk meningkatkan pelayanan dan pembangunan desa. Program ini bertujuan untuk mendorong adopsi teknologi di tingkat desa.', 'smartvillage', 50, 0.00, 0.00, 0.00, 0.00, '2025-06-16 00:00:00', '2025-07-16 23:59:59', '2025-07-29 08:00:00', '2025-07-29 12:00:00', 'Desa di Kabupaten Purworejo, Implementasi teknologi, Dokumentasi program', 'Penilaian berdasarkan inovasi, dampak, keberlanjutan, dan potensi replikasi', 'https://forms.gle/smartvillage-registration'),

('Lomba Badminton Prodi TI', 'badminton-prodi-ti', 'Kompetisi olahraga badminton antar kelas Program Studi Teknologi Informasi.', 'Lomba Badminton Prodi TI adalah kompetisi olahraga yang bertujuan untuk mempererat hubungan antar mahasiswa dan meningkatkan semangat sportivitas. Kompetisi ini terbuka untuk semua mahasiswa Program Studi Teknologi Informasi UMP.', 'badminton', 25, 650000.00, 350000.00, 200000.00, 100000.00, '2025-06-16 00:00:00', '2025-07-25 23:59:59', '2025-07-26 08:00:00', '2025-07-26 17:00:00', 'Mahasiswa Prodi TI UMP, Tim per kelas, Kategori putra dan putri', 'Sistem turnamen, Fair play, Mengikuti aturan BWF', 'https://forms.gle/badminton-registration');

-- Insert default seminar
INSERT INTO seminars (title, description, speaker_name, speaker_bio, speaker_company, speaker_position, seminar_date, duration_minutes, max_participants, venue, registration_fee, google_form_url) VALUES
('Seminar AI dan Smart Village', 'Seminar nasional tentang penerapan Artificial Intelligence dalam pengembangan Smart Village dan manajemen desa modern.', 'Rubyanto Prabowo, S.Pd', 'CEO Edu Karya Gemilang Jaya dengan pengalaman luas dalam bidang teknologi pendidikan dan pengembangan smart village. Expert dalam implementasi AI untuk pemberdayaan masyarakat.', 'Edu Karya Gemilang Jaya', 'CEO', '2025-07-22 08:00:00', 210, 250, 'Auditorium Kasman Singodimedjo UMP', 15000.00, 'https://forms.gle/seminar-registration');

-- Insert default settings
INSERT INTO settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('site_name', 'PSTI FEST 2025', 'string', 'Nama website', TRUE),
('site_description', 'Technology Driven Society Empowerment - Milad ke-8 Program Studi Teknologi Informasi UMP', 'string', 'Deskripsi website', TRUE),
('contact_email', 'himateknoumpwr@gmail.com', 'string', 'Email kontak utama', TRUE),
('contact_phone', '(0275) 321494', 'string', 'Nomor telepon kontak', TRUE),
('university_name', 'Universitas Muhammadiyah Purworejo', 'string', 'Nama universitas', TRUE),
('university_address', 'Jl. KH Ahmad Dahlan 3, Purworejo - 54111', 'string', 'Alamat universitas', TRUE),
('registration_open', 'true', 'boolean', 'Status pendaftaran terbuka', TRUE),
('max_file_upload', '10485760', 'number', 'Maksimal ukuran file upload (bytes)', FALSE),
('email_verification_required', 'false', 'boolean', 'Apakah verifikasi email diperlukan', FALSE),
('maintenance_mode', 'false', 'boolean', 'Mode maintenance', FALSE),
('event_theme', 'Technology Driven Society Empowerment', 'string', 'Tema acara', TRUE),
('event_year', '2025', 'string', 'Tahun acara', TRUE),
('milad_year', '8', 'string', 'Tahun milad prodi', TRUE);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_registrations_user_competition ON registrations(user_id, competition_id);
CREATE INDEX idx_registrations_status ON registrations(registration_status);
CREATE INDEX idx_competitions_category ON competitions(category);
CREATE INDEX idx_competitions_active ON competitions(is_active);
CREATE INDEX idx_smart_villages_status ON smart_villages(status);
CREATE INDEX idx_smart_villages_score ON smart_villages(total_score);
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);

-- Create views for common queries
CREATE VIEW active_competitions AS
SELECT * FROM competitions 
WHERE is_active = TRUE 
AND registration_start <= NOW() 
AND registration_end >= NOW();

CREATE VIEW competition_stats AS
SELECT 
    c.id,
    c.name,
    c.category,
    c.max_participants,
    COUNT(r.id) as registered_participants,
    (c.max_participants - COUNT(r.id)) as available_slots,
    ROUND((COUNT(r.id) / c.max_participants) * 100, 2) as fill_percentage
FROM competitions c
LEFT JOIN registrations r ON c.id = r.competition_id AND r.registration_status = 'approved'
WHERE c.is_active = TRUE
GROUP BY c.id;

CREATE VIEW smart_village_leaderboard AS
SELECT 
    village_name,
    innovation_title,
    total_score,
    rank,
    status
FROM smart_villages 
WHERE status = 'approved' AND total_score > 0
ORDER BY total_score DESC, created_at ASC;

CREATE VIEW user_dashboard AS
SELECT 
    u.id,
    u.username,
    u.full_name,
    u.email,
    u.university,
    COUNT(r.id) as total_registrations,
    COUNT(CASE WHEN r.registration_status = 'approved' THEN 1 END) as approved_registrations,
    COUNT(sr.id) as seminar_registrations
FROM users u
LEFT JOIN registrations r ON u.id = r.user_id
LEFT JOIN seminar_registrations sr ON u.id = sr.user_id
GROUP BY u.id;
