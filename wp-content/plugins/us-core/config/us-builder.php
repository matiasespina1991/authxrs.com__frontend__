<?php defined( 'ABSPATH' ) OR die( 'This script cannot be accessed directly.' );

/**
 * Configurations for USBuilder
 */

/**
 * Configuring fields for the page settings screen
 *
 * @var array
 */
$page_fields = array(
	'params' => array(
		'post_title' => array(
			'title' => us_translate( 'Page title' ),
			'type' => 'text',
			'std' => '',
		), // post_status, post_name etc.
	),
);

/**
 * Different templates that are required for the USBuilder to work on the frontend side
 *
 * @var array
 */
$templates = array(
	'vc_row' => '[vc_row usbid="{%vc_row%}"][vc_column usbid="{%vc_column%}"]{%content%}[/vc_column][/vc_row]',
);

// VC TTA (Tabs/Tour/Accordion) Section ( The sections that are created with a new element )
$vc_tta_section  = '[vc_tta_section title="{%title_1%}" usbid="{%vc_tta_section_1%}"]';
$vc_tta_section .= '[vc_column_text usbid="{%vc_column_text%}"]{%vc_column_text_content%}[/vc_column_text]';
$vc_tta_section .= '[/vc_tta_section]';
$vc_tta_section .= '[vc_tta_section title="{%title_2%}" usbid="{%vc_tta_section_2%}"][/vc_tta_section]';
$templates['vc_tta_section'] = $vc_tta_section;

/**
 * @var array
 */
return array(
	'page_fields' => $page_fields,
	'templates' => $templates,
);
