<?php
	/* juniper/lib/file - functions relating to dealing with files
		(juniper + numbus) (c) 2012+ numonium //c - all rights reserved */
		
	$_['files'] = array(
		'css'	=> array(),
		'js'	=> array(),
		'fonts'	=> array()
	);
		
	function _file_exists($filename) { 	
        if(function_exists("get_include_path")) { 
            $include_path = get_include_path(); 
        } elseif(false !== ($ip = ini_get("include_path"))) { 
            $include_path = $ip; 
        } else {
        	return false;
        } 
        
        if($filename=='/'){
        	$filename='index.php';
        }
        
        if(false !== strpos($include_path, PATH_SEPARATOR)) { 
            if(false !== ($temp = explode(PATH_SEPARATOR, $include_path)) && count($temp) > 0) { 
                for($n = 0; $n < count($temp); $n++) { 
                	//~EN if current directory doesn't end with a / and filename doesn't start with /, add it
                	if(substr($temp[$n],-1,1)!='/' && substr($filename,0,1)!='/'){
                		$temp[$n].='/';
                	}
#	              	var_dump(file_exists($temp[$n] . $filename),($temp[$n] . $filename));

                    if(false !== @file_exists($temp[$n] . $filename)) { 
#                       return true; 
						return ($temp[$n] . $filename);
                    } 
                }
                
                if($filename[0]=='/' && file_exists($filename)){ //hard-coded absolute path
                	return $filename;
                } 
                
                return false; 
            } else {return false;} 
        } elseif(!empty($include_path)) { 
            if(false !== @file_exists($include_path)) { 
#				return true;             
                return _dir($include_path.'/'.$filename);
            } else {return false;} 
        } else{
        	return (file_exists($filename) ? $filename : false);
        }
    }
    
	function file_get_header($file,$header){
		if(!file_exists($file))
			return false;
		
		$headers=array();
		
		if(_is_array($header)){
			foreach($header as $hkey=>$h){
				$headers[$h]=file_get_header($file,$h);
			}
			
			return (count($headers)>0 ? $headers : false);
		}else{
			global $_;
			
			if ( preg_match( '|'.$header.':(.*)$|mi', file_get_contents($file), $headers ) ){
				$headers = _cleanup_header_comment($headers[1]);
				return $headers;
			}
			
			return false;
		}
	}
    
?>