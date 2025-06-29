<?php
/**
 * Database Connection Class
 * PSTI FEST 2025 Website
 */

class Database {
    private static $instance = null;
    private $connection;
    
    private function __construct() {
        try {
            $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES " . DB_CHARSET
            ];
            
            $this->connection = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            error_log("Database connection failed: " . $e->getMessage());
            throw new Exception("Database connection failed");
        }
    }
    
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    public function getConnection() {
        return $this->connection;
    }
    
    public function beginTransaction() {
        return $this->connection->beginTransaction();
    }
    
    public function commit() {
        return $this->connection->commit();
    }
    
    public function rollback() {
        return $this->connection->rollback();
    }
    
    public function lastInsertId() {
        return $this->connection->lastInsertId();
    }
    
    // Prevent cloning
    private function __clone() {}
    
    // Prevent unserialization
    public function __wakeup() {
        throw new Exception("Cannot unserialize singleton");
    }
}

/**
 * User Authentication Class
 */
class Auth {
    private $db;
    
    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }
    
    /**
     * Register new user
     */
    public function register($data) {
        try {
            // Validate input
            $errors = $this->validateRegistrationData($data);
            if (!empty($errors)) {
                return ['success' => false, 'errors' => $errors];
            }
            
            // Check if user already exists
            if ($this->userExists($data['email'], $data['username'])) {
                return ['success' => false, 'message' => 'Email atau username sudah terdaftar'];
            }
            
            // Hash password
            $passwordHash = hash_password($data['password']);
            
            // Generate verification token
            $verificationToken = generate_token();
            
            // Insert user
            $stmt = $this->db->prepare("
                INSERT INTO users (username, email, password_hash, full_name, phone, university, 
                                 verification_token, email_verified, created_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
            ");
            
            $emailVerified = !defined('EMAIL_VERIFICATION_REQUIRED') || !EMAIL_VERIFICATION_REQUIRED;
            
            $result = $stmt->execute([
                sanitize_input($data['username']),
                sanitize_input($data['email']),
                $passwordHash,
                sanitize_input($data['full_name']),
                sanitize_input($data['phone']),
                sanitize_input($data['institution']),
                $verificationToken,
                $emailVerified
            ]);
            
            if ($result) {
                $userId = Database::getInstance()->lastInsertId();
                
                // Log activity
                log_activity($userId, 'user_registered', 'User registered successfully');
                
                // Send verification email if required
                if (!$emailVerified) {
                    $this->sendVerificationEmail($data['email'], $verificationToken);
                }
                
                return [
                    'success' => true, 
                    'message' => $emailVerified ? 'Registrasi berhasil!' : 'Registrasi berhasil! Silakan cek email untuk verifikasi.',
                    'user_id' => $userId,
                    'email_verification_required' => !$emailVerified
                ];
            }
            
            return ['success' => false, 'message' => 'Gagal mendaftarkan user'];
            
        } catch (Exception $e) {
            error_log("Registration error: " . $e->getMessage());
            return ['success' => false, 'message' => 'Terjadi kesalahan sistem'];
        }
    }
    
    /**
     * Login user
     */
    public function login($identifier, $password, $remember = false) {
        try {
            // Find user by email or username
            $stmt = $this->db->prepare("
                SELECT id, username, email, password_hash, full_name, role, email_verified, is_active 
                FROM users 
                WHERE (email = ? OR username = ?) AND is_active = 1
            ");
            $stmt->execute([$identifier, $identifier]);
            $user = $stmt->fetch();
            
            if (!$user) {
                return ['success' => false, 'message' => 'Email/username atau password salah'];
            }
            
            // Verify password
            if (!verify_password($password, $user['password_hash'])) {
                return ['success' => false, 'message' => 'Email/username atau password salah'];
            }
            
            // Check if email is verified
            if (!$user['email_verified']) {
                return ['success' => false, 'message' => 'Silakan verifikasi email terlebih dahulu'];
            }
            
            // Update last login
            $stmt = $this->db->prepare("UPDATE users SET last_login = NOW() WHERE id = ?");
            $stmt->execute([$user['id']]);
            
            // Start session
            $this->startUserSession($user, $remember);
            
            // Log activity
            log_activity($user['id'], 'user_login', 'User logged in successfully');
            
            return [
                'success' => true, 
                'message' => 'Login berhasil!',
                'user' => [
                    'id' => $user['id'],
                    'username' => $user['username'],
                    'email' => $user['email'],
                    'full_name' => $user['full_name'],
                    'role' => $user['role']
                ]
            ];
            
        } catch (Exception $e) {
            error_log("Login error: " . $e->getMessage());
            return ['success' => false, 'message' => 'Terjadi kesalahan sistem'];
        }
    }
    
    /**
     * Logout user
     */
    public function logout() {
        if (isset($_SESSION['user_id'])) {
            log_activity($_SESSION['user_id'], 'user_logout', 'User logged out');
        }
        
        // Destroy session
        session_destroy();
        
        // Clear remember me cookie if exists
        if (isset($_COOKIE['remember_token'])) {
            setcookie('remember_token', '', time() - 3600, '/');
        }
        
        return ['success' => true, 'message' => 'Logout berhasil'];
    }
    
    /**
     * Check if user is logged in
     */
    public function isLoggedIn() {
        return isset($_SESSION['user_id']) && !empty($_SESSION['user_id']);
    }
    
    /**
     * Get current user data
     */
    public function getCurrentUser() {
        if (!$this->isLoggedIn()) {
            return null;
        }
        
        $stmt = $this->db->prepare("
            SELECT id, username, email, full_name, phone, university, role, profile_image, 
                   created_at, last_login 
            FROM users 
            WHERE id = ? AND is_active = 1
        ");
        $stmt->execute([$_SESSION['user_id']]);
        return $stmt->fetch();
    }
    
    /**
     * Validate registration data
     */
    private function validateRegistrationData($data) {
        $errors = [];
        
        // Required fields
        $required = ['full_name', 'email', 'username', 'phone', 'institution', 'password', 'confirm_password'];
        foreach ($required as $field) {
            if (empty($data[$field])) {
                $errors[$field] = ucfirst(str_replace('_', ' ', $field)) . ' wajib diisi';
            }
        }
        
        // Email validation
        if (!empty($data['email']) && !validate_email($data['email'])) {
            $errors['email'] = 'Format email tidak valid';
        }
        
        // Username validation
        if (!empty($data['username'])) {
            if (strlen($data['username']) < 3) {
                $errors['username'] = 'Username minimal 3 karakter';
            }
            if (!preg_match('/^[a-zA-Z0-9_]+$/', $data['username'])) {
                $errors['username'] = 'Username hanya boleh mengandung huruf, angka, dan underscore';
            }
        }
        
        // Password validation
        if (!empty($data['password'])) {
            if (strlen($data['password']) < PASSWORD_MIN_LENGTH) {
                $errors['password'] = 'Password minimal ' . PASSWORD_MIN_LENGTH . ' karakter';
            }
            if ($data['password'] !== $data['confirm_password']) {
                $errors['confirm_password'] = 'Konfirmasi password tidak cocok';
            }
        }
        
        // Phone validation
        if (!empty($data['phone']) && !preg_match('/^[0-9+\-\s()]+$/', $data['phone'])) {
            $errors['phone'] = 'Format nomor telepon tidak valid';
        }
        
        return $errors;
    }
    
    /**
     * Check if user exists
     */
    private function userExists($email, $username) {
        $stmt = $this->db->prepare("SELECT id FROM users WHERE email = ? OR username = ?");
        $stmt->execute([$email, $username]);
        return $stmt->fetch() !== false;
    }
    
    /**
     * Start user session
     */
    private function startUserSession($user, $remember = false) {
        session_start();
        session_regenerate_id(true);
        
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['email'] = $user['email'];
        $_SESSION['full_name'] = $user['full_name'];
        $_SESSION['role'] = $user['role'];
        $_SESSION['login_time'] = time();
        
        // Set remember me cookie if requested
        if ($remember) {
            $token = generate_token();
            $expires = time() + (30 * 24 * 60 * 60); // 30 days
            
            // Store token in database
            $stmt = $this->db->prepare("
                UPDATE users SET remember_token = ?, remember_token_expires = FROM_UNIXTIME(?) 
                WHERE id = ?
            ");
            $stmt->execute([$token, $expires, $user['id']]);
            
            // Set cookie
            setcookie('remember_token', $token, $expires, '/', '', false, true);
        }
    }
    
    /**
     * Send verification email
     */
    private function sendVerificationEmail($email, $token) {
        // This would integrate with your email service
        // For now, just log the verification link
        $verificationLink = APP_URL . "/verify-email.php?token=" . $token;
        error_log("Verification email for $email: $verificationLink");
        
        // TODO: Implement actual email sending
        return true;
    }
    
    /**
     * Verify email with token
     */
    public function verifyEmail($token) {
        try {
            $stmt = $this->db->prepare("
                UPDATE users SET email_verified = 1, verification_token = NULL 
                WHERE verification_token = ? AND email_verified = 0
            ");
            $result = $stmt->execute([$token]);
            
            if ($stmt->rowCount() > 0) {
                return ['success' => true, 'message' => 'Email berhasil diverifikasi'];
            }
            
            return ['success' => false, 'message' => 'Token verifikasi tidak valid atau sudah digunakan'];
            
        } catch (Exception $e) {
            error_log("Email verification error: " . $e->getMessage());
            return ['success' => false, 'message' => 'Terjadi kesalahan sistem'];
        }
    }
    
    /**
     * Request password reset
     */
    public function requestPasswordReset($email) {
        try {
            $stmt = $this->db->prepare("SELECT id FROM users WHERE email = ? AND is_active = 1");
            $stmt->execute([$email]);
            $user = $stmt->fetch();
            
            if (!$user) {
                return ['success' => false, 'message' => 'Email tidak ditemukan'];
            }
            
            $resetToken = generate_token();
            $expires = date('Y-m-d H:i:s', time() + 3600); // 1 hour
            
            $stmt = $this->db->prepare("
                UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?
            ");
            $stmt->execute([$resetToken, $expires, $user['id']]);
            
            // Send reset email
            $this->sendPasswordResetEmail($email, $resetToken);
            
            return ['success' => true, 'message' => 'Link reset password telah dikirim ke email Anda'];
            
        } catch (Exception $e) {
            error_log("Password reset request error: " . $e->getMessage());
            return ['success' => false, 'message' => 'Terjadi kesalahan sistem'];
        }
    }
    
    /**
     * Reset password with token
     */
    public function resetPassword($token, $newPassword) {
        try {
            $stmt = $this->db->prepare("
                SELECT id FROM users 
                WHERE reset_token = ? AND reset_token_expires > NOW() AND is_active = 1
            ");
            $stmt->execute([$token]);
            $user = $stmt->fetch();
            
            if (!$user) {
                return ['success' => false, 'message' => 'Token reset tidak valid atau sudah kedaluwarsa'];
            }
            
            if (strlen($newPassword) < PASSWORD_MIN_LENGTH) {
                return ['success' => false, 'message' => 'Password minimal ' . PASSWORD_MIN_LENGTH . ' karakter'];
            }
            
            $passwordHash = hash_password($newPassword);
            
            $stmt = $this->db->prepare("
                UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expires = NULL 
                WHERE id = ?
            ");
            $stmt->execute([$passwordHash, $user['id']]);
            
            log_activity($user['id'], 'password_reset', 'Password reset successfully');
            
            return ['success' => true, 'message' => 'Password berhasil direset'];
            
        } catch (Exception $e) {
            error_log("Password reset error: " . $e->getMessage());
            return ['success' => false, 'message' => 'Terjadi kesalahan sistem'];
        }
    }
    
    /**
     * Send password reset email
     */
    private function sendPasswordResetEmail($email, $token) {
        $resetLink = APP_URL . "/reset-password.php?token=" . $token;
        error_log("Password reset email for $email: $resetLink");
        
        // TODO: Implement actual email sending
        return true;
    }
}
?>

