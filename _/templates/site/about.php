<?php
	
	echo $this->header(); ?>
	
	<div class="_-wrapper _-page _-page--sub _-page--<?php echo $this->slug; ?>" data-_="page" data-_-slug="<?php echo $this->slug; ?>">
		<div class="_-bg--noise"></div>
		<div class="_-page--sub--content _-page--content">
			<div class="_-gallery--wrapper _-gallery--sub--wrapper">
				<nav class="_-gallery--nav slides-navigation">
					<a href="#" class="_-gallery--nav--next next">&raquo;</a>
					<a href="#" class="_-gallery--nav--prev prev">&laquo;</a>
				</nav>

				<ul class="_-gallery _-gallery--<?php echo $this->slug; ?> _-gallery--slider slides-container" data-_-gallery-init="false">
					<li class="_-gallery--slide _-gallery--item _-gallery--item--bill-pay-is-back" data-slug="<?php echo $this->slug; ?>/about">
						<div class="_-gallery--item--text">
							<h2 class="_-gallery--slide--title">About Sun &amp; Fun Media</h2>
							<p><strong>Sun & Fun Media</strong> operates a radio network sold by Premiere Networks with over 900 affiliates nationwide.</p>
							<p>We offer a unique suite of products and services exclusively for radio stations for 100% barter that are designed to <strong>increase sales, improve ratings, and reduce expenses</strong>.</p>
							<p>Established 1996.</p>
						</div>
						<div class="_-gallery--item--icon _-gallery--item--icon--1"></div>
					</li>
				</ul>
			</div>
		</div>
	</div><?php #._-page._-wrapper ?>
<?php echo $this->footer(); ?>