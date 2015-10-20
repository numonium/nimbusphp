<?php
	/* juniper/lib/model/list - description for lists (typically for auto-complete)
		(juniper + nimbus) (c) 2012+ numonium //c - all rights reserved	
	*/

	global $_;
	
	class _List extends _Model {
		var $id;
		var $uuid;
		var $presenter; //binding to particular presenter

		function __construct($args=false,$force_init=true){
			global $_;
			
			if(is_string($args)){
				$args = array('type' => $args);
			}
			
			parent::__construct($args,$force_init);
						
		}

		function __get($var){
			return parent::__get($var);
		}
	
	}
?>
