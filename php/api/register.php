<?php
require_once '../config.php';
require_once '../classes/Database.php';
require_once '../classes/Models.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_error_response('Method not allowed', 405);
}

try {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        send_error_response('Invalid JSON data');
    }
    
    // Validate required fields
    $required_fields = ['competition_id', 'full_name', 'email', 'phone'];
    $errors = [];
    
    foreach ($required_fields as $field) {
        if (empty($input[$field])) {
            $errors[] = "Field {$field} is required";
        }
    }
    
    if (!empty($errors)) {
        send_error_response('Validation failed', 400, $errors);
    }
    
    // Sanitize input
    $data = [];
    foreach ($input as $key => $value) {
        $data[$key] = sanitize_input($value);
    }
    
    // Validate email
    if (!validate_email($data['email'])) {
        send_error_response('Invalid email format');
    }
    
    // Check if competition exists
    $competition = new Competition();
    $comp = $competition->find($data['competition_id']);
    
    if (!$comp) {
        send_error_response('Competition not found');
    }
    
    // Check registration period
    $now = new DateTime();
    $regStart = new DateTime($comp['registration_start']);
    $regEnd = new DateTime($comp['registration_end']);
    
    if ($now < $regStart) {
        send_error_response('Registration has not started yet');
    }
    
    if ($now > $regEnd) {
        send_error_response('Registration has ended');
    }
    
    // Create or find user
    $user = new User();
    $existingUser = $user->findByEmail($data['email']);
    
    if ($existingUser) {
        $userId = $existingUser['id'];
    } else {
        // Create new user
        $userData = [
            'username' => $data['email'],
            'email' => $data['email'],
            'password_hash' => hash_password('default123'), // Default password
            'full_name' => $data['full_name'],
            'phone' => $data['phone'],
            'university' => $data['university'] ?? '',
            'major' => $data['major'] ?? '',
            'student_id' => $data['student_id'] ?? '',
            'email_verified' => 1 // Auto verify for competition registration
        ];
        
        $newUser = $user->create($userData);
        if (!$newUser) {
            send_error_response('Failed to create user account');
        }
        $userId = $newUser['id'];
    }
    
    // Create registration
    $registration = new Registration();
    
    $registrationData = [
        'user_id' => $userId,
        'competition_id' => $data['competition_id'],
        'team_name' => $data['team_name'] ?? null,
        'motivation' => $data['motivation'] ?? '',
        'experience_level' => $data['experience_level'] ?? 'beginner',
        'portfolio_url' => $data['portfolio_url'] ?? '',
        'github_url' => $data['github_url'] ?? '',
        'linkedin_url' => $data['linkedin_url'] ?? '',
        'institution' => $data['institution'] ?? '',
        'village_name' => $data['village_name'] ?? null,
        'village_address' => $data['village_address'] ?? null,
        'innovation_description' => $data['innovation_description'] ?? null,
        'payment_status' => $comp['registration_fee'] > 0 ? 'pending' : 'paid',
        'registration_status' => 'pending'
    ];
    
    // Handle team members
    if (isset($data['team_members']) && is_array($data['team_members'])) {
        $registrationData['team_members'] = json_encode($data['team_members']);
    }
    
    $result = $registration->register($userId, $data['competition_id'], $registrationData);
    
    if ($result) {
        // Log activity
        log_activity($userId, 'competition_registration', "Registered for {$comp['name']}");
        
        // Prepare response
        $response = [
            'registration_id' => $result['id'],
            'competition' => $comp['name'],
            'payment_required' => $comp['registration_fee'] > 0,
            'payment_amount' => $comp['registration_fee'],
            'google_form_url' => $comp['google_form_url'],
            'status' => 'pending'
        ];
        
        send_success_response($response, 'Registration successful');
    } else {
        send_error_response('Registration failed');
    }
    
} catch (Exception $e) {
    error_log("Registration error: " . $e->getMessage());
    send_error_response($e->getMessage());
}
?>
