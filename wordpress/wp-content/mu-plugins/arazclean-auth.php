<?php
/**
 * Araz Clean - real authentication endpoints for the React app.
 *
 *   POST /wp-json/arazclean/v1/login    { username, password }
 *        -> { id, name, email, roles, isAdmin } or 401
 *   POST /wp-json/arazclean/v1/register { username, email, password, name }
 *        -> { id, name, email, roles, isAdmin:false } or error
 *   GET  /wp-json/arazclean/v1/users
 *        -> all WordPress accounts (id, name, email, roles, registered) - for the
 *           admin panel's accounts tab
 *
 * The storefront uses these so the admin panel can be protected:
 * only users with the administrator role may access /admin.
 */

defined( 'ABSPATH' ) || exit;

add_action(
	'rest_api_init',
	static function () {
		register_rest_route(
			'arazclean/v1',
			'/login',
			array(
				'methods'             => 'POST',
				'callback'            => 'arazclean_api_login',
				'permission_callback' => '__return_true',
			)
		);
		register_rest_route(
			'arazclean/v1',
			'/register',
			array(
				'methods'             => 'POST',
				'callback'            => 'arazclean_api_register',
				'permission_callback' => '__return_true',
			)
		);
		register_rest_route(
			'arazclean/v1',
			'/users',
			array(
				'methods'             => 'GET',
				'callback'            => 'arazclean_api_users',
				'permission_callback' => '__return_true',
			)
		);
		register_rest_route(
			'arazclean/v1',
			'/users/(?P<id>\d+)',
			array(
				'methods'             => 'DELETE',
				'callback'            => 'arazclean_api_delete_user',
				'permission_callback' => '__return_true',
			)
		);
	}
);

function arazclean_api_login( WP_REST_Request $request ) {
	$params   = $request->get_json_params();
	$username = sanitize_user( (string) ( $params['username'] ?? '' ), true );
	$password = (string) ( $params['password'] ?? '' );

	if ( ! $username || ! $password ) {
		return new WP_REST_Response( array( 'error' => 'نام کاربری و رمز عبور را وارد کنید.' ), 400 );
	}

	// ورود فقط با شماره موبایل (کاربران عادی) یا نام کاربری (مدیر) — نه ایمیل.
	if ( strpos( $username, '@' ) !== false ) {
		return new WP_REST_Response( array( 'error' => 'ورود فقط با شماره موبایل امکان‌پذیر است.' ), 400 );
	}

	$user = wp_authenticate( $username, $password );

	if ( is_wp_error( $user ) ) {
		return new WP_REST_Response( array( 'error' => 'نام کاربری یا رمز عبور نادرست است.' ), 401 );
	}

	$roles = array_values( $user->roles );

	return array(
		'id'      => $user->ID,
		'name'    => $user->display_name ? $user->display_name : $user->user_login,
		'email'   => $user->user_email,
		'roles'   => $roles,
		'isAdmin' => in_array( 'administrator', $roles, true ),
	);
}

function arazclean_api_register( WP_REST_Request $request ) {
	$params   = $request->get_json_params();
	$username = sanitize_user( (string) ( $params['username'] ?? '' ), true );
	$email    = sanitize_email( (string) ( $params['email'] ?? '' ) );
	$password = (string) ( $params['password'] ?? '' );
	$name     = sanitize_text_field( (string) ( $params['name'] ?? '' ) );

	// «نام کاربری» همان شمارهٔ موبایل است — پس پیام خطا باید در مورد موبایل
	// باشد، نه «نام کاربری»؛ قبلاً اینجا strlen بررسی می‌شد و وقتی موبایل
	// خالی/نامعتبر بود، پیام گمراه‌کنندهٔ «نام کاربری باید حداقل ۳ حرف باشد»
	// نشان داده می‌شد و کاربر فکر می‌کرد مشکل از فیلد «نام» است.
	if ( ! preg_match( '/^09\d{9}$/', $username ) ) {
		return new WP_REST_Response( array( 'error' => 'شماره موبایل معتبر نیست (مثل 09123456789).' ), 400 );
	}
	if ( mb_strlen( trim( $name ) ) < 2 ) {
		return new WP_REST_Response( array( 'error' => 'نام و نام خانوادگی را کامل وارد کنید.' ), 400 );
	}
	if ( strlen( $password ) < 6 ) {
		return new WP_REST_Response( array( 'error' => 'رمز عبور باید حداقل ۶ کاراکتر باشد.' ), 400 );
	}
	if ( $email && ! is_email( $email ) ) {
		return new WP_REST_Response( array( 'error' => 'ایمیل معتبر نیست.' ), 400 );
	}
	if ( username_exists( $username ) || ( $email && email_exists( $email ) ) ) {
		return new WP_REST_Response( array( 'error' => 'این حساب کاربری قبلاً ثبت شده است.' ), 409 );
	}

	$user_id = wp_create_user( $username, $password, $email );
	if ( is_wp_error( $user_id ) ) {
		return new WP_REST_Response( array( 'error' => $user_id->get_error_message() ), 400 );
	}

	// مشتری ووکامرس (در صورت نبود ووکامرس، نقش subscriber)
	wp_update_user(
		array(
			'ID'           => $user_id,
			'display_name' => $name ? $name : $username,
			'role'         => 'customer',
		)
	);

	return array(
		'id'      => $user_id,
		'name'    => $name ? $name : $username,
		'email'   => $email,
		'roles'   => array( 'customer' ),
		'isAdmin' => false,
	);
}

function arazclean_api_users( WP_REST_Request $request ) {
	$users = get_users( array( 'fields' => 'all' ) );
	$out   = array();
	foreach ( $users as $u ) {
		$out[] = array(
			'id'         => (int) $u->ID,
			'name'       => $u->display_name ? $u->display_name : $u->user_login,
			'email'      => $u->user_email,
			'roles'      => array_values( $u->roles ),
			'registered' => $u->user_registered ? substr( $u->user_registered, 0, 10 ) : '',
		);
	}
	return $out;
}

/**
 * DELETE /wp-json/arazclean/v1/users/{id} - حذف یک حساب (برای تب «حساب‌ها»).
 *
 * امنیت: فقط کاربرِ administrator (که idش با هدر X-Admin-Id ارسال می‌شود)
 * اجازهٔ حذف دارد؛ و حساب‌های administrator هرگز قابل حذف نیستند تا مدیر
 * نتواند خودش یا مدیر دیگر را حذف کند. سفارش‌های کاربرِ حذف‌شده به مدیر
 * منتقل می‌شوند (از بین نمی‌روند).
 */
function arazclean_api_delete_user( WP_REST_Request $request ) {
	// wp_delete_user در wp-admin/includes/user.php تعریف شده که در فرانت‌اند
	// بارگذاری نمی‌شود — مانند همان مشکل wp_handle_upload در افزونهٔ رسانه.
	require_once ABSPATH . 'wp-admin/includes/user.php';

	$id = (int) $request['id'];
	if ( ! $id ) {
		return new WP_REST_Response( array( 'error' => 'شناسهٔ حساب معتبر نیست.' ), 400 );
	}

	// فقط مدیر می‌تواند حساب حذف کند (هدر X-Admin-Id باید متعلق به یک administrator باشد).
	$admin_id = (int) $request->get_header( 'x-admin-id' );
	$admin    = $admin_id ? get_userdata( $admin_id ) : null;
	if ( ! $admin || ! in_array( 'administrator', (array) $admin->roles, true ) ) {
		return new WP_REST_Response( array( 'error' => 'فقط مدیر می‌تواند حساب حذف کند.' ), 403 );
	}

	$target = get_userdata( $id );
	if ( ! $target ) {
		return new WP_REST_Response( array( 'error' => 'این حساب پیدا نشد.' ), 404 );
	}

	// حساب‌های مدیر قابل حذف نیستند.
	if ( in_array( 'administrator', (array) $target->roles, true ) ) {
		return new WP_REST_Response( array( 'error' => 'حساب مدیر قابل حذف نیست.' ), 403 );
	}

	// آرگومان دوم wp_delete_user یعنی «انتقال محتوا به این کاربر به‌جای حذف»:
	// سفارش‌ها و نوشته‌های کاربر حذف نمی‌شوند، فقط به مدیر منتقل می‌شوند.
	if ( ! wp_delete_user( $id, $admin_id ) ) {
		return new WP_REST_Response( array( 'error' => 'حذف حساب ناموفق بود.' ), 500 );
	}

	return array( 'ok' => true, 'id' => $id );
}
