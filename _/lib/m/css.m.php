<?php
	/* juniper/lib/model/css - model for css declarations, attributes, rendering, etc
		(juniper + nimbus) (c) 2012+ numonium //c - all rights reserved	
	*/

	global $_;

	_define('CSS_SELECTOR_INLINE','_inline');
	
	class _CSS extends _Model {
		var $selector;
		var $attrs;
		var $ver;
		var $compatibility; //automatically insert compatible code for different web browsers
		var $file;
		var $content; //for use with files
		
		function __construct($data='',$ver=2.1){
			global $_;

			if(is_array($data)){
				if(!empty($data['selector']) && is_array($data['selector'])){
					$this->selector=implode(",\n",$data['selector']);
					unset($data['selector']);
				}else if(!empty($data['selector'])){
					$this->selector=$data['selector'];
					unset($data['selector']);
				}else if(!empty($data['file'])){
					if($file=_file_exists($data['file'])){
						$this->file=$file;
						ob_start();
						require_once($file);
						$this->content=ob_get_clean();
						unset($data['file']);
					}
				}else{
					$this->selector=CSS_SELECTOR_INLINE;
				}
				foreach($data as $key=>$val){
					$this->attrs[strtolower($key)]=$val;
				}
			}
			
			$this->ver=$ver;
			if(!isset($this->compatibility)){
				$this->compatibility=true;
			}
		}
		
		public static function uglify($content=''){
			global $_;
			

		}
	}
?>