<?php
	global $_;
	
	
	if(!isset($_['tmp']['pages'])){
		$_['tmp']['pages'] = array();
	}
	
	$_['tmp']['pages'] += array(
		'contact'	=> new _Page(array(
			FETCH_FROM_DB	=> true,
			'slug'			=> 'contact'
		)),
		'login'	=> new _Page(array(
			FETCH_FROM_DB	=> true,
			'slug'			=> 'log-in'
		)),
		'logout'	=> new _Page(array(
			FETCH_FROM_DB	=> true,
			'slug'			=> 'log-out'
		))
	);
	
	if(!empty($_['ajax'])){
		return;
	}
	
	echo $_['doctypes']['html5']."\n";
	
?>
<html id="<?php echo $_['site']->uuid; ?>" class="env[<?php echo $_['env']['context']; ?>] _-no--js" xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en" data-_-js="0" data-_-build="<?php echo $_['env']['build']; ?>">
<head>
	<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
	<meta name="format-detection" content="telephone=no" />
	<title>__TITLE__</title><?php
	$css = array(
		'_' => '/css/_.css', #~EN: main/common/global css
#		'fx' => '/css/fx.css', #~EN: main/common/global css
#		'theme' => '/theme/css/_.css',  #~EN: theme/local css
		'ui'	=> '/design/css/jquery-ui.css',
		'font' => array(
			'sfm-icons-v2'	=> '/fonts/sfm-icons-v2/_.css',
			'exo' => '/fonts/exo/_.css',
			'quicksand'	=> '/fonts/quicksand/_.css'
		),
		'/design/css/jquery.superslide.css',
//		'/design/css/jquery.jscrollpane.css',
		'design' =>'/design/css/_.css', #~EN: template/local css
	);
	
	if(_User::logged_in()){
		$css['admin'] = '/design/css/admin.css';
	}
	
	$this->add_css($css);

	$this->add_js(array(
		'package'	=> 'jquery'
	));
	
/*	$this->add_js(array(
		'package'	=> 'x'
	));*/
	
	$this->add_js(array(
		'package'	=> '_'
	));

	if(!empty($_['env']['contexts']['live'])){
	
		ob_start(); ?>
	
		// google analytics {
				
		(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
		
		ga('create', 'UA-37176957-1', 'auto');
		ga('send', 'pageview');
		
		// } google analytics
		
		// facebook pixel tracker {		  
		  
		(function() {
		var _fbq = window._fbq || (window._fbq = []);
		if (!_fbq.loaded) {
		var fbds = document.createElement('script');
		fbds.async = true;
		fbds.src = '//connect.facebook.net/en_US/fbds.js';
		var s = document.getElementsByTagName('script')[0];
		s.parentNode.insertBefore(fbds, s);
		_fbq.loaded = true;
		}
		})();
		window._fbq = window._fbq || [];
		window._fbq.push(['track', '6022437575681', {'value':'0.00','currency':'USD'}]);
		
		// } facebook pixel tracker<?php
			
		$this->add_js(array(
			'+'			=>  ob_get_clean()
		));
		
	}
	
	$this->module('scrollbars');
	
	if(!empty($_['tmp']['mod'])){
		foreach($_['tmp']['mod'] as $mkey => $mod){
			$this->module($mod);
		}
	} ?>

	<link rel="shortcut icon" href="/design/img/icons/favicon.ico" mce_href="/design/img/icons/favicon.ico" /><?php
		
	if(!empty($this->href)){ ?>
	
		<link rel="canonical" href="<?php echo $this->href; ?>" /><?php
		
	} ?>
	
	<!--[if lt IE 9]>
		<script src="//cdnjs.cloudflare.com/ajax/libs/html5shiv/r29/html5.min.js"></script>
	<![endif]--><?php
		
	if(!empty($_['env']['contexts']['live'])){ ?>
	
		<noscript><img height="1" width="1" alt="" style="display:none" src="https://www.facebook.com/tr?ev=6022437575681&amp;cd[value]=0.00&amp;cd[currency]=USD&amp;noscript=1" /></noscript><?php
			
	} ?>
	
</head>
<body class="<?php echo $this->body_class(); ?>">
	<header class="_-chrome--header">
		<div class="_-chrome--header--inner">
			<ul class="_-chrome--header--nav _-nav">
				<li class="_-nav--item _-nav--item--logo">
					<a class="_-chrome--header--logo _-logo" href="/">
						<span class="_-icon">
							<span class="_-icon--img--wrapper">
								<span class="_-icon--img--wrapper2">
									<img src="/design/img/icons/header-logo-lg.png" height="100%" />
								</span>
							</span>
							<span class="_-bg"></span>
						</span>
						<span class="_-text">
							<span class="_-text--text">Sun &amp; Fun Media &mdash; Sales and Programming Solutions for Radio &mdash; 100% Barter</span>
						</span>
					</a>
				</li>
				<li class="_-nav--item _-nav--item--contact"><a href="<?php echo $_['tmp']['pages']['contact']->href/*.(!empty($_['const']['sections'][$this->slug]) ? $this->href : '')*/; ?>"><span class="_-icon"></span><span class="_-text">Contact Us</span></a></li><?php
				
				if(_User::logged_in()){ ?>

					<li class="_-nav--item _-nav--item--log-out"><a href="<?php echo $_['tmp']['pages']['logout']->href; ?>"><span class="_-icon"></span><span class="_-text">Log Out</span></a></li><?php
					
				}else{ ?>
				
					<li class="_-nav--item _-nav--item--log-in"><a href="<?php echo $_['tmp']['pages']['login']->href.(!empty($_['const']['sections'][$this->slug]) ? $this->href : ''); ?>"><span class="_-icon"></span><span class="_-text">Log In</span></a></li><?php
					
				} ?>

			</ul>
		</div><?php #._-chrome--header--inner
			
		if($this->page_is_admin()){ ?>
		
			<script type="text/javascript"> _.admin._ = true; </script>
			<section class="_-chrome--header--status--wrapper">
				<div class="_-bg--noise"></div>
				<div class="_-chrome--header--status">
					<span class="_-icon _-icon--shield"><span class="_-icon _-icon--font--shield"></span></span>
					<h2><?php echo $_['api']['sfm']->page_admin_header_status(); ?></h2>						
				</div>
			</section><?php
				
		} ?>
	</header>