<?php
	$_vac = false;
	
	if(!empty($this->matches[1])){ # dest/single view
		$_vac = new _Vacation(array(
			FETCH_FROM_DB	=> true,
			'uuid'	=> $this->matches[1]
		));		

		$this->tokens['dest-name'] = $_vac->name;
		$this->tokens['dest-city'] = $_vac->city['name'];
	}
	
	if(!empty($_['request']['ref'])){
		$ref = $_['request']['ref'];
	}else if($_vac && !empty($_vac->link) && !empty($_vac->link['url'])){
		$ref = $_vac->ref(true);
	}
	
	$this->module('xfancybox');
	
	echo $this->header(); ?>
	
	<div class="<?php echo $_['api']['sfm']->page_classes($this); ?>" data-_="page" data-_-slug="<?php echo $this->slug; ?>">
		<div class="_-bg--noise"></div>
		<div class="_-page--sub--content _-page--content">
			<section class="_-page--content--text">
				<h1>Find Your <strong>Perfect</strong> Vacation</h1>
				<h2>Your Trip to <strong><?php echo (!empty($this->tokens['dest-city']) ? $this->tokens['dest-city'] : 'Nothing Found'); ?></strong></h2>
			</section>
			<section class="_-page--<?php echo $this->slug.($_single ? '--single' : ''); ?>--listing" data-_-map-listing="<?php echo $_vac->city['name']; ?>"><?php
				
				if($_vac){
					
					if(!empty($ref)){ ?>
						
						<a class="_-handoff--link _-lightbox fancybox fancybox.iframe" href="<?php echo $_['const']['link']['old']['admin']['login'].'&book&embed&ref='.$ref; ?>" style="display:none;" rel="group" title="Order Your Vacation to <?php echo $_vac->name; ?>" data-_-fancybox-skip>Open</a>
										
						<script type="text/javascript">
							
							(function($){
								
								$(document).ready(function(){
									
									$('.fancybox, ._-lightbox').fancybox({
										autoSize : false,
										width : '90%',
										height : '90%',
										helpers : { 
											overlay : {closeClick: false},
											title : false
										},
										/* ~EN (2015): close button control  *
										showCloseButton : false,
										closeBtn : false,*/
										afterClose : function(){
											window.location.href = '/log-out';
										}
									});
									
									$('._-handoff--link').click();
								
								});
								
							})(jQuery);
							
						</script><?php
						
					}else{ ?>
				
						<div class="_-vacation _-expand" data-_-vacation-type="<?php echo $_vac->type; ?>">
							<span class="_-bg--noise"></span>
							<section class="_-vacation--content">
								<div class="_-vacation--meta">
									<h2><?php echo $_vac->name; ?></h2>
									<h3><span class="_-icon _-icon--font--user"></span> <?php echo ($_vac->type=='cruise' && !empty($_vac->days) ? '<strong>' . $_vac->days . '-day</strong> cruise' : 'trip'); ?> for <?php echo $_vac->ppl; ?></h3>
									<div class="_-listing--item--offer _-vacation--offer--wrapper">
										<div class="_-listing--item--offer _-vacation--offer"><?php
											
											if(!empty($_vac->offer)){ ?>
											
												<span class="_-icon _-icon--info"></span>
												<p><?php echo $_vac->offer; ?></p><?php
													
											} ?>
											
										</div>
									</div><?php
										
									if(!empty($_vac->_img)){ ?>
									
										<a rel="fancybox" class="_-listing--item--img--wrapper _-vacation--img--wrapper" title="<?php echo $_vac->name.' - '.$_vac->city['name']; ?>" href="<?php echo $_vac->_img['_']; ?>" style="background-image:url('<?php echo $_vac->_img['_']; ?>');"></a><?php
											
									} ?>
								</div>
								<div class="_-vacation--sep"></div>
								<div class="_-vacation--itin _-vacation--details"><?php
									
									if($_vac->type == 'cruise'){ ?>
									
										<h2 class="_-align--center"><?php echo ($_vac->type == 'cruise' ? 'Cruise' : 'Trip'); ?> Itinerary</h2>
										<ul class="_-vacation--itin--listing"><?php
										
											if(!empty($_vac->itin)){
												foreach($_vac->itin['day'] as $ikey => $itin){ ?>
												
													<li class="_-vacation--itin--listing--item" data-_-vacation-itin-day="<?php echo ($ikey + 1); ?>">
														<h4 class="_-vacation--itin--day">Day <strong><?php echo ($ikey + 1); ?></strong></h4>
														<p class="_-vacation--itin--val"><?php echo $itin; ?></p>
													</li><?php											
													
												}
											} ?>
											
										</ul><?php
											
									}else{ ?>
									
										<h2 class="_-align--center">To Order this Certificate, please call:</h2>
										<h2 class="_-align--center" style="margin-bottom:0;font-size:2em;">Sun & Fun Media</h2>										
										<h2 class="_-align--center" style="font-size:1.5em;">407.328.0505</h2><?php
										
									} ?>
									
									<a class="_-button _-button--book" href="/vacations/view/<?php echo $_vac->city['slug'].'/'.$_vac->slug; ?>">
										<span class="_-text"><span class="_-icon _-icon--arrow--left">&#9668;</span> Vacation Details</span>
										<span class="_-button--icon _-icon--font--<?php
										
											switch($_vac->type){
												case 'air':
													echo 'destination-air';
													break;
												case 'land':
													echo 'destination-land';
													break;
												case 'vacation':
													echo 'vacation';
													break;
												case 'cruise':
													echo 'cruise';
													break;
													
											} ?>"></span>
									</a>
									
								</div>							
							</section>
						</div><?php
							
					} ?>
					
					<section class="_-page--vacations--select">				
						<section class="_-page--vacations--select--list">
							<a class="_-btn _-btn--continue _-btn--dest" href="/vacations/browse"><span class="_-text">See All <strong>150+</strong> Vacations</span> <span class="_-icon _-icon--arrow--right">&#9658;</span></a>
						</section>
						<section class="_-page--vacations--select--map">
							<a class="_-btn _-btn--continue _-btn--cta--map" href="/vacations/map"><span class="_-text">Search via Map</span> <?php echo _Page::icon('globe'); ?> <span class="_-icon _-icon--arrow--right">&#9658;</span></a>
						</section>
					</section><?php
					
					/*	
					if(!empty($_vac->cat) && is_object($_vac->cat)){ ?>
					
						<a class="_-btn _-btn--continue" href="/vacations/browse/<?php echo $_vac->cat->slug; ?>">
							<span class="_-icon _-icon--arrow--left">&#9668;</span> <span class="_-text">More <?php echo $_vac->cat->name; ?></span>							
						</a><?php

					}else{ ?>
					
					
						<a class="_-btn _-btn--continue" href="/vacations/map/#/sfm/map/<?php echo $this->matches[1]; ?>">
							<span class="_-icon _-icon--arrow--left">&#9668;</span> <span class="_-text">More Trips in <?php echo $this->tokens['dest-city']; ?></span>							
						</a><?php
							
					}*/
					
				}else{ ?>
				
					<p>Many apologies, this vacation could not be found. Please select another.</p>
					
					<a class="_-btn _-btn--continue" href="/vacations/map">
						<span class="_-icon _-icon--arrow--left">&#9668;</span>
						<span class="_-text">Back to Map</span>
						<?php echo _Page::icon('globe'); ?>
					</a><?php
						
				} ?>
				
			</section>
		</div>
	</div><?php #._-page._-wrapper ?>
<?php echo $this->footer(); ?>