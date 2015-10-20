<?php
	/* juniper/lib/model/template - model for templates
		(juniper + nimbus) (c) 2012+ numonium //c - all rights reserved	
	*/

	global $_;
	
	if(!class_exists('_Template')){
	
		class _Template extends _Model {
			var $dirs;
			var $views;
			var $colors = array();
			var $fonts = array();
			var $themes; //color schemes
			var $types; //template types
			var $sidebar;
			var $_children;
			
			function __construct($data='',$force_init=true){
				global $_;
				
				$this->_children = array();
				
				if(is_array($data) && isset($data[FETCH_FROM_DB]) && $data[FETCH_FROM_DB]!==false){
					unset($data[FETCH_FROM_DB]);
					if($template=$_['db']->getSingle($_['db']->getTableName($this),$_['db']->where($data))){
						$this->init($template,'',true);
					}
				}else{
					$this->init($data,'',true);
				}
				
	#			parent::__construct($data,$force_init);
				
				$this->dir=array(
					'.' => _dir($_['/']['templates'].'/'.$this->path['_']),
					'/' => _dir($_['.'].'/'.$_['/']['templates'].'/'.$this->path['_']),
				);
				
				$this->dir['_']	= _dir($this->dir['/'].'/_');
				
				foreach(array('css','js','img') as $dkey=>$dir){
					$this->dir[$dir]=_dir($this->dir['.'].'/'.$dir);
				}
				
				foreach(_scandir($this->dir['/']) as $dkey=>$file){
					if(!is_dir(_dir($this->dir['/'].'/'.$file))){
						# ~EN (2014): rtrim was stripping off "p" from ends of file name, replace with better regex
						$file_slug = preg_replace('/\\.[^.\\s]{3,4}$/', '', $file);
						$this->views[$file_slug]=$file;
					}
				}
				
				foreach(array('fonts','colors') as $tkey=>$type){
					if($file=_file_exists(_dir($this->dir['_'].'/'.$type.'.php'))){
						require_once($file);
						if(empty($_['css'][$type]) || !is_array($_['css'][$type])){
							$_['css'][$type]=array();
						}
						
#						$_['css'][$type]=&$this->colors;
						/* ~EN: we want to prevent about color definitions getting overwritten by other templates adding to $_['css']['colors'] */
						$_['css'][$type]=_array_merge($_['css'][$type],$this->$type);
					}
					
				}
				
				if(is_dir($this->dir['_'])){
					foreach(array('cfg','const','vars') as $tkey=>$type){
						$f = _dir($this->dir['_'].'/'.$type.'.php');
						if(file_exists($f)){
							require_once($f);
						}
						unset($f);
					}
				}
				
				// build sidebars
				$sidebars = array();
				
				// does this template have a sidebar?
				if(!empty($this->sidebar['position'])){
					$sidebars[$this->sidebar['position']] = &$this;
				}
				
				if(!empty($this->id) && ($children = $_['db']->getAll($_['db']->getTableName($this),$_['db']->where(array( 'parent-id' => $this->id, 'has-sidebar' => true))))){
				
					foreach($children as $ckey => &$child){
						
						$child = new _Template($child);
						if(!empty($child->sidebar['position'])){
							$sidebars[$child->sidebar['position']] = &$child;
							$this->_children[$child->slug] = &$child;
						}
						
					}
	
					unset($chidren);
	
				}
				
				$this->sidebars = $sidebars;
				
	/*			if($themes=$_['db']->getAll('templates-themes',array('template-id' => $this->id))){
					foreach($themes as $tkey=>&$theme){
						if(!empty($theme['theme']) && !empty($theme['theme']['id'])){
							$theme['theme'][FETCH_FROM_DB]=true;
							$themes[$tkey]=new _Theme($theme['theme']);
						}
					}
					$this->themes=$themes;
				}else{
					$this->themes=array();
				}*/
			}
			
			function __get($var){
				switch($var){
					case 'children':
					case 'themes':
						return $this->$var();
						break;
					default:
						return parent::__get($var);
						break;
				}
			}
			
			function children(){
				global $_;
				
				if(!empty($this->_children)){
					return $this->_children;
				}
				
				if(!empty($this->id) && (_is_array($rows=$_['db']->getAll($_['db']->getTableName($this),array('parent-id' => $this->id, 'hidden' => 0))))){
	
					foreach($rows as $rkey=>&$row){
						$row=new _Template($row);
						
						$slug = (!empty($row->slug) ? $row->slug : $row->uuid);
						if(!empty($slug) && !empty($this->_children[$slug])){
							$thils->_children[$slug] = $row;
						}
					}
					
					return $this->_children;
				}
				
				return false;
			}
			
			function has_view($view){
				global $_;
				
				if(!empty($this->views[$view])){
					return $this->views[$view];
				}else if(!empty($_['site']->template_global) && !empty($_['site']->template_global->views[$view])){
					return ($_['site']->template_global->dir['/'].'/'.$_['site']->template_global->views[$view]);
				}
				
				return false;
			}
			
			function &has_sidebar($id=false){
				
				if(!empty($id)){
					
					return (!empty($this->sidebars[$id]) ? $this->sidebars[$id] : false);
					
				}else{
					
					return $this->sidebars;
					
				}
				
				return true;
				
			}
			
			function themes(){ //we need to make this a function to prevent recursion
				global $_;
				
				if($themes=$_['db']->getAll('templates-themes',array('theme-id' => $this->id))){
					foreach($themes as $tkey=>&$theme){
						if(!empty($theme['theme']['id'])){
							$theme['theme'][FETCH_FROM_DB]=true;
							$theme[$tkey]=new _Theme($theme['theme']);
						}
					}
					return $themes;
				}
				
				return false;
			}
		}
	}
	
	_cfg('templates',array(
		'/' => array(
			'_' => '_' //global template path
		)
	));
?>
