<?php
	/* juniper/mod/lightbox - standard lightbox -> "lightbox 2"
		(juniper + nimbus) (c) 2012+ numonium //c - all rights reserved */
	
	$this->css = _array_merge($this->css,array(
		'lightbox' => 'css/_.css'
	));
	
	$this->fonts = _array_merge($this->fonts,array(
//		'led'	=> 'LED'
	));
	
	$this->js=_array_merge($this->js,array(
#		'lib' => array('/js/jquery.js'),
		'lightbox' => '/_/mod/lightbox/js/_.js'
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

	));

	ob_start();	?>
//		_.cfg.wysiwyg.options = _.array.merge_recursive(_.cfg.wysiwyg.options, __OPTIONS__);
		
		/*
	
		if(jQuery){
			(function($){
				$(document).ready(function(){

//					_.ui.editors.wysiwyg.fn.init(false,__OPTIONS__);
//					_.ui.editors.wysiwyg.fn.init(false,{css : '<?php echo _dir($this->dir['.'].'/css/wym.css'); ?>'});

				})
			})(jQuery);
		}* /<?php
		
	$this->js['+'][]=ob_get_clean();*/

?>