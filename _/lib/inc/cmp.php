<?php
	/* juniper/lib/cmp - comparison functions
		(juniper + nimbus) (c) 2012+ numonium //c - all rights reserved */
		
	function cmp_obj_alpha($a,$b){
		if(empty($a) && !empty($b)){
			return 1;
		}else if(!empty($a) && empty($b)){
			return -1;
		}else if(empty($a) && empty($b)){
			return 0;
		}
		
		if(is_array($a)){
			$a = (object) $a;
		}
		
		if(is_array($b)){
			$b = (object) $b;
		}
				
		if(!empty($a->name)){
			$a = $a->name;
		}else if(!empty($a->title)){
			$a = $a->title;
		}else if(!empty($a->slug)){
			$a = $a->slug;
		}
		
		if(!empty($b->name)){
			$b = $b->name;
		}else if(!empty($b->title)){
			$b = $b->title;
		}else if(!empty($b->slug)){
			$b = $b->slug;
		}
		
		if(strtolower($a) == strtolower($b)){
			return 0;
		}else{
			return strtolower($a) > strtolower($b);
		}

	}
	function cmp_order($a,$b){
		if(is_object($a) && isset($a->_order)){
			$a=$a->_order;
		}else if(is_object($a) && isset($a->nav['order'])){
			$a=$a->nav['order'];
		}
		
		if(is_object($b) && isset($b->_order)){
			$b=$b->_order;
		}else if(is_object($b) && isset($b->nav['order'])){
			$b=$b->nav['order'];
		}
		
		return $a-$b;
	}
	
	// sort javascript array based on keys
	function cmp_js($a,$b){
		if(is_int($a) && is_string($b)){
			return 1;
		}else if(is_int($a) && is_int($b)){
			return $a < $b;
		}else if(is_string($a) && is_string($b)){
			return strtolower($a) < strtolower($b);
		}
		
		return 0;
	}
	
	function cmp_robots($a,$b){
		//will be arrays from @db[sites-seo-robots]
		
		//are either empty?
		if(empty($a) || !is_array($a) || empty($b) || !is_array($b)){
			return false;
		}
		
		if(!empty($a['useragent']['id']) && !empty($b['useragent']['id'])){
			return strtolower($a['useragent']['id']) < strtolower($b['useragent']['id']);
		}else if(empty($a['useragent']['id']) && empty($b['useragent']['id'])){ //wildcard UAs
			return 0;
		}else if(empty($a['useragent']['id']) && !empty($b['useragent']['id'])){
			return 1; //$a is wildcard, send to top
		}else if(!empty($a['useragent']['id']) && empty($b['useragent']['id'])){
			return -1; //$b is wildcard, send to top
		}
		
		return 0;
	}
?>