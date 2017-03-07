<?php
namespace ReCHallenge\Walkers;


class Menu extends \Walker_Nav_Menu {

	/**
	 * Change structure of menu level HTML.
	 */
	function start_lvl(&$output, $depth = 0, $args = Array()) {
		$indent = str_repeat("\t", $depth);
		$output .= "\n$indent<ul class=\"menu\">\n";
	}

	/**
	 * Fix menu item classes.
	 */
	function start_el(&$output, $item, $depth = 0, $args = array(), $id = 0) {

		// Remove item classes
		$item->classes = array();
//
//		// Add class to active item
//		if ($item->current === true || $item->current_item_ancestor === true) {
//			array_push($item->classes, 'active');
//		}

		// Execute original function
		parent::start_el($output, $item, $depth, $args, $id);
	}

}