<?php
/**
 * Database Configuration
 * PSTI FEST 2025 Website
 */

// Database configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'psti_fest_2025');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

// Application configuration
define('APP_NAME', 'PSTI FEST 2025');
define('APP_URL', 'http://localhost');
define('APP_ENV', 'development'); // development, production
define('APP_DEBUG', true);

// Security configuration
define('JWT_SECRET', 'psti-fest-2025-secret-key-change-in-production');
define('ENCRYPTION_KEY', 'psti-fest-2025-encryption-key-32char');
define('SESSION_LIFETIME', 7200); // 2 hours in seconds
define('PASSWORD_MIN_LENGTH', 8);

// File upload configuration
define('UPLOAD_MAX_SIZE', 10 * 1024 * 1024); // 10MB
define('UPLOAD_ALLOWED_TYPES', ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx', 'zip', 'mp4']);
define('UPLOAD_PATH', __DIR__ . '/../uploads/');

// Email configuration
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_USERNAME', 'himateknoumpwr@gmail.com');
define('SMTP_PASSWORD', 'your-app-password');
define('SMTP_ENCRYPTION', 'tls');
define('MAIL_FROM_ADDRESS', 'himateknoumpwr@gmail.com');
define('MAIL_FROM_NAME', 'PSTI FEST 2025');

// Google Forms Integration
define('IDEATHON_FORM_URL', 'https://bit.ly/PendaftaranLombaIdeathonPSTI');
define('SMARTVILLAGE_FORM_URL', 'https://forms.gle/smartvillage-registration');
define('BADMINTON_FORM_URL', 'https://forms.gle/badminton-registration');
define('SEMINAR_FORM_URL', 'https://forms.gle/seminar-registration');

// Competition settings
define('IDEATHON_FEE', 75000);
define('BADMINTON_FEE', 10000);
define('SEMINAR_FEE', 15000);
define('SMARTVILLAGE_FEE', 0);

// Event dates
define('REGISTRATION_START', '2025-06-16');
define('REGISTRATION_END_SMARTVILLAGE', '2025-07-16');
define('REGISTRATION_END_IDEATHON', '2025-06-25');
define('SUBMISSION_DEADLINE', '2025-07-15');
define('SEMINAR_DATE', '2025-07-22');
define('IDEATHON_DATE', '2025-07-24');
define('BADMINTON_DATE', '2025-07-26');
define('FINAL_EVENT_DATE', '2025-07-29');

// API configuration
define('API_RATE_LIMIT', 100); // requests per minute
define('API_VERSION', 'v1');

// Pagination
define('DEFAULT_PAGE_SIZE', 20);
define('MAX_PAGE_SIZE', 100);

// Cache configuration
define('CACHE_ENABLED', true);
define('CACHE_LIFETIME', 3600); // 1 hour

// Timezone
date_default_timezone_set('Asia/Jakarta');

// Error reporting
if (APP_ENV === 'development') {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
} else {
    error_reporting(0);
    ini_set('display_errors', 0);
}

// Session configuration
ini_set('session.cookie_httponly', 1);
ini_set('session.cookie_secure', 0); // Set to 1 in production with HTTPS
ini_set('session.use_strict_mode', 1);
ini_set('session.cookie_samesite', 'Strict');

// CORS headers for API
function setCorsHeaders() {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    header('Access-Control-Max-Age: 86400');
    
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }
}

// Auto-load classes
spl_autoload_register(function ($class) {
    $file = __DIR__ . '/classes/' . str_replace('\\', '/', $class) . '.php';
    if (file_exists($file)) {
        require_once $file;
    }
});

// Global functions
function sanitize_input($data) {
    return htmlspecialchars(strip_tags(trim($data)), ENT_QUOTES, 'UTF-8');
}

function validate_email($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

function generate_token($length = 32) {
    return bin2hex(random_bytes($length));
}

function hash_password($password) {
    return password_hash($password, PASSWORD_ARGON2ID);
}

function verify_password($password, $hash) {
    return password_verify($password, $hash);
}

function log_activity($user_id, $action, $description = '', $additional_data = []) {
    try {
        $db = Database::getInstance()->getConnection();
        $stmt = $db->prepare("
            INSERT INTO activity_logs (user_id, action, description, ip_address, user_agent, additional_data) 
            VALUES (?, ?, ?, ?, ?, ?)
        ");
        
        $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
        $user_agent = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';
        $additional_json = json_encode($additional_data);
        
        $stmt->execute([$user_id, $action, $description, $ip, $user_agent, $additional_json]);
    } catch (Exception $e) {
        error_log("Failed to log activity: " . $e->getMessage());
    }
}

function send_json_response($data, $status_code = 200) {
    http_response_code($status_code);
    header('Content-Type: application/json');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit();
}

function send_error_response($message, $status_code = 400, $errors = []) {
    send_json_response([
        'success' => false,
        'message' => $message,
        'errors' => $errors
    ], $status_code);
}

function send_success_response($data = [], $message = 'Success') {
    send_json_response([
        'success' => true,
        'message' => $message,
        'data' => $data
    ]);
}

// Security headers
function set_security_headers() {
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: DENY');
    header('X-XSS-Protection: 1; mode=block');
    header('Referrer-Policy: strict-origin-when-cross-origin');
    
    if (APP_ENV === 'production') {
        header('Strict-Transport-Security: max-age=31536000; includeSubDomains');
    }
}

// Initialize security headers
set_security_headers();
?>
