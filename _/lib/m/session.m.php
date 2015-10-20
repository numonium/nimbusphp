<?php
	/* juniper/lib/model/session - model for user / browser sessions
		(juniper + nimbus) (c) 2012+ numonium //c - all rights reserved	
	*/

	global $_;
	
	class _Session extends _Model {
		var $id;
		var $uuid;
		var $magic;
		var $user;
		var $company;
		var $site;
		var $action;
		var $created; //sql timestamp
		var $expires; //unix timestamp (int)
		var $_session; // ref to $_SESSION['_']

		function __construct($args,$force_init=true){
			global $_;
			
			parent::__construct($args,$force_init);
			
			if(empty($this->magic)){
				$this->magic = _pwd($this->uuid);
			}
			
			if(!empty($this->expires) && is_string($this->expires) && is_numeric($this->expires)){
				$this->expires = intval($this->expires);
			}
			
			if(!empty($this->type) && !empty($this->user)){
				$session = array(
					'uuid'	=> $this->user->uuid,
					'auth_level' => $this->user->auth_level
				);
				
				if(!empty($this->user->group) && is_object($this->user->group)){
					$session['group'] = array(
						'uuid'	=> $this->user->group->uuid,
						'auth_level'	=> $this->user->group->auth_level
					);
				}else if($group_id = $_['db']->getSingle('users-groups',array(
					'user-uuid'	=> $this->user->uuid
				))){
					$group = new _Group(array(FETCH_FROM_DB => true, 'uuid' => $group_id['group']['uuid']));
					$session['group'] = array(
						'uuid'	=> $group->uuid,
						'auth_level'	=> $group->auth_level
					);
				}
								
				$_SESSION['_'][$this->type] = &$session;
			}
			
			if(!empty($_SESSION['_'])){
				$this->_session = &$_SESSION['_'];
			}
		}

		function __get($var){
			switch($var){
				case 'expired':
					return $this->expired();
					break;
			}
		
			return parent::__get($var);
		}
		
		function delete(){
			global $_;
			
			return $_['db']->delete($_['db']->getTableName($this),array('uuid' => $this->uuid));
		}
		
		function expire(){
			return ($this->expired ? $this->delete() : false);
		}
		
		function expired(){
			if(empty($this->expires))
				return false;
		
			return (time() > $this->expires);
		}
	
	}
?>
