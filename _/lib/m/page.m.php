<?php
	/* juniper/lib/model/page - model for web pages
		juniper + nimbus © 2010+ numonium //c - all rights reserved	
	*/

	global $_;
	
	class _Page extends _Model {
		var $type;
		var $doctype;
		var $css;
		var $fonts;
		var $js;
		var $body_classes; //will be compiled into $this->body_class()
		var $modules;
		var $files;
		var $tokens;
		var $site;
		var $file;
		var $nav;
		var $msg;
		var $widget; // reference to current widget
		var $content;
		
		var $loaded = array(); # ~EN (2014): we need to cache the files we've read to prevent code from re-executing. not sure if we should cache the file data itself, since it would be expensive
		
		function __construct($data=false,$force_init=true){
			global $_;
			
			$this->body_classes = $this->css = $this->files = $this->js = array();
			$this->remove_from_db('msg','widget');
			
			if(!empty($data) && _is_array($data) && isset($data[FETCH_FROM_DB])){
#				var_dump('#$$',$_['db']->where($data));
			}
			
			$tbl=$_['db']->getTableName($this);
			
			if(!empty($data) && (!_is_array($data) || (_is_array($data) && empty($data[FETCH_FROM_DB])))){ //standard loading into object
				parent::__construct($data,$force_init);
				
				if(!empty($this->site) && is_object($this->site) && (empty($_['site']) || !is_object($_['site']))){
					$_['site']=&$this->site;
				}
				
				if(empty($this->nav)){
					$this->nav = array();
				}
				
			}else{ //load obj from db
			
				$_debug=false;
				if(!empty($data['_debug'])){
					$_debug=true;
					unset($data['_debug']);
				}
				
				if(empty($this->site) && !empty($data['site'])){
					
					if(is_object($data['site'])){
						$this->site = $data['site'];
					}else{
						$this->site = new _Site(array_merge($data['site'],array(FETCH_FROM_DB => true)));
					}					
					
				}else if(empty($this->site) && !empty($_['site']) && is_object($_['site'])){
					$this->site = &$_['site'];
				}else if(isset($data['site-id'])){
					$this->site = new _Site(array(FETCH_FROM_DB => true,'id' => $data['site-id']));
				}
						
				if(empty($this->nav)){
					$this->nav = array();
				}
				
				if(!empty($this->site) && is_object($this->site)){
					if(!empty($data['site'])){
						unset($data['site']);
					}

					if(!empty($data['site-id'])){
						unset($data['site-id']);
					}					
				}
				
#				$data['site-id'] = $_['cfg']['sites']['global-site-id'];
				
				/* ~EN: for some reason, $this->site gets overwritten when parent constructor is called */
				$site = (!empty($this->site) && is_object($this->site) ? $this->site : false);
				
				/* ~EN: pull master content */
				parent::__construct($data,true);
								
				if($site){
					$this->site = $site;
				}				
				
				if((empty($data['site-id']) || ($data['site-id'] == $_['cfg']['sites']['global-site-id'])) && !empty($this->site) && is_object($this->site)){
					$data['site-id'] = $this->site->id;
				}
				
				/* ~EN: normalise data for redux table */
				$data_redux = $data;
				foreach(array('id','uuid') as $val){
					if(!empty($data_redux[$val])){
						$data_redux['page-'.$val] = $data_redux[$val];
						unset($data_redux[$val]);
					}
				}
				
				/* ~EN: anything that's not an id should have "redux" prepended */
				foreach(array_diff(array_keys($data_redux),array(FETCH_FROM_DB,'site-id','site-uuid','page-id','page-uuid','nav-hidden','nav-order')) as $rkey => $val){
					if($val != 'id'){
						$data_redux['redux-'.$val] = $data_redux[$val];
					}
					unset($data_redux[$val]);
				}
				
				if(is_object($this->site) && $_page=$_['db']->getSingle('sites-'.$tbl,$_['db']->where($data_redux)." and (`redux-active` is null or `redux-active`='1')")){

					if(isset($_page['nav']['order']) && $_page['nav']['order']!=''){
						$this->nav['order']=$_page['nav']['order'];
					}
					
					if(isset($_page['nav']['hidden'])){
						$this->nav['hidden']=$_page['nav']['hidden'];
					}
					
					if(!empty($_page['redux']) && _is_array($_page['redux'])){
						$this->redux($_page['redux']);
					}
				}
				
			}
			
			$tokens = array(
				'header-top'	=> '',
				'footer-bottom'	=> ''
			);
			
			if(!empty($this->tokens) && is_array($this->tokens)){
				$this->tokens = array_merge($this->tokens,$tokens);
			}else{
				$this->tokens = $tokens;
			}
			
			unset($tokens);		
			
/*			if(!empty($this->file) && $this->file=_file_exists($this->file)){
				$this->get_file_content($this->file);

/*				ob_start();
				require($this->file);
				if(!empty($this->content['_'])){
					$this->_content=$this->content;
				}
				
				$this->content=array(
					'_'	=> ob_get_clean()
				);
				
/*				if(!empty($this->_content)){
					$this->content['_']=str_replace(token('content'),$this->_content['_'],$this->content['_']);
				}
				
				$this->content['plain']=trim(strip_tags($this->content['_']));*
				
				$this->render_content();
				
				if(!empty($this->title) && empty($this->slug)){
					$this->slug=slug($this->title);
				}
				
#				$this->content['_']=file_get_contents($file);*/

#			}
			
			foreach(array('css','fonts','js') as $akey=>$asset){
				if(empty($this->$asset)){
					$this->$asset = array();
				}
			}
			
			$this->js['+'] = array();
			
			if(isset($this->nav['order'])){
				$this->_order=$this->nav['order'];
			}
			
			if(!empty($this->title)){
				
				if($_['url']->uri!='/'){
					$this->title.= (!empty($_['site']->name_legal) ? ' - '.$_['site']->name_legal : '').(!empty($_['site']->company->address['city']) ? ' - '.$_['site']->company->address['city'].', ' : '').(!empty($_['site']->company->address['state']) ? $_['site']->company->address['state'] : '');
				}
				
				$this->title=$this->render_content($this->title,false);
				
			}
			
			if(!empty($this->template) && _is_array($this->template)){
				$this->template = new _($this->template);
			}
			
			if(_User::logged_in()){
/*				$this->add_css(array('admin' => '/design/css/admin.css'));
				$this->add_js(array('admin' => '/design/js/admin.js'));
#				$this->css['admin'][] = '/css/admin.css';
#				$this->js['admin'][] = '/js/admin.js';
*/				
				$this->module('ckeditor');
#				$this->module('pw-strength');
			}
			
			$this->module('xfancybox');				
			
			if(!empty($_['ua'])){
				$this->body_classes = array_merge($this->body_classes,$_['ua']->classes());				
			}
						
		}
		
		function __toString(){
			global $_;
			
			if(!empty($this->content['_']))
				return $this->content['_'];
			else if(!empty($this->content['plain'])){
				return $this->content['plain'];
			}else if(!empty($this->content) && is_string($this->content)){
				return $this->content;
			}
			
			return '';
		}
		
		function add_css($file,$type=false,$base=false){
			global $_;
//			return $this->add_file($file,'css',$type);

			if(is_array($file)){
			
				$ret = array();
			
				foreach($file as $fkey => $f){
					$ret[$fkey] = $this->add_css($f,$fkey,$base);
				}
				
				return $ret;
				
			}else{
			
				if(!empty($base) && $file[0]!='/'){
					$file = _dir($base.'/'.$file);
				}
			
				if(empty($this->css[$type])){
					$this->css[$type] = array($file);
				}else if(_is_array($this->css[$type])){
#					var_dump('bbb9',$asset,$this->css,$file,$type,array_merge($this->css[$type],array($file)));
					$this->css[$type] = array_merge($this->css[$type],array($file));
				}else{
					$this->css[$type] = array($this->css[$type], $file);
				}
				
				if(!isset($_['files']['css'][$file])){
					$_['files']['css'][$file] = false;
				}
				
				if(!isset($this->files['css'][$file])){
					$this->files['css'][$file] = true;
				}
				
				return true;
			}
		}
		
		function add_fonts($file,$type=false,$base=false){
			global $_;
			
//			return $this->add_file($file,'fonts',$type);
			if(is_array($file)){
			
				$ret = array();
			
				foreach($file as $fkey => $f){
					$ret[$fkey] = $this->add_fonts($f,$fkey,$base);
				}
				
				return $ret;
				
			}else{
			
				if(!empty($base) && $file[0]!='/'){
					$file = _dir($base.'/'.$file);
				}
			
				if(empty($this->fonts[$type])){
					$this->fonts[$type] = array($file);
				}else if(_is_array($this->fonts[$type])){
#					var_dump('bbb9',$asset,$this->fonts,$file,$type,array_merge($this->fonts[$type],array($file)));
					$this->fonts[$type] = array_merge($this->fonts[$type],array($file));
				}else{
					$this->fonts[$type] = array($this->fonts[$type], $file);
				}
				
				if(!isset($_['files']['fonts'][$file])){
					$_['files']['fonts'][$file] = false;
				}
				
				if(!isset($this->files['fonts'][$file])){
					$this->files['fonts'][$file] = true;
				}
				
				return true;
			}

		}
		
		function add_js($file,$type=false,$base=false){
			global $_;
			
			if(empty($file)){
				return false;
			}
			
//			return $this->add_file($file,'js',$type);


#			if(is_array($file) && !empty($file['package'])){
#				$file = '/js/'.(!empty($_['build']) ? 'opt' : 'package').'/'.$file['package'].'.js';
#			}

			if(is_array($file)){
			
				$ret = array();
			
				foreach($file as $fkey => $f){
					$ret[$fkey] = $this->add_js($f,$fkey,$base);
				}
				
				return $ret;
				
			}else{
				
				if(empty($base) && $file[0]!='/' && ($type=='package')){
					$file = _dir('/js/'.(!empty($_['build']) ? 'opt' : 'package').'/'.$file.'.js');
				}else if(!empty($base) && $file[0]!='/' && $type!='+'){
					$file = _dir($base.'/'.$file);
				}
				
				if(!empty($file) && !empty($type) && $type=='+'){
					$this->js[$type][] = $file;
					
					return true;
				}
				
				$js = '';
				
				if(empty($type)){
					$this->js[] = $file;
				}else{
			
					if(empty($this->js[$type])){
					
						$this->js[$type] = array($file);
						
					}else if(_is_array($this->js[$type]) && !in_array($file, $this->js[$type])){
					
	#					var_dump('bbb9',$asset,$this->js,$file,$type,array_merge($this->js[$type],array($file)));
						$this->js[$type] = array_merge($this->js[$type],array($file));					
						
					}else if(!is_array($this->js[$type]) && ($this->js[$type]!=$file) ){
					
						$this->js[$type] = array($this->js[$type], $file);
						
					}
					
				}
				
				if(!isset($_['files']['js'][$file])){
					$_['files']['js'][$file] = false;
				}
				
				if(!isset($this->files['js'][$file])){
					$this->files['js'][$file] = true;
				}
				
				return true;
			}

		}
		
		function add_file($file,$asset=false,$type=false){
			if(empty($asset) || (!is_array($file) && !empty($this->files[$asset][$file]))){
				return false;
			}
			
			if(is_array($file)){
			
				$ret = array();
			
				foreach($file as $fkey => $f){
					$ret[$fkey] = $this->add_file($f,$asset,$fkey);
				}
				
				return $ret;
				
			}else{
			
				if(empty($this->$asset[$type])){
					$this->$asset[$type] = array($file);
				}else if(_is_array($this->$asset[$type])){
#					var_dump('bbb9',$asset,$this->$asset,$file,$type,array_merge($this->$asset[$type],array($file)));
					$this->$asset[$type] = array_merge($this->$asset[$type],array($file));
				}else{
					$this->$asset[$type] = array($this->$asset[$type], $file);
				}
				
				
				$this->files[$asset][$file] = true;
				
				return true;
			}
		}
		
		function admin_header($inserts=''){
			global $_;
		
			return $this->render_content($this->view('admin--header',$inserts),false);
		}
		
		public static function all($args=array()){
			global $_;
			
			$class = __CLASS__;
			$tbl = $_['db']->getTableName($class);
			
			if($pages = $_['db']->getAll('sites-'.$tbl,array('site-id' => $_['site']->id))){
				foreach($pages as $pkey => &$page){
					$page = new _Page(array(FETCH_FROM_DB => true, 'id' => $page['page']['id']));
					
					if(!empty($args)){
						if(!empty($args['type']) && ($page->type != $args['type'])){
							unset($pages[$pkey]);
						}
					}
					
				}
				
				usort($pages, 'cmp_obj_alpha');
			}
			
			return (!empty($pages) && _is_array($pages) ? $pages : false);
		}
		
		function body_class(){
			global $_;
			
			$ret = (!empty($this->body_classes) && _is_array($this->body_classes) ? $this->body_classes : array());
			
			$_['cfg']['page']['body']['admin-class'] = '_-admin';
			
			if($this->page_is_admin() && !in_array($_['cfg']['page']['body']['admin-class'], $ret)){
				$ret[] = $_['cfg']['page']['body']['admin-class'];
			}
			
			if(!empty($_['usr']) && !empty($_['usr']['user'])){
				$ret[] = '_-user--'.$_['usr']['user']->slug;
				
				if(!empty($_['usr']['user']->group)){
					$ret[] = '_-group--'.$_['usr']['user']->group->slug;
				}
			}
			
			return (count($ret) > 0 ? implode(' ',$ret) : false);
		}
		
		function content_has_title($content=false, $title_ele='h1'){
		
			if(empty($content) && !empty($this->content) && !empty($this->content['_'])){
				$content = $this->content['_'];
			}else if(empty($content)){
				return false;
			}
			
			$dom = new simple_html_dom();
			$dom->load($content);
			
			if(count($dom->find($title_ele))){ //detect presence of h1 element in content
				return true;
			}
			
			return false;
			
		}
		
		function footer($inserts=''){
			return $this->view('footer',$inserts);
		}
		
		function get_content($file){
			if($file=_file_exists($file)){
				ob_start();
				require($file);
				$content = ob_get_clean();
			}
			
			return false;
		}
		
		function get_file_content($file='',$force=false){
			global $_;
			
			if(empty($file) && !empty($this->file)){
				$file=$this->file;
			}else if(empty($file)){
				return false;
			}
			
			if($file=_file_exists($file)){
			
				# ~EN (2014): return page from cache
				if(!empty($this->loaded[$file])){
					return $this->loaded[$file];
				}
			
				ob_start();
				require($file);
				if(!empty($this->content['_'])){
					$this->_content=$this->content;
				}
				
				$content = ob_get_clean();
				
				if(mb_detect_encoding($content,'UTF-8',true)){
					
					$this->utf8 = true;
#					$content = utf8_decode($content);
					
#					$content = iconv("UTF-8", "ISO-8859-1",$content);
					
				}else{
					$this->utf8 = false;
				}
								
				$this->content=array(
					'_'	=> $content
				);
				
				$this->loaded[$file] = $content;
				
/*				if(!empty($this->_content)){
					$this->content['_']=str_replace(token('content'),$this->_content['_'],$this->content['_']);
				}
				
				$this->content['plain']=trim(strip_tags($this->content['_']));*/
				
				$this->render_content();
				
				if(!empty($this->title) && empty($this->slug)){
					$this->slug=slug($this->title);
				}
				
				return $this->content;
				
#				$this->content['_']=file_get_contents($file);
			}
			
			return false;
		}
		
		function has_image($file){
			global $_;
			
			$path=array_values(array_diff(explode('/',$file),array('')));
			
			if($path[0]=='site'){
				$path[0]=$_['site']->dir['/'];
			}
			
			$file=implode('/',$path);
			
			if($dir=_is_dir(dirname($file))){
				if($files = _scandir($dir)){
					foreach($files as $fkey=>$f){
						if(
							(
								strpos(array_last($path),'.')===false && array_last($path) == implode('.',array_slice(explode('.',$f),0,-1)
							) ||
							(
								strpos(array_last($path),'.')!==false && array_last($path) == $f)
							)
						){
							return $f;
						}
					}
				}
			}
			
			return false;
		}
		
		function header($inserts=''){
			global $_;
		
			return $this->render_content($this->view('header',$inserts),false);
		}
		
		function header_min($inserts='',$site=''){
			global $_;
			
			if(!empty($site) && is_object($site) && $template = $site->template->has_view('header')){
				
				
			}
			
			
			if($header = $this->header($inserts)){

				$dom = new simple_html_dom();
				$dom->load($header);
				
				$tags = array();
				$tags['head'] = $dom->find('head',0)->outertext;
				
				
				
			}

			var_dump('!$$',$_['site']->template->dir.'/'.$_['site']->template->has_view('header'),$tags);
			
			return false;
			

			
			return $header;
		}
		
		public static function icon($id){
			global $_;
			
			ob_start(); ?>
			
			<span class="_-icon--wrapper"><span class="_-icon _-icon--font--<?php echo $id; ?>"></span></span><?php
				
			return ob_get_clean();			
			
		}
		
		function module($slug,$options='',$set=false){
			global $_;
			
			if(!empty($this->modules[$slug])){
				return false;
			}
			
			$m = new _Module($slug);
			
			if(!empty($options) && _is_array($options)){
				$m->options = _array_merge($m->options,$options);
			}
			
			if(!empty($m->js['+']) && _is_array($m->js['+'])){
				$m->js['+']=str_replace(token('options'), json_encode($m->options), implode("\n",$m->js['+']));
			}

			
			foreach(array('fonts','css','js') as $akey => $asset){
				$func = 'add_'.$asset;
				if(_is_array($m->$asset)){
					$this->$func($m->$asset,false,$m->dir['.']);
								
					$ary = array_flatten(array_merge($_['const']['array']['flatten']['args'],$m->$asset));
					foreach($ary as $fkey => &$file){
						if($asset=='fonts'){
							$m->css=array_merge(array(_dir('/fonts/'.$fkey.'/_.css')),$m->css);
						}else if(!(is_string($fkey) && $fkey=='+')){
							if($file[0]!='/'){
								$file=_dir($m->dir['.'].'/'.$file);
							}
						}
					}
					
//					$this->add_file($ary,$asset);
					
#					if($asset == 'js')
#						var_dump('@@@',$asset,$m->$asset,'###',array_expand($m->$asset),'#$$',array_expand($ary),'$$$',_array_merge($this->$asset,array_expand($m->$asset)),$ary);

#					if(empty($this->files[$file])){
#						$this->$asset = array_expand(_array_merge(array_flatten(is_array($this->$asset) ? $this->$asset : array($this->$asset)),$ary));					
#						$this->files[$file] = true;
#					}
					
					$m->$asset = $ary = array_expand(array_merge($_['const']['array']['flatten']['args'],$ary));

#					var_dump('@222##$',$asset,$m,'****',$this->files,$this->$asset);

/*
					$m->$asset = $ary = array_expand($ary);
					$this->$asset = (_array_merge(is_array($this->$asset) ? $this->$asset : array($this->$asset),$m->$asset));*/

					
					
					if($set){
#						$_['page']->$asset = array_unique(array_merge(is_array($_['page']->$asset) ? $_['page']->$asset : array($_['page']->$asset),$m->$asset));
					}
				}
			}
			
			$this->modules[$slug] = true;
		}
		
		function nav($args=''){
			global $_;
			
			$_args=array(
				'style'	=> $_['site']->template->nav['style'],
				'page'	=> &$this,
				'site'	=> &$_['site']
			);
			
			if(!empty($args) && _is_array($args)){
				$_args=array_merge($_args,$args);
			}
			
			return new _Nav($_args);
		}
		
		# ~EN (2014): determines if page is in administration area
		function page_is_admin(){
			
			return (
				($this->slug == 'admin' || $this->type == 'admin')	
			);
		}
		
		function redux($redux){ //overwrites data from redux table
		
			if(!empty($redux) && is_object($redux)){
				$redux = get_object_vars($redux);
			}else if(empty($redux) || !is_array($redux)){
				return false;
			}
		
			foreach($redux as $rkey=>&$rval){ // overwrite $page properties with site-specific info
			
				if(isset($rval) && $rval!=''){
				
					if(_is_array($rval)){
						$rval=array_diff($rval,array(''));
						
						if(_is_array($rval)){
							$this->{'_'.$rkey}=$this->$rkey;
							$this->$rkey=$rval;
						}
						
/*						
						foreach($rval as $r2key=>$r2val){
							if(isset($rval[$r2key]) && $rval[$r2key]!=''){
								if(!is_array($this->$rkey)){
									$this->$rkey=array();
								}
								
								$this->$rkey[$r2key]=$r2val;
							}
						}*/
					}else{
						$this->{'_'.$rkey}=$this->$rkey;
						$this->$rkey=$rval;
					}
					
				}
				
			}
						
		}
		
		function render_content($html='',$set=true){
			global $_;

			
			if($set && !empty($this->_content['_'])){ //requires both file and content from db
				$this->content['_']=str_replace(token('content'),$this->_content['_'],$this->content['_']);
				unset($this->_content);
			}
			
			$tokens = $this->tokens = array_merge($this->tokens, array(
				'name'	=> (!empty($this->name) ? $this->name : (!empty($_['title']) ? $_['title'] : '')),
				'title'	=> (!empty($this->title) ? $this->title : (!empty($_['title']) ? $_['title'] : '')),
				'content'	=> (!empty($this->content['_']) ? $this->content['_'] : ''),
				'salutation' => (!empty($_['site']->str['salutation']) ? $_['site']->str['salutation'] : '')
#				'company-address-state_full' => (!empty($_['site']->company->address['state']) && !empty($_['loc']['states'][$_['site']->company->address['state']]) ? $_['loc']['states'][$_['site']->company->address['state']] : !empty($_['site']->company->address['state']) ? $_['site']->company->address['state'] : '')
#				'site-name'	=> (!empty($_['site']) && !empty($_['site']->name) ? $_['site']->name : '' )
			));
			
			if(!empty($_['site']->company->address['state']) && !empty($_['loc']['states'][$_['site']->company->address['state']])){
				$tokens['company-address-state_full'] = $_['loc']['states'][$_['site']->company->address['state']];
			}
			
			if($set){
				#$this->content['_']=$tokens['content'];
				
				if(!empty($this->_content)){
					unset($this->_content);
				}
			}
			
			
			$content=str_replace(array_map('token',array_keys($tokens)),array_values($tokens),$html);
						
			if($set){
				$this->content['plain']=trim(strip_tags($html));
			}
			
#			var_dump('$$$',preg_replace("/".$_['cfg']['str']['token']['wrap']."site-(.+)".$_['cfg']['str']['token']['wrap']."/i"))
			$matches=array();
			$tmp='';
/*
			if($matches=preg_replace(
					"/".$_['cfg']['str']['token']['wrap']."site-(.+)".$_['cfg']['str']['token']['wrap']."/i",
					'a'.(true && var_dump("$1") ? strtolower("$1") :  "$1"),
					$content
				)){*/
				
			$matches = $tokens = array();
				
			if(preg_match_all(
					"/".$_['cfg']['str']['token']['wrap']."site-([\w\-]+)".$_['cfg']['str']['token']['wrap']."/i",
					$content, $matches
				)){
				
				if(count($matches)>=2){ //has at least one match, stored at $matches[1]
					if(_is_array($matches[1])){
						foreach($matches[1] as $mkey=>&$match){
							$match=array_pick($_['site'],$match);
							$tokens[$matches[0][$mkey]]=$match;
						}
					}else{
#						$matches[1]=$_['site']->{strtolower($matches[1])};
						$matches[1]=array_pick($_['site'],$matches[1]);
						$tokens[$matches[0]]=$matches[1];
					}
				}
			}
			
			$matches = array();
			
			if(preg_match_all(
					"/".$_['cfg']['str']['token']['wrap']."company-([\w\-]+)".$_['cfg']['str']['token']['wrap']."/i",
					$content, $matches
				)){
				
				if(count($matches)>=2){ //has at least one match, stored at $matches[1]
#					$matches[1]=$_['site']->company->{strtolower($matches[1])};
					
					if(_is_array($matches[1])){
						foreach($matches[1] as $mkey=>&$match){
							$match=array_pick($_['site']->company,$match);
							$tokens[$matches[0][$mkey]]=$match;
						}
					}else{
						$matches[1]=array_pick($_['site']->company,$matches[1]);
						$tokens[$matches[0]]=$matches[1];
					}
				}
			}
			
			$matches = array();
			
			if(preg_match_all(
					"/".$_['cfg']['str']['token']['wrap']."template-([\w\-]+)".$_['cfg']['str']['token']['wrap']."/i",
					$content, $matches
				)){
				
				if(count($matches)>=2){ //has at least one match, stored at $matches[1]
				
					if(_is_array($matches[1])){
						foreach($matches[1] as $mkey=>&$match){
							$match=array_pick($_['site']->company,$match);
							$tokens[$matches[0][$mkey]]=$match;
						}
					}else{
#						$matches[1]=$_['site']->template->{strtolower($matches[1])};
						$matches[1]=array_pick($_['site']->template,$matches[1]);
						$tokens[$matches[0]]=$matches[1];
					}
				}
			}
			
			$matches = array();
			
			if(preg_match_all(
					"/".$_['cfg']['str']['token']['wrap']."page-([\w\-]+)".$_['cfg']['str']['token']['wrap']."/i",
					$content, $matches
				)){
				
				if(count($matches)>=2){ //has at least one match, stored at $matches[1]
					if(_is_array($matches[1])){
						foreach($matches[1] as $mkey=>&$match){
							$match=array_pick($this,$match);
							$tokens[$matches[0][$mkey]]=$match;
						}
					}else{
#						$matches[1]=$this->{strtolower($matches[1])};
						$matches[1]=array_pick($this,$matches[1]);
						$tokens[$matches[0]]=$matches[1];
					}
				}
			}
						
			if(_is_array($tokens)){
				$content=str_replace(array_keys($tokens),array_values($tokens),$content);
			}
			
#			var_dump('###',"/".$_['cfg']['str']['token']['wrap']."site-(.+)".$_['cfg']['str']['token']['wrap']."/i",$matches,'$$$',$content);
		
			return $content;
			
		}
		
		function robots($args=false){
			global $_;
			
			$ret = false;

			ob_start(); ?>
			User-Agent: *
			Disallow: /<?php
			
			$_default = ob_get_clean();

			
			if(/*!$_['env']['contexts']['live'] ||*/ !_bool($_['site']->robots)){ // globally disallow, typically used for dev/beta contexts (TODO - whitelist)
			
				$ret = $_default;
				
			}else if(_bool($_['site']->robots)){ //globally allowed -> blacklist
				$tbl = 'sites-seo-robots';
				
				$used = array();
				if($robots = $_['db']->getAll($tbl,"(`site-id`='".$_['site']->id."' or `site-id`='".$_['cfg']['sites']['global-site-id']."') order by `site-id` desc")){
					foreach($robots as $rkey => &$robot){
						$href = false;
						if(!empty($robot['redux']['href'])){
							$href = $robot['redux']['href'];
						}else if($tmp_page = new _Page(array(FETCH_FROM_DB => true, 'id' => $robot['page']['id']))){
							$href = $tmp_page->href;
						}
						
						// TODO - discern different ua options
						
						if(!empty($href) && empty($used[$robot['page']['id']])){
							$robot['redux']['href'] = $href;
							$used[$robot['page']['id']] = $robot;
						}
						
						unset($href);
					}
					
					if(_is_array($used)){
						usort($used, 'cmp_robots'); //sort pages based on user agent, wildcards up front
						
						$current_ua = false;
						$ret = '';
						
						ob_start();
						
						foreach($used as $ukey => &$use){
							$use['useragent'] = new _UserAgent(array(FETCH_FROM_DB => true, 'id' => $use['useragent']['id']));
							
							if(empty($current_ua) || (!empty($current_ua) && is_object($current_ua) && !empty($current_ua->id) && $current_ua->id!=$use['useragent']->id)){ ?>
								User-Agent: <?php echo (!empty($use['useragent']->slug) ? $use['useragent']->slug : WILDCARD);
								
								$current_ua = $use['useragent'];
								
							}
							
							if(!empty($use['allow'])){ ?>
								Allow: <?php
								
							}else{ ?>
								Disallow: <?php
								
							}
							
							echo $use['redux']['href'];
							
						}
						
						$ret .= ob_get_clean();
					}
				}
			}
			
			echo (!empty($ret) ? $ret : $_default);
		}
		
		function save($args=false){
			global $_;
			
			$tbl = $_['db']->getTableName($this);
			
			if((empty($this->site) || !is_object($this->site)) && !empty($_['site']) && is_object($_['site'])){
				$this->site = $_['site'];
			}
						
			//pages with override info -> pipe back into redux table
			if(is_object($this->site) && $redux=$_['db']->getSingle('sites-'.$tbl,"`site-id`='".$this->site->id."' and `page-id`='".$this->id."' and (`redux-active` is null or `redux-active`='1')")){
			
				if(!empty($redux['redux']['updated'])){
					unset($redux['redux']['updated']);
				}
			
				foreach($redux['redux'] as $rkey => &$r){
					if(isset($this->$rkey)){
						$r = $this->$rkey;
					}
				}
				
				if(!empty($redux['redux']['template']) && ((is_object($redux['redux']['template']) && !empty($redux['redux']['template']->view)) || (is_array($redux['redux']['template']) && $redux['redux']['template']['view'])) && empty($redux['redux']['template-view'])){
					
					$redux['redux']['template-view'] = (is_object($redux['redux']['template']) ? $redux['redux']['template']->view : $redux['redux']['template']['view']);
					unset($redux['redux']['template']);
					
				}

				$_['db']->update('sites-'.$tbl, $redux, $_['db']->where(array('site-id' => $this->site->id, 'page-id' => $this->id)));
			
				return true;	
			}
			
			return false;

		}
		
		function view($name,$inserts=''){
			global $_;
			
			ob_start();
			
			if(!empty($_['site']->template->views[$name]) && $file=_file_exists($_['site']->template->dir['/'].'/'.$_['site']->template->views[$name])){ //search local template
				require($file);
			}else if(!empty($_['site']->template_global->views[$name]) && $file=_file_exists($_['site']->template_global->dir['/'].'/'.$_['site']->template_global->views[$name])){ //search global template
				require($file);			
			}
			
			# ~EN (2015): insert assets, like js and css files
			if(!empty($inserts) && is_array($inserts)){
				foreach($inserts as $ikey => $insert){ # $ikey => 'js','css','fonts'
					if(method_exists($this, 'add_'.$ikey)){
						foreach($insert as $ikey2 => $ins){
							var_dump('@@@##!!',$ins);
#							$this->{'add_'.$ikey}($ins);
						}
					};
				}
			}			
			
			return ob_get_clean();
		}
	}
?>
