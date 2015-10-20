<?php
	/* juniper/lib/model/user - what a person would look like
		(juniper + nimbus) (c) 2012+ numonium //c - all rights reserved	
	*/

	global $_;
	
	require_once(_dir($_['.'].'/lib/o/o.php'));
	require_once(_dir($_['.'].'/'.$_['/']['m'].'/m.php'));
	
	class _User extends _Model {
		var $_group;
		var $site;
		var $station;
	
		function __construct($args='',$force_init=true){
			global $_;
			
			$station = null;

			if(!empty($args)){
				if(!empty($args['station'])){
					if(is_object($args['station'])){
						$station = &$args['station'];
					}else{
						$station = $args['station'];
					}
					unset($args['station']);
				}
			}

			parent::__construct($args,$force_init);
			
			if(empty($this->slug) && !empty($this->name)){
				$this->slug=slug($this->name);
			}
			
			if(!isset($this->password_hashed)){
				$this->password_hashed=false;
			}
			
			if(empty($this->salt)){
				$this->salt = uuid('salt');
			}

			if(!empty($this->password) && !$this->password_hashed){
				$this->_password=$this->password;
				
				if(empty($this->salt)){
					die('usr[init][no-salt] user has no salt -> bad taste :(');
				}
				
				$this->password=_pwd($this->password,$this->salt);
				$this->password_hashed=true;
			}
			
			if(!empty($this->group)){
				if(is_string($this->group)){
					$this->group = new _Group(array(
						FETCH_FROM_DB	=> true,
						'uuid'			=> $this->group
					));
				}else if(is_array($this->group) && !empty($this->group['uuid'])){
	#				$this->_group = $this->group;
					$this->group = new _Group(array(
						FETCH_FROM_DB	=> true,
						'uuid'			=> $this->group['uuid']
					));
				}
			}

			if(!empty($station)){
				$this->station = $station;
			}

			if(!empty($this->station) && is_array($this->station) && !empty($this->station['uuid'])){
				$this->station = new _Station(array(
					FETCH_FROM_DB => true,
					'uuid'	=> $this->station['uuid']
				));
			}else{
//				$this->station = new _Station();
			}

		}

		function __get($var){
			return parent::__get($var);
		}
		
		public static function all($args=''){
			global $_;
			
			if($users = $_['db']->getAll('users')){
				
				$ret = array();
				
				foreach($users as $ukey => $user){
					if($user['id'] === 1){
						continue;
					}
					
					$ret[$user['uuid']] = new _User(array(FETCH_FROM_DB => true, 'uuid' => $user['uuid']));
				}
				
				
				return $ret;
			}
			
			return false;
		}
		
		function add_reset_hash($args=array(),$save=false){
			global $_;
			
			if(empty($args['expiry'])){
				$args['expiry'] = '+1 day';
			}
			
			if(is_string($args['expiry'])){
				$args['expiry'] = strtotime($args['expiry']);
			}
			
			if(!empty($args['save'])){
				$save = $args['save'];
			}
			
			$this->reset = array(
				'hash'	=> uniqid(),
				'expiry'	=> date('Y-m-d H:i:s', $args['expiry'])
			);
			
			if(!empty($save)){
				return $this->save();
			}
			
			return true;
		}
		
		function delete_reset_hash($args=array(),$save=false){
			return $this->remove_reset_hash($args,$save);
		}
		
		function remove_reset_hash($args=array(),$save=false){
			global $_;
			
			$this->reset = array(
				'hash' => '',
				'expiry'	=> ''
			);
			
			if(!empty($save)){
				return $this->save();
			}
			
			return true;
		}
		
		public static function exists($args){
			global $_;
			
			if(empty($args) || !_is_array($args)){
				return false;
			}
			
			//dummy object
			$u=new _User();
			
			if(!empty($args['reset-hash']) && ($user = $_['db']->getSingle($_['db']->getTableName($u),array('username' => $args['username'])))){
				$user = new _User(array(FETCH_FROM_DB => true, 'uuid' => $user['uuid']));

				if(
					(!empty($args['reset-hash']) && !empty($user->reset) && !empty($user->reset['hash'])) &&
					($args['reset-hash'] == $user->reset['hash']) &&
					(time() <= strtotime($user->reset['expiry']))
				){
					return $user;
				}
				
				return false;
			}else if(!empty($args['hash']) && ($user = $_['db']->getSingle($_['db']->getTableName($u),array('username' => $args['username'])))){
				$user = new _User(array(FETCH_FROM_DB => true, 'uuid' => $user['uuid']));

				if(!empty($args['password'])){
					if(
						(empty($this) && self::pw_verify($args['password'],$user->hash)) ||
						(!empty($this) && $this->pw_verify($args['password'],$user->hash))
					){
						return $user;
					}
				}
				
				return false;
			}else if($user = $_['db']->getSingle($_['db']->getTableName($u),$args)){
				return new _User($user);
			}
			
			return _bool($_['db']->numRows($_['db']->getTableName($u),$args));
		}
		
		function full_name(){
			
			if(empty($this->name)){
				return false;
			}
			
			if(is_string($this->name)){
				return $this->name;
			}
			
			if(!is_array($this->name)){
				return false;
			}
			
			return implode(' ', array_diff($this->name, array('')));
		}
		
		public static function is_admin(){
			return _User::logged_in();
		}
		
		public static function logged_in(){
			global $_;
			
			return (!empty($_SESSION['_']['login']) && _is_array($_SESSION['_']['login']));
		}
		
		public static function login($args){
			global $_;
			
			foreach(array('email','password') as $fkey => $field){
				if(empty($args[$field]) && !empty($args['user'][$field])){
					$args[$field] = &$args['user'][$field];
				}
			}
			
			if(empty($args['email']) && !empty($args['username'])){
				$args['email'] = &$args['username'];
			}
			
#			var_dump('##', _pwd($args['password'],$user['salt']),$args,$args['email'],$_['db']->getAll('users',"lower(email) = '".strtolower($args['email'])."'"));

			if($users = $_['db']->getAll('users',"lower(email) = '".strtolower($args['email'])."'")){
			
				foreach($users as $ukey => $user){
				
					if($user['password'] == _pwd($args['password'],$user['salt']) && intval($user['company']['id']) == (is_object($_['site']->company) ? $_['site']->company->id : $_['site']->company['id'])){
						$u = new _User($user);
						$u->restore_session();
						
						return $u;
//						return $user['uuid'];
					}else if($user['password'] == _pwd($args['password'],$user['salt'])){ //user from different site logged in -> forward to proper domain
						$site = new _Site(array('company-id' => intval($user['company']['id']), FETCH_FROM_DB => true));
						$company = new _Company(array('id' => intval($user['company']['id']), FETCH_FROM_DB => true));
						$u = new _User($user,true);
						
						$session = new _Session(array(
							'action'	=> 'login',
							'user'		=> array(
								'id'	=> $u->id,
								'uuid' => $u->uuid
							),
							'site'		=> array(
								'id'	=> $site->id,
								'uuid'	=> $site->uuid
							),
							'company'	=> array(
								'id'	=> $company->id,
								'uuid'	=> $company->uuid
							),
							'expires'	=> strtotime('+1 hour')
						));
						
						$session->save();
												
						$_['url']->redirect('http' . ($_['http']->is_ssl() ? 's' : '') . ':'.$site->href.'/session/restore/'.$session->magic);
						
						exit;

/*						$fields = array();
						
						foreach($args as $akey=>&$arg){
							$fields['user['.$akey.']'] = $arg;
						}
						
						
#						$_['url']->redirect('http' . ($_['http']->is_ssl() ? 's' : '') . ':'.$site->href.'/admin');
						
/*var_dump('!!!',	*					$_['http']->post(array(
							'url' => 'http' . ($_['http']->is_ssl() ? 's' : '') . ':'.$site->href.'/admin',
							'fields'	=> $fields
						));
						
						$_['url']->redirect('http' . ($_['http']->is_ssl() ? 's' : '') . ':'.$site->href);

						exit;*/
			 		}
				}
			}
			
			return false;

		}
		
		public static function logout(){
			global $_;
			
			session_destroy();
			$_['url']->redirect('/');
			
			return true;
		}
		
		public static function pw_hash($pass=''){
			if(empty($pass)){
				if(!empty($this) && !empty($this->password)){
					$pass = $this->password;
				}else{
					return false;
				}
			}
			
			return password_hash($pass, PASSWORD_BCRYPT);
			
		}
		
		function pw_change($pass=''){
			if(empty($pass)){
				return false;
			}
			
			$this->hash = $this->pw_hash($pass);
			$this->remove_reset_hash();
			
			return $this->save();
		}
		
		public static function pw_verify($pass='',$hash=''){
						
			if(empty($pass)){
				if(!empty($this)){
					if(!empty($this->password)){
						$pass = $this->password;
					}
				}
			}

			if(empty($hash)){
				if(!empty($this)){
					if(!empty($this->hash)){
						$hash = $this->hash;
					}
				}
			}
			
			if(empty($pass) || empty($hash)){
				return false;
			}
						
			return password_verify($pass,$hash);
		}
		
		function restore_session(){
			global $_;
			
			if(empty($_SESSION['_']['users'][$this->uuid])){
				$_SESSION['_']['user'] = $_SESSION['_']['users'][$this->uuid] = &$this;
			}
		}
		
		function save($args=''){
			$company=false;
			
			// if(!empty($this->company) && is_object($this->company) && !empty($this->company->id)){
			// 	$id=$this->company->id;
			// 	$company=$this->company;
			// 	$this->company=array('id' => $id);
			// 	unset($id);
			// }
			
			// if(!empty($this->station) && is_object($this->station)){
			// 	$_station = $this->station;
			// 	$this->station = $this->_station;
			// 	var_dump('!!!',$this);
			// 	die();
			// 	unset($this->station);
			// }
			
			$_password = $password = $password_hashed = false;
			
			if(!empty($this->password) && empty($this->password_hashed)){
				$_password = $this->_password=$this->password;
				$password = $this->password = _pwd($this->password,$this->salt);
				$password_hashed = $this->password_hashed = true;
				
			}
			
			unset($this->_password,$this->password_hashed, $this->_station);
						
			$ret = parent::save($args);
			
			// if(!empty($_station)){
			// 	$this->_station = $this->station;
			// 	$this->station = $_station;
			// 	unset($_station);
			// }
			
			if($_password){
				$this->_password = $_password;
				unset($_password);
			}
			
			if($password_hashed){
				$this->password_hashed = $password_hashed;
				unset($password_hashed);
			}
			
			// if($company){
			// 	$this->company=$company;
			// }
			
			// unset($company);
			
			return $ret;
		}
	
	}
?>
