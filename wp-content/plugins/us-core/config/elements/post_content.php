<?php defined( 'ABSPATH' ) OR die( 'This script cannot be accessed directly.' );

/**
 * Configuration for shortcode: post_content
 */

$design_options_params = us_config( 'elements_design_options' );
$hover_options_params = us_config( 'elements_hover_options' );

/**
 * @return array
 */
return array(
	'title' => __( 'Post Content', 'us' ),
	'category' => __( 'Post Elements', 'us' ),
	'icon' => 'fas fa-align-justify',
	'shortcode_post_type' => array( 'us_content_template', 'us_page_block' ),
	'hide_on_adding_list' => TRUE, // TODO: remove when 'shortcode_post_type' will work for USBuilder
	'params' => us_set_params_weight(

		// General section
		array(
			'type' => array(
				'title' => us_translate( 'Show' ),
				'type' => 'select',
				'options' => array(
					'excerpt_content' => __( 'Excerpt, if it\'s empty, show part of a content', 'us' ),
					'excerpt_only' => __( 'Excerpt, if it\'s empty, show nothing', 'us' ),
					'part_content' => __( 'Part of a content', 'us' ),
					'full_content' => __( 'Full content', 'us' ),
				),
				'std' => 'excerpt_content',
				'admin_label' => TRUE,
				'usb_preview' => TRUE,
			),
			'remove_rows' => array(
				'title' => __( 'Exclude Rows and Columns', 'us' ),
				'type' => 'select',
				'options' => array(
					'' => us_translate( 'None' ),
					'1' => __( 'Inside a content', 'us' ),
					'parent_row' => __( 'Around this element', 'us' ),
				),
				'std' => '',
				'show_if' => array( 'type', '=', 'full_content' ),
				'usb_preview' => TRUE,
			),
			'force_fullwidth_rows' => array(
				'switch_text' => __( 'Stretch content of Rows to the full width', 'us' ),
				'type' => 'switch',
				'std' => FALSE,
				'show_if' => array( 'remove_rows', '!=', '1' ),
				'usb_preview' => TRUE,
			),
			'excerpt_length' => array(
				'title' => __( 'Amount of words in Excerpt', 'us' ),
				'description' => __( 'HTML tags, line-breaks and shortcodes will be stripped.', 'us' ) . ' ' . __( 'Set "0" to show full Excerpt.', 'us' ),
				'type' => 'slider',
				'std' => '0',
				'options' => array(
					'' => array(
						'min' => 0,
						'max' => 100,
					),
				),
				'show_if' => array( 'type', '=', array( 'excerpt_content', 'excerpt_only' ) ),
				'usb_preview' => TRUE,
			),
			'length' => array(
				'title' => __( 'Amount of words in Content', 'us' ),
				'description' => __( 'HTML tags, line-breaks and shortcodes will be stripped.', 'us' ),
				'type' => 'slider',
				'std' => '30',
				'options' => array(
					'' => array(
						'min' => 1,
						'max' => 100,
					),
				),
				'show_if' => array( 'type', '=', array( 'excerpt_content', 'part_content' ) ),
				'usb_preview' => TRUE,
			),
		),

		// More options section
		array(
			'show_more_toggle' => array(
				'type' => 'switch',
				'switch_text' => __( 'Hide part of a content with the "Show More" link', 'us' ),
				'std' => FALSE,
				'group' => __( 'More Options', 'us' ),
				'usb_preview' => TRUE,
			),
			'show_more_toggle_height' => array(
				'title' => __( 'Height of visible content', 'us' ),
				'description' => __( 'In pixels:', 'us' ) . ' <span class="usof-example">100px</span>, <span class="usof-example">150px</span>, <span class="usof-example">200px</span>',
				'type' => 'text',
				'std' => '200px',
				'show_if' => array( 'show_more_toggle', '!=', FALSE ),
				'group' => __( 'More Options', 'us' ),
				'usb_preview' => TRUE,
			),
			'show_more_toggle_text_more' => array(
				'title' => __( 'Text when content is hidden', 'us' ),
				'type' => 'text',
				'std' => __( 'Show More', 'us' ),
				'show_if' => array( 'show_more_toggle', '!=', FALSE ),
				'group' => __( 'More Options', 'us' ),
				'usb_preview' => TRUE,
			),
			'show_more_toggle_text_less' => array(
				'title' => __( 'Text when content is shown', 'us' ),
				'description' => __( 'Leave blank to prevent content from being hidden again.', 'us' ),
				'type' => 'text',
				'std' => __( 'Show Less', 'us' ),
				'show_if' => array( 'show_more_toggle', '!=', FALSE ),
				'group' => __( 'More Options', 'us' ),
				'usb_preview' => TRUE,
			),
			'show_more_toggle_alignment' => array(
				'title' => us_translate( 'Alignment' ),
				'type' => 'radio',
				'labels_as_icons' => 'fas fa-align-*',
				'options' => array(
					'none' => us_translate( 'Default' ),
					'left' => us_translate( 'Left' ),
					'center' => us_translate( 'Center' ),
					'right' => us_translate( 'Right' ),
				),
				'std' => 'none',
				'show_if' => array( 'show_more_toggle', '!=', FALSE ),
				'group' => __( 'More Options', 'us' ),
				'usb_preview' => TRUE,
			),
		),

		$design_options_params,
		$hover_options_params
	),
);
