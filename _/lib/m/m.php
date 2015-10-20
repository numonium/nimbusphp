<?php
	/* juniper/lib/model - basic model (abstract class)
		(juniper + nimbus) (c) 2012+ numonium //c - all rights reserved	
	*/

	global $_;
	
	class _Model extends _ {
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
			global $_;
			
			$tbl = $_['db']->getTableName($this);
			
			if(!empty($this->uuid)){
				return $_['db']->delete($tbl,array('uuid' => $this->uuid));
			}else if(!empty($this->id)){
				return $_['db']->delete($tbl,array('id' => $this->id));
			}
			
			return false;
		}
		
		function del(){
			return $this->delete();
		}
	
	}
?>
