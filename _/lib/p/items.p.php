<?php
	/* juniper/lib/presenter - basic presenter (abstract class)
		(juniper + nimbus) (c) 2012+ numonium //c - all rights reserved	
	*/

	global $_;
	
	class _ItemsPresenter extends _Presenter {
		var $model;
		var $view;
		var $slug;
	
		function __construct($args='',$force_init=true){
			parent::__construct($args,$force_init);
			
			if(!empty($this->model) && is_object($this->model)){
				$this->model->presenter = &$this;
			}
		}
	
		public static function all(){
			var_dump('@@@ presenter main all',get_class($this));
		}
	}
?>
