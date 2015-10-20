<?php
	/* nimbus/lib/api - abstract class for apis
		nimbus (c) 2012+ numonium //c - all rights reserved	
		
		~EN - 23 jan 2014
	*/
	
	require_once('o.php');

	abstract class _API extends _{

		# ~EN (2014): nothing yet
		function __construct($data='',$force_init=true){
			return parent::__construct($data,$force_init);
		}
		
		# directs router or page to new command
		abstract function go($cmd);
		
		# get response from server
		abstract function get($args,$data='',$context='local');

		# get url for cmd
		abstract function url($cmd); 
			
	};
	
?>