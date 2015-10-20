<?php
	/* juniper/lib/presenter/form - presenter for forms
		(juniper + nimbus) © 2012+ numonium //c - all rights reserved	
	*/

	global $_;
	
	class _FormsPresenter extends _Presenter {
		var $model;
		var $view;
	
		public static function all(){
			var_dump('@@@',get_class($this));
		}
	}
?>
