<?php
	/* juniper/lib/presenter/pages - page presenter (for lib/presenter/model)
		(juniper + nimbus) (c) 2012+ numonium //c - all rights reserved	
	*/

	global $_;
	
	class _PagesPresenter extends _Presenter {
		var $model;
		var $view;
		var $url;
		
		function __construct($args='',$force_init=true){
			global $_;
			
			parent::__construct($args,$force_init);
						
			if(empty($this->url) && !empty($_['url']) && is_object($_['url'])){
				$this->url = $_['url'];
			}
			
		}
		
		function add(){ // ADMIN - add page to db
			global $_;
			
			if(_is_array($_['post'])){
				
			}else if($p = $_['site']->template->has_view('page-add')){
				$p = new _Page(array('file' => $p, 'require' => true));
				echo $p;
			}
		}
		
		function build($type='css',$args){
			if(method_exists($this, 'build_'.$type)){
				return $this->{'build_'.$type}($args);
			}
			
			return false;
		}
		
		function build_css($args){
			global $_;
			
			$type = 'css';
			$files = array();
			
			if(!empty($args['sid']) && !empty($_SESSION['_']['build'][$type][$args['sid']])){
				$files = $_SESSION['_']['build'][$type][$args['sid']];
			}else if(!empty($args['q'])){
				$files = explode(',',base64_decode($args['q']));
			}
			
			if(empty($files)){
				return false;
			}
			
			$ret = ''; $len = count($files); $i = 0;
			
			foreach($files as $fkey => $file){
				ob_start(); ?>
			
				/* # (<?php echo $i.' / '.$len.' - '. $fkey; ?>) <?php echo $file; ?> { */ <?php
				
				echo "\n\n";
				
				$r = new _Router($file,$_['site']);
				
				$r->route(); ?>
				
				/* } <?php echo $file ?> # (<?php echo $i.' / '.$len.' - '.$fkey; ?>) */ <?php
				
				$r = ob_get_clean() . "\n\n";
				$dir = dirname($file).'/';
				$dir_p = dirname($dir).'/';
				
				$r = str_replace(
					array(
						"url('../",
						'url("../',
						'url("img/'
					),
					array(
						"url('".$dir_p,
						'url("'.$dir_p,
						'url("'.$dir_p.'img/'
					),
				$r);
								
				$ret .= $r;
				$i++;
			}

			$ret = $this->minify_css($ret);
			
			// Enable caching
			header('Cache-Control: public');
			
			// Expire in one day
			header('Expires: ' . gmdate('D, d M Y H:i:s', time() + 86400) . ' GMT');
			
			// Set the correct MIME type, because Apache won't set it for us
			header("Content-type: ".$_['mime']['css']);
			
			echo $ret;

		}
		
		function build_js($args){
			global $_;
			
			$type = 'js';
			$files = array();
			
			if(!empty($args['sid']) && !empty($_SESSION['_']['build'][$type][$args['sid']])){
				$files = $_SESSION['_']['build'][$type][$args['sid']];
			}else if(!empty($args['q'])){
				$files = explode(',',base64_decode($args['q']));
			}
			
			if(empty($files)){
				return false;
			}
			
			$ret = ''; $len = count($files); $i = 0;
			
			
			foreach($files as $fkey => $file){
				ob_start(); ?>
			
				/* # (<?php echo $i.' / '.$len.' - '. $fkey; ?>) <?php echo $file; ?> { */ <?php
									
				echo "\n\n";
				
				if(strpos($file, '/package/') !== false){
					echo js_load($file);	
				}else{
				
					$r = new _Router($file,$_['site']);			
					$r->route();
					
				} ?>
				
				/* } <?php echo $file ?> # (<?php echo $i.' / '.$len.' - '.$fkey; ?>) */ <?php
					
				$ret .= ob_get_clean();
				
				$i++;
					
			}
			
			// Enable caching
			header('Cache-Control: public');
			
			// Expire in one day
			header('Expires: ' . gmdate('D, d M Y H:i:s', time() + 86400) . ' GMT');
			
			// Set the correct MIME type, because Apache won't set it for us
			header("Content-type: ".$_['mime']['js']);

			echo $ret;

		}
		
		function minify_css($buffer){
			
			// Remove comments
			$buffer = preg_replace('!/\*[^*]*\*+([^/][^*]*\*+)*/!', '', $buffer);
			
			// Remove space after colons
			$buffer = str_replace(': ', ':', $buffer);
			
			// Remove whitespace
			$buffer = str_replace(array("\r\n", "\r", "\n", "\t", '  ', '    ', '    '), '', $buffer);
			
			return $buffer;

		}
		
		function render($type=false){
			global $_;
			
			if(!$type){
				$type = $this->model->type;
			}
			
			if(!is_object($this->url)){
				$this->url = new _URL($this->url);
			}
			
			# ~EN (2014): 
			if($this->model->auth_level !== null && $this->model->auth_level !== false){
				if(!_User::logged_in() || (isset($_['usr']['auth_level']) && $_['usr']['auth_level'] > $this->model->auth_level)){
					$redir = new _Page(array(
						FETCH_FROM_DB	=> true,
						'type'	=> 'login'
					));
					
					$_SESSION['_']['form']['login']['redir'] = $_SERVER['REQUEST_URI'];
					
					$_['url']->redirect($redir->href.'?noauth');
				}
			}
			
#			var_dump('$$$@@',$_['usr'],$this->model->auth_level);
			
			$html=false;
			
			if(!empty($this->url->file) && $this->url->require===true){ //make sure the file has been properly vetted by this point!
			
				if($this->url->content_type==$_['mime']['js'] && ($this->url->pieces[1] == 'package')){
				
					$html = js_load($this->url);
				
				}else if(!empty($this->model->content['_'])){
					$html = $this->model->render_content((string) $this->model);
				}else{
					ob_start();
					require($this->url->file);
					$html=ob_get_clean();
				}			
			}else if(!empty($this->template->views[$type])){
			
				if($this->url->content_type==$_['mime']['js'] && $this->url->require===true){
#					$this->model->content['_']=minify($this->model->content['_']);

					$page=new _Page(array(
						'file' => $this->model->file
					));

					$_['http']->header('content-type',$this->url->content_type.'; charset='.($page->utf8 ? $_['charsets']['utf8'] : $_['charsets']['iso-latin-1']));
					
					return $this->model->content['_']; //proceeding causes text encoding errors
					/*
					$page=array(
						'content' => $this->model->content
					);*/
				}else{
					$page=array(
						'file' => (_dir($this->template->dir['/'].'/'.$this->template->views[$type]))
					);
				}

				if(is_object($_['page']) && !empty($page['file']) && empty($this->model->_loaded)){
#					$_['page']->get_file_content($page['file']);
					$page = &$_['page'];
				}else if(empty($this->model->_loaded)){
					$page = new _Page($page);
				}else{
					$page = &$this->model;
				}
				
				# ~EN (2014): IMPORTANT!! possibly requiriing double assets
				foreach(array('css','fonts','js') as $akey=>$asset){ //we add assets after content to preserve ordering
					$page->$asset = (_array_merge(
/*						array(
							'__args' => array(
								'sep' => '--'
							)
						),*/
						$page->$asset,
						$this->model->$asset
					));
				}
				
				$html=(string)$page;
				
				//process html if content type = html
				
				/* ~EN: ie does not properly include text/html in http-accept, so let's just save this for later */

#				if(in_array($_['mime']['html']->type,explode(',',strpos($_['server']['http-accept'],';')!==false ? substr($_['server']['http-accept'],0,strpos($_['server']['http-accept'],';')) : $_['server']['http-accept'] )) || ($_['ua']->slug=='ie' && $_['server']['http-accept']=='*/*')){
					$html=$this->render_html($page);
#				}				
			}
			
			if(!empty($html)){
/*				$html=str_replace(array(token('title'),token('content')),array((!empty($this->model->title) ? $this->model->title : (!empty($_['title']) ? $_['title'] : '')), $this->model->content['_']),$html);*/
				$html=$this->model->render_content($html);
			}
			
			return /*$_['env']['contexts']['dev']*/ true ? $html : minify($html);			
#			return minify($html);
#			return $html;
		}
		
		function render_css($css=false, $dom=false){
			global $_;
			
			if(!$dom && !empty($_['dom']) && is_object($_['dom'])){
				$dom = $_['dom'];
			}else if(!$dom){
				$dom = new simple_html_dom();
			}
			
			if(_is_array($css)){
				$_css = array_unique(array_flatten(array_merge(
					array('__args' => array(
						'sep' => '--'
					)), $css)
				));
								
				$head_css='';
				$css_stub = '.'.$_['ua']->stub.'.'.$_['mime']['css']->ext;
				
				ob_start();
				
				if(!empty($_['build'])){
					$sid = uniqid();
					$_SESSION['_']['build']['css'][$sid] = $_css;
					
					$q = '?sid='.$sid.'&q='.base64_encode(implode(',',$_css))/*.'&hash='.md5(implode(',',$_css))*/;
					
					foreach($_css as $ckey => $c){
						$_['files']['css'][$ckey] = true;
					} ?>
				
		<link class="_-css _-css--prod" id="_-css--prod--<?php echo uuid('css'); ?>" rel="stylesheet" type="<?php echo $_['mime']['css']; ?>" href="/build/css/_<?php echo $css_stub.$q; ?>" /><?php
						
				}else{
				
					foreach($_css as $ckey=>&$css){
					
						$css=rtrim(_is_array($css) && !empty($css['file']) ? $css['file'] : $css,'.'.$_['mime']['css']->ext).$css_stub;
						$css_class = (!empty($ckey) ? array_first(explode('--',$ckey)) : false);
						
						if(!empty($_['files']['css'][$css])){
							continue;
						} ?>
	
		<link class="_-css<?php echo ($css_class ? ' _-css--'.$css_class : ''); ?>" id="<?php echo (!empty($ckey) ? '_-css--'.$ckey : uuid('css')); ?>" rel="stylesheet" type="<?php echo $_['mime']['css']; ?>" href="<?php echo $css; ?>" /><?php
						
						$_['files']['css'][$css] = true;
						

					}
					
				}
				
				$head_css = ob_get_clean();
				
				foreach($dom->find('head') as $hkey=>$head){
					$head->innertext.=$head_css;
				}
			}else{
				foreach($dom->find('link[rel=stylesheet]') as $ekey=>$ele){
					if(empty($_['files']['css'][$ele->href])){
						$ele->href=rtrim($ele->href,'.'.$_['mime']['css']->ext).'.'.$_['ua']->stub.'.'.$_['mime']['css']->ext;
						$_['files']['css'][$ele->href] = true;
					}
				}
			}
			
			return $dom;
		}
		
		function render_html($html=''){
			global $_;
			
			$dom=new simple_html_dom();

			ini_set('memory_limit','256M');

			$dom->load((is_object($html) && !empty($html->content['_'])) ? $html->content['_'] : $html);
			
			$_['dom']=&$dom;
			
			$dom = $this->render_css($html->css,$dom);
			
			/* rewrite css links *
//			$css_ext='css';
			
			if(_is_array($html->css)){
				$_css = array_unique(array_flatten(array_merge(
					array('__args' => array(
						'sep' => '--'
					)), $html->css)
				));
								
				$head_css='';
				
				foreach($_css as $ckey=>&$css){
				
					$css=rtrim(_is_array($css) && !empty($css['file']) ? $css['file'] : $css,'.'.$_['mime']['css']->ext).'.'.$_['ua']->stub.'.'.$_['mime']['css']->ext;
					$css_class = (!empty($ckey) ? array_first(explode('--',$ckey)) : false);
					
					ob_start(); ?>

	<link class="_-css<?php echo ($css_class ? ' _-css--'.$css_class : ''); ?>" id="<?php echo (!empty($ckey) ? '_-css--'.$ckey : uuid('css')); ?>" rel="stylesheet" type="<?php echo $_['mime']['css']; ?>" href="<?php echo $css; ?>" /><?php
					
					$head_css.=ob_get_clean();
				}
				
				foreach($dom->find('head') as $hkey=>$head){
					$head->innertext.=$head_css;
				}
			}else{
				foreach($dom->find('link[rel=stylesheet]') as $ekey=>$ele){
					$ele->href=rtrim($ele->href,'.'.$_['mime']['css']->ext).'.'.$_['ua']->stub.'.'.$_['mime']['css']->ext;
				}
			}*/
						
			$dom = $this->render_js($html->js,$dom);
			
			return (string) $dom;
		}
		
		function render_js($js=false, $dom=false, $recurs=false){
			global $_;
			
			if(!$dom && !empty($_['dom']) && is_object($_['dom'])){
				$dom = $_['dom'];
			}else if(!$dom){
				$dom = new simple_html_dom();
			}
			
			if(_is_array($js)){
				$head_js='';
				
				$ary_args = array(
					'__args' => array(
						'sep' => '--',
						'exclude' => array('+') // this is for init jit(?) js
					)
				);
				
				$_js = array_expand(array_merge($ary_args, /*array_unique*/(array_flatten(array_merge($ary_args,$js)))));
				
				if(!$recurs && !empty($_js['lib'])){ //render libs first
					$dom = $this->render_js(array('lib' => $_js['lib']),$dom,true);
					unset($_js['lib']);
					
#					var_dump('%%%',(string)$dom);
				}
				
				$_js = array_flatten(array_merge(
					array(
						'__args' => array(
							'sep' => '--',
							'exclude' => array('+') // this is for init jit(?) js
						)
					), $_js)
				);
				
				uksort($_js, 'cmp_js');
				$_js = array_reverse($_js);
				
				$add_js = false;
				
				if(0 && $_['build']){
					ob_start();
					$_js_add = false;
					if(!empty($_js['+'])){
						$_js_add = $_js['+'];
						unset($_js['+']);
					}
					
					$sid = uniqid();
					$_SESSION['_']['build']['js'][$sid] = array_unique($_js);

					$q = '?sid='.$sid.'&q='.base64_encode(implode(',',$_js))/*.'&hash='.md5(implode(',',$_js))*/;
					
					foreach($_js as $jkey => $j){
						$_['files']['js'][$jkey] = true;
					} ?>
					
		<script class="_-js _-js--prod" id="_-js--prod" type="text/javascript" src="/build/js/_.js<?php echo $q; ?>"></script><?php
					
					if($_js_add){ ?>
					
		<script class="_-js _-js--+" id="_-js--+" type="text/javascript"><?php echo (_is_array($_js_add) ? implode("\n\n",array_flatten($_js_add)) : $_js_add); ?></script><?php
						
					}
					
					$head_js .= ob_get_clean();
					
				}else{
				
					foreach($_js as $jkey => &$j){
	#					$j=rtrim($css,'.'.$_['mime']['js']->ext).'.'.$_['ua']->stub.'.'.$_['mime']['js']->ext;
						$js_class = ($jkey===0 || (isset($jkey) && $jkey!='') ? array_first(explode('--',$jkey)) : false);
	
	#						var_dump('@##$',$j,$_['files']['js'],$_['tmp']['i'],$trace[3]['function'],$trace[3]['file'].' @'.$trace[3]['line']);
						ob_start();
	
						if(is_string($jkey) && $jkey === '+' && !empty($j)){ ?>
						
		<script class="_-js<?php echo ($js_class ? ' _-js--'.$js_class : ''); ?>" id="<?php echo ($jkey===0 || (isset($jkey) && $jkey!='') ? '_-js--'.$jkey : uuid('js')); ?>" type="text/javascript"><?php echo (_is_array($j) ? implode("\n\n",array_flatten($j)) : $j); ?></script><?php
		
						}else if(is_string($j) && isset($_['files']['js'][$j]) && empty($_['files']['js'][$j])){
						
						 ?>
						
		<script class="_-js<?php echo ($js_class ? ' _-js--'.$js_class : ''); ?>" id="<?php echo ($jkey===0 || (isset($jkey) && $jkey!='') ? '_-js--'.$jkey : uuid('js')); ?>" type="<?php echo $_['mime']['js']; ?>" src="<?php echo $j; ?>"></script><?php
						
							$_['files']['js'][$j] = true;
		
						}
	/*	<link  rel="stylesheet" type="<?php echo $_['mime']['css']; ?>" href="<?php echo $css; ?>" /><?php*/
	
						if($jkey === '+'){
							$tmp = ob_get_clean();				
							$add_js .= $tmp;
						}else{
							$head_js .= ob_get_clean();
						}
					}
				}
				
				$head_js.=$add_js."\n";
				
				foreach($dom->find('head') as $hkey=>$head){
					$head->innertext.=$head_js;
				}
			}
			
			return $dom;
			
		}
		
		function view($args='', $set=true){
			global $_;
			
			if($set){
				$_['page']=&$this->model;
				
				if(!empty($this->model->title)){
					$_['title']=&$this->model->title;
				}
			}
			
			if(_is_array($args)){
				$this->init($args,'',true);
			}
			
			if(empty($this->model->type) || empty($this->template->views[$this->model->type])){
				$this->model->type='_';
			}
						
			echo $this->render($this->model->type); //print it out!~
						
#			var_dump('#@',$this->template,'##',$this->model->type,$_['site']);
		}
	}
?>
