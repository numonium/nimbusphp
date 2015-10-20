<?php
	
	$_single = false;
	$_vacs = false;
	
	if(!empty($this->matches[3])){ # dest/single view
		$_single = true;
		$_vac = new _Vacation(array(
			FETCH_FROM_DB	=> true,
			'slug'	=> $this->matches[3]
		));		

		$this->tokens['dest-name'] = $_vac->name.
		$this->tokens['dest-city'] = $_vac->city['name'];
	}else if(!empty($this->matches[1])){ # listing view
		
		if($this->matches[1] == 'cruises'){
			$_cat = new _Cat(array(
				'slug'	=> $this->matches[1],
				'name'	=> 'Cruises'	
			));
			
			$_vacs = _Vacation::all(array('type' => 'cruise'));
		}else if($this->matches[1] == 'featured'){
			$_cat = new _Cat(array(
				'slug'	=> $this->matches[1],
				'name'	=> 'Featured Destination'	
			));
			
			$_vacs = _Vacation::all(array('cat' => $this->matches[1]));
		}else{		
			$_cat = new _Cat(array(FETCH_FROM_DB => true, 'slug' => $this->matches[1]));
			
			if(!empty($_cat->uuid)){
				$_vacs = _Vacation::all(array('cat-uuid' => $_cat->uuid));
			}
		}	
		
		if(!empty($_vacs)){
			$_num = count($_vacs);
		}
			
		$this->tokens['dest-cat'] = $_cat->name;
	}else{ # browse > all
		$_all = true;
		$_vacs = _Vacation::all(array('group' => 'cat'));
	}
	
	echo $this->header(); ?>
	
	<div class="<?php echo $_['api']['sfm']->page_classes($this); ?>" data-_="page" data-_-slug="<?php echo $this->slug; ?>">
		<div class="_-bg--noise"></div>
		<div class="_-page--sub--content _-page--content">
			<h1 class="_-page--title">Find Your <strong>Perfect</strong> Vacation</h1><?php
			
			if(!empty($_all)){ ?>
			
				<h2 class="_-page--subtitle">Browse All <strong>150+</strong> Vacations</h2><?php
				
			}else if(!empty($_cat)){ ?>
			
				<h2 class="_-page--subtitle"><?php echo (!empty($_num) ? $_num : 'Browse'); ?> <strong><?php echo units($_num,in_array($_cat->slug, array('gambling-casinos')) ? 'Destination' : $_cat->name); ?></strong></h2><?php
					
			}
			
			if(empty($_vacs)){ ?>
			
				<p class="_-err _-no--results">Apologies, there are no vacations in this category. Please select another.</p><?php
					
			}else if(!empty($_all)){ ?>
			
				<dl class="_-listing--main _-listing--section"><?php
					
					foreach($_vacs as $ckey => $vacs){
						if(empty($vacs) || empty($vacs['_']['len'])){
							continue;
						}
						
						if($ckey == 'misc'){
							$c = new _Cat(array(
								'slug'	=> $ckey,
								'name'	=> 'Miscellaneous Trips'
							));
						}else if($ckey == 'cruises'){
							$c = new _Cat(array(
								'slug'	=> $ckey,
								'name'	=> 'Cruises'
							));
						}else{
							$c = new _Cat(array(FETCH_FROM_DB => true, 'uuid' => $ckey));
						} ?>
					
						<dt class="_-listing--main--header _-listing--section--header"><strong class="_-num"><?php echo $vacs['_']['len']; ?></strong><?php echo units($vacs['_']['len'],$c->name); ?></dt>
						<dd class="_-listing--main--item _-listing--section--item">
							<ul class="_-listing--vacations _-listing--dest"><?php
							
								foreach($vacs as $vkey => $vac){
									if($vkey === '_'){
										continue;
									}
 ?>
									
									<li class="_-listing--item _-listing--item--<?php echo $vac->slug; ?>">
										<div class="_-vacation" data-_-vacation-type="<?php echo $vac->type; ?>">
											<span class="_-bg--noise"></span>
											<a class="_-vacation--content" href="/vacations/view/<?php echo $vac->city['slug'].'/'.$vac->slug; ?>">
												<div class="_-vacation--name--wrapper">
													<h2 class="_-vacation--name" data-_-ui-font-size="1.25em"><?php echo $vac->name; ?></h2>
												</div><?php
													
												if(!empty($vac->_img)){ ?>
												
													<div class="_-listing--item--img--wrapper _-vacation--img--wrapper" data-_-img-load="<?php echo $vac->_img['thumb'] ;?>" style="background-image:url('<?php echo $vac->_img['thumb']; ?>');"></div><?php
														
												} ?>
												
												<div class="_-listing--item--offer _-vacation--offer--wrapper">
													<div class="_-listing--item--offer _-vacation--offer"><?php
														if(!empty($vac->offer)){ ?>
														
															<span class="_-icon _-icon--info"></span>
															<p><?php echo $vac->offer; ?></p><?php
																
														} ?>
														
													</div>
												</div>
												<span class="_-arrow--down"></span>
											</a>
										</div>
									</li><?php
											
								} ?>
							
							</ul><?php /*
							<a class="_-listing--section--item--cta" href="/vacations/browse/<?php echo $c->slug; ?>">See all <strong><?php echo $c->name; ?></strong><span class="_-arrow--down"></span></a> */ ?>
						</dd><?php
					
					} ?>					
					
				</dl><?php
					
			}else{ ?>
			
				<ul class="_-listing--vacations _-listing--dest"><?php
					
					foreach($_vacs as $vkey => $vac){ ?>
					
						<li class="_-listing--item _-listing--item--<?php echo $vac->slug; ?>">
							<div class="_-vacation" data-_-vacation-type="<?php echo $vac->type; ?>">
								<span class="_-bg--noise"></span>
								<a class="_-vacation--content" href="/vacations/view/<?php echo $vac->city['slug'].'/'.$vac->slug; ?>">
									<div class="_-vacation--name--wrapper">
										<h2 class="_-vacation--name" data-_-ui-font-size="1.25em"><?php echo $vac->name; ?></h2>
									</div><?php
										
									if(!empty($vac->_img)){ ?>
									
										<div class="_-listing--item--img--wrapper _-vacation--img--wrapper" data-_-img-load="<?php echo $vac->_img['thumb'] ;?>" style="background-image:url('<?php echo $vac->_img['thumb']; ?>');"></div><?php
											
									} ?>
									
									<div class="_-listing--item--offer _-vacation--offer--wrapper">
										<div class="_-listing--item--offer _-vacation--offer"><?php
											if(!empty($vac->offer)){ ?>
											
												<span class="_-icon _-icon--info"></span>
												<p><?php echo $vac->offer; ?></p><?php
													
											} ?>
											
										</div>
									</div>
									<span class="_-arrow--down"></span>
								</a>
							</div>
						</li><?php
							
					} ?>
	
				</ul><?php
					
			} ?>
			
			<section class="_-page--vacations--select"><?php
					
				if(empty($_all)){ ?>
				
					<section class="_-page--vacations--select--list">
						<a class="_-btn _-btn--continue _-btn--dest" href="/vacations/browse"><span class="_-text">See All <strong>150+</strong> Vacations</span> <span class="_-icon _-icon--arrow--right">&#9658;</span></a>
					</section><?php
						
				} ?>
				
				<section class="_-page--cta _-page--vacations--cta">
					<a class="_-btn _-btn--continue _-btn--cta" href="/contact/vacations"><span class="_-text">Get More Information</span> <span class="_-icon _-icon--arrow--right">&#9658;</span></a>
				</section>
				
				<section class="_-page--vacations--select--map">
					<a class="_-btn _-btn--continue _-btn--cta--map" href="/vacations/map"><span class="_-text">Search via Map</span> <?php echo _Page::icon('globe'); ?> <span class="_-icon _-icon--arrow--right">&#9658;</span></a>
				</section>
				
			</section>
		</div>
	</div><?php #._-page._-wrapper ?>
<?php echo $this->footer(); ?>