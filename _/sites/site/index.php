<?php
	$_forms=array(
		'admin'	=> array(
			'login' => new _Form(array('slug' => 'admin--login', FETCH_FROM_DB => true))
		)
	);
	
	$_['tmp']['pages']['sub'] = $_['const']['sections'];
	
	foreach($_['tmp']['pages']['sub'] as $pkey => &$p){
		$p = new _Page(array(
			FETCH_FROM_DB	=> true,
			'slug'			=> $pkey
		));
	}
	
	echo $this->header(); ?>
	
	<div class="_-wrapper _-page _-page--<?php echo $this->slug; ?>" data-_="page" data-_-slug="<?php echo $this->slug; ?>">
		<div class="_-gallery--wrapper">
			<nav class="_-gallery--nav slides-navigation">
				<a href="#" class="_-gallery--nav--next next">&raquo;</a>
				<a href="#" class="_-gallery--nav--prev prev">&laquo;</a>
			</nav>
			<ul class="_-gallery _-gallery--home _-gallery--slider slides-container">
				<li class="_-gallery--slide _-gallery--item _-gallery--item--home" data-slug="home">
					<div class="_-gallery--item--text">
						<h2>Sun &amp; Fun Media</h2>
						<h3>Sales and Programming</h3>
						<h3>Solutions for Radio</h3>
						<h3>100% Barter</h3>
						<a class="_-gallery--item--link" href="<?php echo $_['tmp']['pages']['contact']->href; ?>"><span class="_-text">Get Started Today</span><span class="_-icon _-icon--arrow--right">&#9658;</span></a>
					</div>
					<div class="_-gallery--item--icon"></div>
					<div class="_-bg--noise"></div>
				</li>
				<li class="_-gallery--slide _-gallery--item _-gallery--item--vacations" data-slug="vacations">
					<div class="_-gallery--item--text">
						<h2>Trade</h2>
						<h2>Ad Spots <strong>For</strong></h2>
						<h2>Hot Spots</h2>
						<h3>Incentives &amp; Giveaways</h3>
						<h3>For 100% Barter</h3>
						<a class="_-gallery--item--link" href="<?php echo $_['tmp']['pages']['sub']['vacations']->href; ?>"><span class="_-text">See Our <strong>150+</strong> Vacations</span><span class="_-icon _-icon--arrow--right">&#9658;</span></a>
					</div>
					<div class="_-gallery--item--icon"></div>
					<div class="_-bg--noise"></div>
				</li>
				<li class="_-gallery--slide _-gallery--item _-gallery--item--ntr-events" data-slug="ntr-events">
					<div class="_-gallery--item--text">
						<h2>NTR Events</h2>
						<h3>Make your events</h3>
						<h3>More Profitable</h3>
						<a class="_-gallery--item--link" href="<?php echo $_['tmp']['pages']['sub']['ntr-events']->href; ?>"><span class="_-text">Get More Information</span><span class="_-icon _-icon--arrow--right">&#9658;</span></a>
					</div>
					<div class="_-gallery--item--icon"></div>
					<div class="_-bg--noise"></div>
				</li>
				<li class="_-gallery--slide _-gallery--item _-gallery--item--automotive-solutions" data-slug="automotive-solutions">
					<div class="_-gallery--item--text">
						<h2>Get More<br />Ad Revenue</h2>
						<h3>From Local Car Dealers</h3>
						<a class="_-gallery--item--link" href="<?php echo $_['tmp']['pages']['sub']['automotive-solutions']->href; ?>"><span class="_-text">Get More Information</span><span class="_-icon _-icon--arrow--right">&#9658;</span></a>
					</div>
					<div class="_-gallery--item--icon"></div>
					<div class="_-bg--noise"></div>
				</li>
				<li class="_-gallery--slide _-gallery--item _-gallery--item--billboards-tv-ads" data-slug="billboards-tv-ads">
					<div class="_-gallery--item--text">
						<h2>Billboards &amp;<br />TV Ads</h2>
						<h3>Let Us Pay the Bill</h3>
						<h3>100% Barter</h3>
						<a class="_-gallery--item--link" href="<?php echo $_['tmp']['pages']['sub']['billboards-tv-ads']->href; ?>"><span class="_-text">Get More Information</span><span class="_-icon _-icon--arrow--right">&#9658;</span></a>
					</div>
					<div class="_-gallery--item--icon"></div>
					<div class="_-bg--noise"></div>
				</li>
				<li class="_-gallery--slide _-gallery--item _-gallery--item--bill-pay" data-slug="bill-pay">
					<div class="_-gallery--item--text">
						<h2>Bill Pay is Back</h2>
						<h3>100% Barter</h3>
						<h3>$2k &ndash; $10k / year</h3>
						<a class="_-gallery--item--link" href="<?php echo $_['tmp']['pages']['sub']['bill-pay']->href; ?>"><span class="_-text">Get More Information</span><span class="_-icon _-icon--arrow--right">&#9658;</span></a>
					</div>
					<div class="_-gallery--item--icon"></div>
					<div class="_-bg--noise"></div>
				</li>
				<li class="_-gallery--slide _-gallery--item _-gallery--item--vehicle-wraps" data-slug="vehicle-wraps">
					<div class="_-gallery--item--text">
						<h2>Vehicle Wraps<br />Are Great</h2>
						<h3>Add the perfect</h3>
						<h3>flare to your ride</h3>
						<a class="_-gallery--item--link" href="<?php echo $_['tmp']['pages']['sub']['vehicle-wraps']->href; ?>"><span class="_-text">Get More Information</span><span class="_-icon _-icon--arrow--right">&#9658;</span></a>
					</div>
					<div class="_-gallery--item--icon"></div>
					<div class="_-bg--noise"></div>
				</li>
				<li class="_-gallery--slide _-gallery--item _-gallery--item--station-merchandise" data-slug="station-merchandise">
					<div class="_-gallery--item--text">
						<h2>Swag with<br />your logo</h2>
						<h3>Custom Merchandise</h3>
						<h3>100% Barter</h3>
						<a class="_-gallery--item--link" href="<?php echo $_['tmp']['pages']['sub']['station-merchandise']->href; ?>"><span class="_-text">Get More Information</span><span class="_-icon _-icon--arrow--right">&#9658;</span></a>
					</div>
					<div class="_-gallery--item--icon"></div>
					<div class="_-bg--noise"></div>
				</li>
				<li class="_-gallery--slide _-gallery--item _-gallery--item--one-stop-trade-shop" data-slug="one-stop-trade-shop">
					<div class="_-gallery--item--text">
						<h2>One-Stop<br />Trade Shop</h2>
						<h3>Studio Equipment</h3>
						<h3>And Much More</h3>
						<a class="_-gallery--item--link" href="<?php echo $_['tmp']['pages']['sub']['one-stop-trade-shop']->href; ?>"><span class="_-text">Get More Information</span><span class="_-icon _-icon--arrow--right">&#9658;</span></a>
					</div>
					<div class="_-gallery--item--icon"></div>
					<div class="_-bg--noise"></div>
				</li>
				<li class="_-gallery--slide _-gallery--item _-gallery--item--gift-cards" data-slug="gift-cards">
					<div class="_-gallery--item--text">
						<h2>Gift Cards</h2>
						<h3>100% Barter</h3>
						<a class="_-gallery--item--link" href="<?php echo $_['tmp']['pages']['sub']['gift-cards']->href; ?>"><span class="_-text">Get More Information</span><span class="_-icon _-icon--arrow--right">&#9658;</span></a>
					</div>
					<div class="_-gallery--item--icon"></div>
					<div class="_-bg--noise"></div>
				</li>
			</ul>
		</div>	
	</div><?php #._-page._-wrapper ?>
<?php echo $this->footer(); ?>