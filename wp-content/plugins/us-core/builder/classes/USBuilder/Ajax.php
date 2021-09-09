<?php defined( 'ABSPATH' ) OR die( 'This script cannot be accessed directly.' );

/**
 * This class describes an us builder ajax.
 */
final class USBuilder_Ajax {

	/**
	 * Prefix for internal AJAX request handlers to ensure uniqueness.
	 *
	 * @var string
	 */
	const PREFIX_FOR_HANDLER = 'usb_';

	/**
	 * Prefix for actions that will be called from the Frontend.
	 *
	 * @var string
	 */
	const PREFIX_FOR_ACTION = 'action_';

	/**
	 * Pattern for getting layout data from shortcodes (Used in importing shortcodes)
	 *
	 * @var string
	 */
	const PATTERN_GRID_LAYOUT_DATA = '/(\s?grid_layout_data="([^"]+)")/';

	/**
	 * Init hooks for AJAX actions
	 *
	 * @access public
	 */
	public static function init() {

		// TODO: add proper capability check, see #2232
		// Checking for edit permission
		if (
			! is_user_logged_in()
			AND (
				! current_user_can( 'edit_posts' )
				OR ! current_user_can( 'edit_pages' )
			)
		) {
			return;
		}

		// Check for an action in the list of all actions
		if (
			! $action = us_arr_path( $_POST, 'action' )
			OR ! in_array( $action, self::get_actions() )
		) {
			return;
		}

		// The check _nonce
		if ( ! check_ajax_referer( __CLASS__, '_nonce', FALSE ) ) {
			wp_send_json_error(
				array(
					'message' => us_translate( 'An error has occurred. Please reload the page and try again.' ),
				)
			);
		}

		// Setup postdata and add global $post, $wp_query for correct render of post related data (title, date, custom fields, etc.)
		if ( $post_id = (int) us_arr_path( $_REQUEST, 'post_id' ) ) {
			global $post, $wp_query;
			$query_args = array(
				'p' => $post_id,
				'post_type' => array_keys( us_get_public_post_types() ),
			);
			$wp_query->query( $query_args );
			$post = get_queried_object();
			setup_postdata( $post );
		}

		// Adds actions to process requests
		foreach ( self::get_actions() as $action_name ) {
			if ( ! empty( $action_name ) AND is_string( $action_name ) ) {
				// The add corresponding method from the class to the AJAX action
				$method_name = substr( $action_name, strlen( self::PREFIX_FOR_HANDLER ) );
				add_action( 'wp_ajax_' . $action_name, __CLASS__ . "::$method_name" );
			}
		}
	}

	/**
	 * Get the actions
	 *
	 * @access public
	 * @return array The actions.
	 */
	public static function get_actions() {
		return array(
			self::PREFIX_FOR_ACTION . 'render_shortcode' => self::PREFIX_FOR_HANDLER . 'render_shortcode',
			self::PREFIX_FOR_ACTION . 'save_post' => self::PREFIX_FOR_HANDLER . 'save_post',
		);
	}

	/**
	 * Creates a nonce
	 *
	 * @access public
	 * @return string
	 */
	public static function create_nonce() {
		return wp_create_nonce( __CLASS__ );
	}

	/**
	 * The renders the resulting shortcodes via AJAX
	 *
	 * @access public
	 * @param string $shortcode The shortcode
	 */
	public static function render_shortcode( $shortcode ) {
		// Loading all shortcodes
		if ( class_exists( 'WPBMap' ) AND method_exists( 'WPBMap', 'addAllMappedShortcodes' ) ) {
			WPBMap::addAllMappedShortcodes();
		}

		$res = array( 'html' => '' );
		if ( $content = us_arr_path( $_POST, 'content' ) ) {
			$content = wp_unslash( $content );

			// If there is data of layouts, then we import layouts
			if ( strpos( $content, 'grid_layout_data' ) !== FALSE ) {
				$content = preg_replace_callback( self::PATTERN_GRID_LAYOUT_DATA, function( $matches ) {
					return ' items_layout="' . us_import_grid_layout( $matches[2] ) . '"';
				}, $content );
			}

			// Adds data-usbid attribute to html when output shortcode result
			add_filter( 'do_shortcode_tag', array( USBuilder_Shortcode::instance(), 'add_usbid_to_html' ), 9999, 3 );
			$res['html'] = (string) do_shortcode( $content );
		}

		// Add content to the result (This can be useful for complex changes)
		if ( us_arr_path( $_POST, 'isReturnContent' ) ) {
			$res['content'] = $content;
		}

		// The response data
		wp_send_json_success( $res );
	}

	/**
	 * Updates post or term data
	 *
	 * @access public
	 */
	// TODO: check capabilities add support for translated posts
	public static function save_post() {

		if ( ! $post_id = us_arr_path( $_POST, 'post_id' ) ) {
			wp_send_json_error( array( 'message' => us_translate( 'Post ID not set' ) ) );
		}
		if ( ! $post = get_post( (int) $post_id ) ) {
			wp_send_json_error( array( 'message' => us_translate( 'Record could not be found' ) ) );
		}

		// Applying the WordPress stripslashes_deep function to remove all added slashes
		$_POST = array_map( 'stripslashes_deep', $_POST );

		if ( isset( $_POST['post_title'] ) ) {
			if ( empty( $_POST['post_title'] ) ) {
				wp_send_json_error( array( 'message' => us_translate( 'Post title cannot be empty' ) ) );
			} elseif ( mb_strlen( $_POST['post_title'] ) > 255 ) {
				wp_send_json_error( array( 'message' => us_translate( 'Post title cannot exceed 255 characters' ) ) );
			}
			$post->post_title = $_POST['post_title'];
		}

		// If content is set, then we get it and apply filters to it
		if ( isset( $_POST['post_content'] ) ) {
			// Get and clearing content from usbid="..."
			$post->post_content = preg_replace( '/(\s?usbid="([^\"]+)")/', '', (string) $_POST['post_content'] );
			// Additional cleaning of layout data
			$post->post_content = preg_replace( self::PATTERN_GRID_LAYOUT_DATA, '', $post->post_content );
		}

		// Update meta data
		if ( $meta = us_arr_path( $_POST, 'pageMeta', /* Default */array() ) ) {
			$post->meta_input = (array) $meta;
		}

		if ( isset( $_POST['post_status'] ) ) {
			if ( ! array_key_exists( $_POST['post_status'], get_post_stati() ) ) {
				wp_send_json_error( array( 'message' => us_translate( 'Invalid post status' ) ) );
			}
			$post->post_status = $_POST['post_status'];
		}

		wp_update_post( $post, /* WP_Error */ TRUE );
		$result = NULL;
		if ( is_wp_error( $result ) ) {
			wp_send_json_error( array( 'message' => $result->get_error_message() ) );
		}

		wp_send_json_success();
	}
}
