<?php
	
	echo $this->header();
	
	$vacs = array(
		'featured'	=> _Vacation::all(array('cat' => 'featured')),
		'beaches'	=> _Vacation::all(array('cat-uuid' => 'sBYCRZZeQ2WOP1LxHMVyfbOABZiHFvZ6c3s7bU1ZOH2wSzPxyQ3HGdDXIDuaapo')),
		'cruises'	=> _Vacation::all(array('type' => 'cruise')),
		'sports'	=> _Vacation::all(array('cat-uuid'	=> 'ukdlEZLu3YIjrvTyMI9hxoacr8LV5m7Vm3izxP5gpvyNX2YYzwMnH1XR07qXp4Q')),
		'gambling'	=> _Vacation::all(array('cat-uuid'	=> 'MsNgtme1q1gk04LR9qVUmjkUt7bhWjKyLmwk8vMefjDbkDEEw8YDtQUI8ufka30')),
		'festivals'	=> _Vacation::all(array('cat-uuid'	=> '19B2C5E2A151ECE0F901F8CDA40FC072E01229837877C3FF21582AC395339203')),
	);
	
	 ?>
	
	<div class="<?php echo $_['api']['sfm']->page_classes($this); ?>" data-_="page" data-_-slug="<?php echo $this->slug; ?>">
		<div class="_-bg--noise"></div>
		<div class="_-page--sub--content _-page--content">
			<h1>Find Your <strong>Perfect</strong> Vacation</h1>
			<h2 style="margin-bottom:.5em">For 100% Barter</h2>
			<ul class="_-listing--vacations _-listing--dest">
				<li class="_-listing--item _-listing--item--featured">
					<div class="_-vacation" data-_-vacation-type="<?php echo $vacs['featured'][0]->type; ?>">
						<span class="_-bg--noise"></span>
						<a class="_-vacation--content" href="/vacations/browse/featured">
							<h2 class="_-vacation--name"><span class="_-text">Featured Vacations</span></h2><?php
								
							if(!empty($vacs['featured'][0]->_img)){ ?>
							
								<div class="_-listing--item--img--wrapper _-vacation--img--wrapper" style="background-image:url('<?php echo $vacs['featured'][0]->_img['_']; ?>');"></div><?php
									
							} ?>
							
							<div class="_-listing--item--offer _-vacation--offer--wrapper">
								<div class="_-listing--item--offer _-vacation--offer"><?php
									if($num = count($vacs['featured'])){ ?>
									
										<span class="_-icon _-icon--info"></span>
										<p><?php echo $num; ?> Featured Trip<?php echo ($num != 1 ? 's' : ''); ?></p><?php
											
									} ?>
									
								</div>
							</div>
							<span class="_-arrow--down"></span>
						</a>
					</div>
				</li><?php
					
				if(!empty($vacs['beaches'])){ ?>
				
					<li class="_-listing--item _-listing--item--beaches">
						<div class="_-vacation" data-_-vacation-type="<?php echo $vacs['beaches'][0]->type; ?>">
							<span class="_-bg--noise"></span>
							<a class="_-vacation--content" href="/vacations/browse/beaches">
								<h2 class="_-vacation--name"><span class="_-text">Top Beaches</span></h2><?php
									
								if(!empty($vacs['beaches'][0]->_img)){ ?>
								
									<div class="_-listing--item--img--wrapper _-vacation--img--wrapper" style="background-image:url('<?php echo $vacs['beaches'][0]->_img['_']; ?>');"></div><?php
										
								} ?>
								
								<div class="_-listing--item--offer _-vacation--offer--wrapper">
									<div class="_-listing--item--offer _-vacation--offer"><?php
										if($num = count($vacs['beaches'])){ ?>
										
											<span class="_-icon _-icon--info"></span>
											<p><?php echo $num; ?> Top Beach<?php echo ($num != 1 ? 'es' : ''); ?></p><?php
												
										} ?>
										
									</div>
								</div>
								<span class="_-arrow--down"></span>
							</a>
						</div>
					</li><?php
						
				}
				
				if(!empty($vacs['cruises'])){ ?>
				
					<li class="_-listing--item _-listing--item--cruises">
						<div class="_-vacation" data-_-vacation-type="<?php echo $vacs['cruises'][0]->type; ?>">
							<span class="_-bg--noise"></span>
							<a class="_-vacation--content" href="/vacations/browse/cruises">
								<h2 class="_-vacation--name"><span class="_-text">Cruise Vacations</span></h2><?php
									
								if(!empty($vacs['cruises'][0]->_img)){ ?>
								
									<div class="_-listing--item--img--wrapper _-vacation--img--wrapper" style="background-image:url('<?php echo $vacs['cruises'][0]->_img['_']; ?>');"></div><?php
										
								} ?>
								
								<div class="_-listing--item--offer _-vacation--offer--wrapper">
									<div class="_-listing--item--offer _-vacation--offer"><?php
										if($num = count($vacs['cruises'])){ ?>
										
											<span class="_-icon _-icon--info"></span>
											<p><?php echo $num; ?> Cruise<?php echo ($num != 1 ? 's' : ''); ?></p><?php
												
										} ?>
										
									</div>
								</div>
								<span class="_-arrow--down"></span>
							</a>
						</div>
					</li><?php
						
				}
				
				if(!empty($vacs['sports'])){ ?>
				
					<li class="_-listing--item _-listing--item--sports">
						<div class="_-vacation" data-_-vacation-type="<?php echo $vacs['sports'][0]->type; ?>">
							<span class="_-bg--noise"></span>
							<a class="_-vacation--content" href="/vacations/browse/sporting-events">
								<h2 class="_-vacation--name"><span class="_-text">Sporting Events</span></h2><?php
									
								if(!empty($vacs['sports'][0]->_img)){ ?>
								
									<div class="_-listing--item--img--wrapper _-vacation--img--wrapper" style="background-image:url('<?php echo $vacs['sports'][0]->_img['_']; ?>');"></div><?php
										
								} ?>
								
								<div class="_-listing--item--offer _-vacation--offer--wrapper">
									<div class="_-listing--item--offer _-vacation--offer"><?php
										if($num = count($vacs['sports'])){ ?>
										
											<span class="_-icon _-icon--info"></span>
											<p><?php echo $num; ?> Sporting Event<?php echo ($num != 1 ? 's' : ''); ?></p><?php
												
										} ?>
										
									</div>
								</div>
								<span class="_-arrow--down"></span>
							</a>
						</div>
					</li><?php
						
				}
				
				if(!empty($vacs['gambling'])){ ?>
				
					<li class="_-listing--item _-listing--item--gambling">
						<div class="_-vacation" data-_-vacation-type="<?php echo $vacs['gambling'][0]->type; ?>">
							<span class="_-bg--noise"></span>
							<a class="_-vacation--content" href="/vacations/browse/gambling-casinos">
								<h2 class="_-vacation--name"><span class="_-text">Gambling &amp; Casinos</span></h2><?php
									
								if(!empty($vacs['gambling'][0]->_img)){ ?>
								
									<div class="_-listing--item--img--wrapper _-vacation--img--wrapper" style="background-image:url('<?php echo $vacs['gambling'][0]->_img['_']; ?>');"></div><?php
										
								} ?>
								
								<div class="_-listing--item--offer _-vacation--offer--wrapper">
									<div class="_-listing--item--offer _-vacation--offer"><?php
										if($num = count($vacs['gambling'])){ ?>
										
											<span class="_-icon _-icon--info"></span>
											<p><?php echo $num; ?> Destination<?php echo ($num != 1 ? 's' : ''); ?></p><?php
												
										} ?>
										
									</div>
								</div>
								<span class="_-arrow--down"></span>
							</a>
						</div>
					</li><?php
						
				}
				
				if(!empty($vacs['festivals'])){ ?>
				
					<li class="_-listing--item _-listing--item--festivals">
						<div class="_-vacation" data-_-vacation-type="<?php echo $vacs['festivals'][0]->type; ?>">
							<span class="_-bg--noise"></span>
							<a class="_-vacation--content" href="/vacations/browse/annual-festivals">
								<h2 class="_-vacation--name"><span class="_-text">Annual Festivals</span></h2><?php
									
								if(!empty($vacs['festivals'][0]->_img)){ ?>
								
									<div class="_-listing--item--img--wrapper _-vacation--img--wrapper" style="background-image:url('<?php echo $vacs['festivals'][0]->_img['_']; ?>');"></div><?php
										
								} ?>
								
								<div class="_-listing--item--offer _-vacation--offer--wrapper">
									<div class="_-listing--item--offer _-vacation--offer"><?php
										if($num = count($vacs['festivals'])){ ?>
										
											<span class="_-icon _-icon--info"></span>
											<p><?php echo $num; ?> Annual Festival<?php echo ($num != 1 ? 's' : ''); ?></p><?php
												
										} ?>
										
									</div>
								</div>
								<span class="_-arrow--down"></span>
							</a>
						</div>
					</li><?php
						
				} ?>
				
			</ul>
			<section class="_-page--vacations--select">		
				<section class="_-page--vacations--select--list">
					<a class="_-btn _-btn--continue _-btn--dest" href="/vacations/browse"><span class="_-text">See All <strong>150+</strong> Vacations</span> <span class="_-icon _-icon--arrow--right">&#9658;</span></a>
				</section>
				<section class="_-page--vacations--select--map">
					<a class="_-btn _-btn--continue _-btn--cta--map" href="/vacations/map"><span class="_-text">Search via Map</span> <?php echo _Page::icon('globe'); ?> <span class="_-icon _-icon--arrow--right">&#9658;</span></a>
				</section>
			</section>
			<section class="_-page--cta _-page--vacations--cta">
				<a class="_-btn _-btn--continue _-btn--cta" href="/contact/vacations"><span class="_-text">Get More Information</span> <span class="_-icon _-icon--arrow--right">&#9658;</span></a>
			</section>
		</div>
	</div><?php #._-page._-wrapper ?>
<?php echo $this->footer(); ?>