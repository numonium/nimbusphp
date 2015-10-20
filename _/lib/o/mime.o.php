<?php
	/* juniper/lib/o/mime basic construct for MIME-type requests
		juniper + nimbus © 2010+ numonium //c - all rights reserved	
	 */

	global $_;
	 
	class _Mime extends _{
		var $type;
		var $ext;
		
		function __construct($args=''){
			global $_;
			if(is_array($args)){
				$this->init($args,'',true);
			}else{
				$args=strtolower($args);
				foreach($_['mime'] as $key=>$m){
					if($key==$args || $m->type==$args || $m->ext==$args){
						$this->init($m);
					}
				}
				if(strpos($args,'/')!==false){
					$this->type=$args;
				}else{
					$this->ext=$args;
				}
			}
		}
		
		function __get($name){
			if($name=='extension')
				return $this->ext;
		}
		
		function __toString(){
			return (is_array($this->type) ? $this->type[0] : $this->type);
		}
		
		function is($type){
			global $_;
			if($type=='')
				return $false;

			if(is_object($type) && get_class($type)==get_class($this)){
				return (!empty($type->type) && (strtolower($type->type)==strtolower($this->type)));
			}

			$type=strtolower($type);
			foreach($_['mime'] as $key=>$m){
				if($type==$key || $m->type==$type)
					return true;
			}
			
			return false;
		}
		
		public static function file_content_type($file){
			if($file=_file_exists($file)){
				return mime_content_type($file);
			}
			
			return false;
		}
	}
	
	if(!function_exists('mime_content_type')){
		function mime_content_type($f){
			$f=escapeshellarg($f);
			return trim (`file -bi $f`);
		}
	}
	
	require_once('lib/inc/mime.php');
?>