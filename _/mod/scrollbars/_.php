<?php
	/* juniper/mod/scrollbars - javascript scrollbars
		(juniper + nimbus) (c) 2012+ numonium //c - all rights reserved */
	
	$this->slug = 'scrollbars';
	
	$this->css = _array_merge($this->css,array(
		$this->slug => 'css/_.css'
	));
	
	$this->fonts = _array_merge($this->fonts,array(
//		'led'	=> 'LED'
	));
	
	$this->js=_array_merge($this->js,array(
		$this->slug => 'js/_.js'
	));
	
/*	$callbacks = array();
	
	// callback for "save" button
	ob_start(); ?>
	
	function(obj,json){
		_.log('-img[upload]',obj,event,this);
		alert('asd');
	}<?php
	
	$callbacks['_img-upload'] = ob_get_clean();*/
	
/*	$this->options = _array_merge($this->options,array(
//		'css' => _dir($this->dir['.'].'/css/wym.css'),
#		'air'			=> true,
		'autoresize'	=> true,
		'resize'		=> false,
		'imageUpload'	=> '/admin/img/add',
		'bodyClass'		=> '_-wsyiwyg CKEditorInputArea CKEditorGeneratedContent RTEGeneratedContent',
//		'buttonsAdd'	=> array('_save', '_cancel'),
//		'auto-start' => false,
//		'sign'	=> '+',
//		'start' => 'user'

	));/*/
	
	ob_start();
		
	$this->js['+'][]=ob_get_clean();

?>