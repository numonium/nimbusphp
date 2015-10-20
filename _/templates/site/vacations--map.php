<?php
	
	$this->module('gmaps');
	
	echo $this->header(); ?>
	
	<div class="<?php echo $_['api']['sfm']->page_classes($this); ?>" data-_="page" data-_-slug="<?php echo $this->slug; ?>">
		<div class="_-bg--noise"></div>
		<div class="_-page--sub--content _-page--content">
			<section class="_-page--content--text">
				<h1>Find Your <strong>Perfect</strong> Vacation</h1>
			</section>
			<section class="_-page--<?php echo $this->slug; ?>--map">
				<div class="_-map--wrapper">
					<figure class="_-map"></figure>
				</div>
			</section>
			<section class="_-page--cta _-page--vacations--cta">
				<a class="_-btn _-btn--continue _-btn--cta" href="/contact/vacations"><span class="_-text">Get More Information</span> <span class="_-icon _-icon--arrow--right">&#9658;</span></a>
			</section>
		</div>
	</div><?php #._-page._-wrapper ?>
<?php echo $this->footer(); ?>