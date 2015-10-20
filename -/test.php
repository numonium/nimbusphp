<?php
	/* FAKE API ENDPOINT - "test"
		- accessible via /-/test */

	define('__NU_NO_ROUTE',true);
	header('Content-Type: application/json; charset=utf8');

	require_once('../_/_.php');

	$args = array(
		'json'	=> true,
	);

	if(!empty($_['request']['q'])){
		$args['q'] = $_['request']['q'];
		unset($args['group']);
	}	
		
	# ~EN (2015): do something with this that outputs JSON

	return json_encode(array(
		'success' : true
	));

?>
