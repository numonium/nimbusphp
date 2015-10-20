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
					<li class="_-gallery--slide _-gallery--item _-gallery--item--new-traffic-patterns" data-slug="<?php echo $this->slug; ?>/new-traffic-patterns">
						<div class="_-gallery--item--text">
							<h2 class="_-gallery--slide--title">New Traffic Patterns</h2>
							<h3 class="_-gallery--slide--subtitle">Car Shopping has Changed &ndash; So Should You</h3>
							<div class="_-col--2--wrapper _-col--wrapper">
								<div class="_-col _-col--1">
									<h4><strong>67%</strong> of all leads come from online</h4>
									<div class="_-gallery--item--icon _-gallery--item--icon--1"></div>
									<div class="_-caption"><strong>Source:</strong> NADA Advertising Expenditures<br />By Medium, 2013</div>
								</div>
								<div class="_-col _-col--2">
									<h4><strong>83%</strong> of all searches start online</h4>
									<div class="_-gallery--item--icon _-gallery--item--icon--2"></div>
									<div class="_-caption"><strong>Source:</strong> NADA Advertising Expenditures<br />By Medium, 2013</div>								
								</div>							
							</div>
							<div class="_-gallery--item--link--wrapper">
								<a class="_-gallery--item--link" href="<?php echo $_['tmp']['pages']['contact']->href.$this->href; ?>"><span class="_-text">Get Started Today</span><span class="_-icon _-icon--arrow--right">&#9658;</span></a>
							</div>
						</div>
						<div class="_-gallery--item--icon"></div>
					</li>
					<li class="_-gallery--slide _-gallery--item _-gallery--item--radio-ad-buys" data-slug="<?php echo $this->slug; ?>/radio-ad-buys">
						<div class="_-gallery--item--text">
							<h2 class="_-gallery--slide--title">Radio Ad Buys at All-Time Low</h2>
							<h3 class="_-gallery--slide--subtitle">Digital Spending At All-Time High</h3>
							<ul class="_-gallery--item--text--points">
								<li>Embrace the <strong>New Reality</strong></li>
							</ul>
							<a class="_-gallery--item--link" href="<?php echo $_['tmp']['pages']['contact']->href.$this->href; ?>"><span class="_-text">Get Started Today</span><span class="_-icon _-icon--arrow--right">&#9658;</span></a>
						</div>
						<div class="_-gallery--item--icon _-gallery--item--icon--1"></div>
					</li>
					<li class="_-gallery--slide _-gallery--item _-gallery--item--welcome-to-carpoint" data-slug="<?php echo $this->slug; ?>/welcome-to-carpoint">
						<div class="_-gallery--item--text">
							<h2 class="_-gallery--slide--title">Welcome to CarPoint</h2>
							<h3 class="_-gallery--slide--subtitle">Digital Lead Generation for Radio</h3>
							<ul class="_-gallery--item--text--points">
								<li>Become a trusted <strong>lead source</strong></li>
								<li>Leverage longer, <strong>deeper buys</strong></li>
							</ul>
							<a class="_-gallery--item--link" href="<?php echo $_['tmp']['pages']['contact']->href.$this->href; ?>"><span class="_-text">Get Started Today</span><span class="_-icon _-icon--arrow--right">&#9658;</span></a>
						</div>
						<div class="_-gallery--item--icon"></div>
					</li>
					<li class="_-gallery--slide _-gallery--item _-gallery--item--connect-dealers-listeners" data-slug="<?php echo $this->slug; ?>/connect-dealers-listeners">
						<div class="_-gallery--item--text">
							<h2 class="_-gallery--slide--title">Connect Dealers &amp; Listeners</h2>
							<h3 class="_-gallery--slide--subtitle">Direct Leads Delivered 24/7/365</h3>
							<ul class="_-gallery--item--text--points">
								<li>Steal share <strong>from the Internet</strong></li>
								<li>Win back <strong>lost accounts</strong></li>
							</ul>
							<a class="_-gallery--item--link" href="<?php echo $_['tmp']['pages']['contact']->href.$this->href; ?>"><span class="_-text">Get Started Today</span><span class="_-icon _-icon--arrow--right">&#9658;</span></a>
						</div>
						<div class="_-gallery--item--icon"></div>
					</li>
				</ul>
			</div>
		</div>
	</div><?php #._-page._-wrapper ?>
<?php echo $this->footer(); ?>