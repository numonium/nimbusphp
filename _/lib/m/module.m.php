<?php
	/* juniper/lib/model/module - model for modules
		(juniper + nimbus) (c) 2012+ numonium //c - all rights reserved	
	*/

	global $_;
	
	class _Module extends _Model {
		var $css;
		var $dir;
		var $fonts;
		var $html;
		var $js;
		var $options;
		var $init;
		
		function __construct($data='',$force_init=true){
			global $_;
			
			if(!is_array($data)){
				$data=array('slug' => $data);
			}
			
			parent::__construct($data,$force_init);
			
			if(is_dir(_dir($_['.'].$_['/']['mod'].'/'.$this->slug))){
				$this->dir=array(
					'.' => $_['/']['mod'].'/'.$this->slug
				);
				
				$this->dir['/']=_dir($_['.'].'/'.$this->dir['.']);
			}
			
			foreach(array('css','fonts','js') as $akey=>$asset){
				if(!empty($this->$asset) || !_is_array($this->$asset)){
					$this->$asset=array();
				}
			}
			
			if(!empty($this->dir['/']) && $file=_file_exists(_dir($this->dir['/'].'/_.php'))){
				ob_start();
				require($file);
				$this->html=ob_get_clean();
				unset($file);
			}
		}
	}
?>
