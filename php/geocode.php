<?php
header('Content-Type: application/json');

// Validate and sanitize input
$q = isset($_GET['q']) ? filter_var($_GET['q'], FILTER_SANITIZE_STRING) : null;

if ($q) {
    // Simulate geocoding data
    $data = [
        'results' => [
            [
                'country_code' => 'US',
                'formatted' => 'United States'
            ]
        ]
    ];

    echo json_encode($data);
} else {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid query']);
}
