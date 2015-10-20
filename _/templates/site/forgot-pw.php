<?php
	
	$pictcha = new _Pictcha();
	$pictcha->attach($this);
	
	$_['tmp']['ref'] = (!empty($this->matches) && !empty($this->matches[1]) ? new _Page(array(
		FETCH_FROM_DB	=> true,
		'slug'			=> $this->matches[1]
	)) : false);
		
	$form = new _Form(array(
		FETCH_FROM_DB	=> true,
		'uuid'	=> 'LMQJAayOIM0jebbvS5kVBIH7SYlSAwxyseknXyNxRwed2WfgbqTB3LlLjZhBBPy',
		'type'	=> 'forgot-pw',
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
			'process'	=> array(array(&$_['api']['sfm'],'process__form__forgot_pw'))
		),
		'validator'	=> array(
			'_'	=> new _Validator(),
			'pictcha'	=> $pictcha,
#			'login'	=> array($_['api']['sfm'],'validate__form__forgot_pw')
		),
		'validation_map'	=> array(
			'user--username'	=> array(
				'coords' => array('user','username'),
				'v' => 'required'
			),
/*
			'user--password'	=> array(
				'coords' => array('user','password'),
				'v' => 'required'
			)
*/
			'user--ip'	=> array(
				'coords'	=> array('user','ip'),
				'v'	=> array('domestic')
			)
		)
	));
	
	echo $this->header(); ?>
	
	<div class="_-wrapper _-page _-page--sub _-page--log-in _-page--<?php echo $this->slug.(!empty($this->matches) && !empty($this->matches[1]) ? ' _-page--'.$this->matches[1].' _-page--'.$this->slug.'--'.$this->matches[1] : ''); ?>" data-_="page" data-_-slug="<?php echo $this->slug; ?>">
		<div class="_-bg--noise"></div>
		<div class="_-page--sub--content _-page--content">
			<div class="_-gallery--wrapper _-gallery--sub--wrapper">
				<nav class="_-gallery--nav slides-navigation">
					<a href="#" class="_-gallery--nav--next next">&raquo;</a>
					<a href="#" class="_-gallery--nav--prev prev">&laquo;</a>
				</nav>

				<ul class="_-gallery _-gallery--<?php echo $this->slug; ?> _-gallery--slider slides-container" data-_-gallery-init="false">
					<li class="_-gallery--slide _-gallery--item _-gallery--item--log-in" data-slug="<?php echo $this->slug; ?>/log-in">
						<div class="_-gallery--item--text">
							<h2 class="_-gallery--slide--title"><?php echo (isset($_['get']['reset']) ? 'Reset Password' : 'Forgot Password'); ?></h2><?php
							
							if((!empty($_['post']['_submit']) || !empty($_['post']['pictcha'])) && $form->submit($_['post'])){

								echo $form->success();
								
							}else{ ?>
							
								<h3 class="_-gallery--slide--subtitle"><?php
								
									if(isset($_['get']['noauth'])){ ?>
									
										Please log in to view this page:<?php
									
									}else{ ?>
									
										Please enter your username or call letters to reset your password:<?php
										
									} ?></h3><?php
								
								echo $form;
								
							} ?>

						</div>
					</li>
				</ul>
			</div>
		</div>
	</div><?php #._-page._-wrapper ?>
<?php echo $this->footer(); ?>