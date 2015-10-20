<?php
	
	if(!empty($this->matches[1])){
		$vacs = _Vacation::all(array('city' => $this->matches[1]));
		
		$this->tokens['dest-city'] = $vacs[0]->city['name'];
	}
	
	echo $this->header(); ?>
	
	<div class="<?php echo $_['api']['sfm']->page_classes($this); ?>" data-_="page" data-_-slug="<?php echo $this->slug; ?>">
		<div class="_-bg--noise"></div>
		<div class="_-page--sub--content _-page--content">
			<section class="_-page--content--text">
				<h1>Find Your <strong>Perfect</strong> Vacation</h1>
				<h2>Select Your Trip to <strong><?php echo (!empty($vacs) ? $vacs[0]->city['name'] : 'Nothing Found'); ?></strong></h2>
			</section>
			<section class="_-page--<?php echo $this->slug; ?>--listing" data-_-map-listing="<?php echo $vacs[0]->city['name']; ?>">
				<ul class="_-listing _-listing--dest"><?php
					
					foreach($vacs as $vkey => $vac){ ?>
					
						<li class="_-listing--item _-listing--item--<?php echo $vac->slug; ?>">
							<div class="_-vacation" data-_-vacation-type="<?php echo $vac->type; ?>">
								<span class="_-bg--noise"></span>
								<a href="/vacations/map/<?php echo $vac->city['slug'].'/'.$vac->slug; ?>">
									<h2><?php echo $vac->name; ?></h2>
									<h3><span class="_-icon _-icon--font--user"></span> <?php echo ($vac->type=='cruise' && !empty($vac->days) ? '<strong>' . $vac->days . '-day</strong> cruise' : 'trip'); ?> for <?php echo $vac->ppl; ?></h3>
									<div class="_-listing--item--offer _-vacation--offer--wrapper">
										<div class="_-listing--item--offer _-vacation--offer"><?php
											
											if(!empty($vac->offer)){ ?>
											
												<span class="_-icon _-icon--info"></span>
												<p><?php echo $vac->offer; ?></p><?php
													
											} ?>
											
										</div>
									</div><?php
										
									if(!empty($vac->_img)){ ?>
									
										<div class="_-listing--item--img--wrapper _-vacation--img--wrapper" style="background-image:url('<?php echo $vac->_img['_']; ?>');"></div><?php
											
									} ?>
									
									<span class="_-button"><?php echo ($vac->type=='cruise' ? 'Cruise' : 'Trip'); ?> Information &#9658;</span>
									
								</a>
							</div>
						</li><?php
							
					} ?>
					
				</ul>
			</section>
		</div>
	</div><?php #._-page._-wrapper ?>
<?php echo $this->footer(); ?>