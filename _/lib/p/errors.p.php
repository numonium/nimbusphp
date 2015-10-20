<?php
	/* juniper/lib/presenter/errors - presenters to make even our errors look beautiful
		juniper + nimbus © 2010+ numonium //c - all rights reserved	
	*/

	global $_;
	
	class _ErrorsPresenter extends _Presenter {
		function view(){
			var_dump('@@@ error',$this);
		}
	}
?>
