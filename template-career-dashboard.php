<?php
/* Template Name: Career Dashboard */
get_header();

get_template_part("parts/navigation/breadcrumb");
?>

    <!-- Main -->
    <main>

        <div class="row column">
            <?php
            the_content();
            ?>
        </div>

        <!-- Calendar / News -->
        <div class="section-even calendar-news">

            <div class="row">
                <div class="column column-block medium-5 large-4">
                    <?php get_template_part('parts/misc/career', 'selector'); ?>
                    <?php get_template_part('parts/misc/career', 'calendar'); ?>
                </div>
                <div class="column medium-7 large-8">

                    <section class="wisv-panel">
                        <div class="wisv-panel-heading">
                            <h1 class="small">Latest Job Openings
                                <small><a href="<?php echo get_post_type_archive_link('job_opening') ?>">View more <i class="fa ch-arrow-right"></i></a></small>
                            </h1>
                        </div>
                        <div class="wisv-panel-content">
                            <?php
                            // Get most recent job openings
                            $job_openings = new WP_Query([
                                'post_type' => 'job_opening',
                                'posts_per_page' => 3,
                                'orderby' => 'date',
                                'order' => 'DESC',
                                'meta_query' => [
                                    [
                                        'key' => '_company_id',
                                        'value' => '',
                                        'compare' => '!=',
                                    ],
                                ],
                            ]);

                            // Render job openings
                            iF ($job_openings->have_posts()) {
                                while ($job_openings->have_posts()) {
                                    $job_openings->the_post();
                                    get_template_part('parts/post-type/excerpt', 'job_opening');
                                }
                                wp_reset_postdata();
                            } else {
                                ?>
                                <div class="row column">
                                    <h3>No content available</h3>
                                    <p>There are no job openings available at the moment.</p>
                                </div>
                                <?php
                            }
                            ?>
                        </div>
                    </section>

                </div>
            </div>
        </div>

    </main>

<?php
get_footer();
