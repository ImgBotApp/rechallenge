<?php

namespace ReCHallenge;

/**
 * Loads theme scripts.
 *
 * @package ReCHallenge
 */
class Scripts
{
    /**
     * Hook into WordPress.
     */
    static function register_hooks()
    {

        add_action('wp_enqueue_scripts', [__CLASS__, 'load_scripts']);
    }

    /**
     * Enqueue scripts.
     */
    static function load_scripts()
    {

        // Register scripts
        wp_register_script('foundation', get_stylesheet_directory_uri().'/assets/components/foundation-sites/dist/js/foundation.js', ['jquery'], null, true);
        wp_register_script('rechallenge', get_stylesheet_directory_uri().'/assets/js/app.js', ['jquery', 'foundation'], null, true);

        // Load combined and compressed theme JS and dependencies
        wp_enqueue_script('rechallenge');
    }
}