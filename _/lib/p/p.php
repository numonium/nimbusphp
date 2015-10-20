<?php
	/* juniper/lib/presenter - basic presenter (abstract class)
		(juniper + nimbus) (c) 2012+ numonium //c - all rights reserved	
	*/

	global $_;
	
	class _Presenter extends _ {
		var $model;
		var $view;
		var $slug;
		var $page;
		var $page_presenter; // should contain reference to page
	
		function __construct($args='',$force_init=true){
			parent::__construct($args,$force_init);
			
			if(!empty($this->model) && is_object($this->model)){
				$this->model->presenter = &$this;
			}
			
			$this->remove_from_db(array('page','page_presenter'));
		}
	
		public static function all(){
			var_dump('@@@ presenter main all',get_class($this));
		}
		
		public function admin_add($view=true){
			global $_;
			
			return $this->admin_edit(false,$view);
		}
		
		public function admin_edit($id=false,$view=true){
			global $_;
			
			$model_class = $this->model_class;
			$item_slug = _get_class($_['admin']->model);
			$class_slug = slug(plural($item_slug));
			$item_slug = slug($item_slug);
			$file_view = ($_['admin']->view == 'add' ? 'edit' : $_['admin']->view);
			$_['admin']->str['class-slug'] = &$class_slug;
			
			$page = array();
			
			if(empty($id) && !empty($_['get']['id'])){
				$id = (is_numeric($_['get']['id']) ? intval($_['get']['id']) : $_['get']['id']);
				$page[$item_slug] = new $model_class(array(FETCH_FROM_DB => true, 'id' => $id));
			}else if(!empty($id) && is_object($id)){
				$page[$item_slug] = $id;
			}else if(!empty($this->model)){
				$page[$item_slug] = &$this->model;
			}
						
			if(!empty($page[$item_slug]) && is_object($page[$item_slug])){
				$page['obj'] = &$page[$item_slug];
			}
							
			if(!($v = _file_exists(_dir($_['.'].'/'.$_['/']['v'].'/admin--'.$class_slug.'--'.$file_view.'.v.php')))){
				$v = _file_exists(_dir($_['.'].'/'.$_['/']['v'].'/admin--_--'.$file_view.'.v.php'));
			}
			
			if($v){
			
				
				$page['file'] = $v;
								
				$this->page = (is_object($page) ? $page : new _Page($page));
				$this->page->__ = true;
				
				$this->page->class_slug = $class_slug;
				
				
				$this->page->action = false;
				if(!empty($_['get']['action'])){
					$this->page->action = $_['get']['action'];
				}
				
				$this->page->from = false;
				
				$from = array();
				
				if(!empty($_['get']['from']) && _is_array($_['get']['from'])){
				
					$from['uuid'] = $_['get']['from']['uuid'];
					
					if($className = uuid_to_class($from['type'])){
			
						$obj = new $className(array(FETCH_FROM_DB => true, 'uuid' => $from['uuid']));
						if($obj->found){
							$this->page->from = $obj;
						}
						
					}
				}
				
				$_['url']->require = false;
				$this->page_presenter = new _PagesPresenter(array('model' => &$this->page, 'template' => $_['site']->template));
				
				if($view){ // if false, allow caller function to handle rendering
					$this->page_presenter->view();
				}
				
			}else{
				
				echo 'Admin view all '.$class_slug.', but no view :(';
				var_dump('$ppp page',$this->page);
				
			}	
		}
		
		public function admin_submit($save=false){
			global $_;
			
			if($save){
				return $this->model->save();
			}
			
			return false;
		}
		
		public function admin_view($id=false,$view=true){
			global $_;
			
			if(empty($id) && !empty($_['get']['id'])){
				$id = $_['get']['id'];
			}
			
			$model_class = $this->model_class;
			
			if(!empty($id) && ($item = new $model_class(array(FETCH_FROM_DB => true, 'id' => $id)))){
				
				if(!empty($item->id)){
					echo 'Admin view single ';
				}else{
					echo 'Admin gallery not found';
				}
				
				var_dump('@!@',$_['/']['v'],'###',$id,$this->tbl);
				
			}else{
				$class_slug = slug(plural(_get_class($_['admin']->model)));
				
				$v = false;
				if(!($v = _file_exists(_dir($_['.'].'/'.$_['/']['v'].'/admin--'.$class_slug.'--view--all.v.php')))){
					$v = _file_exists(_dir($_['.'].'/'.$_['/']['v'].'/admin--_--view--all.v.php'));
				}
				
				if($v){
					
					$this->page = new _Page(array('file' => $v, $class_slug => $this->all(), 'model_slug' => $class_slug));
					$this->page->__ = true;
					
					$_['url']->require = false;
					$this->page_presenter = new _PagesPresenter(array('model' => &$this->page, 'template' => $_['site']->template));
					
					if($view)
						$this->page_presenter->view();
					
				}else{
					
					echo 'Admin view all '.$_['admin']->str['model'].', but no view :(';
					
				}				
			}			
		}
		
		// admin - redirect to other admin section to abstract urls
		function redirect($view,$model=''){
			global $_;
			
			if(empty($model)){
				$model = $this->model;
			}
			
			if(is_object($model)){
				$model = _get_class($model);
			}
			
			$url = _dir('/admin/'.strtolower(plural($_['admin']->str['model'])).'/'.$view.(isset($_['url']->referrer->vars['embed']) ? '?embed' : ''));
			$_['url']->redirect($url);
			
			exit;
		}
		
		function upload($files=false,$class='_'){ // take http post upload files -> obj
			if(empty($files)){
				$files = $_FILES;
			}
			
			$_files = array();
			$num_files = 0;
			
			if(is_string($files)){
				
				if(!empty($_POST['_'.$files]) && _is_array($_POST['_'.$files])){
					$_files['_data'] = $_POST['_'.$files];
				}
								
				if(!empty($_FILES[$files])){
					$_files = array_merge($_files,$_FILES[$files]);
				}
				
				if(_is_array($_files)){
					$files = $_files;
					$_files = array();
				}
				
			}else if(!_is_array($files)){
				return false;
			}
			
			$num_files = count($_files);
			
			if(!empty($files['_data'])){ // data url uploads
				foreach($files['_data']['data'] as $dkey => $data){
					if(empty($data))
						continue;
						
					$file = new _File(array(
						'data-uri'	=> $data
					));
					
					$_files[] = $file;
					$num_files++;
				}
				
			}else if(!empty($files['error']['file'])){
				foreach($files['error']['file'] as $ekey => $error){
					switch($error){
						case 0:
							$_files[$ekey] = true;
							$num_files++;
							break;
					}
				}
			}
			
			if(_is_array($_files)){
				$i = -1;
				foreach($_files as $fkey => &$file){
					$i++;
					
					// handle files previously created via data uri
					if(is_object($file)){
						continue;
					}
					
					if($file !== true){
						return false;
					}

					$file = new _File(array(
						'name' => $files['name']['file'][$fkey],
						'type'	=> $files['type']['file'][$fkey],
						'path'	=> $files['tmp_name']['file'][$fkey],
						'size'	=> $files['size']['file'][$fkey],
						'index' => $i
					));
				}
				
				return $_files;
			}
			
			return ($num_files ? $_files : false);
		}
	}
?>
