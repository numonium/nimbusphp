<?php
	/* juniper/lib/dir - directory manipulation libraries
		juniper + numbus © 2010+ numonium //c - all rights reserved */
		
	//negotiates a proper directory path
	function _dir(){
		$args=func_get_args();
		if(count($args)>0){
			$args=implode('',$args);
			return str_replace('//','/',$args);
		}
		return false;
	}
	
	function _is_dir($dir){
		global $_;
		
		foreach(explode(PATH_SEPARATOR,get_include_path()) as $pkey=>$path){
#			var_dump('!!!',$path);
			if(is_dir(_dir($path.'/'.$dir))){
				return _dir($path.'/'.$dir);
			}
		}
		
		return ( is_dir($dir) ? $dir : false );
	}

	function get_dirs($dir){
		global $_;
		if($dir[0]!='/'){
			$dir=$_['/']['/'].'/'.$dir;
		}
		$dirs=_scandir($dir);
		
		foreach($dirs as $key=>$d){
			if(!is_dir(_dir($dir.'/'.$d)))
				unset($dirs[$key]);
		}
		
		return array_values($dirs);
	}
	
	function _rmdir($dir,$level=0){
		//List the contents of the directory table 
		$dir_content = scandir($dir); 
		if($dir_content !==false){
			foreach($dir_content as $entry){
				if(!in_array($entry,array ('.','..'))){
					$entry=$dir.'/'.$entry;
					if(!is_dir($entry)){
						unlink($entry);
					}else{
						_rmdir($entry,$level+1);
					}
				}
			}
		}
		rmdir($dir);
	}
	
	function _scandir($dir,$filter=true){
		if(empty($dir))
			return false;
			
		$files = array_values(array_diff(scandir($dir),array('.'),array('..')));
		
		if(!_is_array($files)){
			return false;
		}
		
		foreach($files as $fkey => $file){
			if($filter && ($file[0]=='.' || in_array($file, array('.','..','')))){
				unset($files[$fkey]);
			}
		}
	
		return (count($files) > 0 ? $files : false);
	}
?>