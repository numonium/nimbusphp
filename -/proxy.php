<?php
	/* FAKE API ENDPOINT - "proxy"
		- proxies request to other (possibly external URL) to avoid CORS/XSS */

	define('__NU_NO_ROUTE',true); # must be set to not load site/assets
	
	require_once('../_/_.php');
	
	if(!empty($_['url']->pieces[2])){
		$url = base64_decode($_['url']->pieces[2]);
	}
	
	$mime = true;
	
	$ret = $_['http']->curl_exec(array(
		'url'	=> $url,
		'return-transfer'	=> true
	),$mime);
	
	header('Content-Type: ' . (!empty($mime) ? $mime : 'text/html'));
	
	if($ret){
		echo $ret;
	}else if($content = file_get_contents($url)){
		echo $content;
	}else{
		echo 0;
	}
	
?>