<?php
	/* juniper/lib/o/url - url object definitions and helper functions
		(juniper + nimbus) (c) 2012+ numonium //c - all rights reserved	
	*/
	
	global $_;
	
	class _URL extends _ {
		var $protocol;
		var $host;
		var $domain;
		var $content_type;
		var $uri;
		var $path;
		var $vars; //vars for get
		var $pieces;
		var $user;
		var $pass;
		var $q;
		var $tail;
		var $file;
		var $_file; //absolute path of $file
		var $get;	//let's abstract these too
		var $post;	//let's abstract these too
		var $require; //require/include the specified file rather than serving it up
		var $parent; //parent url (typically used for recursion)
		var $referrer;
		var $referer; //linked to $this->referrer
		var $matches; # ~EN (2014): preg/regex uri matches
		
		function __construct($url,$host=''){
			global $_;
			
			$_class = get_class($this);
			
			if(_is_array($url)){
				parent::__construct($url,true);
				
				if(!empty($url['url'])){
					$url = $url['url'];
				}else if(!empty($url['uri'])){
					$url = $url['uri'];
				}
			}
			
			$this->uri=$url;
			$this->path=parse_url($url);
			
			if(!empty($this->path['path'])){
			
				if($this->path['path']!='/' && $this->path['path'][strlen($this->path['path'])-1]=='/'){
					$this->path['path']=substr($this->path['path'], 0, -1);
				}
				
				$this->uri=&$this->path['path'];
			}
			
			if(!empty($this->path['query'])){
				_init($this->vars);
				parse_str($this->path['query'],$this->vars);
			}
			$this->pieces=$pieces=$this->digest($url);
			$this->pieces['url']=$this->pieces;

			$this->protocol=(!empty($this->path['scheme']) ? $this->path['scheme'] : 'http');

			$this->host=($host!='' ? $host : (!empty($this->path['host']) ? $this->path['host'] : $_SERVER['HTTP_HOST']));
			$this->pieces['host']=explode('.',$this->host);
			
			$p=count($this->pieces['host']);
			$this->domain=$this->pieces['host'][$p-2].'.'.$this->pieces['host'][$p-1];
			
			$this->require=false; //serve up the requested file rather than php require()
			
			if(($num_pieces=count($pieces))>0 && strpos($this->pieces[$num_pieces-1],'?')!==false){
				$q=strstr($this->pieces[$num_pieces-1],'?');
				$q=substr($q,1);
				parse_str($q,$_get);
				
				foreach($_get as $key=>$param){
					$_['get'][$key]=$this->get[$key]=$param;
				}
				
				$this->pieces[$num_pieces-1]=strstr($this->pieces[$num_pieces-1],'?',true);
			}
			
			if($this->uri=='/'){
				$this->pieces['url']=array('index.htm');
				$num_pieces=1;
			}
			
			$file=explode('.',array_last($this->pieces['url']));
			if(count($file)==1){ //no file extension given
				$file[]=$_['mime']['html']->ext;
			}
			
			if($num_pieces>0){
				$this->content_type=new _Mime(array_last($file));
			}
			
			if(empty($this->content_type)){
				$this->content_type = $_['mime']['html']->type;
			}
			
			$this->rewrite();
			
			if(!empty($this->path->query)){
				$this->q = &$this->path->query;
			}
			
/*			if(!empty($_['server']['http-referer'])){
				$this->referer = new _URL(array(
					'uri'	=> $_['server']['http-referer'],
					'parent' => &$this
				));
			}*/
			
			if(empty($this->parent) && empty($this->referrer) && !empty($_['server']['http-referrer'])){

				$this->referrer = new $_class(array(
					'uri'	=> $_['server']['http-referrer'],
					'parent'	=> &$this
				));
				
				$this->referer = &$this->referrer;
			}
		}
		
		function __get($name){
			if($name=='subdomain'){
				return $this->getSubdomain();
			}
		}
		
		function __set($name,$value){
			if($name=='uri'){
				$this->__construct($value);
			}
		}
		
		function __toString(){
			return $this->_toString(false);
		}
		
		function _toString($relative=true,$params=true){
			$ret='';
			
			if(!$relative){
				$ret .= $this->protocol.'://'.$this->host;
			}
			
			$ret .= $this->uri;
			
			if($params && !empty($this->vars) && _is_array($this->vars)){
				$ret.='?'.http_build_query($this->vars);
			}
			
			return $ret;
		}
		
		function redirect($url,$responseCode='',$embed=false){
			if($responseCode=='@'){
				$_debug=true;
				$responseCode='';
			}
			
			if(_is_array($url)){
				$_url='?';
				if(!empty($url['_url'])){
					$_url=$url['_url'].$_url;
					unset($url['_url']);
				}
				$_url.=http_build_query($url);
				$url=$_url;
				unset($_url);
			}

			if(!empty($responseCode) && !headers_sent()){
				switch((is_int($responseCode) ? $responseCode : intval($responseCode))){
					default:
	//					header($_['http'][strval($responseCode)]);
						header($_['http']->response[intval($responseCode)]);
						break;
				}
			}
			if(!headers_sent()){
				header('Location: '.$url,true,(!empty($responseCode) ? intval($responseCode) : 0));
				$_SESSION['redirect-from'] = $this->_toString();

				exit;
			}else{
				print '<script type="text/javascript">window.location.href="'.$url.'";</script>';
			}
		}
		
		function build($params){
			return http_build_query($params);
		}
		
		function digest($url=''){
			global $_;
			
			if($url==''){
				$url=$this->uri;
			}
			
			$url=explode((DIRECTORY_SEPARATOR!='' ? DIRECTORY_SEPARATOR : '/'),$url);
			$ret=array();			
			
			foreach($url as $key=>$u){
				if(trim($u)!=''){
					$str= (in_array(trim($u), $_['const']['url']['dir']['whitelist']) ? trim($u) : trim(strip_tags(urldecode($u))));
					
					if(strpos($str,'?')!==false){
						$str=substr($str,0,strpos($str,'?'));
					}
					
					$ret[]=$str;
					
				}
			}
			
			return $ret;
		}
		
		function get_mvp(){
			$pieces=array_values(array_diff(explode('/',$this->uri),array('')));
			$ret=array();
						
			switch(count($pieces)){
				case 0:
					return false;
					break;
				case 1:
					$ret=array(
						'm'	=> singular($pieces[0]),
						'p' => (singular($pieces[0]) == $pieces[0] ? plural($pieces[0]) : $pieces[0]),
						'v'	=> 'view'
					);
					break;
				case 2:
					$ret=array(
						'm'	=> singular($pieces[0]),
						'p' => (singular($pieces[0]) == $pieces[0] ? plural($pieces[0]) : $pieces[0]),
						'v'	=> $pieces[1]
					);
					break;
				default:
					$ret=array(
						'm'	=> singular($pieces[0]),
						'p' => (singular($pieces[0]) == $pieces[0] ? plural($pieces[0]) : $pieces[0]),
						'v'	=> $pieces[1],
						'+'	=> array_slice($pieces,2)
					);
					break;
			}
			
			return (count($ret)>0 ? $ret : false);
		}
		
		function getSubdomain($depth=''){
			$ary=explode('.',$this->host);
			if($depth==''){
				$num=count($ary);
				unset($ary[$num-2],$ary[$num-1]);
				return implode('.',$ary);
			}else if($depth>0){
				$ret='';
				for($i=0; $i<$depth; $i++){
					$ret.=$ary[$i].($i<$depth-1 ? '.' : '');
				}
				return $ret;
			}
			
			return false;
		}
		
		//find a better way to process rewrite rules
		function rewrite(){
			global $_;
			
			if($this->content_type==$_['mime']['js']){
				$this->require=true;
			}
			
			if(!empty($_['site']) && is_object($_['site'])){
				if(count($this->pieces['url'])>=2 && in_array($this->pieces['url'][0],$_['/']['assets'])){ 
					/* rewrites for global assets (img/css/js)
						-> first term in url is asset dir
						* /img/asd.jpg 
						* /img/dir-2/asd.jpg
						* /css/module-name/_.css
						* /js/admin.js
					*/

					$this->file=_dir($_['.'].'/'.$_['/']['templates'].'/'.$_['cfg']['templates']['/']['_'].$this->uri);

				}else if(count($this->pieces['url'])>=3 && $this->pieces['url'][0]=='mod'){
					/* rewrites for module assets/files (img/css/js)
						-> first term in url is "mod"
						-> second term in url is module slug
						-> third term in url is asset dir
						* /mod/lightbox/img/close.png
					*/
					
					if(in_array($this->pieces['url']['2'],$_['/']['assets']) && $file = _file_exists(_dir($_['.'].'/'.$this->uri))){
						$this->file = $file;						
					}

				}else if(count($this->pieces['url'])>=3 && $this->pieces['url'][0]=='site'){
					/* rewrites for site assets/files (img/css/js)
						-> first term in url is "site"
						-> second term in url is asset dir
						* /design/img/asd.jpg 
						* /design/img/dir-2/asd.jpg
						* /design/css/module-name/_.css
					*/			
					

					
					$this->file=_dir($_['site']->dir['/'].'/'.implode('/',array_slice($this->pieces['url'],1))); 
						
				}else if(count($this->pieces['url'])>=4 && $this->pieces['url'][0]=='admin'){
					/* rewrites for site administration
						-> first term in url is "admin"
						-> second term in url is model name
						-> third term in url is presenter action
						-> 4+ term in url is slug, object type, etc.
						* /admin/property/add
						* /admin/news-events/edit
						* /admin/galleries/view
					*/
					
					$params = array(
						'model' 	=> 1,
						'action'	=> 2,
						'id'		=> 3,
						'slug'		=> 4
					);
					
					foreach($params as $pkey=>$param){
						if(!empty($this->pieces['url'][$param])){
							$_['get'][$pkey] = $this->pieces['url'][$pkey] = &$this->pieces['url'][$param];
						}
					}

					if($this->file = $_['site']->template->has_view('admin-modules')){
						$this->require = true;
						
					}else{
						$this->file=_dir($_['site']->dir['/'].'/'.implode('/',array_slice($this->pieces['url'],1))); 
					}
						
				}else if(is_object($_['site']->template) && count($this->pieces['url'])>=3 && in_array($this->pieces['url'][1],$_['/']['assets'])){
					/* rewrites for template assets (img/css/js)
						-> first term in url is "design" or "theme"
						-> second term in url is asset dir
						* /design/img/asd.jpg 
						* /design/img/dir-2/asd.jpg
						* /design/css/module-name/_.css
					*/
					
					if($this->pieces['url'][0]=='design'){
						$obj='template';
					}else if($this->pieces['url'][0]=='theme'){
						$obj='theme';
					}else{
						$obj=false;
					}
					
					if($obj){
						$this->file=_dir($_['site']->$obj->dir['/'].'/'.implode('/',array_slice($this->pieces['url'],1)));
					}
					
				}else if(count($this->pieces['url'])>=3 && $this->pieces['url'][0]=='widgets' && is_dir(_dir($_['.'].'/'.$_['/']['widgets'].'/'.$this->pieces['url'][1]))){
					/* rewrites for widgets
						-> first term in url is "widgets"
						-> second term is widget slug
						-> third term is _.php or asset dir
						* /widgets/news/_.php
						* /widgets/news/img/_.gif -> /widgets/news/themes/victorian/img/_.gif
					*/
					
					$dir=_dir($_['.'].'/'.$_['/']['widgets'].'/'.$this->pieces['url'][1]);
					
					if(count($this->pieces['url'])>=4 && in_array($this->pieces['url'][2],$_['/']['assets']) && ($file = _file_exists(_dir($dir.'/'.implode('/',array_slice($this->pieces['url'],2)))))){
					
						/* look for asset, figure out if there is theme replacement */
						if(is_object($_['site']->theme) && $theme_file=_file_exists(_dir($dir.'/themes/'.$_['site']->theme->slug.'/'.implode('/',array_slice($this->pieces['url'],2))))){
							//$file has already been set
							$file = $theme_file;
							unset($theme_file);
						}
						
						$this->file = $file;
						
					}
					
				}else if(strtolower(array_last($this->pieces['url'])=='submit')){
					/* rewrites for form submission
						-> last term in url is "submit"
						* /interview/submit -> /interview/_.php
					*/
					
					if(count($this->pieces['url'])==2 && $file=_file_exists($this->pieces['url'][0].'/_.php')){
						$this->file=$file;
						$this->require=true;
						unset($file);
					}
					
#					$this->file=_dir($_[)
				}				
			}
			
			if(!empty($this->file) && $fname=explode('.',basename($this->file))){
				//remove UA strings from file
				$this->file=rtrim($this->file,basename($this->file)).implode('.',array_diff($fname,array($_['ua']->stub)));
			}
			
			/*			
			if(count($this->pieces['url'])==2 && in_array($this->pieces['url'][0],array('css','js','img'))){
				$this->file=_dir($_['.'].'/'.$_['/']['templates'].'/'.$_['cfg']['templates']['/']['_'].$this->uri);
			}
			
			*/
		}
		
		public function slug($str='',$replace=array(), $delimiter='-', $charset='ISO-8859-1'){
			if(empty($str) && isset($this))
				$str=$this->uri;
			$str = iconv($charset, 'UTF-8', $str);
			if(!empty($replace)){
				$str = str_replace((array)$replace, ' ', $str);
			}
	
			$clean = iconv('UTF-8', 'ASCII//TRANSLIT', $str);
			$clean = preg_replace("/[^a-zA-Z0-9\/_|+ -]/", '', $clean);
			$clean = strtolower(trim($clean, '-'));
			$clean = preg_replace("/[\/_|+ -]+/", $delimiter, $clean);
			
			return $clean;
		}
	}
?>