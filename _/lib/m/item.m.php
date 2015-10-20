<?php
	/* juniper/lib/model/item - description for generic items
		(juniper + nimbus) (c) 2012+ numonium //c - all rights reserved	
	*/

	global $_;
	
	class _Item extends _Model {
		var $id;
		var $uuid;
		var $name;
		var $slug;
		var $type;
		var $company;
		var $site;
		var $last;
		var $presenter; //binding to particular presenter

		function __construct($args,$force_init=true){
			global $_;
			
			$this->last = array();
			
			parent::__construct($args,$force_init);
			
			if(empty($this->site) && !empty($_['site'])){
				$this->site = &$_['site'];
			}
			
			if(empty($this->company) && !empty($_['site']->company) && is_object($_['site']->company)){
				$this->company = &$_['site']->company;
			}
		}

		function __get($var){
			return parent::__get($var);
		}
		
		function save(){
			global $_;
			
			if(!empty($_['user'])){
				$this->last['edited']['user'] = &$_['user'];
				
			}
			
			if(is_subclass_of($this,get_class())){ // _Properties will be a subclass of _Item, but _Items will not
				if(isset($this->id) && empty($this->id)){
					unset($this->id);
				}
				
				$obj = get_object_vars($this);
				unset($obj['className']);
				
				$item = new _Item($obj,false);
				
				if(empty($item->id)){
					$item->id = null;
				}

				if($item->save()){
					$this->item = $item;
				}
				
				$ret = parent::save();
			}else{			
				$ret = parent::save();
			}
			
			return $ret;
		}
	
	}
?>
