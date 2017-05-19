<?php
// If template called without $children variable, empty array fallback
if (!isset($children))
	$children = array();

// Add dotted border if no sub-nav
$dotted_border = count($children) === 0 ? ' dotted-border' : '';

// Get cover image
$cover_image = get_the_post_thumbnail_url(rechallenge_get_aux_page_id(), 'cover');
$cover_image_html = $cover_image !== false ? ' style="background:url(' . esc_url($cover_image) . ')"' : '';

// Get title
$title = rechallenge_get_title();
?>

<!-- Page title -->
<div class="page-title<?php echo $dotted_border; ?>"<?php echo $cover_image_html; ?>>
	<?php
	// Collapse if no cover image but has sub menu
	if (count($children) === 0 || $cover_image !== false) {
		?>
		<div class="row">
			<div class="column">
				<h1><?php echo esc_html($title); ?>
			</div>
		</div>
		<?php
	}
	?>
</div>