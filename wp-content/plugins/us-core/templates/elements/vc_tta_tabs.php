<?php defined( 'ABSPATH' ) OR die( 'This script cannot be accessed directly.' );

/**
 * Shortcode: vc_tta_tabs
 *
 * Overloaded by UpSolution custom implementation.
 *
 * Dev note: if you want to change some of the default values or acceptable attributes, overload the shortcodes config.
 *
 * @var $shortcode      string Current shortcode name
 * @var $shortcode_base string The original called shortcode name (differs if called an alias)
 * @var $content        string Shortcode's inner content
 * @var $classes        string Extend class names
 *
 * @var $toggle         bool {@for [vc_tta_accordion]} Act as toggle?
 * @var $scrolling      bool {@for [vc_tta_accordion]} Scrolling when opening a section?
 * @var $c_align        string {@for [vc_tta_accordion], [vc_tta_tour]} Text alignment: 'left' / 'center' / 'right'
 * @var $c_icon         string {@for [vc_tta_accordion]} Icon: '' / 'chevron' / 'plus' / 'triangle'
 * @var $c_position     string {@for [vc_tta_accordion]} Icon position: 'left' / 'right'
 * @var $title_tag      string Title HTML tag (inherited from wrapping vc_tta_tabs shortcode): 'div' / 'h2'/ 'h3'/ 'h4'/ 'h5'/ 'h6'/ 'p'
 * @var $title_size     string Title Size
 * @var $layout         string {@for [vc_tta_tabs]} Tabs layout: 'default' / 'modern' / 'trendy' / 'timeline'
 * @var $stretch        bool {@for [vc_tta_tabs]} Stretch tabs to the full available width
 * @var $tab_position   string {@for [vc_tta_tour]} Tabs position: 'left' / 'right'
 * @var $controls_size  string {@for [vc_tta_tour]} Tabs size: 'auto' / '10' / '20' / '30' / '40' / '50'
 * @var $el_id          string element ID
 * @var $el_class       string {@for [vc_tta_accordion], [vc_tta_tabs], [vc_tta_tour]} Extra class
 * @var $css            string Custom CSS
 */

// Backward compatibility
if ( $shortcode_base == 'vc_tour' ) {
	$shortcode_base = 'vc_tta_tour';
} elseif ( $shortcode_base == 'vc_accordion' ) {
	$shortcode_base = 'vc_tta_accordion';
} elseif ( $shortcode_base == 'vc_tabs' ) {
	$shortcode_base = 'vc_tta_tabs';
}

/*
 * Global variable for storing the tabs container options along with it's child tabs options
 * Dev note: we use $current_tabs_index to cover cases when tabs are nested, so different tabs options are not mixed
 */
global $us_tabs_options, $current_tabs_index;
if ( ! $us_tabs_options ) {
	$us_tabs_options = array();
}
$current_tabs_index = count( $us_tabs_options );

// Identify is this FAQs page
$us_tabs_options[ $current_tabs_index ][ 'us_faq_markup' ] = (
	$shortcode_base == 'vc_tta_accordion'
	AND ( us_is_faqs_page() OR $faq_markup )
);

$_atts['class'] = 'w-tabs';
$_atts['class'] .= isset( $classes ) ? $classes : '';

$list_classes = $list_inline_css = '';

// Extract tab attributes for future html preparations
$us_tabs_options[ $current_tabs_index ]['us_tabs_atts'] = array();
$us_tabs_atts = &$us_tabs_options[ $current_tabs_index ]['us_tabs_atts'];
$active_tab_indexes = array();
$section_contents = array();

/**
 * Removing empty section and parse data
 *
 * @param array $matches
 * @return string
 */

$func_parse_vc_tta_section = function( $matches ) use( &$us_tabs_atts, &$active_tab_indexes, &$section_contents ) {

	// Performing preprocessing of shortcodes, this will allow correct work grid layouts
	$content = do_shortcode( $matches[5] );

	// If the content is empty then skip the section
	if (
		// For the USBuilder page, leave the display of empty tabs
		! apply_filters( 'usb_is_preview_page', NULL )
		AND (
			empty( $matches[5] )
			OR empty( $content )
		)
	) {
		return;
	}

	$index = count( $us_tabs_atts );
	$item_atts = shortcode_parse_atts( '[' . $matches[2] . ' ' . trim( $matches[3] ) . ' ]' );
	unset( $item_atts[0], $item_atts[1] );

	if ( isset( $item_atts['active'] ) AND $item_atts['active'] ) {
		$active_tab_indexes[] = $index;
		$item_atts['defined_active'] = 1;
	}

	// If a unique identifier is not set, then we generate automatically for the normal operation of tabs and sections
	if ( empty( $item_atts['el_id'] ) ) {
		$item_atts['el_id'] = us_uniqid();
	}

	$us_tabs_atts[ $index ] = $item_atts;
	$section_contents[ $index ] = $content;

	return '[' . $matches[2] . ' ' . $matches[3] . ']:content:[/'. $matches[2] .']';
};

$regex_vc_tta_section = get_shortcode_regex( array( 'vc_tta_section' ) );
$content = preg_replace_callback( '/' . $regex_vc_tta_section . '/', $func_parse_vc_tta_section, $content, PREG_OFFSET_CAPTURE );

// If none of the tabs is active, the first one will be
if ( empty( $active_tab_indexes ) AND $shortcode_base != 'vc_tta_accordion' ) {
	$active_tab_indexes[] = 0;
	$us_tabs_atts[0]['active'] = 'yes';
}

if ( ! ( $shortcode_base == 'vc_tta_accordion' AND $toggle ) AND count( $active_tab_indexes ) > 1 ) {
	foreach ( array_slice( $active_tab_indexes, 1 ) as $index ) {
		$us_tabs_atts[ $index ]['active'] = 0;
		$us_tabs_atts[ $index ]['defined_active'] = 0;
	}
}

// Pass some of the attributes to the sections
foreach ( $us_tabs_atts as $index => $tab_atts ) {
	$us_tabs_atts[ $index ]['c_position'] = isset( $c_position ) ? $c_position : 'right';
	$us_tabs_atts[ $index ]['c_icon'] = isset( $c_icon ) ? $c_icon : 'chevron';
	$us_tabs_atts[ $index ]['c_align'] = isset( $c_align ) ? $c_align : 'none';
	$us_tabs_atts[ $index ]['title_tag'] = isset( $title_tag ) ? $title_tag : 'div';
	$us_tabs_atts[ $index ]['title_size'] = isset( $title_size ) ? $title_size : '';

	// If there is no el_id, then we will generate a new unique el_id
	if ( empty( $us_tabs_atts[ $index ]['el_id'] ) ) {
		$us_tabs_atts[ $index ]['el_id'] = us_uniqid();
	}
}

if ( $shortcode_base == 'vc_tta_tabs' ) {
	$_atts['class'] .= ' layout_hor';
	$list_classes .= us_amp() ? '' : ' hidden';
} elseif ( $shortcode_base == 'vc_tta_tour' ) {
	$_atts['class'] .= ' layout_ver';
	$_atts['class'] .= ' navpos_' . $tab_position;
	$_atts['class'] .= ' navwidth_' . $controls_size;
	$list_classes .= ' align_' . $c_align;
}

if ( empty( $layout ) ) {
	$layout = 'default';
}
$_atts['class'] .= ' style_' . $layout;
$_atts['class'] .= ' switch_' . $switch_sections;

$list_classes .= ' items_' . count( $us_tabs_atts );
$list_classes .= ( $stretch ) ? ' stretch' : '';

// Accordion-specific settings
if ( $shortcode_base == 'vc_tta_accordion' ) {
	$_atts['class'] .= ' accordion';
	if ( ! isset( $atts['scrolling'] ) ) {
		$_atts['class'] .= ' has_scrolling';
	}
	if ( $toggle ) {
		$_atts['class'] .= ' type_togglable';
	}
	if ( $remove_indents ) {
		$_atts['class'] .= ' remove_indents';
	}
}

if ( ! empty( $el_id ) ) {
	$_atts['id'] = $el_id;
}

// Generate inline styles for Tabs & Tour
if ( $shortcode_base != 'vc_tta_accordion' ) {
	$list_inline_css .= us_prepare_inline_css(
		array(
			'font-family' => $title_font,
			'font-weight' => $title_weight,
			'text-transform' => $title_transform,
			'font-size' => $title_size,
			'line-height' => $title_lineheight,
		)
	);
}

// Output the element
$output = '<div' . us_implode_atts( $_atts ) . '>';

// Add tabs items
if ( $shortcode_base != 'vc_tta_accordion' ) {
	$output .= '<div class="w-tabs-list' . $list_classes . '"' . $list_inline_css . '>';
	$output .= '<div class="w-tabs-list-h">';

	foreach ( $us_tabs_atts as $index => $tab_atts ) {
		$tab_atts['title'] = isset( $tab_atts['title'] ) ? us_replace_dynamic_value( $tab_atts['title'], 'any' ) : '';
		$tab_atts['title'] = wptexturize( $tab_atts['title'] );
		$tab_atts['i_position'] = isset( $tab_atts['i_position'] ) ? $tab_atts['i_position'] : 'left';

		$tabs_item_atts = array(
			'class' => 'w-tabs-item',
			'aria-controls' => 'content-' . $tab_atts['el_id'],
		);

		// Add aria-label when title is empty to avoid accessibility issues
		if ( empty( $tab_atts['title'] ) AND ! empty( $tab_atts['icon'] ) ) {
			$tabs_item_atts['aria-label'] = $tab_atts['icon'];
		}

		$tabs_item_atts['class'] .= ! empty( $tab_atts['el_class'] ) ? ' ' . $tab_atts['el_class'] : '';
		$tabs_item_atts['class'] .= ! empty( $tab_atts['active'] ) ? ' active' : '';
		$tabs_item_atts['class'] .= ! empty( $tab_atts['defined_active'] ) ? ' defined-active' : '';
		$tabs_item_atts['class'] .= ! empty( $tab_atts['icon'] ) ? ' with_icon' : '';

		// Check if the relevant section has a link
		if ( isset( $tab_atts['tab_link'] ) ) {
			$tabs_item_link_atts = us_generate_link_atts( $tab_atts['tab_link'] );
		} else {
			if ( ! us_amp() ) {
				$tabs_item_link_atts['href'] = 'javascript:void(0);';
			}
		}

		// For USBuilder add to the `usbid` attributes of the related section.
		if (
			apply_filters( 'usb_is_preview_page', NULL )
			AND ! empty( $tab_atts['usbid'] )
		) {
			$tabs_item_atts['data-related-to'] = $tab_atts['usbid'];
		}

		if ( us_amp() ) {
			$tabs_item_link_atts['id'] = 'w-tabs-item-' . $tab_atts['el_id'];
			$tabs_item_link_atts['on'] = 'tap:' . $tab_atts['el_id'] . '.toggleClass(class="active",force=true)';
			$tabs_item_link_atts['on'] .= ',' . $tabs_item_link_atts['id'] . '.toggleClass(class="active",force=true)';

			foreach ( $us_tabs_atts as $amp_id ) {
				if ( $amp_id['el_id'] == $tab_atts['el_id'] ) {
					continue;
				}
				$tabs_item_link_atts['on'] .= ',' . $amp_id['el_id'] . '.toggleClass(class="active",force=false)';
				$tabs_item_link_atts['on'] .= ',' . 'w-tabs-item-' . $amp_id['el_id'] . '.toggleClass(class="active",force=false)';
			}
		}

		$output .= '<a' . us_implode_atts( $tabs_item_atts + $tabs_item_link_atts ) . '>';
		if ( isset( $tab_atts['icon'] ) AND $tab_atts['i_position'] == 'left' ) {
			$output .= us_prepare_icon_tag( $tab_atts['icon'] );
		}
		$output .= '<span class="w-tabs-item-title">' . $tab_atts['title'] . '</span>';
		if ( isset( $tab_atts['icon'] ) AND $tab_atts['i_position'] == 'right' ) {
			$output .= us_prepare_icon_tag( $tab_atts['icon'] );
		}
		$output .= '</a>';
	}

	$output .= '</div></div>';
}

// Handling inner tabs
$us_tabs_options[ $current_tabs_index ][ 'us_tab_index' ] = 0;

// Collecting content after forming all parameters
$content = preg_replace_callback( '/:content:/', function( $maches ) use( &$section_contents ) {
	reset( $section_contents );
	$index = key( $section_contents );
	$return = $section_contents[ $index ];
	unset( $section_contents[ $index ] );
	return $return;
}, $content );
unset( $section_contents );

$output .= '<div class="w-tabs-sections"><div class="w-tabs-sections-h">' . do_shortcode( $content ) . '</div></div></div>';

// Removing information of current tabs options from global variable after $output is ready
unset( $us_tabs_options[ $current_tabs_index ] );
echo $output;
