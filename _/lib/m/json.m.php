<?php
	/* juniper/lib/model/json - model for javascript objects
		(juniper + nimbus) (c) 2012+ numonium //c - all rights reserved	
	*/

	global $_;

	_define('CSS_SELECTOR_INLINE','_inline');
	
	class _JSON extends _Page{
		var $data;
		var $content; //for use with files
		
		function __construct($args=false,$force_init=true){
			global $_;
			
			parent::__construct($args,$force_init);
			$this->mime = $_['mime']['json'];
		}
		
		function __toString(){
			return $this->encode();
		}
		
		function encode($data=false){
			if(empty($data)){
				$data = $this->data;
			}
			
			return (!empty($data) ? json_encode($data) : false);
		}
		
		function decode($str){
			if(empty($str)){
				return false;
			}
			
			return json_decode($str);
		}
	}
?>