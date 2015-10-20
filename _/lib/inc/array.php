<?php
	/* juniper/lib/array - array constructs and manipulation functions
		(juniper + nimbus) (c) 2012+ numonium //c - all rights reserved */
	
    function _array($ary){
    	return (is_array($ary) ? $ary : array($ary));
    }
    
    function _is_array($ary){
    	return (!empty($ary) && is_array($ary) && count($ary)>0);
    }
    
if(!function_exists('array_column')){
	function array_column($ary,$key){
		$ret=array();
		
		if(is_object($ary)){
			$ary=get_object_vars($ary);
		}
		
		if(!_is_array($ary)){
			return false;
		}
		
		foreach($ary as $key2=>&$val){
			if(is_object($val)){
				$val=get_object_vars($val);
			}
			$ret[]=$val[$key];
		}
		
		return $ret;
	}
}

	function array_col($ary,$key){
		return array_column($ary,$key);
	}
	
	function array_collapse($array, $key_prefix = '', &$out = array()) {
		return array_flatten($array,$key_prefix,$out);
	}
	
	function _array_diff(){
		$args = func_get_args();
		
		if(empty($args) || !is_array($args)){
			return false;
		}
		
		if(count($args) == 1){
			return $args[0];
		}
		
		if(count($args) == 2){
			foreach($args[1] as $akey => $arg){
				if(isset($args[0][$akey])){
					unset($args[0][$akey]);
				}
			}
			
			return $args[0];
		}
		
		if(count($args) > 2){		
			foreach($args as $akey => $arg){
				if($akey == 0){
					$ret = $args[0];
				}else{		
					$ret = _array_diff($ret,$arg);
				}
			}
			
			return $ret;
		}
	}
    	
	function array_expand($array,$sep='-'){
	
		if(is_array($array) && !empty($array['__args'])){
			$args = $array['__args'];
			unset($array['__args']);
			
			if(!empty($args['key-prefix'])){
				$key_prefix = $args['key-prefix'];
			}
			
			if(!empty($args['sep'])){
				$sep = $args['sep'];
			}
		}
		
		$out=$array;

		foreach($array as $field => $val){
			$fields=explode($sep,$field);
			$field_depth=count($fields);

#		if(!empty($_['const']['debug']))	     			
#			var_dump('-- expand',$field_depth,$fields);
			
			if($field_depth > 1){
				for($j=$field_depth-1; $j>=0; $j--){
					$ary=array_wrap($j==$field_depth-1 ? $val : $ary,$fields[$j]);
				}
				$out=_array_merge($out,$ary);
				unset($out[$field]);
			}
		}
		
		return $out;
	}
	
	function array_first($ary){
		if(!_is_array($ary)){
			return false;
		}
		
		$ary2 = $ary;
		
		return array_shift($ary2);
	}
	
	function array_flatten($array, $key_prefix = '', &$out = array()) {
		global $_;
		
		$args = false;
		$sep = '-';
	
		if(is_array($array) && !empty($array['__args'])){
			$args = $array['__args'];
			
			unset($array['__args']);
			
			if(!empty($args['key-prefix'])){
				$key_prefix = $args['key-prefix'];
			}
			
			if(!empty($args['sep'])){
				$sep = $args['sep'];
			}
		}
		
		$has_ = isset($array['_']);
	
	    foreach($array as $key => $child){
#	    	var_dump('!!!',$key_prefix,$key);
	    	if($args && !empty($args['exclude']) && _is_array($args['exclude']) && is_string($key) && in_array($key, $args['exclude'])){
	    		$out[$key] = $child;
		    	continue;
	    	}
	        if(is_array($child)){
	        	if($args){
		        	$child = array_merge(array('__args' => $args),$child);
	        	}
	            $out = array_flatten($child, (!empty($key_prefix) ? $key_prefix.$sep : '').$key, $out);
	            
	        }else if(!empty($key_prefix)){ //typically 2+-level recursion
#			}else if($key_prefix + is_string($key) > 1){
				$_key=$key;
//				if($_key=='_' && isset($key_prefix) && $key_prefix!=''){
				if(($_key==='_' || ($_key===0 && !isset($array['_']))) && isset($key_prefix) && $key_prefix!=''){ // move first or '_' index to $key_prefix
					$_key=$key_prefix;
				}else if(isset($key_prefix) && $key_prefix!=''){
					$_key=$key_prefix.$sep.$_key;
				}else if($key===0 && !isset($array['_'])){ //move first index to '_' empty
					$_key = '_';
				}
				
	            $out[$_key] = $child;
	        }else{
	            $out[$key] = $child;
	        }
	        
	     }

#		if(!empty($_['const']['debug']))	     
#			var_dump('++ flatten',$key_prefix,$array,$out);
	     
	    return $out;
	}
	
	//replaces array keys with $keys
	function array_ladder($ary,$keys=false){
		if(!$keys || !_is_array($keys))
			return $ary;
		
		$ret = array();
		foreach($keys as $kkey => $key){
			$ret[$key] = $ary[$kkey];
		}
			
		return $ret;
	}
	
	function array_last($ary,$assoc=false){
		if(!_is_array($ary)){
			return false;
		}
		
		if($assoc){ //associative array
			$key = array_last(array_keys($ary));
			
			return array($key => $ary[$key]);
		}
		
		return $ary[count($ary)-1];
	}
	
	function _array_map($callback, $array){  // recursive array_map()
	    $new = array(); 
	    foreach($array as $key => $val){ 
	    	if(!isset($val)){
	    		$new[$key] = $val;
	        }else if (isset($val) && is_array($val)){ 
	            $new[$key] = _array_map($callback, $val); 
	        }else if (isset($val) && is_object($val)){ 
	            $new[$key] = _array_map($callback, (array)$val); 
	        }else{
	            $new[$key] = call_user_func($callback, $val); 
	        } 
	    } 
	    return $new; 
	}

	function _array_merge(){
		if(func_num_args()==0)
			return false;
			
		$args=func_get_args();
		
		$ret=$args[0];
		
		for($i=1; $i<count($args); $i++){
			foreach($args[$i] as $key=>$value){
				if(_is_array($value) && !empty($ret[$key])){
					/* ~EN: flat index has been overwritten with array, move index -> ['_'] *
					$ret[$key]=_array_merge((_is_array($ret[$key]) ? $ret[$key] : array($ret[$key])),$value);*/
					$ret[$key]=_array_merge((_is_array($ret[$key]) ? $ret[$key] : array('_' => $ret[$key])),$value);
				}else if(!_is_array($value) && !empty($ret[$key])){ // conflict - merging string into array
					if($value !== $ret[$key]){ //if they are equal, do nothing
						$ret[$key]=_array_merge((_is_array($ret[$key]) ? $ret[$key] : array('_' => $ret[$key])),array($value));					
					}
				}else{ //merge data into empty space
					$ret[$key]=$value;
				}
			}
		}
		
#		var_dump('%%% ret',$ret);
		
		return $ret;
	}
	
	function _array_merge2(){
		global $_;
		
		if(func_get_args() == 0)
			return false;
			
		$_args = $args = func_get_args();
		$num_args = count($args);
		
		if($num_args == 1){
			return $args[0];
		}
		
		$ret = array_pop($args);		
		foreach($args as $akey => &$arg){
			if(!is_array($arg)){
				continue;
			}
			
			$ret = array_merge($ret,array_flatten(array_merge($_['const']['array']['flatten']['args'], $arg)));
			
			var_dump('@$$',$arg,$ret);
		}
		
		return array_expand(array_merge($_['const']['array']['expand']['args'],$ret));
	
	}
	
	// pick $pick['el1']['el2']['el3'] from $ary
	function array_pick($ary,$pick){
		if(is_string($pick)){
			$pick=array_map('strtolower',explode('-',$pick));
		}
		
		if(is_object($ary)){
			$ary=get_object_vars($ary);
		}
		
		if(!_is_array($pick)){
			return $ary;
		}
		
		$key=array_shift($pick);
		
		if(!empty($ary[$key]) && (is_array($ary[$key]) || is_object($ary[$key]))){
			return array_pick($ary[$key],$pick);
		}else if(!empty($ary[$key])){
			return $ary[$key];
		}
		
		return false;
	}
	
	function _array_rand($ary,$num=''){
		if(!_is_array($ary)){
			return false;
		}

		if(empty($num)){
			$num = 1;
		}
		
		$keys=array_rand($ary, $num > count($ary) ? count($ary) : $num);
		
		if(!is_array($keys))
			$keys=array($keys);
		
		$ret=array();
		
		foreach($keys as $key){
			$ret[$key]=$ary[$key];
		}
		
		return $ret;
	}
	
	function array_shuffle($ary){
		if(empty($ary) || !is_array($ary) || !count($ary)){
			return false;
		}
		
       $keys = array_keys($ary);

        shuffle($keys);

        foreach($keys as $key) {
            $new[$key] = $ary[$key];
        }

        return $new;
	}
	
	function array_wrap($ary,$index){
		return array($index => $ary);
	}
	
	function _implode($glue,$pieces){ //will recursively implode
		if(empty($pieces) || !_is_array($pieces)){
			return false;
		}
		
		$ret = '';
		foreach($pieces as $pkey => $piece){
			$ret .= (is_array($piece) ? _implode($glue,$piece) : $piece).$glue;
		}
		
		return substr($ret, 0, 0-strlen($glue));
	}

    function real_array($ary){
    	if(!_is_array($ary))
    		return array();
    	foreach($ary as $key=>$a){
    		if($key[0]=='_')
    			unset($ary[$key]);
    	}
    	return $ary;
    }
    
    function is_real_array($ary){
    	if(!_is_array($ary))
    		return false;
    		
    	foreach($ary as $key=>$val){
    		if($key[0]=='_')
    			return false;
    	}
    	
    	return true;
    }
    
	function spliceIndex($ary,$index){
		$ret=array();
		
		foreach($ary as $key=>$val){
			if(isset($val[$index]) || $key==$index)
				$ret[]=$val[$index];
		}
		
		return $ret;
	}	
	
	function spliceElementByIndex($ary,$index){
		$ret=array();
		
		foreach($ary as $key=>$val){
			if(isset($val[$index]) || $key==$index)
				$ret[]=$val;
		}
		
		return $ret;
	}
	
	function spliceChildren(&$ary,$ch,$key='id',$parent_key=''){
		if($parent_key=='')
			$parent_key='parent_'.$key;
			
		$ret=array();
		$tmp=$ary;
		
		foreach($tmp as $tkey=>$t){
			if($t[$parent_key]==$ch[$key]){
				$ret[]=$t;
				unset($ary[$tkey]);
			}
		}
		
		$ary=array_values($ary);
		
		return $ret;
	}
		
?>
