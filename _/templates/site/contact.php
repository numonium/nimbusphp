<?php
	
	$pictcha = new _Pictcha();
	$pictcha->attach($this);
	
	$_['tmp']['ref'] = (!empty($this->matches) && !empty($this->matches[1]) ? new _Page(array(
		FETCH_FROM_DB	=> true,
		'slug'			=> $this->matches[1]
	)) : false);
	
	$form = new _Form(array(
		FETCH_FROM_DB => true,
		'uuid'	=> 'UpPB8J0elFCpWl7IiaKVV2WIyIl5mNK0m5DwoHs8oDaL0CsiVTFyyIyoimrRxPx',
		'type'	=> 'contact',
		'cfg'	=> array(
			'email'	=> array(
				'from'	=> array('name' => $_['site']->name, '_' => 'info@'.$_['site']->domain),
#				'from'	=> 'info@numonium.com',
#				'to'	=> array('numonium+test--sfm@gmail.com','rob@sunfunmedia.com'),
				'to'	=> $_['const']['forms']['contact']['to'],
				'auto_reply'	=> true,
				'subj'	=> '['.$_['site']->domain.'] Contact Form Submission',
				'params'	=> '-f'.'info@'.$_['site']->domain
			),
			'fallback'	=> array(
				'process'	=> array('email'),
				'email'	=> array(
					'from'	=> array('name' => $_['site']->name, '_' => 'info@'.$_['site']->domain),
#					'from'	=> 'info@numonium.com',
					'to'	=> array('numonium+test--sfm--fallback@gmail.com'/*'info@sunfunmedia.com'*/),
					'auto_reply'	=> true,
					'subj'	=> '['.$_['site']->domain.'] Contact Form Submission - FALLBACK',
					'params'	=> '-f'.'info@'.$_['site']->domain
				)
			),
			'process'	=> array(array($_['api']['sfm'],'process__form__lead'),'email')
		),
		'validator'	=> array(
			'_'	=> new _Validator(),
			'pictcha'	=> $pictcha
		),
		'validation_map'	=> array(
			'lead--name'	=> array(
				'coords' => array('lead','name'),
				'v' => 'required'
			),
			'lead--company'	=> array(
				'coords' => array('lead','company'),
				'v' => 'required'
			),
			'lead--call-letters'	=> array(
				'coords' => array('lead','call-letters'),
				'v' => 'required'
			),
			'lead--phone'	=> array(
				'coords' => array('lead','phone'),
				'v' => 'required'
			),
			'lead--email'	=> array(
				'coords' => array('lead','email'),
				'v' => array('required','email')
			),
			'lead--ip'	=> array(
				'coords'	=> array('lead','ip'),
				'v'	=> array('domestic')
			)
		)
	));
	
	echo $this->header(); ?>

	<div class="_-wrapper _-page _-page--sub _-page--<?php echo $this->slug.(!empty($this->matches) && !empty($this->matches[1]) ? ' _-page--'.$this->matches[1].' _-page--'.$this->slug.'--'.$this->matches[1] : ' _-page--'.$this->slug.'--_'); ?>" data-_="page" data-_-slug="<?php echo $this->slug; ?>"><?php /*
	
	<div class="<?php echo $_['api']['sfm']->page_classes($this); ?>" data-_="page" data-_-slug="<?php echo $this->slug; ?>"> */ ?>
		<div class="_-bg--noise"></div>
		<div class="_-page--sub--content _-page--content">
			<div class="_-page--content--inner">
				<div class="_-gallery--item--text"><?php
					
					if(!empty($_['tmp']['ref'])){ ?>

						<h2 class="_-gallery--slide--title">Get Started Today!</h2><?php
							
						if((!empty($_['post']['_submit']) || !empty($_['post']['pictcha'])) && $form->submit($_['post'])){
							echo $form->success();
						}else{ ?>
						
							<h3 class="_-gallery--slide--subtitle">Just a Bit of Info and we'll Get Going<?php #echo (empty($_['tmp']['ref']) ? 'Drop Us A Line' : 'About '.$_['tmp']['ref']->name); ?></h3><?php
							
							echo $form;
							
						}
						
					}else{ ?>
					
						<h2 class="_-gallery--slide--title">Contact Sun &amp; Fun Media</h2>
						<h3 class="_-gallery--slide--subtitle">1315 South International Parkway, Suite 1131</h3>
						<h3 class="_-gallery--slide--subtitle">Lake Mary, FL 32746</h3><?php /*
						<h3 class="_-gallery--slide--subtitle _-text--phone"><span class="_-text--phone--phone"><strong>Phone:</strong> 800.735.0060</span><span class="_-text--phone--fax"><strong>Fax:</strong> 407.328.0051</span></h3>*/ ?>
														
						<div class="_-col--2--wrapper"><?php
							/*
								
								For affiliate sales, please call 800-735-0060 or sales@sunfunmedia.com.
								For questions regarding your station’s copy, traffic or affidavits, please call 407-328-0775.
								For questions regarding your vacation, please call 407-328-0505.
								For all other questions, please call 407-328-0505.*/ ?>
							
							
							<ul class="_-gallery--item--text--points _-col _-col--1">
								<li class="_-text--dept"><h4>Affiliate Sales</h4></li>
								<li class="_-text--name"><a href="tel:+18007350060">800.735.0060</a></li>
								<li class="_-text--title"><a href="mailto:sales@sunfunmedia.com">sales@sunfunmedia.com</a></li>
								<li class="_-text--link"><a class="_-gallery--item--link" href="mailto:sales@sunfunmedia.com"><span class="_-text">Email</span><span class="_-icon _-icon--arrow--right">&#9658;</span></a>
							</ul>
							<ul class="_-gallery--item--text--points _-col _-col--2">
								<li class="_-text--dept"><h4 style="line-height:1.25em;">Station Copy, Traffic,<br />&amp; Affidavits</h4></li>
								<li class="_-text--name"><a href="tel:+14073280775">407.328.0775</a></li><?php /*
								<li class="_-text--title"><a href="mailto:sales@sunfunmedia.com">sales@sunfunmedia.com</a></li> */ ?>
								<li class="_-text--link"><a class="_-gallery--item--link" href="tel:+14073280775"><span class="_-text">Call</span><span class="_-icon _-icon--arrow--right">&#9658;</span></a>
							</ul>
							<ul class="_-gallery--item--text--points _-col _-col--3">
								<li class="_-text--dept"><h4>Reservations</h4></li>
								<li class="_-text--name"><a href="tel:+14073280505">407.328.0505</a></li><?php /*
								<li class="_-text--title"><a href="mailto:sales@sunfunmedia.com">sales@sunfunmedia.com</a></li> */ ?>
								<li class="_-text--link"><a class="_-gallery--item--link" href="tel:+14073280505"><span class="_-text">Call</span><span class="_-icon _-icon--arrow--right">&#9658;</span></a>
							</ul>
							<ul class="_-gallery--item--text--points _-col _-col--4">
								<li class="_-text--dept"><h4>Everything Else</h4></li>
								<li class="_-text--name"><a href="tel:+14073280505">407.328.0505</a></li><?php /*
								<li class="_-text--title"><a href="mailto:sales@sunfunmedia.com">sales@sunfunmedia.com</a></li> */ ?>
								<li class="_-text--link"><a class="_-gallery--item--link" href="tel:+14073280505"><span class="_-text">Call</span><span class="_-icon _-icon--arrow--right">&#9658;</span></a>
							</ul>
						</div>
					
					<?php
						
					} ?>

				</div>
			</div>
		</div>
	</div><?php #._-page._-wrapper ?>
<?php echo $this->footer(); ?>