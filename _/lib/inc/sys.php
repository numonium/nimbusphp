<?php
	/* juniper/lib/sys - system-level core functions
		(juniper + nimbus) (c) 2012+ numonium //c - all rights reserved	*/
	
	function add_include_path($path,$order='last'){
		$include_paths=explode(PATH_SEPARATOR,get_include_path());
		$ret=array();
		
		if(is_array($path)){
			foreach($path as $pkey=>$p){
				$ret[]=add_include_path($p,$order);
			}
			return $ret;
		}
		
		if(in_array($path,$include_paths)){
			return false;
		}
		
		if(count($include_paths)>0){
			if($include_paths[0]=='.'){ 
				$ret[]=$include_paths[0];
				unset($include_paths[0]);
			}
			
			switch($order){
				case 0:
				case 'first':
					$ret[]=$path;
					break;
				case 'last':
				default:
					$include_paths[]=$path;
					break;
			}

			$ret=array_merge($ret,$include_paths);

			return set_include_path(implode(PATH_SEPARATOR,$ret));
		}
		
		return set_include_path(get_include_path().PATH_SEPARATOR.$path);
			
	}
	
	function del_include_path($path){
		return set_include_path(implode(PATH_SEPARATOR, array_diff(explode(PATH_SEPARATOR,get_include_path()),array($path) )));
	}
	
	function remove_include_path($path){
		return del_include_path($path);
	}
	
	function args_map($keys,$values){
		//creates a map of arguments: function($a,$b,$c) -> function(array('a' => '', 'b' => '', 'c' =>))
		if(!is_array($keys) && !is_array($values)){
			return array($keys => $values);
		}else if(is_array($keys) && is_array($values)){
			$ret=array();
			foreach($keys as $key=>$kval){
				if(isset($values[$key]))
					$ret[$kval]=$values[$key];
			}
			
			return $ret;
		}
		
		return $values;
		
	}
	
	function __autoload($class){
		global $_;
		
		if(class_exists($class)){
			return true;
		}
		
		if($class=='_'){
			$dirs = array(
				_dir($_['.'].'/lib/o/o.php')
			);
		}else{
			
			if($class[0]=='_')
				$class=substr($class,1);
				
			if(strrpos(strtolower($class),'presenter')!==false){
				$class=str_ireplace('presenter','',$class);
				$dirs=array(
					_dir($_['.'].'/'.$_['/']['presenters'].'/'.$class.'.p.php'),
					_dir($_['.'].'/'.$_['/']['presenters'].'/'.strtolower($class).'.p.php')
				);
			}else{
				$dirs=array(
					_dir($_['.'].'/lib/o/'.$class.'.o.php'),
					_dir($_['.'].'/lib/o/'.strtolower($class).'.o.php'),
					_dir($_['.'].'/'.$_['/']['models'].'/'.$class.'.m.php'),
					_dir($_['.'].'/'.$_['/']['models'].'/'.strtolower($class).'.m.php')
				);
			}
			
		}
				
		foreach($dirs as $dkey=>$dir){
			if(file_exists($dir)){
				require_once($dir);

				return true;
			}
		}

		return false;
	}
	
	function _cfg($name,$ary){
		global $_;
		
		if(empty($_['cfg'][$name])){
			$_['cfg'][$name]=$ary;
		}else{
			$_['cfg'][$name]=_array_merge(_is_array($_['cfg'][$name]) ? $_['cfg'][$name] : array($_['cfg'][$name]));
		}
	}
		
	/* defines all keys=val in array */
	function _define($ary,$prefix='',$separator='_'){
		if(!is_array($ary) && !is_array($prefix)){	//use define($ary,$prefix) syntax
			if(!defined($ary))
				define($ary,$prefix);
			else
				return false;
		}else if(is_array($ary)){
			if(empty($prefix)){
				$separator='';
			}else if(is_array($prefix)){
				$prefix=$ary[$prefix[0]];
			}
			foreach($ary as $key=>$val){
				if(is_array($val)){
					_define($val,(!empty($prefix) ? $prefix.$separator : '').$key);
				}else{
					_define(strtoupper($prefix).$separator.strtoupper($key),$val);			
				}
			}
		}
	}
	
	//just in case you want to use the add/del (+/-) relationship
	
	function _env($context){
		global $_;
		if(is_array($_['env']['contexts']) && count($_['env']['contexts'])>0){
			foreach($_['env']['contexts'] as $type=>$c){
				if(strtolower($context)!=$type){
					$_['env']['contexts'][$type]=false;
				}else{
					$_['env']['contexts'][$type]=true;
				}
			}
		}
		$_['env']['context']=strtolower($context);
		$_['context']=&$_['env']['context'];
	}
	
	function _error_reporting($toggle=true){
		global $_;
		
		if ($toggle == true) {
			error_reporting(E_ALL & ~E_DEPRECATED);
			ini_set('display_errors','On');
		}else if($toggle=='log') {
			error_reporting(E_ALL & ~E_DEPRECATED);
			ini_set('display_errors','Off');
			ini_set('log_errors', 'On');
			ini_set('error_log', _dir($_['/']['log'].'/error.log'));
		}else if($toggle==false){
			error_reporting(0);
			ini_set('display_errors','Off');
		}
	}
	
	function _init(&$key){
		if(!is_array($key))
			$key=array();
	}
	
	function _md5($str){
		global $_;
		
		return md5($_['cosnt']['salt']['md5'].'+'.$str);
	}
	
	function _method_exists($class,$method){ //recursive method_exists, to check parent classes
		/* ~EN: may already be done in php */
		
		if(empty($class) || empty($method)){
			return false;
		}
		
		if(method_exists($class,$method)){
			return true;
		}else if($parent = get_parent_class($class)){
			return _method_exists($parent,$method);
		}
		
		return false;
	}
		
	function _setEnv($contexts=''){
		global $_;
		$env = false;
		if(empty($contexts)){
			$_['env']['context']=false;
			$contexts=$_['env']['contexts'];
			$env = true;
		}

		foreach($contexts as $type=>$c){
			if(isset($_['env'][$type]) && $_['env'][$type]===true){
				$_['env']['contexts'][$type]=true;
			}else if(is_array($c) && isset($c['keys'])){
				if(is_array($c['keys'])){
//						$_['env']['contexts'][$type]=((isset($_['env'][$type]) && $_['env'][$type]===true) || (in_array($_['host'][0],$c['keys']) || in_array($_['host'][count($_['host'])-1],$c['keys']) || in_array($_['host'][count($_['host'])-2],$c['keys']) ? true : false));
					$_['env']['contexts'][$type]=(in_array($_['host'][0],$c['keys']) || in_array($_['host'][count($_['host'])-1],$c['keys']) || in_array($_['host'][count($_['host'])-2],$c['keys']) ? true : false);
					
				}else{
					$_['env']['contexts'][$type]=($_['host'][0]==$c['keys'] || $_['host'][count($_['host'])-1]==$c['keys']);
				}
			}

			if($_['env']['contexts'][$type])
				$_['env']['context']=strtolower($type);
		}
		
		if(!empty($_['env']['contexts']['beta'])){
			if(!empty($_['env']['contexts']['live'])){
				$_['env']['contexts']['live'] = false;
				$_['env']['context'] = 'beta';
			}
		}
		
		if($env){
			$_['context']=&$_['env']['context'];
		}
	}
	
	function set_error_reporting(){
		global $_;
		
		switch($_['env']['context']){
			case 'dev':
				_error_reporting(true);
				break;
			case 'beta':
				_error_reporting('log');
				break;
			default:
				_error_reporting(false);
				break;
		}
	}
	
if ( !function_exists('sys_get_temp_dir')) {

	function sys_get_temp_dir() {
		if(!empty($_ENV['TMP'])){
			return realpath($_ENV['TMP']);
		}
		
		if(!empty($_ENV['TMPDIR'])){
			return realpath( $_ENV['TMPDIR']);
		}
		
		if(!empty($_ENV['TEMP'])){
			return realpath( $_ENV['TEMP']);
		}
		
		$tempfile = tempnam(__FILE__,'');
		
		if (file_exists($tempfile)) {
		  unlink($tempfile);
		  return realpath(dirname($tempfile));
		}
 	
 		return null;
	}
	
}
	
	function uuid($class=''){
		if(!empty($class) && is_object($class)){
			$class=get_class($class);
		}
	
		if(!empty($class) && $class[0]=='_'){
			$class=substr($class,1);
		}

		/* ~EN (2015): remove extra precision, we don't really need tha right now *
		return str_replace('.','-',uniqid('_-'.(!empty($class) ? strtolower($class).'--' : ''),true)); */
		return str_replace('.','-',uniqid('_-'.(!empty($class) ? strtolower($class).'--' : '')));
	}
	
		
	function unregister_globals(){
		global $_;
		
		$global_types = array('_SESSION', '_POST', '_GET', '_COOKIE', '_REQUEST', '_SERVER', '_ENV', '_FILES');
	
		// ~EN: force unregister globals (i.e., $GLOBALS['var'] => global $var)
	    if (ini_get('register_globals')) {
	        foreach ($global_types as $value) {
	            foreach ($GLOBALS[$value] as $key => $var) {
	            	if($value=='_SESSION' && $key=='_'){
	            		continue;
	            	}
	                if ($var === $GLOBALS[$key]) {
	                    unset($GLOBALS[$key]);
	                }
	            }
	        }
	    }
	    
	    // ~EN: translate globals into internal global arrays
	    foreach($global_types as $global_ary){
	    	if(!isset($GLOBALS[$global_ary])){
		    	continue;
	    	}
	    	
	    	foreach($GLOBALS[$global_ary] as $gtkey=>$global){
            	if(isset($value) && $value=='_SESSION' && $gtkey=='_'){
            		continue;
            	}

    			$_index = $index = ($global_ary[0]=='_' ? substr($global_ary,1) : $global_ary); //convert __ -> _
    			$index = strtolower($index);
				$_gtkey=strtolower(str_replace(array('__','_'),array('_','-'),$gtkey));
	    		if($_gtkey[0]=='-'){ //keys may now start with "-" rather than "_" for control, so we change back
	    			$_gtkey[0]='_';
	    		}
	    		
	    		
    			$_[$index][$_gtkey] = $global;	
    			
    			if($index == 'server' && $_gtkey == 'http-referer'){
	    			$_[$index]['http-referrer'] = &$_[$index][$_gtkey];
    			}
	    	}
	    }
	 }
	
?>