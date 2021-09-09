<?php defined( 'ABSPATH' ) OR die( 'This script cannot be accessed directly.' );

/**
 * Shortcode: us_separator
 *
 * Dev note: if you want to change some of the default values or acceptable attributes, overload the shortcodes config.
 *
 * @param $title               string Progress Bar title
 * @param $count               int Values to be set in the Progress Bar
 * @param $style               string Style: '1' / '2' / '3' / '4' / '5'
 * @param $size                string Height
 * @param $color               string Color style: 'primary' / 'secondary' / 'heading' / 'text' / 'custom'
 * @param $bar_color           string
 * @param $hide_count          bool Hide progress value counter?
 * @param $hide_final_value    boolean Hide progress final value
 * @var   $shortcode           string Current shortcode name
 * @var   $shortcode_base      string The original called shortcode name (differs if called an alias)
 * @var   $content             string Shortcode's inner content
 * @var   $classes             string Extend class names
 *
 */

$_atts = array(
	'class' => 'w-progbar initial',
);

$_atts['class'] .= isset( $classes ) ? $classes : '';
$_atts['class'] .= ' style_' . $style;
$_atts['class'] .= ' color_' . $color;

if ( $hide_count ) {
	$_atts['class'] .= ' hide_count';
}

// When some values are set in Design options, add the specific classes
if ( us_design_options_has_property( $css, 'color' ) ) {
	$_atts['class'] .= ' has_text_color';
}

if ( ! empty( $el_id ) ) {
	$_atts['id'] = $el_id;
}
// If we are in WPB front end editor mode, make sure the progbar has an ID
if ( function_exists( 'vc_is_page_editable' ) AND vc_is_page_editable() AND empty( $_atts['id'] ) ) {
	$_atts['id'] = us_uniqid();
}

if ( $title != '' ) {
	$title_string = '<span class="w-progbar-title-text">' . wptexturize( $title ) . '</span>';
} else {
	$title_string = '';
	$_atts['class'] .= ' title_none';
}

$title_inline_css = us_prepare_inline_css(
	array(
		'font-size' => $title_size,
	)
);

/**
 * Remove all but numbers from a string
 * @param mixed $value
 * @return mixed
 */
$func_number = function ( $value ) {
	$value = preg_replace( '/[^0-9\.\-\,]/', '', $value );
	// Floating point number checker, if at the end there is a separator and this is a comma, then fix it on a dot
	$value = preg_replace( '/(\,(\d+))$/', ".$2", $value );
	$value = preg_replace( '/(\,|\.)/', '', $value );

	return $value;
};

// Checking a value that cannot be greater than the final value
$count_number = $func_number( $count );
$final_value_number = $func_number( $final_value );
if (
	(
		$count_number > 0
		AND $count_number > $final_value_number
	)
	OR (
		$count_number < 0
		AND $count_number < $final_value_number
	)
) {
	$count = $final_value;
}

// Calculate bar width for AMP or Builder preview
if ( us_amp() ) {
	$bar_width = ( $count_number / $func_number( $final_value ) ) * 100;
	$bar_width = number_format( $bar_width, 2 ) . '%';
} else {
	$bar_width = '';
}

$bar_inline_css = us_prepare_inline_css(
	array(
		'height' => $size,
		'width' => $bar_width,
		'background' => us_get_color( $bar_color, /* Gradient */ TRUE ),
	)
);

// Check for the presence of a unit at the main value
$is_count_unit = preg_replace( '/([\d\-\,\.\s]*)/', '', $count );
if ( ! $is_count_unit AND preg_match( '/^((\D*)(:?\-)?)?(\d+)(\D*)?$/', $final_value, $matches ) ) {
	if ( ! empty( $matches[2] ) ) {
		$count = rtrim( $matches[2], '-' ) . $count;
	}
	if ( ! empty( $matches[5] ) ) {
		$count .= $matches[5];
	}
}

// Export options to js
$json_data = array(
	'value' => $count_number,
	'template' => $count,
	'finalValue' => $func_number( $final_value ),
);

// Show Final value
if ( ! $hide_final_value AND ! empty( $final_value ) ) {
	$json_data['showFinalValue'] = sprintf( _x( 'of %s', 'Example: 33% of 100%', 'us' ), $final_value );
	$count .= ' ' . $json_data['showFinalValue'];
}

// Output the element
$output = '<div' . us_implode_atts( $_atts );
if ( ! us_amp() ) {
	$output .= us_pass_data_to_js( $json_data );
}
$output .= '>';

// Title
$output .= '<' . $title_tag . ' class="w-progbar-title"' . $title_inline_css . '>';
$output .= $title_string;
$output .= '<span class="w-progbar-title-count">' . $count . '</span>';
$output .= '</' . $title_tag . '>';

// Bar
$output .= '<div class="w-progbar-bar">';
$output .= '<div class="w-progbar-bar-h"' . $bar_inline_css . '>';
$output .= '<span class="w-progbar-bar-count">' . $count . '</span>';
$output .= '</div>';
$output .= '</div>';

$output .= '</div>';

// If we are in WPB front end editor mode, apply JS to the progbar
if ( function_exists( 'vc_is_page_editable' ) AND vc_is_page_editable() ) {
	$output .= '<script>
	jQuery( function( $ ){
		if ( typeof $us !== "undefined" && typeof $.fn.wProgbar === "function" ) {
			var $elm = jQuery( "#' . $_atts['id'] . '" );
			if ( $elm.data( "wProgbar" ) === undefined ) {
				$elm.wProgbar();
			}
		}
	} );
	</script>';
}

echo $output;
