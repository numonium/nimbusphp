<?php
	/* juniper/lib/o/router - determines correct route for given URL
		juniper + nimbus © 2010+ numonium //c - all rights reserved	
	*/
	
	global $_;
	
	class _Router extends _ {
		var $cfg;
		var $url;
		var $site;
		/* use ^  to figure out v */
		var $page;
		var $model;
		var $presenter;
		var $action;
		var $template;
		var $view;
		var $content;
		var $admin = false;
		var $user;
		
		function __construct($url='',$site=''){
			global $_;
			
			if(empty($url) && !empty($_['url'])){
				$this->url = &$_['url'];
			}else if(!empty($url) || $url===false){
				if($url!==false)
					$this->url=&$url;
				else
					$this->url=false;
			}else if(!empty($url) && is_string($url)){
				$this->url=new _URL($url);
			}
			
			if(!empty($site) || $site===false){
				if($site!==false)
					$this->site=&$site;
				else
					$this->site=false;
			}else{
				$this->site = &$_['site'];
			}
			
			if(empty($this->user) && !empty($_['user'])){
				$this->user = &$_['user'];
			}
			
			$this->uuid = uuid('router');
		}
		
		function prepare($url=''){
			global $_;
			
			if(empty($url)){
				if(!empty($this->url)){
					$url = &$this->url;
				}else{
					return false;
				}
			}
			
			if(is_string($url)){
				$url = new _URL($url);
			}
					
			$assets = array();
			foreach(array($_['/']['img'],$_['/']['widgets']) as $dkey => $d){
				$assets[] = trim($d,'/');
			}
			
			$url->rewrite(); //bring up site/template-level rewrites
			
			# ~EN (2014): admin switches -> _Site::has_page automatically includes page content
			if(!empty($url->pieces[0]) && ($url->pieces[0] == 'admin')){
				
				
				$_['admin'] = new _Admin(array(
					'url'	=> &$url,
					'site'	=> &$this->site,
					'user'	=> &$this->user
				));
			}
			
			if(!empty($url->pieces[0]) && ($url->pieces[0] == 'build') && !empty($url->pieces[1])){ # ~EN (2015): opt/build -> build asset with given session id or query
				$_['env']['build'] = true;
				$_['build'] = &$_['env']['build'];
				
				$p_args = array();
				if(!empty($_['get']['sid'])){
					$p_args['sid'] = $_['get']['sid'];
				}
				
				if(!empty($_['get']['q'])){
					$p_args['q'] = $_['get']['q'];
				}
				
				if(!empty($_['get']['hash'])){
					$p_args['hash'] = $_['get']['hash'];
				}
				
				$this->presenter = new _PagesPresenter();
				return $this->presenter->build($url->pieces[1],$p_args);
				
			}else if($url->content_type==$_['mime']['css']){ //rewrite css files
				if($url->pieces['url'][0]=='mod'){
					$url->file=$_['.'].$url->uri;
					$url->rewrite();
				}
				
				
				$this->model=new _CSS(array('file' => $url->file));
				$_['page']=&$this->model;
				$this->action='view';
				
			}else if($url->pieces['url'][0] == 'ac'){ //auto-complete lists
				$args = array();
				if(!empty($url->pieces['url'][1])){
					$args['slug'] = $url->pieces['url'][1];
				}
				if(!empty($url->pieces['url'][2])){
					$args['type'] = $url->pieces['url'][2];
				}
				
				
				$this->model = new _List($args);
				$this->presenter = $this->get_presenter($this->model);					
				$this->action = 'ac';
			}else if($page=$this->site->has_301(array('href' => $_['db']->escape($url->uri)))){
				
				$_['url']->redirect($page->url['to'],301);
/*				var_dump('###!!',$page);
				die();
				
				if(empty($page->content['_'])){ //page has no content, let's check locally
					$file = _dir($this->site->dir['/'].'/'.($url->uri=='/' ? 'index.php' : $url->uri));
					if(_file_exists($file)){
						$page->content['_']=($url->require ? require($file) : file_get_contents($file));
						$page->content['plain']=strip_tags($page->content['_']);
					}
				}
				
				if(!empty($_['admin'])){
					$_['admin']->page = &$page;
				}
				
				$this->model=&$page;
				$_['page']=&$this->model;
				
				$this->action='view';*/

			}else if($page=$this->site->has_page(array('href' => $_['db']->escape($url->uri)))){
				if(empty($page->content['_'])){ //page has no content, let's check locally
					$file = _dir($this->site->dir['/'].'/'.($url->uri=='/' ? 'index.php' : $url->uri));
					if(_file_exists($file)){
						$page->content['_']=($url->require ? require($file) : file_get_contents($file));
						$page->content['plain']=strip_tags($page->content['_']);
					}
				}
				
				if(!empty($_['admin'])){
					$_['admin']->page = &$page;
				}
				
				$this->model=&$page;
				$_['page']=&$this->model;
				
				$this->action='view';

			}else if(
					!($url->pieces['url'][0] == 'mod' && !empty($url->pieces['url'][2]) && in_array($url->pieces['url'][2],$assets) ) &&
					(( ($file=$url->file) && $url->require ) ||
					( 
						!in_array($url->pieces['url'][0],$assets) && 
						( ($file=_file_exists($url->uri)) || ($file=_file_exists(rtrim($url->uri,' /?').'.php')) ) 
					))
				){ //browse locally (doc-root + template-doc-root + include-path)
					

				if($file[0]=='.' && (
					( $_file=_file_exists(_dir($this->site->dir['/'].'/'.substr($file,1))) ) ||
					( $_file=_file_exists(_dir($this->site->template->dir['/'].'/'.substr($file,1))) ) ||
					( $_file=_file_exists(_dir($this->site->template_global->dir['/'].'/'.substr($file,1))) )
				)){
					$file=$_file;
					unset($_file);
/*					}else if($file[0]=='.' && $_file=_file_exists(_dir($this->site->template->dir['/'].'/'.substr($file,1)))){
					$file=$_file;
					unset($_file);
				}else if($file[0]=='.' && $_file=_file_exists(_dir($this->site->template_global->dir['/'].'/'.substr($file,1)))){*/
				}
				
				if(is_dir($file)){
					$file.='/index.php';
				}
				
				$page = new _Page(array(
					'file' => (substr(_dir($file),0,2) == './' ? substr(_dir($file),2) : _dir($file))
				));
				
				if(empty($page->content['_'])){ //page has no content, let's check locally
					
					if($url->pieces['url'][0] == 'mod'){
						$file = _dir($_['.'].$url->uri);
					}else{
						$file = _dir($this->site->dir['/'].'/'.($url->uri=='/' ? 'index.php' : $url->uri));
					}
					
					if(_file_exists($file)){
						$content=file_get_contents($file);
						
						$page->content['_']=$content;
						$page->content['plain']=strip_tags($page->content['_']);
					}
				}
				
				if(!empty($url->content_type) && is_object($url->content_type) && (in_array($url->content_type->ext,array_merge(array_keys($_['const']['ext']['img']),$_['/']['assets'])))){ //send content-type header;
					$_['http']->header('content-type',$url->content_type->type.'; charset='.($page->utf8 ? $_['charsets']['utf8'] : $_['charsets']['iso-latin-1']));
				}
									
				$this->model=&$page;
				$_['page']=&$this->model;
				$this->action='view';
				
/*					return array(
					'file' => $file
				);*/
#				}else{
				//try for file passthrough
#					$url->rewrite();

			}else if($_['db']->numRows('pages',"(`site-id`='".$this->site->id."' or `site-id`='".$_['cfg']['sites']['global-site-id']."') and active='1' and lower(href)='".$_['db']->escape($url->uri)."'",WILDCARD,"`site-id` desc")>0){ //check to see if dynamic content page		

				if($page=$_['db']->getSingle('pages',"(`site-id`='".$this->site->id."' or `site-id`='".$_['cfg']['sites']['global-site-id']."') and active='1' and lower(href)='".$_['db']->escape($url->uri)."'",WILDCARD,"`site-id` desc")){
					
					if(!empty($page['template']['view']) && !empty($this->site->template->views[$page['template']['view']])){
						$page['file']=_dir($this->site->template->dir['/'].'/'.$this->site->template->views[$page['template']['view']]);
					}
					
					$page=new _Page($page);
					
					// if href overwritten by child page, 301 to proper url
					if($page->href!=$_['url']->uri){
						$_['url']->redirect($page->href,301);
					}
				}
									
				if(_User::logged_in() && !empty($page->path) && !empty($page->path['model'])){ // admin + robots
					$itemClass = keytoclass($page->path['model']);
					$item = new $itemClass();
					
					$this->model = $item;
					$this->presenter = $this->get_presenter($this->model);
					if(!empty($page->path['presenter'])){
						$this->action = $page->path['presenter'];
					}else if(!empty($page->path['view'])){
						$this->action = $page->path['view'];
					}else{
						$this->action = 'view';
					}
					
					$_['url']->pieces['url']['action'] = $this->action;
				
				}else{
				
#						var_dump('*( legacy )*');
					
					if(empty($page->content['_'])){ //page has no content, let's check locally
						$file = _dir($this->site->dir['/'].'/'.($url->uri=='/' ? 'index.php' : $url->uri));
						if(_file_exists($file)){
							$page->content['_']=($url->require ? require($file) : file_get_contents($file));
							$page->content['plain']=strip_tags($page->content['_']);
						}
					}
					
					$this->model=$page;
					$_['page']=&$this->model;
					
					if(!empty($this->model->path['presenter'])){
						$this->action = $this->model->path['presenter'];
					}else if(!empty($this->model->path['view'])){
						$this->action = $this->model->path['view'];
					}else{					
						$this->action='view';
					}
					
				}
				
//					return $page;
			}else if(!empty($url->file) && $file=_file_exists($url->file)){
				$this->passthrough($url->file);
			}else if(strtolower(array_last($url->pieces['url'])=='submit')){
				$this->form_submit();
			}/*else if($mvp = $url->get_mvp()){ //parse url
				
				switch($mvp['m']){
					case 'session':
						$s = keytoclass($mvp['m']);
						$this->model = new $s(array('magic' => $mvp['+'][0], FETCH_FROM_DB => true));
						break;
					
					
				}
				
				$this->action = $mvp['v'];
				
				if(empty($this->model)){
				
					return $this->_404();
				
/*						return array(
						'paths'	=> $mvp
					);*

				}
			}*/else{
				return $this->_404();
			}
		}
			
		function route($url=''){
			global $_;
			
			if(empty($url)){
				if(!empty($this->url)){
					$url = $this->url;
				}
			}
			
			$_['http']->header('mem');
			$_['http']->header('time');
									
			if(empty($this->model)){
				$this->prepare($url);
			}
			
			$_['http']->header('mem');
			$_['http']->header('time');
						
			if(is_object($this->model)){
				$_['rel-root']=str_replace($_['doc-root'],'',$this->site->dir['/']);
			
				$presenter=$this->get_presenter($this->model);
				$this->presenter = new $presenter(array('model' => &$this->model));
				
				$data = array(
						'model' => &$this->model,
						'site' => &$this->site,
						'template' => &$this->site->template,
						'url'	=> &$url
				);
			
				if(method_exists($this->presenter,$this->action)){
					$action=$this->action;
					$this->presenter->$action($data); //dive right in!~
				
					return true;
				}else if(method_exists($this->model,$this->action)){ //~EN: presently used for robots
					$action=$this->action;
					$this->model->$action($data); //dive right in!~
				
					return true;
				}
			}
				
			return false;
		}
			
#			return $_['db']->getAll('pages',"`site-id`='".$this->id."' or `site-id`='".$_['cfg']['sites']['global-site-id']."')");
		
		public static function get_presenter($model){
			if(is_object($model)){
				$model=get_class($model);
			}
			
			if($model[0]=='_')
				$model=substr($model,1);
			
			return '_'.plural($model).'Presenter';
		}
		
		function passthrough($file=''){
			global $_;
			
			if(is_dir($file)){
				var_dump('$$$ passthrough',$file);
			}
			
			if(empty($file) && !empty($this->url->file) && $file=_file_exists($this->url->file));
			
			if($mime=_Mime::file_content_type($file)){
				$_['http']->headers(array(
					'content-type'	=> $mime,
					'content-transfer-encoding'	=> 'binary',
					'content-length'	=> filesize($file)
				));
				flush();
				readfile($file);
				flush();
				
				/* ~EN: i *know* that we're supposed to close connections, but PHP complains about headers when we try :( *
				$_['http']->header('connection','close'); */
			}
			
#			var_dump('!!!',_Mime::file_content_type($file));
		}
		
		public static function error(){
			//official args ( int $errno , string $errstr [, string $errfile [, int $errline [, array $errcontext ]]] )
			global $_;
			
			_init($_['err']);
			$_['errors']=&$_['err'];
			
			if(func_num_args()==1 && is_array(func_get_arg(0))){
				$args=func_get_arg(0);
			}else{
				$args=args_map(array('id','name','file','line','context'),func_get_args());
			}
			
			var_dump('!@@@',$args['id'],E_USER_NOTICE);
			
			switch($args['id']){
				case E_USER_ERROR:
					$args['slug']='error';
					break;
				case E_USER_WARNING:
				case 2048:
					$args['slug']='warning';
					break;
				case E_USER_NOTICE:
				case 8:
					$args['slug']='notice';
					break;
			}
			
			if(isset($args['context']))
				unset($args['context']);
			
			
			$_['err'][]=new _Error($args);
		}
		
		function form_submit(){
			global $_;
			
			var_dump('!@{ form submit -- probably shouldn\'t be here }',$this->url,'@@@',$_['post']);
		}
		
		function _404(){
			global $_;
			
 			if($page = $this->site->has_page(array('href' => '/404'))){
			
 				if(empty($page->content['_'])){ //page has no content, let's check locally
					$file = _dir($this->site->dir['/'].'/'.($url->uri=='/' ? 'index.php' : $url->uri));
					if(_file_exists($file)){
						$page->content['_']=($url->require ? require($file) : file_get_contents($file));
						$page->content['plain']=strip_tags($page->content['_']);
					}
				}
				
				if(!empty($_['admin'])){
					$_['admin']->page = &$page;
				}
				
				$this->model=&$page;
				$_['page']=&$this->model;
				
				$this->action='view';
				
			}else if($file = $this->site->template->has_view('404')){
				$page = new _Page(array('file' => $file));
				
				if(is_object($page)){
					$this->model = $page;
					$_['page'] = &$this->model;
					$this->action = 'view';
				}

			}
			
			$_['http']->header(404);
			//$this->route();
		}
	}
?>