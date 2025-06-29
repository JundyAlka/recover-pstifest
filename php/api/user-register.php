<?php
/**
 * User Registration API Endpoint
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

try {
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Validate input
    if (!$input) {
        send_error_response('Invalid JSON input');
    }
    
    // Extract data
    $data = [
        'full_name' => $input['fullName'] ?? '',
        'email' => $input['email'] ?? '',
        'username' => $input['username'] ?? '',
        'phone' => $input['phone'] ?? '',
        'institution' => $input['institution'] ?? '',
        'password' => $input['password'] ?? '',
        'confirm_password' => $input['confirmPassword'] ?? '',
        'terms' => $input['terms'] ?? false
    ];
    
    // Validate terms acceptance
    if (!$data['terms']) {
        send_error_response('Anda harus menyetujui syarat dan ketentuan');
    }
    
    // Initialize auth
    $auth = new Auth();
    
    // Attempt registration
    $result = $auth->register($data);
    
    if ($result['success']) {
        // Prepare response data
        $responseData = [
            'user_id' => $result['user_id'],
            'email_verification_required' => $result['email_verification_required'] ?? false
        ];
        
        send_success_response($responseData, $result['message']);
    } else {
        if (isset($result['errors']) && !empty($result['errors'])) {
            send_error_response($result['message'], 400, $result['errors']);
        } else {
            send_error_response($result['message'], 400);
        }
    }
    
} catch (Exception $e) {
    error_log("User registration API error: " . $e->getMessage());
    send_error_response('Terjadi kesalahan sistem', 500);
}
?>

