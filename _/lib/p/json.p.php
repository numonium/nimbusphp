<?php
	/* juniper/lib/presenter/pages/json - presenters for json
		(juniper + nimbus) (c) 2012+ numonium //c - all rights reserved	
	*/

	global $_;

	class _JSONPresenter extends _PagesPresenter{
		var $model;
		var $view;
	
		function __toString(){
			$ret='';
			if($this->model->selector!=CSS_SELECTOR_INLINE){
				$ret.=$this->model->selector."{\n";
			}
			foreach($this->model->attrs as $key=>$a){
				$ret.=$this->render(array($key => $a));
			}
			if($this->model->selector!=CSS_SELECTOR_INLINE){
				$ret.="}\n";
			}
			
			return $ret;
		}
		
		function render($data=''){
			global $_;
			
			$str = '';
			
			if(empty($data) && !empty($this->model->data) && _is_array($this->model->data)){
				$data = $this->model->data;
			}
			
			if(!empty($data) && _is_array($data)){
				$str = json_encode($data);
			}
			
			return $_['env']['contexts']['dev'] ? $str : minify($str);
		}
	
		function view($args=''){
			global $_;
			
			$_['http']->header('content-type',$_['mime']['json']);
			
			echo $this->render();

		}
	}
?>