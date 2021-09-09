<?php defined( 'ABSPATH' ) OR die( 'This script cannot be accessed directly.' );

/**
 * Configuration for shortcode: vc_tta_tour
 */

$misc = us_config( 'elements_misc' );
$design_options_params = us_config( 'elements_design_options' );

$general_params = array(

	// Tabs
	'layout' => array(
		'title' => us_translate( 'Style' ),
		'type' => 'select',
		'options' => array(
			'default' => __( 'Simple', 'us' ),
			'modern' => __( 'Modern', 'us' ),
			'trendy' => __( 'Trendy', 'us' ),
		),
		'std' => 'default',
		'group' => __( 'Tabs', 'us' ),
		'usb_preview' => array(
			'mod' => 'style',
		),
	),
	'tab_position' => array(
		'title' => __( 'Position', 'us' ),
		'type' => 'radio',
		'options' => array(
			'left' => is_rtl() ? us_translate( 'Right' ) : us_translate( 'Left' ),
			'right' => is_rtl() ? us_translate( 'Left' ) : us_translate( 'Right' ),
		),
		'std' => 'left',
		'cols' => 3,
		'group' => __( 'Tabs', 'us' ),
		'usb_preview' => array(
			'mod' => 'navpos',
		),
	),
	'c_align' => array(
		'title' => us_translate( 'Alignment' ),
		'type' => 'radio',
		'labels_as_icons' => 'fas fa-align-*',
		'options' => array(
			'none' => us_translate( 'Default' ),
			'left' => us_translate( 'Left', 'us' ),
			'center' => us_translate( 'Center', 'us' ),
			'right' => us_translate( 'Right', 'us' ),
		),
		'std' => 'none',
		'cols' => 3,
		'group' => __( 'Tabs', 'us' ),
		'usb_preview' => array(
			'elm' => '.w-tabs-list',
			'mod' => 'align',
		),
	),
	'controls_size' => array(
		'title' => us_translate( 'Width' ),
		'type' => 'select',
		'options' => array(
			'auto' => us_translate( 'Auto' ),
			'10' => '10%',
			'20' => '20%',
			'30' => '30%',
			'40' => '40%',
			'50' => '50%',
		),
		'std' => 'auto',
		'cols' => 3,
		'group' => __( 'Tabs', 'us' ),
		'usb_preview' => array(
			'mod' => 'navwidth',
		),
	),
	'title_font' => array(
		'title' => __( 'Font', 'us' ),
		'type' => 'select',
		'options' => us_get_fonts(),
		'std' => '',
		'group' => __( 'Tabs', 'us' ),
		'usb_preview' => array(
			'elm' => '.w-tabs-list',
			'css' => 'font-family',
		),
	),
	'title_weight' => array(
		'title' => __( 'Font Weight', 'us' ),
		'type' => 'select',
		'options' => array(
			'' => us_translate( 'Default' ),
			'100' => '100 ' . __( 'thin', 'us' ),
			'200' => '200 ' . __( 'extra-light', 'us' ),
			'300' => '300 ' . __( 'light', 'us' ),
			'400' => '400 ' . __( 'normal', 'us' ),
			'500' => '500 ' . __( 'medium', 'us' ),
			'600' => '600 ' . __( 'semi-bold', 'us' ),
			'700' => '700 ' . __( 'bold', 'us' ),
			'800' => '800 ' . __( 'extra-bold', 'us' ),
			'900' => '900 ' . __( 'ultra-bold', 'us' ),
		),
		'std' => '',
		'cols' => 2,
		'group' => __( 'Tabs', 'us' ),
		'usb_preview' => array(
			'elm' => '.w-tabs-list',
			'css' => 'font-weight',
		),
	),
	'title_transform' => array(
		'title' => __( 'Text Transform', 'us' ),
		'type' => 'select',
		'options' => array(
			'' => us_translate( 'Default' ),
			'none' => us_translate( 'None' ),
			'uppercase' => 'UPPERCASE',
			'lowercase' => 'lowercase',
			'capitalize' => 'Capitalize',
		),
		'std' => '',
		'cols' => 2,
		'group' => __( 'Tabs', 'us' ),
		'usb_preview' => array(
			'elm' => '.w-tabs-list',
			'css' => 'text-transform',
		),
	),
	'title_size' => array(
		'title' => __( 'Font Size', 'us' ),
		'type' => 'slider',
		'std' => '1em',
		'options' => array(
			'px' => array(
				'min' => 10,
				'max' => 50,
			),
			'rem' => array(
				'min' => 0.5,
				'max' => 4.0,
				'step' => 0.1,
			),
			'em' => array(
				'min' => 0.5,
				'max' => 4.0,
				'step' => 0.1,
			),
		),
		'cols' => 2,
		'group' => __( 'Tabs', 'us' ),
		'usb_preview' => array(
			'elm' => '.w-tabs-list',
			'css' => 'font-size',
		),
	),
	'title_lineheight' => array(
		'title' => __( 'Line height', 'us' ),
		'description' => us_arr_path( $misc, 'desc_line_height', '' ),
		'type' => 'text',
		'cols' => 2,
		'group' => __( 'Tabs', 'us' ),
		'usb_preview' => array(
			'elm' => '.w-tabs-list',
			'css' => 'line-height',
		),
	),

	// More Options
	'switch_sections' => array(
		'title' => __( 'Switch sections', 'us' ),
		'type' => 'radio',
		'options' => array(
			'click' => __( 'On click', 'us' ),
			'hover' => __( 'On hover', 'us' ),
		),
		'std' => 'click',
		'group' => __( 'More Options', 'us' ),
		'usb_preview' => TRUE,
	),
	'title_tag' => array(
		'title' => __( 'Sections Title HTML tag', 'us' ),
		'type' => 'select',
		'options' => us_arr_path( $misc, 'html_tag_values', array() ),
		'std' => 'div',
		'group' => __( 'More Options', 'us' ),
	),
);

/**
 * @return array
 */
return array(
	'title' => __( 'Vertical Tabs', 'us' ),
	'category' => __( 'Containers', 'us' ),
	'icon' => 'fas fa-folder-plus',
	'is_container' => TRUE,
	'weight' => 350, // go after Tabs element, which has "360" weight
	'as_child' => array(
		'except' => 'vc_tta_section',
	),
	'as_parent' => array(
		'only' => 'vc_tta_section',
	),
	'params' => us_set_params_weight(
		$general_params,
		$design_options_params
	),

	// Default VC params which are not supported by the theme
	'vc_remove_params' => array(
		'active_section',
		'alignment',
		'autoplay',
		'color',
		'css_animation',
		'gap',
		'no_fill_content_area',
		'pagination_color',
		'pagination_style',
		'shape',
		'spacing',
		'style',
		'title',
	),

	'usb_init_js' => '$elm.wTabs()',
);
