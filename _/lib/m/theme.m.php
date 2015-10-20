<?php
	/* juniper/lib/model/theme - model for themes (color swatches)
		(juniper + nimbus) (c) 2012+ numonium //c - all rights reserved	
	*/

	global $_;
	
	class _Theme extends _Model {
	
		function __construct($data='',$force_init=true){
			global $_;
			
			parent::__construct($data,$force_init);
			
			if(empty($this->dir) || !is_array($this->dir)){
				$this->dir=array();
			}
			
			if(!empty($this->slug) && is_dir(_dir($_['.'].$_['/']['themes'].'/'.$this->slug))){
				$this->dir['.']=$_['/']['themes'].'/'.$this->slug;
				$this->dir['/']=$_['.'].$this->dir['.'];
			}			
		}
		
		function __get($var){
			switch($var){
				case 'templates':
					return $this->templates();
					break;
				default:
					return parent::__get($var);
					break;
			}
		}
		
		function templates(){ //we need to make this a function to prevent recursion
			global $_;
			
			if($templates=$_['db']->getAll('templates-themes',array('theme-id' => $this->id))){
				foreach($templates as $tkey=>&$template){
					if(!empty($template['theme']['id'])){
						$template['template'][FETCH_FROM_DB]=true;
						$templates[$tkey]=new _Template($template['template']);
					}
				}
				return $templates;
			}
			
			return false;
		}
	}
?>
