<?php
	
	$_single = false;
	$_cols = 3;
	
	$vacs = _Vacation::all(array('city' => $this->matches[1]));
	
	if(!empty($this->matches[3])){ # dest/single view
		$_single = true;
		$_vac = new _Vacation(array(
			FETCH_FROM_DB	=> true,
			'uuid'	=> $this->matches[3] 
		));

		$this->name = $this->tokens['dest-name'] = $_vac->name;
		$this->tokens['dest-city'] = $_vac->city['name'];
	}else if(!empty($this->matches[1])){ # listing view
		$_vac = &$vacs[0];
		
		$this->tokens['dest-city'] = $vacs[0]->city['name'];
	}
	
	$ref = array();
	if(!empty($_['server']['http-referrer'])){
		$ref = array(
			'type'	=> (endsWith($_['server']['http-referrer'],'map') ? 'map' : 'browse'),
			'url'	=> &$_['server']['http-referrer']	
		);
	}
	
	echo $this->header(); ?>
	
	<div class="<?php echo $_['api']['sfm']->page_classes($this); ?>" data-_="page" data-_-slug="<?php echo $this->slug; ?>" data-_-title="<?php echo $this->title; ?>">
		<div class="_-bg--noise"></div>
		<div class="_-page--sub--content _-page--content">
			<section class="_-page--content--text">
				<h1>Find Your <strong>Perfect</strong> Vacation</h1>
				<h2>Select Your Trip to <strong><?php echo (!empty($this->tokens['dest-city']) ? $this->tokens['dest-city'] : 'Nothing Found'); ?></strong></h2>
			</section>
			<section class="_-page--<?php echo $this->slug.($_single ? '--single' : ''); ?>--listing" data-_-map-listing="<?php echo $_vac->city['name']; ?>"><?php
				
				if(!empty($_vac->link) && !empty($_vac->link['url'])){ ?>
				
					<div class="_-vacation _-expand" data-_-vacation-type="<?php echo $_vac->type; ?>">
						<span class="_-bg--noise"></span>
						<section class="_-vacation--content">
							<div class="_-vacation--meta">
								<h2 class="_-vacation--name" data-_-ui-font-size="1.25em">Log In</h2><?php
										
								$form = new _Form(array(
									'type'	=> 'login--vacations',
									'obj'	=> $_vac,
									'cfg'	=> array(/*
										'email'	=> array(
											'from'	=> array('name' => $_['site']->name, '_' => 'info@'.$_['site']->domain),
							#				'from'	=> 'info@numonium.com',
											'to'	=> array('numonium+test--sfm@gmail.com'/*,'info@sunfunmedia.com'*),
											'auto_reply'	=> true,
											'subj'	=> '['.$_['site']->domain.'] Login Form Submission',
											'params'	=> '-f'.'info@'.$_['site']->domain
										),
										'fallback'	=> array(
											'process'	=> array('email'),
											'email'	=> array(
												'from'	=> array('name' => $_['site']->name, '_' => 'info@'.$_['site']->domain),
							#					'from'	=> 'info@numonium.com',
												'to'	=> array('numonium+test--sfm--fallback@gmail.com'/*'info@sunfunmedia.com'*),
												'auto_reply'	=> true,
												'subj'	=> '['.$_['site']->domain.'] Login Form Submission - FALLBACK',
												'params'	=> '-f'.'info@'.$_['site']->domain
											)
										),*/
							#			'process'	=> array('email', array($_['api']['sfm'],'process__form__login'))
#										'process'	=> array(array(&$_['api']['sfm'],'process__form__login__vacations'))
										'process'	=> array(array(&$_['api']['sfm'],'process__form__login'))
									),
									'validator'	=> array(
										'_'	=> new _Validator(),
							#			'pictcha'	=> $pictcha,
#										'login'	=> array($_['api']['sfm'],'validate__form__login__vacations')
									),
									'validation_map'	=> array(
										'user--username'	=> array(
											'coords' => array('user','username'),
											'v' => 'required'
										),
										'user--password'	=> array(
											'coords' => array('user','password'),
											'v' => 'required'
										)
							/*			'user--ip'	=> array(
											'coords'	=> array('user','ip'),
											'v'	=> array('domestic')
										)*/
									)
								));

								if(!empty($_['post']['_submit']) && $form->submit($_['post'])){
									echo $form->success();
								}else{
									echo $form;
								} ?>
										
							</div>
							<div class="_-vacation--sep"></div>
							<div class="_-vacation--itin _-vacation--details">

								<h2>Not a Client?</h2><br />									

								<a class="_-button _-btn _-btn--continue" href="/contact/vacations<?php echo (!empty($this->matches[3]) ? '?ref=' . $this->matches[3] : ''); ?>"><span class="_-text">Get More Information <span class="_-icon _-icon--arrow--right">&#9658;</span></span></a>
								
							</div>					
						</section>
					</div><?php
						
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
					
				}
					
				if(!empty($ref)){
					
					if($ref['type'] == 'browse'){ ?>
				
						<a class="_-btn _-btn--continue" href="<?php echo $ref['url']; ?>">
							<span class="_-icon _-icon--arrow--left">&#9668;</span>
							<span class="_-text">More Trips in <?php echo $this->tokens['dest-city']; ?></span>
						</a><?php
							
					}else if($ref['type'] == 'map'){ ?>
					
						<section class="_-page--vacations--select">
							<section class="_-page--vacations--select--map">
								<a class="_-btn _-btn--continue _-btn--globe _-btn--back" href="<?php echo (!empty($_['ajax']) ? '#/sfm/map' : '/vacations/map' ); ?>">
									<span class="_-icon _-icon--arrow--left">&#9668;</span>
									<span class="_-text">Back to Map</span>
									<?php echo _Page::icon('globe'); ?>
								</a>
							</section>
						</section><?php
						
					}
					
				} /*
				
				if(!empty($vacs) && (count($vacs) === 1)){ ?>
				
					<section class="_-page--vacations--select">
						<section class="_-page--vacations--select--map">
							<a class="_-btn _-btn--continue _-btn--globe _-btn--back" href="<?php echo (!empty($_['ajax']) ? '#/sfm/map' : '/vacations/map' ); ?>">
								<span class="_-icon _-icon--arrow--left">&#9668;</span>
								<span class="_-text">Back to Map</span>
								<?php echo _Page::icon('globe'); ?>
							</a>
						</section>
					</section><?php
						
				}else{ ?>
				
					<a class="_-btn _-btn--continue" href="<?php echo (!empty($_['ajax']) ? '#/sfm' : '/vacations/map/#sfm'); ?>/map/<?php echo $this->matches[1]; ?>">
						<span class="_-icon _-icon--arrow--left">&#9668;</span>
						<span class="_-text">More Trips in <?php echo $this->tokens['dest-city']; ?></span>
					</a><?php
						
				}*/ ?>
					
			</section>
		</div>
	</div><?php #._-page._-wrapper ?>
<?php echo $this->footer(); ?>