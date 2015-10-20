<?php
	/* juniper/mod/shadowbox - better lightbox -> "shadowbox"
		(juniper + nimbus) (c) 2012+ numonium //c - all rights reserved */
	
	$this->css = _array_merge($this->css,array(
		'shadowbox' => 'css/_.css'
	));
	
	$this->fonts = _array_merge($this->fonts,array(
//		'led'	=> 'LED'
	));
	
	$this->js=_array_merge($this->js,array(
#		'lib' => array('/js/jquery.js'),
		'shadowbox' => 'js/_.js'
//		'shadowbox'	=> '/_/mod/min/f=_/mod/shadowbox/js/_.js'
	));
	
	$this->options = array(
		'handleUnsupported'	=> 'link'
	);
	
	/*
	$this->options = _array_merge($this->options,array(
//		'css' => _dir($this->dir['.'].'/css/wym.css'),
#		'air'			=> true,
		'autoresize'	=> false,
		'resize'		=> false,
		'imageUpload'	=> '/admin/img/add',
		'buttonsAdd'	=> array('_save', '_cancel'),
//		'auto-start' => false,
//		'sign'	=> '+',
//		'start' => 'user'

	)); */

	ob_start();	?>
	
		Shadowbox.init(__OPTIONS__);<?php
		
	$this->js['+'][]=ob_get_clean();

?>