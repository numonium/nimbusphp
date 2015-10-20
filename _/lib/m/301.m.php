<?php
	/* juniper/lib/model - basic model (abstract class)
		(juniper + nimbus) (c) 2012+ numonium //c - all rights reserved	
	*/

	global $_;
	
	class _301 extends _Model {
		var $id;
		var $uuid;
		var $presenter; //binding to particular presenter

		function __construct($args,$force_init=true){
			global $_;
			
			parent::__construct($args,$force_init);
			
			$this->remove_from_db(array('presenter','tbl'));
		}

		function __get($var){
			return parent::__get($var);
		}
	
		
		function delete(){
			return parent::delete();
		}
		
		function del(){
			return $this->delete();
		}
	
	}
?>
