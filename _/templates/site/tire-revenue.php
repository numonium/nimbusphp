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

				<ul class="_-gallery _-gallery--<?php echo $this->slug; ?> _-gallery--slider slides-container">
					<li class="_-gallery--slide _-gallery--item _-gallery--item--tire-buying-year-round" data-slug="<?php echo $this->slug; ?>/tire-buying-year-round">
						<div class="_-gallery--item--text">
							<h2 class="_-gallery--slide--title">Tire Buying is year-round</h2>
							<h3 class="_-gallery--slide--subtitle">Seasonality is a Myth</h3>
							<ul class="_-gallery--item--text--points">
								<li>25% of your audience <strong>needs new tires every day</strong></li>
								<li>100% of your tire shops <strong>want to sell them a set</strong></li>
							</ul>
							<a class="_-gallery--item--link" href="<?php echo $_['tmp']['pages']['contact']->href.$this->href; ?>"><span class="_-text">Get Started Today</span><span class="_-icon _-icon--arrow--right">&#9658;</span></a>
						</div>
						<div class="_-gallery--item--icon _-gallery--item--icon--1"></div>
					</li>
					<li class="_-gallery--slide _-gallery--item _-gallery--item--introducing-tirepoint" data-slug="<?php echo $this->slug; ?>/introducing-tirepoint">
						<div class="_-gallery--item--text">
							<h2 class="_-gallery--slide--title">Introducing TirePoint</h2>
							<h3 class="_-gallery--slide--subtitle">A New Way to Sell Tire Shops</h3>
							<ul class="_-gallery--item--text--points">
								<li>Combine power of digital <strong>with trust of radio</strong></li>
								<li>Turn Flights <strong>into annuals</strong></li>
							</ul>
							<a class="_-gallery--item--link" href="<?php echo $_['tmp']['pages']['contact']->href.$this->href; ?>"><span class="_-text">Get Started Today</span><span class="_-icon _-icon--arrow--right">&#9658;</span></a>
						</div>
						<div class="_-gallery--item--icon _-gallery--item--icon--1"></div>
					</li>
					<li class="_-gallery--slide _-gallery--item _-gallery--item--lead-generation-for-tires" data-slug="<?php echo $this->slug; ?>/lead-generation-for-tires">
						<div class="_-gallery--item--text">
							<h2 class="_-gallery--slide--title">Lead Generation for Tires</h2>
							<h3 class="_-gallery--slide--subtitle">Exclusive for Radio</h3>
							<ul class="_-gallery--item--text--points">
								<li>Create consistent revenue <strong>from unreliable category</strong></li>
								<li>Give tire shops a <strong>reason to buy ads</strong></li>
							</ul>
							<a class="_-gallery--item--link" href="<?php echo $_['tmp']['pages']['contact']->href.$this->href; ?>"><span class="_-text">Get Started Today</span><span class="_-icon _-icon--arrow--right">&#9658;</span></a>
						</div>
						<div class="_-gallery--item--icon _-gallery--item--icon--1"></div>
					</li>
				</ul>
			</div>
		</div>
	</div><?php #._-page._-wrapper ?>
<?php echo $this->footer(); ?>