<?php
	/* juniper/lib/presenter/admin - presenter for misc. admin functions
		(juniper + nimbus) (c) 2012+ numonium //c - all rights reserved	
	*/

	global $_;
	
	class _AdminPresenter extends _Presenter {
	
		function __construct($args='',$force_init=true){
			parent::__construct($args,$force_init);
			
			if(!empty($this->model) && is_object($this->model)){
				$this->model->presenter = &$this;
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
		
		public function admin_seo($id=false){
			global $_;
			
			$class_slug = slug(plural(_get_class($_['admin']->model)));
			
			$v = false;
			if(!($v = _file_exists(_dir($_['.'].'/'.$_['/']['v'].'/admin--'.$class_slug.'--seo.v.php')))){
				$v = _file_exists(_dir($_['.'].'/'.$_['/']['v'].'/admin--_--seo.v.php'));
			}
			
			if($v){
				
				$page = new _Page(array('file' => $v, /*$class_slug => $this->all(),*/ 'model_slug' => $class_slug));
				$page->__ = true;
				
				$_['url']->require = false;
				$presenter = new _PagesPresenter(array('model' => $page, 'template' => $_['site']->template));
				$presenter->view();
				
			}else{
				
				echo 'Admin SEO tools ('.$_['admin']->str['model'].'), but no view :(';
				
			}				

			
			return true;
		}
		
		function admin_seo_submit($data,$form=''){
			global $_;

			//data should be vetted before passing here
			if(empty($data) || !_is_array($data) || empty($data['uuid'])){
				return false;
			}
/*						
			if(!empty($data['site']) && _is_array($data['site']) && isset($data['site']['robots']) && intval($data['site']['robots'])!=$_['site']->robots){
				$_['site']->robots = intval($data['site']['robots']);
				
				return $_['site']->save();
			}
			*/
			
			if(!empty($data['page']) && _is_array($data['page'])){
				
				foreach($data['page'] as $pkey => &$page){
				
					if(!empty($page['robots'])){
						$robots = _bool($page['robots']);
						$page = new _Page(array(FETCH_FROM_DB => true, 'uuid' => $pkey));
						
						if(isset($page->robots) && ($page->robots != $robots)){
							$page->robots = $robots;
							$page->save();
						}
					}
				}
			}

			return false;
		}
		
		function admin_submit($data=false){
			global $_;
			
			if(empty($data) && _is_array($_['post'])){
				$data = $_['post'];
			}
			
			if(empty($data['uuid'])){
				return false; //no form
			}
			
			$_form = new _Form(array(FETCH_FROM_DB => true, 'uuid' => $data['uuid']));
			
			switch($_form->uuid){
				case $_['const']['forms']['admin']['seo']['uuid'] :
					
					$ret = $this->admin_seo_submit($data,$_form);
					break;
				default:
					die('admin catchall');
			}


			// ~EN: TODO - only redirect if successful						
#			if($ret){
				$_['url']->redirect($_['url']->referrer->_toString(false,true)); //use _toString() to preserve embedding
				exit;
#			}
			
			//uh oh
			var_dump('@$@$! admin[seo]',$_['url']->pieces,$_form);
			die('545');
			
		}
		
		public function admin_view($id=false){
			global $_;
			
			return parent::admin_view($id);		
		}
	}
?>
