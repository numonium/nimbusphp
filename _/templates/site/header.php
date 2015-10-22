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
			// 'font-slug'	=> '/fonts/font-slug/_.css'
		),
		'design' =>'/design/css/_.css', #~EN: template/local css
	);
	
	if(_User::logged_in()){
		$css['admin'] = '/design/css/admin.css';
	}
	
	$this->add_css($css);

	$this->add_js(array(
		'package'	=> 'jquery'
	));

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
		
		ga('create', 'UA-00000000-1', 'auto');
		ga('send', 'pageview');
		
		// } google analytics<?php
			
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
	<![endif]-->
	
</head>
<body class="<?php echo $this->body_class(); ?>">
	<header class="_-chrome--header"></header>