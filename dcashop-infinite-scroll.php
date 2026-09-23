```php
<?php
/**
 * Plugin Name: DcaShop Infinite Scroll
 * Plugin URI: https://github.com/behzad79/dcashop-infinite-scroll
 * Description: Limits and manages Infinite Scroll for WooCommerce products on product category archives.
 * Version: 1.0.0
 * Author: Seyyed Behzad Mousaviyan
 * Author URI: https://github.com/behzad79
 * GitHub Plugin URI: https://github.com/behzad79/dcashop-infinite-scroll
 * Text Domain: dcashop-infinite-scroll
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'DCIS_VERSION', '1.0.0' );
define( 'DCIS_PATH', plugin_dir_path( __FILE__ ) );
define( 'DCIS_URL', plugin_dir_url( __FILE__ ) );

/**
 * Prevent Flatsome Infinite Scroll from changing the browser URL.
 */
add_filter( 'flatsome_infinite_scroll_params', function ( $params ) {
	$params['history'] = false;
	return $params;
} );

/**
 * Enqueue plugin assets.
 * Only on WooCommerce product category archives.
 */
add_action( 'wp_enqueue_scripts', 'dcis_enqueue_assets', 99 );

function dcis_enqueue_assets() {

	if ( ! is_product_category() ) {
		return;
	}

	wp_enqueue_style(
		'dcis-infinite-scroll',
		DCIS_URL . 'assets/css/infinite-scroll.css',
		array(),
		DCIS_VERSION
	);

	wp_enqueue_script(
		'dcis-infinite-scroll',
		DCIS_URL . 'assets/js/infinite-scroll.js',
		array( 'jquery' ),
		DCIS_VERSION,
```
