<?php
	/* juniper/lib/model - basic model (abstract class)
		(juniper + nimbus) (c) 2012+ numonium //c - all rights reserved	
	*/

	global $_;
	
	class _Group extends _Model {
		var $id;
		var $uuid;
		var $presenter; //binding to particular presenter
		var $auth_level;

		function __construct($args,$force_init=true){
			global $_;
			
			parent::__construct($args,$force_init);
			
			$this->remove_from_db(array('presenter','tbl'));
		}

		function __get($var){
			return parent::__get($var);
		}
		
		public static function all($args=''){
			global $_;
			
			if($groups = $_['db']->getAll('groups')){
				
				foreach($groups as $gkey => &$group){
					$group = new _Group(array(
						FETCH_FROM_DB => true,
						'uuid'	=> $group['uuid']
					));
				}
				
				return $groups;
			}
			
			return false;
		}
	
	}
?>
