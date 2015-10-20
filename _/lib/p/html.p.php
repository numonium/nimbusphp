<?php
	/* juniper/lib/presenter/html - presenter for html info
		(juniper + nimbus) (c) 2012+ numonium //c - all rights reserved	
	*/

	global $_;
	
	class _HTMLPresenter extends _ {
		var $model;
		var $view;
	
		public static function all(){
			var_dump('@@@',get_class($this));
		}
	}
?>
