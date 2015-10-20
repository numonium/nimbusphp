<?php
	/* juniper/lib/model/sites - library to objectify multiple sites
		juniper + nimbus © 2010+ numonium //c - all rights reserved	
	*/
	
	_init($_['sites']);
	
	class _Site extends _Model{
#		var $cfg;
#		var $loaded;
		var $id;
		var $name;
		var $slug;
		var $href;
		var $dirs;
		var $dir;
		var $domain;
		var $domains;
		var $doc_root;
#		var $uri_strip;
		var $site;
		
		var $user;
		
		function __construct($args='',$force_init=true){
			global $_;
			
			$this->loaded=false;
			
			if(_is_array($args)){
				if(!empty($args['cfg']) && _is_array($args['cfg'])){
					$this->cfg=$args['cfg'];
					unset($args['cfg']);
				}
				if(isset($args[FETCH_FROM_DB]) && $args[FETCH_FROM_DB]!==false){
					if($site=$_['db']->getSingle($_['db']->getTableName($this),$_['db']->where($args))){
						$this->init($site,'',true);
					}
				}else{
					parent::__construct($args,$force_init);
#					$this->init($args,'',true);
				}
				$this->loaded=true;
			}else if(!empty($args)){
				$this->name=$args;
				$this->loaded=true;	
			}else if(empty($args)){
			}
			
			if(empty($this->cfg))
				$this->cfg=$_['cfg']['sites'];
			
			if(!empty($this->id) && is_numeric($this->id)){
				$this->id=intval($this->id);
			}
			
			if(empty($this->force)){
				$this->force=array('www' => false);
			}else if(is_array($this->force) && empty($this->force['www'])){
				$this->force['www']=false;
			}
			
			if(!$_['env']['contexts']['dev'] && !empty($this->force['www']) && intval($this->force['www'])==1){
				$this->force['www']=true;
			}else{
				$this->force=array();
				$this->force['www']=false;
			}
			
			if($_['env']['contexts']['live'] && $this->force['www'] && ($_['url']->pieces['host'][0] != 'www')){ //quickly redirect to www
				$_['url']->redirect('http'.(!empty($_['server']['https']) ? 's' : '').'://www.'.$_['url']->host.$_['url']->uri);
				exit;
			}
			
/*			if(!empty($this->gps_lat) && is_numeric($this->gps_lat))
				$this->gps_lat=doubleval($this->gps_lat);
				
			if(!empty($this->gps_lng) && is_numeric($this->gps_lng))
				$this->gps_lng=doubleval($this->gps_lng);*/
			
			if(empty($this->slug)){
				$this->doc_root=$this->slug=$this->get_slug();
			}
			
			if(empty($this->domains)){
				$this->domains=array(
					'dev' => array(),
					'beta'	=> array(),
					'live'	=> array()
				);
			}			
			
			if(empty($this->domains['dev'])){
				$this->domains['dev'] = $this->slug.'.'.$_['cfg']['domains']['dev'];
			}
			
			if(empty($this->domains['beta'])){
				$this->domains['beta'] = $this->slug.'.'.$_['cfg']['domains']['beta'];
			}
							
			if(!$_['env']['contexts']['dev'] && !empty($this->domains['beta']) && empty($this->domains['live'])){
				$this->domains['live'] = &$this->domains['beta'];
				_env('beta');
			}
			
			if(empty($this->domain)){
				$this->domain = &$this->domains['live'];
			}
				
			$this->dir=$this->get_dirs();
			
			if(!empty($this->dir['/'])){
				add_include_path($this->dir['/']);
			}
			
			if(!empty($this->sidebar['position']) && $this->sidebar['position']=='default'){
				$this->sidebar['position']=$_['cfg']['sidebar']['position']['_'];
			}
			
#			if($this->is_global())
#				$this->href='//'.(!$_['env']['contexts']['live'] ? $this->domains['live'].'.'.$_['domain'] : ($this->force['www'] ? 'www.' : '').$this->domain);
#			else
				$this->href='//'.($_['env']['contexts']['live'] && $this->force['www'] ? 'www.' : '').$this->domains[$_['env']['context']];
			
			if(!empty($this->template) && _is_array($this->template)){
				if(empty($this->template['id']) && $_['db']->numRows('sites-templates',$_['db']->where(array('site-id' => $this->id)))>0){
					$row=$_['db']->getSingle('sites-templates',$_['db']->where(array('site-id' => $this->id)));
					$this->template['id']=$row['template']['id'];
				}
				
				if(!empty($this->template['id'])){
					$this->template=new _Template(array(
						'id' => $this->template['id'],
						FETCH_FROM_DB => true
					));
				}				
			}else if(!empty($this->template) && is_string($this->template)){
				$this->template = new _Template(array(
					'slug' => $this->template,
					FETCH_FROM_DB => true
				));
			}
			
			$this->template_global=new _Template(array('slug' => '_', FETCH_FROM_DB => true));
			
			if(!empty($this->theme) && _is_array($this->theme) && !empty($this->theme['color'])){
				$this->theme = new _Theme(array(
					'slug' => $this->theme['color'],
					FETCH_FROM_DB => true
				));
			}else if(!empty($this->theme) && _is_array($this->theme) && !empty($this->theme['id'])){
				$this->theme = new _Theme(array(
					'id' => $this->theme['id'],
					FETCH_FROM_DB => true
				));			
			}
			
			if(!empty($this->company) && _is_array($this->company) && !empty($this->company['id'])){
				$this->company = new _Company(array(
					'id' => $this->company['id'],
					FETCH_FROM_DB => true
				));			
			}
			
			$this->forms = $this->get_forms();
			
			if(!empty($this->widgets) && _is_array($this->widgets)){
				$widgets=array();
				foreach($this->widgets as $widget=>&$active){
					if(_bool($active)){
						$widgets[$widget]=new _Widget(array(
							'slug'	=> $widget,
							FETCH_FROM_DB => true,
							'site'	=> &$this,
//							'delay_load'	=> true
						));
					}
				}
				
				$this->widgets=$widgets;
			}else if(!empty($this->id) && ($widgets=$_['db']->getAll('sites-widgets',array('site-id' => $this->id)))){
				$this->widgets=array();
				foreach($widgets as $wkey=>$widget){
					$w=new _Widget(array(
						'id'	=> $widget['widget']['id'],
						FETCH_FROM_DB => true,
						'site' => &$this
					));
					if(is_object($w) && !$w->hidden){
						$this->widgets[$w->slug]=$w;
					}
				}
			}
			
			$this->remove_from_db(array('cfg','loaded','href','site','template_global','uri_strip','geo'));
		}
		
/*		function __destruct(){
			global $_;
			
			$this->suspend();
		}*/
		
		function get_content_types(){
			global $_;
			
			$id=false;
			
			if(!empty($this->industry) && _is_array($this->industry) && !empty($this->industry['id'])){
				$id = $this->industry['id'];
			}else if(!empty($this->industry) && is_object($this->industry) && !empty($this->industry->id)){
				$id = $this->industry->id;
			}
			
			if(empty($id)){
				return false;
			}
			
			$ret = array();
			
			if($types = $_['db']->getAll('industries-content_types',array('industry-id' => $id))){
				foreach($types as $tkey => &$type){
					if($type = $_['db']->getSingle('content_types',array('uuid' => $type['content_type']['uuid']))){
						$type = new _($type);

						if(!empty($type->slug) && empty($ret[$type->slug])){
							$ret[$type->slug] = $type;
							unset($ret[$tkey]);
						}else{
							$ret[] = $type;
						}
					}
				}
			}
			
			return (_is_array($ret) ? $ret : false);
		}
		
		function get_dirs(){
			global $_;
			
			$_dirs=$dirs=array();
			
			if(!empty($this->id) && $_['db']->numRows('dirs',"`site-id`='".$this->id."'")>0){
				$dirs=$_['db']->getAll('dirs',"`site-id`='".$this->id."'");
			}else if($_['db']->numRows('dirs',"`site-id`='".$_['cfg']['sites']['global-site-id']."'")>0){
				$dirs=$_['db']->getAll('dirs',"`site-id`='".$_['cfg']['sites']['global-site-id']."'");
			}
			
			foreach($dirs as $key=>$d){
				$_dirs[$d['slug']]=$d['path'];
			}
			
			if(!empty($this->doc_root) && is_dir($_['.'].$_['/']['sites'].'/'.$this->doc_root)){
				$_dirs['/'] = $_['.'].$_['/']['sites'].'/'.$this->doc_root;
				$_dirs['.']=&$this->doc_root;
			}else if(!empty($this->slug) && is_dir($_['.'].$_['/']['sites'].'/'.$this->slug)){
				$_dirs['/'] = $_['.'].$_['/']['sites'].'/'.$this->slug;
				$_dirs['.']=&$this->slug;
			}else if(is_dir($_['.'].$_['/']['sites'].'/'.$_['server']['http-host'])){ //will default to global directory on site that has not been cemented yet
				$_dirs['/'] = $_['.'].$_['/']['sites'].'/'.$_['server']['http-host'];
				$_dirs['.'] = $_['server']['http-host'];
			}
			
			$_dirs['+'] = '/+';
			$_dirs['/+'] = $_dirs['/'].$_dirs['img'].$_dirs['+'];
			$_dirs['.+'] = '/site'.$_dirs['img'].$_dirs['+'];
			
			return $_dirs;
		}
		
		function get_forms(){
			global $_;
			
			if(empty($this->id)){
				return false;
			}
			
			if(!empty($this->forms) || !_is_array($this->forms)){
				$ret=array();
				
				if($forms=$_['db']->getAll($_['db']->getTableName($this).'-forms',array('site-id' => $this->id))){
					foreach($forms as $fkey=>&$form){
						if(!empty($form['form']['id'])){
							$form['form'][FETCH_FROM_DB]=true;
							$ret[]=new _Form($form['form']);
						}
					}
					return (count($ret)>0 ? $ret : false);
				}else{
					return false;
				}
			}
			
			return $this->forms;
		}
		
		/* ~EN: i think this method will be eventually replaced by _Router::route() *
		function get_pages($url=''){
			global $_;
			
			if(!empty($url)){
				if(!is_object($url) && is_string($url)){
					$url=new _URL($url);
				}
				
				if($_['db']->numRows('pages',"`site-id`='".$this->ID."' and lower(href)='".$_['db']->escape($url->uri)."'")>0){ //check to see if dynamic content page
					return $_['db']->getSingle('pages',"`site-id`='".$this->ID."' and lower(href)='".$_['db']->escape($url->uri)."'");
				}else if($file=_file_exists($url->uri) || $file=_file_exists(rtrim($url->uri,' /?').'.php')){ //browse locally (doc-root + template-doc-root + include-path)
					return array(
						'file' => $file
					);
				}else if($mvp=$url->get_mvp()){ //parse url
					return array(
						'paths'	=> $mvp
					);
				}
				
				return false;
			}
			
			return $_['db']->getAll('pages',"`site-id`='".$this->ID."'");
		}*/
		
		/* ~EN: lists all pages for a given Site */
		function get_pages($filter=''){
			global $_;
			
			$ret=array();
			$tbl=$_['db']->getTableName($this);
			
			if($pages=$_['db']->getAll($tbl.'-pages', array('site-id' => $this->id))){
				$found_page=false;
				foreach($pages as $pkey=>$p){

					$page = new _Page(array('id' => $p['page']['id'], FETCH_FROM_DB => true));
					
/*					$page->nav['order']=$p['nav']['order'];
					if(isset($page->nav['order'])){
						$page->_order=$page->nav['order'];
					}
					
					if(!empty($p['redux']) && _is_array($p['redux'])){
						foreach($p['redux'] as $rkey=>$rval){ // overwrite $page properties with site-specific info
							if(isset($rval) && $rval!='')
								$page->$rkey=$rval;
						}
					}*/
					
					if($filter=='nav' && _bool($page->nav['hidden'])){
						unset($page);
						continue;
					}
					
					if(!empty($page->slug) && empty($ret[$page->slug])){
						$ret[$page->slug] = $page;
					}else{
						$ret[]=$page;
					}
					
					unset($page);
				}
			}
			
			$ids=array_col($ret,'id');
			
			if($pages=$_['db']->getAll('pages',"(`site-id`='".$this->id/*."' or `site-id`='".$_['cfg']['sites']['global-site-id']*/."') and active='1'",WILDCARD,"`site-id` desc")){
				foreach($pages as $pkey=>$p){
					if(_is_array($ids) && !in_array(intval($p['id']), $ids)){
						$page = new _Page(array('id' => $p['id'], FETCH_FROM_DB => true));
						
						if(isset($page->nav['order'])){
							$page->_order=$page->nav['order'];
						}

						if(!empty($page->slug) && empty($ret[$page->slug])){
							$ret[$page->slug] = $page;
						}else{
							$ret[]=$page;
						}

						unset($page);
					}
				}
			}
			
			return (_is_array($ret) && uasort($ret, 'cmp_order') ? $ret : false);
		}
		
		function get_slug(){
			global $_;
			
			$tbl=$_['db']->getTableName($this);
			
			if(empty($this->slug) && !empty($this->name)){
				$slug=slug($this->name);
			}else{
				$slug=$this->slug;
			}
			
			$sql = "lower(`slug`) = '".strtolower($slug)."'";
			
			$sql_id='';
			
			if(!empty($this->id)){
				$sql_id=" and id <> '".$this->id."'";
				$sql.=$sql_id;
			}
			
			// 1 - try to find literal match
			if($_['db']->numRows($tbl,$sql)){

				// 2 - try long/legal name
				if((!empty($this->name_legal) && $_['db']->numRows($tbl,"lower(`slug`) = '".slug($this->name_legal)."'".$sql_id)) || (empty($this->name_legal))){

					// 3 - append slug(city)
					if((!empty($this->company) && is_object($this->company) && !empty($this->company->address) && $_['db']->numRows($tbl,"lower(`slug`) = '".strtolower($slug.'-'.slug($this->company->address['city']))."'".$sql_id)) || (empty($this->company))){
					
						// 4 - append slug(state)
						if((!empty($this->company) && is_object($this->company) && !empty($this->company->address) && $_['db']->numRows($tbl,"lower(`slug`) = '".strtolower($slug.'-'.slug($this->company->address['city']).'-'.slug($this->company->address['state']))."'".$sql_id)) || (empty($this->company))){
							
							// 5 - just append a number to slug
							$num=1;
							while($_['db']->numRows($tbl,"lower(`slug`) = '".strtolower($slug.$num)."'")){
								$num++;
							}
							
							return $slug.$num;
							
						}else{
							return strtolower($slug.'-'.slug($this->company->address['city']).'-'.slug($this->company->address['state']));
						}
					
					}else{
						return strtolower($slug.'-'.slug($this->company->address['city']));
					}

				}else{
					return slug($this->name_legal);
				}				
			}else{
				return $slug;
			}
		}
		
		# ~EN (2015): is URL a 301?
		function has_301($args){
			global $_;
			
			if(!_is_array($args) && !empty($args)){
				$args=array('href' => $args);
			}
			
			if(!is_object($_['url'])){
				$_['url'] = new _URL($_['url']);
			}
			
			$tbl=$_['db']->getTableName($this);
			
			$uri = $_['db']->escape(!empty($args['href']) ? $args['href'] : $_['url']->uri);
			
			if(!endsWith($uri,'/')){
				$uri .= '/';
			}
			
			$found_page=false;
			
			if($ret = $_['db']->getSingle('301s',array('url-from' => $uri))){
				return new _301($ret);
			}
			
			return false;
		}
		
		function has_page($args){
			global $_;
			
			if(!_is_array($args) && !empty($args)){
				$args=array('href' => $args);
			}
			
			if(!is_object($_['url'])){
				$_['url'] = new _URL($_['url']);
			}
			
			$tbl=$_['db']->getTableName($this);
			
			$uri = $_['db']->escape(!empty($args['href']) ? $args['href'] : $_['url']->uri);
			
			$found_page=false;
			
			if( ($pages = $_['db']->getAll($tbl.'-pages', array('site-id' => $this->id))) || ($pages = $_['db']->getAll($tbl.'-pages', array('site-id' => $this->cfg['global-site-id']))) ){			

				foreach($pages as $pkey=>$p){
					$page = new _Page(array('id' => $p['page']['id'], FETCH_FROM_DB => true));
					$preg_matches = array();
					# ~EN (2014): redux to allow preg from db
					
					if(
						!(
							(/*empty($page->href) && */!empty($page->preg) && preg_match('/'.$page->preg.'/i',$uri,$preg_matches)) ||
							(!empty($page->href) && (strtolower($page->href) == strtolower($uri)))
						)
					){
						continue;
					}
										
/*					if(isset($page->nav['order'])){
						$page->_order=$page->nav['order'];
					}
					
					if(!empty($p['redux']) && _is_array($p['redux'])){
						foreach($p['redux'] as $rkey=>$rval){ // overwrite $page properties with site-specific info
							if(isset($rval) && $rval!='')
								$page->$rkey=$rval;
						}
					}*/
					
					$page->matches = $preg_matches;
					$_['url']->matches = &$page->matches;
					
					if(!empty($page->template->view) && $view=$this->template->has_view($page->template->view)){
						if($view[0]=='/'){
							$page->file=$view;	
						}else{
							$page->file=_dir($this->template->dir['/'].'/'.$this->template->views[$page->template->view]);
						}
					}
					
					$page->get_file_content();
					$page->file=false;
									
/*					if($page=$_['db']->getSingle('pages',array('id' => "(`site-id`='".$this->id."' or `site-id`='".$_['cfg']['sites']['global-site-id']."') and active='1' and lower(href)='".$_['db']->escape($this->url->uri)."'",WILDCARD,"`site-id` desc")){
					
						var_dump('*( new )*',$page);
						
						if(!empty($page['template']['view']) && !empty($this->template->views[$page['template']['view']])){
							$page['file']=_dir($this->template->dir['/'].'/'.$this->template->views[$page['template']['view']]);
						}
						
						$page=new _Page($page);
					}*/
					
					if(empty($page->content['_'])){ //page has no content, let's check locally
						$files = array(
							_dir($this->dir['/'].'/'.($_['url']->uri=='/' ? 'index.php' : $_['url']->uri)),
							_dir($this->template->dir['/'].'/'.($_['url']->uri=='/' ? 'index.php' : $_['url']->uri))
						);
						
						foreach($files as $file){
							if(_file_exists($file)){
								$page->content['_']=file_get_contents($file);
								$page->content['plain']=strip_tags($page->content['_']);
								break;
							}
						}
					}
					
					$found_page=true;
					break;
				}
				
			}
			
			if($found_page && is_object($page)){
				return $page;
			}else if($_['db']->numRows('pages',"(`site-id`='".$this->id/*."' or `site-id`='".$_['cfg']['sites']['global-site-id']*/."') and active='1' and lower(href)='".$_['db']->escape($_['url']->uri)."'",WILDCARD,"`site-id` desc")>0){ //check to see if dynamic content page
				
					if($page=$_['db']->getSingle('pages',"(`site-id`='".$this->id/*."' or `site-id`='".$_['cfg']['sites']['global-site-id']*/."') and active='1' and lower(href)='".$_['db']->escape($_['url']->uri)."'",WILDCARD,"`site-id` desc")){
						
						if(!empty($page['template']['view']) && !empty($this->template->views[$page['template']['view']])){
							$page['file']=_dir($this->template->dir['/'].'/'.$this->template->views[$page['template']['view']]);
						}else{
#							return false;	
						}
						
						$page=new _Page($page);
					}
					
					if(empty($page->content['_'])){ //page has no content, let's check locally
						$file = _dir($this->dir['/'].'/'.($_['url']->uri=='/' ? 'index.php' : $_['url']->uri));
						if(_file_exists($file)){
							$page->get_file_content($file);
/*							ob_start();
							require($file);
							$page->content['_']=ob_get_clean();
#							$page->content['_']=file_get_contents($file);*/
							$page->content['plain']=strip_tags($page->content['_']);
						}
					}
					
					return $page;
					
/*					$this->page->model=$page;
					$_['page']=&$this->page->model;
					$this->page->action='view';*/
					
			}
			
			return false;
		}
		
		function is_global(){
			global $_;
			return ($this->id===$_['cfg']['sites']['global-site-id']);
		}
		
		public static function all($filter=true){
			global $_;
			
			if($filter){ //~EN: filter out global site
				$sites=$_['db']->getAll('sites',"id<>'".$_['cfg']['sites']['global-site-id']."'");
			}else{
				$sites=$_['db']->getAll('sites');
			}
			
			if(!$sites){
				return false;
			}
			
			foreach($sites as $key=>&$site){
				$site=new _Site($site);
				if(!(!empty($_['site']) && is_object($_['site']) && $_['site']->id==$site->id)){
					$site->suspend();	
				}
			}
			
			return $sites;
		}
		
		function save($args=''){
			global $_;
			
			$_this=$this; //save old object
			
			$_add=false;
						
			$post=array(); //tmp item storage (items that won't go into db)
			
			//move preliminary objects to tmp array so they won't go into database
			foreach(array('cfg','dirs','forms','loaded','uri_strip') as $key=>$val){
				if(isset($this->$val)){
					$post[$val]=$this->$val;
					unset($this->$val);
				}
			}
						
			foreach(get_object_vars($this) as $key => $val){
				if($key[0]=='_'){
					$post[$key]=$this->$key;
					unset($this->$key);
				}
			}
							
			if(!empty($this->sidebar['placement'])){
				$post['sidebar']['placement']=$this->sidebar['placement'];
				unset($this->sidebar);
			}
			
			if(empty($this->domains)){
				$this->domains = array();
			}
			
			if(empty($this->id)){ //add to database
				$_add=true;
				
				$_slug = (!empty($this->slug) ? $this->slug : uuid($this));
				
				if(empty($this->doc_root)){
					$this->doc_root = $_slug;
				}
												
				unset($_slug);
			
				if(!empty($this->forms)){
					$tbl=$_['db']->getTableName($this);
					//TODO : save forms
				}
								
				if(is_object($this->template) && !empty($this->template->id)){
					if(is_object($this->company) && !empty($this->company->id)){
						$post['sites-templates']['company-id']=$this->company->id;
					}
					
					$post['sites-templates']['site-id']=$this->id;
					$post['sites-templates']['template-id']=$this->template->id;
					
					unset($post['sites-templates']);
				}
				
				if(is_object($this->theme) && !empty($this->theme->id)){
					if(is_object($this->company) && !empty($this->company->id)){
						$post['sites-themes']['company-id']=$this->company->id;
					}

					$post['sites-themes']['site-id']=$this->id;
					$post['sites-themes']['theme-id']=$this->theme->id;

					if(!empty($this->sidebar['placement'])){
						$post['sites-templates']['sidebar-placement']=$this->sidebar['placement'];
					}
					
					unset($post['sites-themes']);

				}
				
				if(!empty($this->widgets) && _is_array($this->widgets)){
/*
					foreach($this->widgets as $wkey=>$widget){
#						$post['sites-widgets']['widget-id'][]=(is_object($widget) ? $widget->id : $widget);
						$_['db']->insert('sites-widgets',array(
							'site-id'	=> $this->id,
							'widget-id' => (is_object($widget) ? $widget->id : $widget)
						));
					}*/
					
					$post['widgets']=$this->widgets;
					
					unset(/*$post['sites-widgets'],*/$this->widgets);
					
				}
			}
			
			foreach($this as $key=>$val){
				if(is_object($val) && !empty($val->id)){
					$post[$key]=$val;
					$ary=array('id' => $val->id);
					$this->$key=$ary;
				}
			}
		
/*			if(is_object($this->template) && !empty($this->template->id)){
				$this->template=array(
					'id'	=> $this->template->id
				);
			}*/
			
			if(empty($this->industry)){
				$this->industry=array('id' => 1); //default industry
			}
			
			parent::save($args);
			
			if(_is_array($post)){
				foreach($post as $key=>$val){
					$this->$key=$val;
				}
				
				if($_add && !empty($this->widgets) && _is_array($this->widgets)){ // add / new site
					
					// get default pages
					if($default_pages=$_['db']->getAll('industries-default_pages',array('industry-id' => $this->industry['id']))){
						foreach($default_pages as $dpkey=>$default_page){
							$_['db']->insert('sites-pages',array('site-id' => $this->id, 'page-id' => $default_page['page']['id']));
						}
					}else{
						for($page_i=1; $page_i<=12; $page_i++){
							$_['db']->insert('sites-pages',array('site-id' => $this->id, 'page-id' => $page_i));
						}
					}
				
					foreach($this->widgets as $wkey=>$widget){
	#						$post['sites-widgets']['widget-id'][]=(is_object($widget) ? $widget->id : $widget);
						$_['db']->insert('sites-widgets',array(
							'site-id'	=> $this->id,
							'widget-id' => (is_object($widget) ? $widget->id : $widget)
						));
					}
					
					return $this->cement();					
				}
			}
			
			return false;			
		}
		
		function cement(){ //called after $this->save() to make folder, subdomain, etc.
			global $_;
							
			if(!empty($this->doc_root) && !is_dir($_['.'].$_['/']['sites'].'/'.$this->doc_root)){
				mkdir(_dir($_['.'].$_['/']['sites'].'/'.$this->doc_root));
				
				// touch dirs
				foreach($_['/']['assets'] as $akey=>$asset){
					mkdir(_dir($_['.'].$_['/']['sites'].'/'.$this->doc_root.'/'.$asset));
					
					if($asset == 'img'){ // add user upload dirs
						mkdir(_dir($_['.'].$_['/']['sites'].'/'.$this->doc_root.'/'.$asset.'/'.$_['/']['uploads']));
						chmod(_dir($_['.'].$_['/']['sites'].'/'.$this->doc_root.'/'.$asset.'/'.$_['/']['uploads']), 0755);
					}
				}
				
				// touch files
				foreach(array('index.php','_.php') as $akey=>$asset){
					touch(_dir($_['.'].$_['/']['sites'].'/'.$this->doc_root.'/'.$asset));
				}
				
			}
			
			$this->dir=$this->get_dirs();
			
			if(!empty($this->_uploaded) && _is_array($this->_uploaded)){
				foreach($this->_uploaded as $fkey => $file){
					$file['type']=new _Mime($file['type']);
					if(move_uploaded_file( $file['tmp_name'], _dir($this->dir['/'].'/img/'.$fkey.'.'.$file['type']->ext) )){
						$file['_uploaded']=true;
					}else{
						$file['_uploaded']=false;
					}
				}
			}
			
			// create preliminary assets
			$gallery = new _Gallery(array('name' => 'Homepage Slideshow', 'site' => &$this));
			$gallery->save();
						
			return (!empty($this->dir['/']));
		}
		
		function suspend(){ //removes site dir from include path
			if(!empty($this->dir['/'])){
				del_include_path($this->dir['/']);
			}
			$this->_suspended=true;
		}
		
		function wake(){ //removes site dir from include path
			if(!empty($this->dir['/'])){
				add_include_path($this->dir['/']);
			}
			$this->_suspended=false;
		}
	
	}
	
	_cfg('sites',array(
		'global-site-id' => 0,
		'main-site-id'	=> 1
	));