<?php
	/* juniper/lib/presenter/session - presenter for sessions
		(juniper + nimbus) (c) 2012+ numonium //c - all rights reserved	
	*/

	global $_;
	
	class _SessionsPresenter extends _Presenter {
		var $model;
		var $view;
	
		public static function all(){
			var_dump('@@@',get_class($this));
		}
		
		function restore($magic = ''){
			global $_;
			
			if(empty($key) && !empty($this->key)){
				$magic = $this->key;
			}else if(!empty($this->model) && !empty($this->model->magic)){
				$magic = $this->model->magic;
			}else if(empty($magic) && empty($this->model)){
				return false;
			}
			
			if(empty($this->model) && !empty($this->magic)){
				$this->model = new _Session(array('magic' => $this->magic, FETCH_FROM_DB => true));
			}
									
			if((isset($this->model->_db) && $this->model->_db === false) || $this->model->expired){
			
				if($this->model->expired)
					$this->model->delete();
				
				$_['url']->redirect('/');
			}
						
			if(!empty($this->model->action)){
				switch($this->model->action){
					case 'login':
						$this->model->user = new _User(array('uuid' => $this->model->user['uuid'], FETCH_FROM_DB => true));
						$this->model->user->restore_session();
						
						$this->model->delete();
						
						$_['url']->redirect('/');
						break;
				}
				
			}
		}
	}
?>
