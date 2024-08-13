<?php
header('Content-Type: application/json');

// Validate and sanitize input
$q = isset($_GET['q']) ? filter_var($_GET['q'], FILTER_SANITIZE_STRING) : null;

if ($q) {
    // Simulate weather data
    $data = [
        'weather' => [
            [
                'description' => 'Clear sky',
                'icon' => '01d'
            ]
        ],
        'main' => [
            'temp' => 25,
            'feels_like' => 27,
            'temp_max' => 30,
            'temp_min' => 20,
            'humidity' => 50,
            'pressure' => 1015
        ],
        'wind' => [
            'speed' => 5,
            'deg' => 180
        ],
        'sys' => [
            'sunrise' => 1599823200,
            'sunset' => 1599871200
        ]
    ];

    echo json_encode($data);
} else {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid query']);
}

