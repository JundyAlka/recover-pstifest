<?php
/**
 * Login API Endpoint
 * PSTI FEST 2025 Website
 */

require_once '../config.php';
require_once '../classes/Database.php';

// Set CORS headers
setCorsHeaders();

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_error_response('Method not allowed', 405);
}

// Start session
session_start();

try {
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Validate input
    if (!$input) {
        send_error_response('Invalid JSON input');
    }
    
    $identifier = $input['identifier'] ?? '';
    $password = $input['password'] ?? '';
    $remember = $input['remember'] ?? false;
    
    // Validate required fields
    if (empty($identifier) || empty($password)) {
        send_error_response('Email/username dan password wajib diisi');
    }
    
    // Sanitize input
    $identifier = sanitize_input($identifier);
    
    // Initialize auth
    $auth = new Auth();
    
    // Attempt login
    $result = $auth->login($identifier, $password, $remember);
    
    if ($result['success']) {
        send_success_response($result['user'], $result['message']);
    } else {
        send_error_response($result['message'], 401);
    }
    
} catch (Exception $e) {
    error_log("Login API error: " . $e->getMessage());
    send_error_response('Terjadi kesalahan sistem', 500);
}
?>

