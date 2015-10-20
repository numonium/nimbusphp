<?php
	/* juniper/lib/presenter/lists - presenter for lists (auto-complete)
		(juniper + nimbus) (c) 2012+ numonium //c - all rights reserved	
	*/

	global $_;
	
	class _ListsPresenter extends _Presenter {
		var $model;
		var $view;
		var $slug;
	
		function __construct($args='',$force_init=true){
			parent::__construct($args,$force_init);
		}
		
		function ac($type=false){ //autocomplete stuff
			global $_;
			
			$class = false;
			
			if(!empty($this->model->slug)){
				$class = keytoclass(singular($this->model->slug));
				if(!class_exists($class)){
					$class = false;
				}
			}
			
			$args = array();
			if(!empty($this->model->type)){
				$args['type'] = $this->model->type;
			}
			
			if(method_exists($class,'all') && ($all = $class::all( _is_array($args) ? $args : '', true ))){
				$all = new _JSON(array('data' => $all));
				$presenter = $_['router']::get_presenter($all);
				$presenter = new $presenter(array('model' => $all));
				
				$presenter->view();
			}
		}
	
		public static function all(){
			var_dump('@@@ presenter main all',get_class($this));
		}
		
		public function admin_add(){
			global $_;
			
			return parent::admin_add();
		}
		
		public function admin_edit($id=false){
			global $_;
			
			return parent::admin_edit($id);
		}
		
		public function admin_view($id=false){
			global $_;
			
			return parent::admin_view($id);
		}

	}
?>
