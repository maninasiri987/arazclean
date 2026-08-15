<?php
/**
 * React theme - outputs the built app as the WordPress front page.
 *
 * dist/index.html is copied here from pages_html/dist by run.sh.
 * Absolute paths (assets/, images/, fonts/, ...) are routed back to this
 * dist folder by wordpress/router.php.
 *
 * The app uses BrowserRouter (clean URLs, no #), so unknown paths like
 * /products are a WordPress 404 that falls back to this template; we serve
 * the SPA shell with HTTP 200 and let React render the right page.
 */
$dist = __DIR__ . '/dist/index.html';

if ( is_404() ) {
	status_header( 200 ); // SPA handles its own 404 page
}

// Never cache the SPA shell: the asset URLs inside change on every build, so
// the browser must always fetch the latest index.html (prevents stale bundles
// that 404 on old chunk names).
header( 'Cache-Control: no-store, max-age=0' );

if (file_exists($dist)) {
    readfile($dist);
} else {
    echo '<!doctype html><html lang="en" dir="ltr"><head><meta charset="utf-8"><title>Araz Clean</title></head>'
        . '<body style="font-family:sans-serif;display:grid;place-items:center;height:100vh">'
        . '<p>The React app has not been built yet. Run <code>./run.sh</code> first.</p>'
        . '</body></html>';
}
