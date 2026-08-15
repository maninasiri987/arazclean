<?php
/**
 * Router for the PHP built-in server (php -S):
 *  1) Static files of the React app (assets / images / fonts / favicon / robots / sitemap)
 *     are served from the dist folder of the arazclean-react theme.
 *  2) Everything else (wp-admin, wp-json, ...) is routed to WordPress.
 */
// rawurldecode (not urldecode): urldecode would turn '+' into a space and break
// filenames like BYekan+.woff2.
$uri = rawurldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
// IMPORTANT: do NOT name this variable $wp - it would collide with WordPress's
// global $wp object and break every request ("Call to a member function
// add_query_var() on string").
$wpRoot = __DIR__;                                                     // WordPress root
$dist = $wpRoot . '/wp-content/themes/arazclean-react/dist';

// ---------- 1) React app static files ----------
if (
    preg_match('#^/(assets|images|fonts)/#', $uri) ||
    in_array($uri, ['/favicon.webp', '/robots.txt', '/sitemap.xml'], true)
) {
    $file = $dist . $uri;
    if (is_file($file)) {
        $mime = [
            'js'    => 'application/javascript; charset=utf-8',
            'css'   => 'text/css; charset=utf-8',
            'webp'  => 'image/webp',
            'jpg'   => 'image/jpeg',
            'jpeg'  => 'image/jpeg',
            'png'   => 'image/png',
            'svg'   => 'image/svg+xml',
            'woff2' => 'font/woff2',
            'ttf'   => 'font/ttf',
            'txt'   => 'text/plain; charset=utf-8',
            'xml'   => 'application/xml',
            'html'  => 'text/html; charset=utf-8',
        ];
        $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
        header('Content-Type: ' . ($mime[$ext] ?? 'application/octet-stream'));
        header('Content-Length: ' . filesize($file));
        // Vite hashed bundles (assets/*) are immutable: the filename changes on
        // every build, so a long cache is safe and avoids re-downloading.
        if (strpos($uri, '/assets/') === 0) {
            header('Cache-Control: public, max-age=31536000, immutable');
        }
        readfile($file);
        return true;
    }
    // Missing asset -> return a REAL 404. Serving the SPA shell (text/html)
    // for a .js/.css request would make the browser block it with
    // "disallowed MIME type" errors and break the app (old cached bundles).
    http_response_code(404);
    header('Content-Type: text/plain; charset=utf-8');
    header('Cache-Control: no-store');
    echo 'Not Found';
    return true;
}

// ---------- 2) WordPress ----------
if (is_file($wpRoot . $uri)) {
    return false; // let the server serve the real WordPress file directly
}
require $wpRoot . '/index.php';
return true;
