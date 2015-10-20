<?php
	/* juniper/lib/presenter/galleries - presenter for photo galleries
		(juniper + nimbus) (c) 2012+ numonium //c - all rights reserved	
	*/

	global $_;
	
	class _GalleriesPresenter extends _Presenter {
		var $model;
		var $model_class;
		var $view;
		var $tbl;
		
		function __construct($data='',$force_init=true){
			global $_;
			
			parent::__construct($data,$force_init);
		
			if(!empty($this->model) && is_object($this->model)){
				$this->model_class = get_class($this->model);
				$this->tbl = $_['db']->getTableName($this->model_class);
			}
			
		}
	
		public static function all(){
			global $_;
			
			$tbl = 'galleries';
			
			if($items = $_['db']->getAll($tbl, array('site-id' => $_['site']->id))){
				
				foreach($items as $ikey => &$item){
				
					$item = new _Gallery($item);
				
				}
				
				return (count($items) > 0 ? $items : false);
				
			}else{
			
				return false;
				
			}
		
		}
		
		public function admin_add($view=true){
			global $_;
			
			return $this->admin_edit(false,$view);
		}
		
		public function admin_edit($id=false,$view=true){
			global $_;
			
			$model_class = $this->model_class;
			
			parent::admin_edit($id,false);
			
			if(empty($this->page) || empty($this->page_presenter) || empty($this->page_presenter->model)){
				die('[ERR] uh oh - gallery/edit - no page');
			}
			
			/*
			
			$page = array();
			
			if(empty($id) && !empty($_['get']['id'])){
				$id = (is_numeric($_['get']['id']) ? intval($_['get']['id']) : $_['get']['id']);
				$page['gallery'] = new _Gallery(array(FETCH_FROM_DB => true, 'id' => $id));
			}else if(!empty($id) && is_object($id)){
				$page['gallery'] = $id;
			}else if(!empty($this->model)){
				$page['gallery'] = &$this->model;
			}
			
			if(!empty($page['gallery']) && is_object($page['gallery'])){
				$page['obj'] = &$page['gallery'];
			}*/

							
			if($v = _file_exists(_dir($_['.'].'/'.$_['/']['v'].'/admin--galleries--edit.v.php'))){
				$this->page->file = $v;
				$this->page->get_file_content($this->page->file);

				$_['url']->require = false;
				
				$this->page_presenter->view();
				
/*				$page['file'] = $v;
								
				$page = new _Page($page);
				$page->__ = true;				
				
				$presenter = new _PagesPresenter(array('model' => $page, 'template' => $_['site']->template));
				$presenter->view();*/
				
			}else{
				
				echo 'Admin view all galleries, but no view :(';
				var_dump('$ppp page',$page);
				
			}	
		}
		
		public function admin_cement($args){
			global $_;
			
			if(empty($args) || !_is_array($args)){
				return false;
			}
			
			/* TODO - actual stuff
				? is new gallery -> create -> add images
				? existing gallery -> update -> add new images / delete selected images
				
				!! use $this->model->save() and $this->model->images[0]->save()
			*/ 
		}
		
		public function admin_submit($id=false){
			global $_;
			
			$add = $edit = false;

			// sanitise data
			$data=$_['post'];
			
			if(empty($data)){ // no post
				$_['url']->redirect($_['url']->referrer->_toString(false,true)); //use _toString() to preserve embedding
				exit;
			}
			
			foreach(array('_trim','_htmlspecialchars') as $func){
				$data = array_map($func,$data);
			}
			
			// TODO - form validation
			
			if(empty($data['gallery']['name'])){
				$data['gallery']['name'] = $_['cfg']['gallery']['_']['name'];
			}
			
			if(empty($data['name']) && !empty($data['gallery']['name'])){
				$data['name'] = &$data['gallery']['name'];
			}
			
			$data['gallery']['slug']=slug($data['name']);
			$data['slug'] = &$data['gallery']['slug'];
			
			$gallery = false;
						
			if(!empty($data['gallery']['uuid'])){
				
				if(empty($data['uuid'])){
					$data['uuid'] = &$data['gallery']['uuid'];
				}
				
				$gallery = new _Gallery(array(FETCH_FROM_DB => true, 'uuid' => $data['uuid']));
				if(!empty($gallery->found)){ // if not found from db, will create blank _Gallery
					$edit = true;		
				
					foreach($data['gallery'] as $dkey => $val){
						$gallery->$dkey = $val;
					}			
				}else{ // create new gallery, to soon insert into database
					$gallery = false;
				}
			}
			
			if(empty($gallery)){
				$gallery = new _Gallery($data['gallery']);
			}
			
			// handle edits to existing images
			$i=0;
			$images = array();
						
			if((!empty($data['_img']) && _is_array($data['_img'])) || (!empty($_FILES['img']) && _File::did_upload('img'))){
				
				foreach($data['img']['id'] as $key=>$id){
					$id=intval($id);
					if($id==0){
						$i++;
					}
					
					if(isset($data['img']['delete'][$key]) && intval($data['img']['delete'][$key])==1 && $id > 0 && $img=$_['db']->getSingle('images',array('id' => $id))){
						// easy - delete file					
						$this->del_image($id,array_merge($data,array('file' => $img['file'])));
					}else if(isset($data['img']['delete'][$key]) && intval($data['img']['delete'][$key])==1 && !empty($_FILES['img']['error']['file'])){
						//if the photo that's marked for deletion is in uploaded queue
						//because photos in the queue don't have an id, we have to count from how many files have been uploaded
						$_FILES['img']['error']['file'][$i]=-1;
					}else{
						if(!empty($images[$key]) && _is_array($images[$key]) && $img=$_['db']->getSingle('images',array('id' => $id))){
							//user uploaded a photo to replace one currently in gallery
							$this->del_image($id,array_merge($data,array(FETCH_FROM_DB => false, 'file' => $img['file'])));
							$images[$key]['update']=$img['id'];
							$images[$key]['name']=$img['slug'];
						}
						if(isset($data['img']['caption'][$key]) && $id>0 && $_['db']->numRows('images',array('id' => $id))>0){
							//if the photo is marked for deletion, we don't need to worry about updating it
							$_['db']->update('images',array('caption' => $data['img']['caption'][$key]),"id='".$id."'");
						}
					}
				}
				
				$files = $this->upload('img');
				
				if(_is_array($files)){
					$uploaded = true;
					
					foreach($files as $key => $file){
						$images[$key]['lg'] = new _Image(array(
							'file'			=> $file->path,
							'width'			=> $_['cfg']['img']['pics']['main']['width'],
							'thumb_width'	=> $_['cfg']['img']['pics']['gmaps']['width']
						));
																		
						$images[$key]['_'] = $images[$key]['lg']->thumbnail();
						$images[$key]['thumb'] = $images[$key]['_']->thumbnail();
						
						$path = _dir($_['cfg']['gallery']['dir']['_'].'/'.$data['slug'].'/');
						
						/* TODO - allow for custom name overrides
						$name = (!empty($file->name) ? slug($file->name) : uniqid('img')); */
						$name = uniqid('img');
	/*
						$images[$key]['paths']['lg']=_dir($path.$_['cfg']['gallery']['dir']['lg'].'/'.$name.'.'.$images[$key]['lg']->type->ext);
						$images[$key]['paths']['_']=_dir($path.$name.'.'.$images[$key]['_']->type->ext);
						$images[$key]['paths']['thumb']=_dir($path.$_['cfg']['gallery']['dir']['thumb'].'/'.$name.'.'.$images[$key]['thumb']->type->ext);
						*/
												
						$images[$key]['db'] = array(
/*							'gallery-id' => $gallery->id,
							'gallery-uuid'	=> $gallery->uuid,*/
							'uuid'		=> $images[$key]['_']->uuid,
							'gallery'	=> &$gallery,
							'site'		=> &$gallery->site,
							'user'		=> &$_['user'],
							'company'	=> &$gallery->site->company,
/*							'site-id'	=> $_['site']->id,
							'site-uuid' => $_['site']->uuid,
							'user-id'	=> $_['user']->id,
							'user-uuid'	=> $_['user']->uuid,
							'company-id'=> $_['site']->company->id,
							'company-uuid'	=> $_['site']->company->uuid, */
							'name'	=> $name,
							'slug'	=> $name,
							'file'	=> $name.'.'.$images[$key]['_']->type->ext,
							'type'	=> $images[$key]['_']->type,
							'width'	=> $images[$key]['_']->width,
							'height'=> $images[$key]['_']->height,
							'caption' => $data['img']['caption'][$key]
						);
						
	/*						
						var_dump('!!!',$images,$data,$key,'@@@',$_['db']->numRows('images',"slug='".$images[$key]['db']['slug']."'"));
						die();
	*/						
						// TODO - cement
					}
				}	
				
				if(!$gallery->save($images)){
					die('err[presenter][galleries][save]');
				}

			}else if(_is_array($data['img']['id'])){
				//no image uploaded, but maybe caption was edited
				foreach($data['img']['id'] as $key=>$id){
					$id=intval($id);
					if(isset($data['img']['delete'][$key]) && intval($data['img']['delete'][$key])==1 && ($img = $_['db']->getAll('images',"id='".$id."'"))){
#						$this->del_image($id,array_merge($data,array('file' => $data['img']['file'])));						
						$this->del_image($id,array('gallery' => &$gallery));
					}else if(isset($data['img']['caption'][$key])){
						//if the photo is marked for deletion, we don't need to worry about updating it
						$_['db']->update('images',array('caption' => $data['img']['caption'][$key]),"id='".$id."'");
					}
				}
				
/*				if(!$gallery->save()){
					die('err[presenter][galleries][save] - data/img/id');
				}*/
			}else{
/*				if(!$gallery->save()){
					die('err[presenter][galleries][save] - else');
				}*/
			}
						
			$this->redirect('view');
		}
		
		function del_image($id=WILDCARD,$data='',$type=''){
			global $_;
			
			if($id==WILDCARD){
				$_['get']['id']=intval($_['get']['id']);
				$id=$_['get']['id'];
			}
			
			if(!($img = new _Image(array(FETCH_FROM_DB => true, 'id' => $id)))){
				return false;
			}
			
			$gallery = (!empty($data['gallery']) ? $data['gallery'] : $this->model);
			
			foreach(array('.','lg','thumb') as $key => $d){
				if($d == '.'){
					if(is_dir(_dir($_['doc-root'].'/'.$gallery->dir[$d])) && _file_exists(_dir($_['doc-root'].'/'.$gallery->dir[$d].$img->src)) && is_file(_dir($_['doc-root'].'/'.$gallery->dir[$d].$img->src))){
						unlink(_dir($_['doc-root'].'/'.$gallery->dir[$d].$img->src));
					}
				}else{
					if(is_dir(_dir($_['doc-root'].'/'.$gallery->dir['.'].$gallery->dir[$d])) && _file_exists(_dir($_['doc-root'].'/'.$gallery->dir['.'].$gallery->dir[$d].$img->src)) && is_file(_dir($_['doc-root'].'/'.$gallery->dir['.'].$gallery->dir[$d].'/'.$img->src))){
						unlink(_dir($_['doc-root'].'/'.$gallery->dir['.'].$gallery->dir[$d].'/'.$img->src));
					}
				}
			}
			
			if(is_array($data)){
				foreach(array('dir','lg_dir','thumb_dir') as $key=>$d){
					if(!empty($data[$d]) && !is_dir(_dir($_['doc-root'].'/'.$data[$d].'/'.$data['file'])) &&  file_exists(_dir($_['doc_root'].'/'.$data[$d].'/'.$data['file']))){
						unlink((_dir($_['doc-root'].'/'.$data[$d].'/'.$data['file'])));
					}
				}
			}else{	
				$obj=new _Image($id);		
				
				if(!empty($obj->image_path) && !is_dir($_['doc_root'].$obj->image_path) &&  file_exists($_['doc_root'].$obj->image_path)){
					unlink($_['doc-root'].$obj->image_path);
				}
				$obj->image_path='';
	
				if(!empty($obj->lg_image_path) && !is_dir($_['doc_root'].$obj->lg_image_path) && file_exists($_['doc_root'].$obj->lg_image_path)){
					unlink($_['doc-root'].$obj->lg_image_path);
				}
				$obj->lg_image_path='';
	
				if(!empty($obj->thumb_image_path) && !is_dir($_['doc_root'].$obj->thumb_image_path) && file_exists($_['doc_root'].$obj->thumb_image_path)){
					unlink($_['doc-root'].$obj->thumb_image_path);
				}
				$obj->thumb_image_path='';
				
				$this->save($obj);
			}
			
			return (_is_array($data) && $data['@db']===false ? true : $_['db']->delete('images',"id='".$id."'"));
		}
		
		public static function view($id=false){
			
			echo 'Local view '.($id ? 'gallery '.$id : 'all galleries');
			
		}
		
		public function admin_view($id=false,$view=true){
			global $_;
			
			return parent::admin_view($id,$view);
			
/*
			if(empty($id) && !empty($_['get']['id'])){
				$id = $_['get']['id'];
			}
			
			$model_class = $this->model_class;
			
			if(!empty($id) && ($gallery = new $model_class(array(FETCH_FROM_DB => true, 'id' => $id)))){
				
				if(!empty($gallery->id)){
					echo 'Admin view single ';
				}else{
					echo 'Admin gallery not found';
				}
				
				var_dump('@!@',$_['/']['v'],'###',$id,$this->tbl);
				
			}else{
				
				if($v = _file_exists(_dir($_['.'].'/'.$_['/']['v'].'/admin--galleries--view--all.v.php'))){
					
					$page = new _Page(array('file' => $v, 'galleries' => $this->all()));
					$page->__ = true;
					
					$_['url']->require = false;
					$presenter = new _PagesPresenter(array('model' => $page, 'template' => $_['site']->template));
					$presenter->view();
					
				}else{
					
					echo 'Admin view all galleries, but no view :(';
					
				}				
			}	*/
					
		}
	}
?>
