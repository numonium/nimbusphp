<?php
	/* juniper/mod/fancybox - lightbox variant - "fancybox"
		(juniper + nimbus) (c) 2012+ numonium //c - all rights reserved */
	
	$this->slug = 'xfancybox';
	
	$this->css = _array_merge($this->css,array(
		$this->slug => 'css/_.css'
	));
	
	$this->fonts = _array_merge($this->fonts,array(
//		'led'	=> 'LED'
	));
	
	$this->js=_array_merge($this->js,array(
#		'lib' => array('/js/jquery-mousewheel.js'),
		$this->slug => 'js/_.js'
	));
	
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
	
//		_.cfg.fancybox.options = _.array.merge_recursive(_.cfg.fancybox.options, __OPTIONS__);
	
		if(jQuery){
			(function($){
				$(document).ready(function(){
					
					$('.fancybox, ._-lightbox, [rel="fancybox"]').not('[data-_-fancybox-skip]').fancybox({
/*					    openMethod:'slideIn',
					    openSpeed:400,
					    closeMethod:'slideOut',
					    closeSpeed:400*/
					});
					
				});
			})(jQuery);
		}<?php
		
	$this->js['+'][]=ob_get_clean();

?>