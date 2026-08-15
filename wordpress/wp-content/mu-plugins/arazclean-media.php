<?php
/**
 * Araz Clean - media library REST endpoints for the React admin panel.
 *
 *   GET    /wp-json/arazclean/v1/media        -> list of images
 *   POST   /wp-json/arazclean/v1/media        -> upload (multipart, field "file")
 *   DELETE /wp-json/arazclean/v1/media/{id}   -> delete one attachment
 *
 * The images tab of the admin panel and the "choose from gallery" picker in
 * the product/brand/slider forms use these endpoints. Files are stored in the
 * regular WordPress uploads directory (wp-content/uploads), so the site and
 * wp-admin share the same media library.
 *
 * NOTE: permission_callback is intentionally permissive so the client-side
 * admin panel can call these over plain HTTP. Lock these down (check for a
 * real admin session/token) before exposing the site publicly.
 */

defined( 'ABSPATH' ) || exit;

add_action(
	'rest_api_init',
	static function () {
		register_rest_route(
			'arazclean/v1',
			'/media',
			array(
				'methods'             => 'GET',
				'callback'            => 'arazclean_media_list',
				'permission_callback' => '__return_true',
			)
		);
		register_rest_route(
			'arazclean/v1',
			'/media',
			array(
				'methods'             => 'POST',
				'callback'            => 'arazclean_media_upload',
				'permission_callback' => '__return_true',
			)
		);
		register_rest_route(
			'arazclean/v1',
			'/media/(?P<id>\d+)',
			array(
				'methods'             => 'DELETE',
				'callback'            => 'arazclean_media_delete',
				'permission_callback' => '__return_true',
			)
		);
	}
);

/** Build the JSON shape for one attachment. */
function arazclean_media_item( $post, $group ) {
	$meta = wp_get_attachment_metadata( $post->ID );
	return array(
		'id'    => (int) $post->ID,
		'title' => $post->post_title ? $post->post_title : basename( (string) get_attached_file( $post->ID ) ),
		'url'   => wp_get_attachment_url( $post->ID ),
		'mime'  => $post->post_mime_type,
		'date'  => get_the_date( 'Y-m-d', $post->ID ),
		'width' => isset( $meta['width'] ) ? (int) $meta['width'] : 0,
		'height'=> isset( $meta['height'] ) ? (int) $meta['height'] : 0,
		'group' => $group,
	);
}

/** Mime by file extension (no DB needed for static files). */
function arazclean_static_mime( $ext ) {
	$map = array(
		'jpg'  => 'image/jpeg',
		'jpeg' => 'image/jpeg',
		'png'  => 'image/png',
		'gif'  => 'image/gif',
		'webp' => 'image/webp',
		'svg'  => 'image/svg+xml',
	);
	return isset( $map[ $ext ] ) ? $map[ $ext ] : 'application/octet-stream';
}

/**
 * Static images shipped with the React app (theme dist/images): slide banners,
 * brand logos, product images. These are files on disk, not media-library rows.
 * They are merged into the media list so the images tab shows everything the
 * site uses. Files whose basename matches a real attachment are skipped
 * (already in the media library).
 */
function arazclean_static_images() {
	$root = get_stylesheet_directory() . '/dist/images';
	if ( ! is_dir( $root ) ) {
		return array();
	}

	// Basenames already uploaded as real attachments (dedupe).
	$attached = get_posts(
		array(
			'post_type'      => 'attachment',
			'post_status'    => 'inherit',
			'posts_per_page' => 200,
			'fields'         => 'ids',
		)
	);
	$taken = array();
	foreach ( $attached as $id ) {
		$taken[ basename( (string) get_attached_file( $id ) ) ] = true;
	}

	$items = array();
	$it    = new RecursiveIteratorIterator( new RecursiveDirectoryIterator( $root ) );
	foreach ( $it as $file ) {
		if ( ! $file->isFile() ) {
			continue;
		}
		$path = $file->getPathname();
		$name = $file->getFilename();
		$ext  = strtolower( pathinfo( $name, PATHINFO_EXTENSION ) );
		if ( ! in_array( $ext, array( 'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg' ), true ) ) {
			continue;
		}
		if ( isset( $taken[ $name ] ) ) {
			continue; // already in the media library
		}
		$rel  = str_replace( DIRECTORY_SEPARATOR, '/', substr( $path, strlen( $root ) ) );
		$size = @getimagesize( $path );
		// Group by the folder the image lives in: banners -> slides, brands -> brands,
		// products -> products, anything else -> other.
		$parts = explode( '/', trim( $rel, '/' ) );
		$folder = isset( $parts[0] ) ? $parts[0] : '';
		$group = 'other';
		if ( 'banners' === $folder ) {
			$group = 'slides';
		} elseif ( 'brands' === $folder ) {
			$group = 'brands';
		} elseif ( 'products' === $folder ) {
			$group = 'products';
		}
		$items[] = array(
			'id'     => 'static:' . ltrim( $rel, '/' ),
			'title'  => preg_replace( '/\.[^.]+$/', '', $name ),
			'url'    => '/images' . $rel, // relative on purpose - resolves via assetPath
			'mime'   => arazclean_static_mime( $ext ),
			'date'   => date( 'Y-m-d', $file->getMTime() ),
			'width'  => $size ? (int) $size[0] : 0,
			'height' => $size ? (int) $size[1] : 0,
			'static' => true,
			'group'  => $group,
		);
	}
	usort(
		$items,
		function ( $a, $b ) {
			return strcmp( $a['url'], $b['url'] );
		}
	);
	return $items;
}

function arazclean_media_list( WP_REST_Request $request ) {
	$per_page = min( (int) $request->get_param( 'per_page' ) ?: 100, 200 );
	$items    = get_posts(
		array(
			'post_type'      => 'attachment',
			'post_status'    => 'inherit',
			'posts_per_page' => $per_page,
			'orderby'        => 'date',
			'order'          => 'DESC',
		)
	);

	// Which attachments are used as product images? (featured + gallery)
	global $wpdb;
	$used_ids = array();
	$rows = $wpdb->get_col(
		"SELECT meta_value FROM {$wpdb->postmeta} WHERE meta_key IN ('_thumbnail_id', '_product_image_gallery')"
	);
	foreach ( $rows as $row ) {
		foreach ( explode( ',', (string) $row ) as $id ) {
			if ( is_numeric( $id ) ) {
				$used_ids[ (int) $id ] = true;
			}
		}
	}

	$list = array();
	foreach ( $items as $post ) {
		$group = isset( $used_ids[ (int) $post->ID ] ) ? 'products' : 'uploads';
		$list[] = arazclean_media_item( $post, $group );
	}
	// Real media-library rows first, then the site's static images.
	return array_merge( $list, arazclean_static_images() );
}

function arazclean_media_upload( WP_REST_Request $request ) {
	// These helpers are only loaded in wp-admin by default.
	require_once ABSPATH . 'wp-admin/includes/file.php';
	require_once ABSPATH . 'wp-admin/includes/image.php';

	if ( empty( $_FILES['file'] ) ) {
		return new WP_REST_Response( array( 'error' => 'فایلی ارسال نشده است.' ), 400 );
	}

	$file = $_FILES['file'];

	// Validate + move into the uploads directory (checks mime via wp_check_filetype_and_ext).
	$overrides = array(
		'test_form' => false,
		'mimes'     => array(
			'jpg|jpeg|jpe' => 'image/jpeg',
			'png'          => 'image/png',
			'gif'          => 'image/gif',
			'webp'         => 'image/webp',
			'svg'          => 'image/svg+xml',
		),
	);
	$uploaded = wp_handle_upload( $file, $overrides );

	if ( isset( $uploaded['error'] ) ) {
		return new WP_REST_Response( array( 'error' => $uploaded['error'] ), 400 );
	}

	$filename = basename( $uploaded['file'] );
	$attachment = array(
		'post_mime_type' => $uploaded['type'],
		'post_title'     => preg_replace( '/\.[^.]+$/', '', $filename ),
		'post_status'    => 'inherit',
	);

	$attachment_id = wp_insert_attachment( $attachment, $uploaded['file'] );
	if ( is_wp_error( $attachment_id ) ) {
		@unlink( $uploaded['file'] );
		return new WP_REST_Response( array( 'error' => $attachment_id->get_error_message() ), 500 );
	}

	// Generate metadata (width/height). Safe even without GD/Imagick: the editor
	// is skipped on failure, width/height still come from getimagesize.
	$metadata = wp_generate_attachment_metadata( $attachment_id, $uploaded['file'] );
	if ( is_array( $metadata ) && ! empty( $metadata ) ) {
		wp_update_attachment_metadata( $attachment_id, $metadata );
	}

	$post = get_post( $attachment_id );
	return new WP_REST_Response( arazclean_media_item( $post ), 201 );
}

function arazclean_media_delete( WP_REST_Request $request ) {
	$id = (int) $request->get_param( 'id' );
	if ( ! $id || 'attachment' !== get_post_type( $id ) ) {
		return new WP_REST_Response( array( 'error' => 'تصویر پیدا نشد.' ), 404 );
	}
	$deleted = wp_delete_attachment( $id, true );
	if ( ! $deleted ) {
		return new WP_REST_Response( array( 'error' => 'حذف تصویر ناموفق بود.' ), 500 );
	}
	return array( 'ok' => true, 'id' => $id );
}
