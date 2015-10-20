<?php
	/* /juniper/lib/mime - MIME type recognition
		juniper + nimbus © 2010+ numonium //c - all rights reserved
	 */
	 
	global $_;
/*
	function isMimeType($type){
		global $_;
		
		if($type=='')
			return false;
			
		$type=strtolower($type);
		foreach($_['mime'] as $key=>$mime){
			if($type==$key || strtolower($mime['type'])==$type)
				return $mime;
			else if(is_array($mime['type'])){
				foreach($mime['type'] as $key2=>$t){
					if(strtolower($t)==$type || strtolower($mime['ext'])==$type){
						return $mime;
					}
				}
			}
		}
		return false;
	}*/
	
	function getMimeExtension($type){
		$ext=isMimeType($type);
		if(!$ext)
			return false;
		return $ext['ext'];
	}

	$_['mime']=array(
		'css'			=> new _Mime(array('type' => 'text/css','ext'=>'css')),
		'javascript'	=> new _Mime(array(
			'type' => 'text/javascript',
			'ext'	=> 'js'
		)),
		'json'			=> new _Mime(array('type' => 'application/json','ext'=>'js')),
		'plain'			=> new _Mime(array('type' => 'text/plain', 'ext' => 'txt')),
		'html'			=> new _Mime(array('type' => 'text/html', 'ext' => 'htm')),
		'pdf'			=> new _Mime(array('type' => 'application/pdf', 'ext' => 'pdf')),
		'word'			=> new _Mime(array('type' => 'application/msword', 'ext' => 'doc')),
		'excel'			=> new _Mime(array('type' => 'application/vnd.ms-excel', 'ext' => 'xls')),
		'powerpoint'	=> new _Mime(array('type' => 'application/vnd.ms-powerpoint', 'ext' => 'ppt')),
		'b64'			=> new _Mime(array('type' => 'application/base64')),
		'jpeg'			=> new _Mime(array('type' => 'image/jpeg','ext' => 'jpg')),
		'gif'			=> new _Mime(array('type' => 'image/gif','ext' => 'gif')),
		'bmp'			=> new _Mime(array('type' => array('image/bmp','image/x-bmp','image/x-windows-bmp'),
							'ext' => 'bmp')),
		'xbmp'			=> new _Mime(array('type' => 'image/x-bmp', 'ext' => 'bmp')),
		'xwbmp'			=> new _Mime(array('type' => 'image-x-windows-bmp', 'ext' => 'bmp')),
		'png'			=> new _Mime(array('type' => 'image/png', 'ext' => 'png')),
		'tiff'			=> new _Mime(array('type' => array('image/tiff','image/x-tiff'), 'ext' => 'tiff')),
		'xtiff'			=> new _Mime(array('type' => 'image/x-tiff', 'ext' => 'tiff')),
		'form'			=> new _Mime(array('type' => 'application/x-www-form-urlencoded')),
		'form-file'		=> new _Mime(array('type' => 'multipart/form-data'))
	);
	
	$_['mime']['js']=&$_['mime']['javascript'];
	
	foreach($_['mime'] as $key=>$m){
		define('MIME_'.strtoupper($key),$m);
	}
?>