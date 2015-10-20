<?php
	/* juniper/lib/model/type - model used for uuid to class-name translation
		(juniper + nimbus) (c) 2012+ numonium //c - all rights reserved	
		
		+ TODO - perhaps make a mini-db class that just fetches info from the database
	*/

	global $_;
	
	class _Type extends _Model {
		var $id;
		var $uuid;
		var $name; //binding to particular presenter
		var $slug;
		var $className;
		var $mime;

		function __construct($args,$force_init=true){
			global $_;
			
			parent::__construct($args,$force_init);
		}

		function __get($var){
			return parent::__get($var);
		}
		
		function is($class){
			if(empty($class) || empty($this->className)){
				return false;
			}
			
			if(is_object($class)){
				$class = _get_class($class);
			}
			
			return (strtolower($class) == strtolower($this->className)) || ($class == $this->uuid);
		}
	
	}
?>
