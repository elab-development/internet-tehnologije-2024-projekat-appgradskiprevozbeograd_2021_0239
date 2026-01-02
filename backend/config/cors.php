<?php


return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Ovaj fajl definiše kako tvoj API odgovara na zahteve sa drugih domena.
    | Ovde navodimo port na kojem radi tvoj frontend (React, Vite, itd.)
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie', 'reset-password'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://localhost:5173',
        'http://127.0.0.1:5173',
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
