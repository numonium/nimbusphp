<?php
	
	class _Uglify extends _{
	
		function __construct($args=array(),$force_init=true){
			global $_;
			
			require_once($_['.'].'/lib/o/uglify/Uglify.php');
			require_once($_['.'].'/lib/o/uglify/JS.php');
			require_once($_['.'].'/lib/o/uglify/CSS.php');
			
			var_dump('@$$',Uglify_JS::installed());
				
		}
		
	}
	
 ?>