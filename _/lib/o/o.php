<?php
	/* juniper/lib/class - main class definition for nimbus
		juniper + nimbus © 2010+ numonium //c - all rights reserved	
	*/

	global $_;
	
	class _ {
		var $name;
		var $slug;
		var $id;
		var $uuid;
		var $className; //class name for dynamic instantiation
		var $excl_from_db; //fields to exclude from db
		var $x;
		var $found; //has been found in db?
		var $cemented; // new objects -> have been cemented?
		
		function __construct($data='',$force_init=true){
			global $_;
			
			$this->found = $this->cemented = false;
			
			if(empty($this->excl_from_db) || !is_array($this->excl_from_db)){
				$this->excl_from_db = array();
			}

			$this->remove_from_db(array('cfg','dir','x','excl_from_db','className','presenter','found','cemented'));
			
			if(is_array($data) && isset($data[FETCH_FROM_DB])){ //retr from DB
			
				//determine table name
				if(!empty($data[FETCH_FROM_DB]['table'])){
					$tbl=$data[FETCH_FROM_DB]['table'];
				}else if(!empty($data[FETCH_FROM_DB]['tbl'])){
					$tbl=$data[FETCH_FROM_DB]['tbl'];
					$data[FETCH_FROM_DB]['table']=$data[FETCH_FROM_DB]['tbl'];
					unset($data[FETCH_FROM_DB]['tbl']);
				}else if(isset($data[FETCH_FROM_DB]) && $data[FETCH_FROM_DB]!==false){
					unset($data[FETCH_FROM_DB]);
#					var_dump('$##',$_['db']->where($data));
					if($obj=$_['db']->getSingle($_['db']->getTableName($this),$_['db']->where($data))){
						$this->init($obj,'',true);
						return;
					}else{
						$this->init($data,'',true);
						$this->_db = false;
					}
				}else{
					$tbl=get_class($this);
				}
				
/*				if(count($data[FETCH_FROM_DB])>0){
					$this->load($data);
				}else{*/
					$this->load($_['db']->getSingle($_['db']->getTableName($this)));
#				}

				$this->found = $this->cemented = true;
			}else if(is_array($data)){ //all args given in $data
				$this->init($data,false,$force_init);
			}else{
				$this->load($data); //single arg given (id/name/slug) to retr from db
			}

			
			if(empty($this->uuid)){
				$this->uuid=uuid(get_class($this));
			}
			
			if(empty($this->className)){
				$this->className = get_class($this);
			}

			if(empty($this->slug)){
				if(!empty($this->name)){
					$this->slug = slug($this->name);
				}else if(!empty($this->title)){
					$this->slug = slug($this->title);
				}else if(!empty($this->uuid)){
					$this->slug = &$this->uuid;
				}
			}
			
			if(!$this->found && !isset($this->id)){
				$this->id = false;
			}
			
			if(empty($this->x)){
				$this->x = array();
			}
			
			$_['@'][$this->uuid] = &$this;
		}
		
		function __get($var){
			if(property_exists($this,$var))
				return $this->$var;
			else if(isset($this->x[$var]))
				return $this->x[$var];
			else
				return false;
		}
		
		function __set($var,$val){
			if(property_exists($this,$var)){
				$this->$var=$val;
			}else{
				$this->{$var}=$val;
//				$this->x[$var]=$val;	
			}
			
			if($var == 'name'){
				$this->slug = slug($this->$var);
			}
		}
		
		function __isset($var){
			if(property_exists($this,$var))
				return isset($this->$var);
				
			return isset($this->x[$var]);
		}
		
		function __unset($var){
			if(property_exists($this,$var))
				unset($this->$var);
			else
				unset($this->x[$var]);
		}
		
		// "adds" a field to database (actually removes it from field blacklist $this->excl_from_db)
		function add_to_db($args){
			global $_;
			
			if(empty($this->excl_from_db)){
				$this->excl_from_db = array();
			}
			
			if(empty($args)){
				return false;
			}
			
			if(!is_array($args)){
				if(is_object($args)){
					$args = get_object_vars($args);
				}else{
					$args = array($args);
				}
			}
			
			foreach($args as $akey => $arg){
				if($i = array_search($arg,$this->excl_from_db)){
					unset($this->excl_from_db[$i]);

					return true;
				}
			}
			
			return false;

		}
		
		function init($args,$obj='',$force=false){
			if(is_object($args)){
				$args=get_object_vars($args);
			}
			if(_is_array($args)){
				foreach($args as $key=>$arg){
					if(is_object($obj) && (($force===false && property_exists($obj,$key)) || $force===true)){
						$obj->$key=$arg;
					}else if(property_exists($this,$key) || $force!==false){
						$this->$key=$arg;
					}
				}
			}
		}
		
		function clear(){
			foreach($this as $key=>$o){
				if(!in_array($key,array_merge($this->excl_from_db,array('className')))){
					$this->$key=null;
				}
			}
			//we need to find a better place for 
		}
		
		function load($args=''){
			global $_;
			
			$name=(!empty($this->className) ? $this->className : get_class($this));
			$table=$_['db']->getTableName($name);
			$where=(
				(
					//check to see if "site-id" field exists and restrict to site
					$_['db']->fieldExists($table,'site-id') ? "`site-id`='".$_['site']->id."' and (" : ''
				).
				(
					//throw in hard-coded from $args
					is_array($args) && !empty($args['_where']) ? $args['_where'] : '1=1'
				).
				(
					//close parenthesis
					$_['db']->fieldExists($table,'site-id') ? ")" : ''
				)
			);
			
			$fields=(is_array($args) && !empty($args['_fields']) ? $args['_fields'] : WILDCARD);
			$order=(is_array($args) && !empty($args['_order']) ? $args['_order'] : '');
			
			if(isset($args[FETCH_FROM_DB]) && _is_array($args[FETCH_FROM_DB])){ //create new objects using database defaults (not likely)
				$data=$_['db']->describe($args[FETCH_FROM_DB]['table']);
				$obj=array();
				foreach($data as $key=>$field){
					if(is_array($field) && !in_array($field['Default'],array('CURRENT_TIMESTAMP'))){
						$obj[$field['Field']]=$field['Default'];
					}
				}
				$this->init($obj,null,true);
				if(empty($obj->className)){ //shouldn't be necessary
					$this->className=tabletoclass($args[FETCH_FROM_DB]['table']);
				}
/*			}else if($args==WILDCARD || (is_array($args) && $args['_view']==WILDCARD)){ //also not likely
				if($_['db']->tableExists($table) && $_['db']->numRows($table,$where,$fields,$order)>0){
					//fetch all rows of a particular object
					$data=$_['db']->getAll($table,$where,$fields,$order);
#					if($_['db']->numRows($table,$where,$fields,$order)==1){
#						$data=array($data);
#					}
					
					$cname=(!empty($this->className) && class_exists($this->className) ? $this->className : (get_parent_class($this)!==false ? get_top_class($this) : get_class($this)));

					foreach($data as $key=>$row){
						$this->obj[$key]=new $cname($row);
						if(get_class($this->obj[$key])==get_top_class($this)){
							$this->obj[$key]->init($row,false,true); //force obj to init
							if(empty($this->obj[$key]->className))
								$this->obj[$key]->className=$this->className;
						}
					}
				}*/
			}else if(!empty($args)){
				
				if(is_array($args)){
					
					if(!empty($args['slug'])){
						$args = $_['db']->escape($args['slug']);
					}else if(!empty($args['id'])){
						$args = $_['db']->escape($args['id']);
					}
					
				}else{
					$args = $_['db']->escape($args);
				}
				
				$table=$_['db']->getTableName($this);
				if($_['db']->tableExists($table)){
					//build numRows query
					$q=(
						(
							//get global assets and for specific site
							$_['site']->id > 0 ? "(`site-id`='0' or `site-id`='".$_['site']->id."') and (" : '' 
						).
						(
							//if numeric, $args -> id
							is_numeric($args) ? "id='".$args."' or " : ''
						).
						( !empty($args) ?
							//otherwise, $args -> name or slug
							( is_array($args) ?
								(!is_array($args['name']) ? "lower(name)='".strtolower($args['name'])."' or " : '') . "lower(slug)='".strtolower(!empty($args['slug']) ? $args['slug'] : $args['name'])
								: "lower(name)='".strtolower($args)."' or lower(slug)='".strtolower($args)
							)."'"
						  : '1'
						).
						(
							//close parenthesis
							$_['site']->id > 0 ? ")" : ''
						)
					);
				 	if($_['db']->numRows($table,$q)>0){ 
						$this->init($_['db']->getSingle($table,$q),'',true);
					}else if(!empty($this->slug)){ //try again for $this->slug (not likely)
						$q=(
							(
								//get global assets and for specific site
								$_['site']->id > 0 ? "(`site-id`='0' or `site-id`='".$_['site']->id."') and (" : '' 
							).
							(
								//try $this->slug
								"lower(slug)='".strtolower($this->slug)."'"
							).
							(
								//close parenthesis
								$_['site']->id > 0 ? ")" : ''
							)
						);
					 	if($_['db']->numRows($table,$q)>0){ 
							$this->init($_['db']->getSingle($table,$q),'',true);
						}
					}
				}			
			}
		}
		
		// removes field/var from obj before submitting/saving to db
		function remove_from_db($args=''){
			global $_;
			
			if(empty($this->excl_from_db)){
				$this->excl_from_db = array();
			}
			
			if(empty($args)){
				return false;
			}
			
			if(!is_array($args)){
				if(is_object($args)){
					$args = get_object_vars($args);
				}else{
					$args = array($args);
				}
			}
			
#			$this->excl_from_db += $args;
#			$this->excl_from_db = array_unique($this->excl_from_db);
			$this->excl_from_db = array_unique(array_merge($this->excl_from_db,$args));
			
			return true;
			
		}

		/* ~EN (2015): rebase this object off of given obj's id / uuid */
		function rebase($obj){
			if(empty($obj) || !is_object($obj)){
				return false;
			}

			if(isset($obj->id)){
				$this->id = $obj->id;
			}

			if(isset($obj->uuid)){
				$this->uuid = $obj->uuid;
			}

			return true;
		}
		
		function save($args=''){
			global $_;
			
			if(!empty($args)){ //"save as" UUID (it's better to just save by ID, rather than asking for slug or name)
				$uuid = $id = false;
				$index = 'id';
				if(_is_array($args) && !empty($args['uuid'])){
					$uuid = $args['uuid'];
					$index = 'uuid';
				}else if(_is_array($args) && !empty($args['id'])){
					$id = $args['id'];
				}else{
					$id = $args;
				}
				
				$args=$_['db']->escape($args);
				$tbl=$_['db']->getTableName($this);

				if($_['db']->tableExists($tbl) && ($row = $_['db']->getSingle($tbl,array($index => ($uuid ? $uuid : $id))))){ //does row exist? -> update

					foreach($row as $key=>$val){
						if(property_exists($this,$key))
							$row[$key]=(is_object($this->$key) ? serialize($this->$key) : $this->$key);
					}
					
					$_['db']->update($tbl,$row,"id='".$row['id']."'");
					
				}else if($_['db']->tableExists($tbl)){ //otherwise, new row -> insert
					$row=get_object_vars(array_flatten($this));
					//we don't want to accidentally overwrite an id in the db, let sql handle that
					if(!empty($row['id']))
						unset($row['id']);
						
					$this->id=$_['db']->insert($tbl,$row);
				}
			}else{ //regular commit to DB
				$tbl=$_['db']->getTableName($this);
				unset($this->className);
				/* 
				$this->excl_from_db = array_unique($this->excl_from_db);
				
				$excl = array();
				if(!empty($this->excl_from_db) && _is_array($this->excl_from_db)){
					foreach($this->excl_from_db as $field){
						$excl[$field] = true;
					}
				}else if(!empty($this->excl_from_db)){
					$excl[] = $this->excl_from_db;
				}*/
				
				$obj = array_flatten(get_object_vars($this));
				$excl = $this->excl_from_db;
				
				if(!empty($this->id) && $_['db']->tableExists($tbl) && ($_['db']->numRows($tbl,"id='".$this->id."'"))){ //does row exist? -> update
					
					if($row = $_['db']->getSingle($tbl,"id='".$this->id."'")){
						$row = _array_diff($row,$excl);
					}
					
					foreach($row as $key => &$val){
						if(property_exists($this,$key) || in_array($key,array_keys($obj))){
							if(is_object($this->$key)){
								$deconstructed = false;
								if(!empty($this->$key->id)){
									$row[$key.'-'.'id'] = $this->$key->id;
									$deconstructed = true;
								}
								
								if(!empty($this->$key->uuid)){
									$row[$key.'-'.'uuid'] = $this->$key->uuid;
									$deconstructed = true;
								}
								
								if(!$deconstructed){
									$row[$key] = serialize($this->$key);
								}
							}else{
								$row[$key] = $this->$key;
							}
						}
					}
					
					return $_['db']->update($tbl,$row,"id='".$row['id']."'");
					
				}else if($_['db']->tableExists($tbl)){ //otherwise, new row -> insert
					$ret=array();
					$excl[]='id';
					
					foreach($obj as $okey => $val){
						if(is_object($val)){
						
							$deconstructed = false;
							if(!empty($val->id)){
								$ret[$okey.'-'.'id'] = $val->id;
								$deconstructed = true;
							}
							
							if(!empty($val->uuid)){
								$ret[$okey.'-'.'uuid'] = $val->uuid;
								$deconstructed = true;
							}
							
							if(!$deconstructed){
								$ret[$okey] = serialize($val);
							}
							
						}else if(!in_array($okey, $excl) && $_['db']->fieldExists($tbl,$okey)){
							$ret[$okey] = $val;
						}
					}
					
					//we don't want to accidentally overwrite an id in the db, let sql handle that
					if(!empty($ret['id']))
						unset($ret['id']);
						
					$this->id = $_['db']->insert($tbl,$ret);
					$this->found = true;
					
					return true;
				}
			}
			
			$this->cemented = true;
		}
		
		function get_class($obj=''){
			return (isset($this->className) ? $this->className : get_class($obj!='' ? $obj : $this));
		}
	}
?>
