<?php
	/* juniper/mod/ckedtior - an html -> rich-text wysiwyg (what you see is what you get) editor
		(juniper + nimbus) (c) 2012+ numonium //c - all rights reserved */
	
	$this->css = _array_merge($this->css,array(
		'ckeditor' => 'css/_.css'
	));
	
	$this->fonts = _array_merge($this->fonts,array(
//		'led'	=> 'LED'
	));
	
	$this->js=_array_merge($this->js,array(
		'lib' => array(
#			'/js/jquery.js'
//			'/js/_.js',
//			'js/_.js',
		),
//		'ckeditor' => '/_/mod/min/f=_/mod/ckeditor/js/_.js'
		'ckeditor' => 'js/ckeditor.js'
	));
	
	$callbacks = array();
	
	// callback for "save" button
	ob_start(); ?>
	
	function(obj,json){
		_.log('-img[upload]',obj,event,this);
		alert('asd');
	}<?php
	
	$callbacks['_img-upload'] = ob_get_clean();
	
	$this->options = _array_merge($this->options,array(
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

	));
	
	ob_start();	?>
//		_.cfg.ckeditor.options = _.array.merge_recursive(_.cfg.ckeditor.options, __OPTIONS__);



		if(jQuery){
			
			(function($){
				
				$(document).ready(function(){
				
					$('form ._-input--wysiwyg').each(function(i,ele){
						
						_.ui.editors.ckeditor.fn.init(ele, __OPTIONS__);
						
					});
					
				});
				
			})(jQuery);
			
		}<?php
		
	$this->js['+'][]=ob_get_clean();

?>