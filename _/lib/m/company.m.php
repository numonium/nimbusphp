<?php
	/* juniper/lib/model/company - basic description for company
		(juniper + nimbus) (c) 2012+ numonium //c - all rights reserved	
	*/

	global $_;
	
	class _Company extends _Model {
	
		function __construct($args,$force_init=true){
			global $_;
			
			parent::__construct($args,$force_init);
			
			if(empty($this->geo) || !is_array($this->geo)){
				$this->geo=$args=array();

				if(!empty($this->address) && _is_array($this->address)){
					$args=$this->address;
					$this->geo=array_merge($this->geo,_array(_Geo::gps($this->address)));
				}
				
				if(empty($this->geo['lat']) && !empty($this->geo['gps']['lat'])){
					$this->geo['lat'] = &$this->geo['gps']['lat'];
				}
				
				if(empty($this->geo['lng']) && !empty($this->geo['gps']['lng'])){
					$this->geo['lng'] = &$this->geo['gps']['lng'];
				}
				
				/* ~EN: one day, this will be a new _Geo()
				$this->geo=new _Geo(array($args)); */
				unset($args);
			}
			
#			$this->geo=array_merge($this->geo,_array(_Geo::gps($this->address)));			
		}

		function __get($var){
			return parent::__get($var);
		}
		
		public static function all($args=''){
			global $_;
			
			if($comps = $_['db']->getAll('companies')){
				$ret = array();
				
				foreach($comps as $ckey => $comp){
					$ret[$comp['uuid']] = new _Company(array(FETCH_FROM_DB => true, 'uuid' => $comp['uuid']));
				}
				
				return $ret;
			}
			
			return false;
		}
		
		public static function exists($args){
			global $_;

			if(empty($args) || !_is_array($args)){
				return false;
			}
			
			if(!empty($args['name']) && empty($args['slug'])){ # ~EN (2015): query by slug and not name to be slightly safer
				$args['slug'] = slug($args['name']);
				unset($args['name']);
			}
			
			if($lead = $_['db']->numRows('companies',$args)){
				return new _Company(array(FETCH_FROM_DB => true) + $args);
			}
			
			return false;

		}
		
		function save($args=''){
			if(!empty($this->geo) && _is_array($this->geo)){
				if(isset($this->geo['_alt']))
					unset($this->geo['_alt']);
				if(isset($this->geo['_warning']))
					unset($this->geo['_warning']);
			}
			
			return parent::save($args);
		}
	
	}
?>
