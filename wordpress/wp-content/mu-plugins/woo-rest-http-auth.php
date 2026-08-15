<?php
/**
 * WooCommerce REST API over plain HTTP (LOCAL DEVELOPMENT ONLY).
 *
 * WooCommerce only performs Basic-auth (consumer key/secret) when is_ssl()
 * is true, and WP 7.x is_ssl() no longer has a filter to override it.
 *
 * This plugin temporarily sets $_SERVER['HTTPS']='on' WHILE WooCommerce
 * authenticates (during determine_current_user), then restores the original
 * value immediately afterwards - so API keys work over http://localhost
 * while product image URLs, redirects and everything else keep using http.
 *
 * Remove this file in production (or serve the site over HTTPS).
 */

defined( 'ABSPATH' ) || exit;

// Enable the fake-HTTPS just before WooCommerce authenticates (priority 15).
add_filter(
	'determine_current_user',
	static function ( $user_id ) {
		$GLOBALS['__woo_rest_prev_https'] = $_SERVER['HTTPS'] ?? null;
		$_SERVER['HTTPS']                 = 'on';
		return $user_id;
	},
	5
);

// Restore the original value right after authentication finished.
add_filter(
	'determine_current_user',
	static function ( $user_id ) {
		if ( array_key_exists( '__woo_rest_prev_https', $GLOBALS ) ) {
			if ( null === $GLOBALS['__woo_rest_prev_https'] ) {
				unset( $_SERVER['HTTPS'] );
			} else {
				$_SERVER['HTTPS'] = $GLOBALS['__woo_rest_prev_https'];
			}
			unset( $GLOBALS['__woo_rest_prev_https'] );
		}
		return $user_id;
	},
	20
);
