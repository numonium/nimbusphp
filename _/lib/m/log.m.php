<?php
	/* juniper/lib/model/log - model for log entry
		(juniper + nimbus) (c) 2012+ numonium //c - all rights reserved	
	*/

	global $_;
	
	class _Log extends _ {
		var $id;
		var $uuid;
		var $station = false;
		var $content = false;
		var $hidden = false;
		var $user = false;
		var $created = '';

		function __construct($args,$force_init=true){
			global $_;
			
			if(empty($args['user']) && !empty($_['user']['user'])){
				$args['user'] = &$_['user']['user'];
			}

			parent::__construct($args,$force_init);
			// $this->init($args,'',false);

			$station = null;
			if(!empty($this->station)){
				$station = &$this->station;
			}

			if(!empty($this->user) && is_array($this->user) && !empty($this->user['uuid'])){
				$this->user = new _User(array(
					FETCH_FROM_DB	=> true,
					'uuid'	=> $this->user['uuid'],
					'station'	=> $station
				));
			}

			if(!empty($this->created) && is_int($this->created)){
				$this->created = date('Y-m-d H:i:s', $this->created);
			}

		}

		function save($args=''){
			if(empty($this->created)){
				$this->created = date('Y-m-d H:i:s');
			}

			return parent::save();
		}
	
	}
?>
