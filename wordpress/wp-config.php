<?php
/** wp-config.php — ساخته‌شده توسط scripts/make-wp-config.php */
define( 'DB_NAME', 'arazclean' );
define( 'DB_USER', 'arazclean' );
define( 'DB_PASSWORD', 'arazclean' );
define( 'DB_HOST', 'localhost' );
define( 'DB_CHARSET', 'utf8mb4' );
define( 'DB_COLLATE', '' );

$table_prefix = 'wp_';

define('AUTH_KEY',         'BAHlch.B*0T@L:b]Z5I -$<=R =Ek@W1+m`A~iVqI26yI`7=X}fH-fRg0(WZ2D^r');
define('SECURE_AUTH_KEY',  'B4;;q{O[wllQq,CnSr-y*JgcH?u+T`4o]cdhKMICJ2BjRe$cN{O3l3BS0&vc+>e(');
define('LOGGED_IN_KEY',    '-v7Xn1MOGnkdVwd6$r+tA4qq+;xCe-8.5N}!wY[jQHL Z(HB)kvGc`[V}m -t)F3');
define('NONCE_KEY',        'Xec;|ObnY[0$rq&1|`JWLfbI18FXuG#B$h/#~BWM),Wy-3gG2|-Vgo22gEuO%@>-');
define('AUTH_SALT',        '~u1Yq_s0vhV#1<||aq<^1[REEt|N;1Co$nY4pegI8(_OQ}1fFZU-[_A_5,o[^w l');
define('SECURE_AUTH_SALT', 'mp07M{qI@O~==S!_&%-F:LCq(}QlaujeJBfS>e9$r|{NG`!6[,/0,S$naH*- 6-3');
define('LOGGED_IN_SALT',   'WabowG-pPZ}m0H+tN|gXG?|;E;~T+awh~!nlyWd8.#~w>=sOh;g9SOb&%q</Wj5Y');
define('NONCE_SALT',       '|PD~QQ`a3|i.Xj>Ua_-Uaq~/BJa8G:9(@H!tFi-IMis-#R%Infe5N-aRH1EZ6#~!');

define( 'WP_DEBUG', true );
define( 'WP_DEBUG_LOG', true );
define( 'WP_DEBUG_DISPLAY', false );

if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

require_once ABSPATH . 'wp-settings.php';
