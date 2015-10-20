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
					<li class="_-gallery--slide _-gallery--item _-gallery--item--bill-pay-is-back" data-slug="<?php echo $this->slug; ?>/bill-pay-is-back">
						<div class="_-gallery--item--text">
							<h2 class="_-gallery--slide--title">Bill Pay is Back!</h2>
							<h3 class="_-gallery--slide--subtitle">Operating Costs for Radio are Expensive</h3>
							<ul class="_-gallery--item--text--points">
								<li><strong>Increase cash flow</strong></li>
								<li>Improve P&amp;L</li>
								<li><strong>Up to $20k annually</strong></li>
							</ul>
							<a class="_-gallery--item--link" href="<?php echo $_['tmp']['pages']['contact']->href.$this->href; ?>"><span class="_-text">Get More Information</span><span class="_-icon _-icon--arrow--right">&#9658;</span></a>
						</div>
						<div class="_-gallery--item--icon _-gallery--item--icon--1"></div>
					</li>
				</ul>
			</div>
		</div>
	</div><?php #._-page._-wrapper ?>
<?php echo $this->footer(); ?>