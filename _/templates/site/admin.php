<?php

	echo $this->header(); ?>
	
	<div class="_-wrapper _-page _-page--sub _-page--<?php echo $this->slug.(!empty($this->matches) && !empty($this->matches[1]) ? ' _-page--'.$this->matches[1].' _-page--'.$this->slug.'--'.$this->matches[1] : ''); ?>" data-_="page" data-_-slug="<?php echo $this->slug; ?>">
		<div class="_-bg--noise"></div>
		<div class="_-page--sub--content _-page--content">
			<div class="_-gallery--wrapper _-gallery--sub--wrapper">
				<nav class="_-gallery--nav slides-navigation">
					<a href="#" class="_-gallery--nav--next next">&raquo;</a>
					<a href="#" class="_-gallery--nav--prev prev">&laquo;</a>
				</nav>

				<ul class="_-gallery _-gallery--<?php echo $this->slug; ?> _-gallery--slider slides-container" data-_-gallery-init="false">
					<li class="_-gallery--slide _-gallery--item _-gallery--item--admin" data-slug="<?php echo $this->slug; ?>/admin">
						<div class="_-gallery--item--text">
							<h2 class="_-gallery--slide--title">Administration Area</h2>
							<h3>Please select a section below:</h3>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</div><?php #._-page._-wrapper ?>
<?php echo $this->footer(); ?>
