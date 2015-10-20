<?php
	/* juniper/mod/gmaps - embed custom google map + infobox
		(juniper + nimbus) (c) 2012+ numonium //c - all rights reserved */
	
	$this->slug = 'gmap';
	
	$this->css = _array_merge($this->css,array(
		$this->slug => 'css/_.css'
	));
	
	$this->fonts = _array_merge($this->fonts,array(
//		'led'	=> 'LED'
	));
	
	$this->js=_array_merge($this->js,array(
		'lib' => array(

		),
		$_['cfg']['api']['google']['_']['url'],
		$this->slug.'--infobox' => 'js/03.google.maps.infobox.js',
		$this->slug => 'js/_.js',
	));
	
	$callbacks = array();
	/*	
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

	));*

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
			
		}

		
		<?php
		
	$this->js['+'][]=ob_get_clean(); */

?>