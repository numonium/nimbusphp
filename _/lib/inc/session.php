<?php
	/* juniper/lib/session - session functions and user processing required for framework
		juniper + nimbus © 2010+ numonium //c - all rights reserved
	*/
		
		
//	require_once("vars.php");

	define('SESSION_STUB','_user');

	_session_start();
	
	function checkLogin($authLevel=''){
		if($authLevel=='')
			$authLevel=$GLOBALS['_cfg']['levels']['guest'];
		if(!isset($_SESSION['_user']['email']) || ($_SESSION['_user']['level']>$authLevel))
			header("Location: /");
	}
	
	function login($user,$pass,$remember=null){
		global $_;
		
		$user=strtolower($user); //case insensitive username
		
		if($_['db']->numRows('users',"(site_id='0' or site_id='".$_['site']['id']."') and (lower(username)='".mysql_real_escape_string($user)."' and password='".md5(mysql_real_escape_string($pass))."') and activated='1'")>0){
			$collapse=$_['db']->collapse;
			$_['db']->collapse=false;
			
			$row=$_['db']->getSingle('users',"(site_id='0' or site_id='".$_['site']['id']."') and (lower(username)='".mysql_real_escape_string($user)."' and password='".md5(mysql_real_escape_string($pass))."') and activated='1'");
			
/*			if($row['activated']==0)
				return false;		*/
			
/*			if(isset($_SESSION['_ref']))
				$ref=$_SESSION['_ref'];*/
			session_start();
/*			if(isset($_SESSION['_ref']))
				$_SESSION['_ref']=$ref;*/
			makeSession($row);
			
			if($remember==1){
				makeCookie($row);
			}
			
/*			//get default location
			if(dbNumRows('users_location_history',"user_magic='".$_SESSION['_user']['magic']."' and default_loc='1'")>0){
				$_SESSION['_loc_default']=dbGet('users_location_history',"user_magic='".$_SESSION['_user']['magic']."' and default_loc='1'");
				$_SESSION['_loc_default']=makeLocation($_SESSION['_loc_default'][0]);
				$_SESSION['_loc']=$_SESSION['_loc_default'];
			}
			*/
			return true;
		}
		return false;
	}
	
	function logout(){
		global $_;
		
		
		if(!empty($_['env']['context']) && isset($_SESSION[$_['env']['context']][SESSION_STUB]))
			unset($_SESSION[$_['env']['context']][SESSION_STUB]);
		else if(isset($_SESSION[SESSION_STUB]))
			unset($_SESSION[SESSION_STUB]);
		else
			return false;
			
		return true;
	}
	
	function makeSession($data){
		global $_;
		$ary=array();
		
		//get user data
		foreach($data as $key=>$val){
			if($key!='password'){
				if($key=='id')
					$key='user_id';
				$ary[$key]=(is_numeric($val) ? intval($val) : $val);
			}
		}
		
		if(!empty($_['env']['context']))
			$_SESSION[$_['env']['context']][SESSION_STUB]=$ary;	
		else
			$_SESSION[SESSION_STUB]=$ary;
	}

	function makeCookie($data){
		global $_;
//		var_dump('p'.uniqid(),$data,setcookie($GLOBALS['_cfg']['remember_cookie_name'],'usr='.$data['magic'],$GLOBALS['_cfg']['remember_cookie_expire']));
		setcookie($_['_cfg']['remember_cookie_name'],'usr='.$data['magic'],$_['_cfg']['remember_cookie_expire']);
	}
	
	function session_restore($module_name=''){
		global $_;
		
		_session_start();
		
		if(empty($module_name) && !empty($_['modules']['_']['name'])){
			$module_name=$_['modules']['_']['name'];
		}
		
		$func='session_restore__'.$module_name;
		
		if(function_exists($func)){
			return $func();
		}
	}
	
	function session_save($module_name=''){
		global $_;
		
		_session_start();
		
		if(empty($module_name) && !empty($_['modules']['_']['name'])){
			$module_name=$_['modules']['_']['name'];
		}
		
		$_SESSION['_']['modules'][$module_name]=$_;
		
		$func='session_save__'.$module_name;
		
		if(function_exists($func)){
			return $func();
		}
	}
	
	/* ~EN: load session save/restore functions for modules */
//	require_once('session-modules.php');
	
	function _session_start(){
		global $_;
		
		
		if(in_array('junipr', explode('.',$_SERVER['HTTP_HOST']))){
			session_save_path('/home/juniper/sessions');
		}else{
			session_save_path('/tmp');
		}
		
		if(!headers_sent() && session_id()=='')
			session_start();
	}
	
	/* unauthRedirect(URL,[URL]): redirects unauthorised users to a login page,
		returning them to their previous URL before logging in */
	function unauthRedirect($from='',$to=''){
		if(!isLoggedIn()){
			if($from!=''){
				$_SESSION['_after_login']=$from;
			}
			
			header("Location: ".($to!='' ? $to : '/login'));
		}
	}
?>