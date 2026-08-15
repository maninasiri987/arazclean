<?php
/**
 * Araz Clean - SPA routing fixes.
 *
 * The React app (BrowserRouter) owns every URL: /, /products, /cart, /login,
 * /admin, /product/:slug, ... WordPress must serve the SPA shell (theme
 * index.php) for ALL of them instead of redirecting. This plugin disables
 * the two built-in redirect behaviors that break that:
 *
 *   1. redirect_canonical()  - 301s /cart -> /cart/ and /product/x -> /product/x/
 *   2. wp_redirect_admin_locations() - redirects /login, /admin, /dashboard
 *      to wp-login.php / wp-admin, kicking the user out of the app.
 *
 * The React app's own guards handle login/admin access control client-side.
 */

defined( 'ABSPATH' ) || exit;

// Never canonical-redirect. Every path must reach the theme's SPA shell.
add_filter( 'redirect_canonical', '__return_false', 1 );

// Remove the admin/login-location redirect before it runs
// (registered at priority 1000 on template_redirect).
add_action(
	'template_redirect',
	static function () {
		remove_action( 'template_redirect', 'wp_redirect_admin_locations', 1000 );
	},
	1
);
