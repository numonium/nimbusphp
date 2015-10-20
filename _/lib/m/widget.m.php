<?php
	/* juniper/lib/model/widget - description for widgets
		(juniper + nimbus) (c) 2012+ numonium //c - all rights reserved	
	*/

	global $_;
	
	class _Widget extends _Model {
		var $site;
		var $anchor; // reference to page to inject assets
		var $delay_load; // delay load $this->page->file until print

		function __construct($args,$force_init=true){
			global $_;
			
			
			if(!empty($args['site']) && is_object($args['site'])){
				$site=$args['site'];
				unset($args['site']);
			}else{
				$site=false;
			}
			
			parent::__construct($args,$force_init);
			
			$this->remove_from_db('anchor');
			
			if(empty($this->dir)){
				$this->dir=array();
			}
			
			$this->delay_load = true;
			
			if(!empty($this->slug) && is_dir(_dir($_['.'].$_['/']['widgets'].'/'.$this->slug))){
				$this->dir['.']=$_['/']['widgets'].'/'.$this->slug;
				$this->dir['/']=$_['.'].$this->dir['.'];
			}
			
			if($site){
				$this->site=$site;
				unset($site);
			}
			
			if($file=_file_exists(_dir($this->dir['/'].'/_.php'))){
				$this->file=$file;
				$page = array(
					'require'	=> true,
					'site'	=> &$this->site,
					'widget'	=> &$this
				);
				
				if(empty($this->delay_load)){
					$page['file'] = $this->file;
				}
				
				$this->page=new _Page($page);
			}
			
			if(!empty($this->page) && is_object($this->page) && empty($this->page->widget)){
				$this->page->widget = &$this;
			}
		}

		function __get($var){
			switch($var){
				case 'preview_image':
					return $this->preview_image();
					break;
			}
			
			return parent::__get($var);
		}
		
		function __toString(){
			global $_;
			
			if(!empty($this->delay_load)){
				
				$this->page->file = $this->page->get_file_content($this->file);
			}
			
			return (!empty($this->page) && !empty($this->page->content['_']) ? $this->page->content['_'] : '');
		}
		
		//attaches widget to given Page
		function attach(&$page=false){
			global $_;
			
			if(empty($page) && !empty($this->anchor) && is_object($this->anchor)){
				$page = &$this->anchor;
			}
			
			if(empty($page) || !is_object($page) || empty($this->page) || !is_object($this->page)){
				return false;
			}
			
			foreach($_['/']['assets'] as $akey => $asset){
//				$func = 'add_'.$asset;
				if(!empty($this->page->$asset)/* && method_exists($page,$func)*/){
					$page->$asset = _array_merge($page->$asset,$this->page->$asset);
#					var_dump('@#4asd',$asset,$page->$asset);
#					$page->$func($this->page->$asset);
				}else{
					$page->$asset += $this->page->$asset;
				}
			}
			
//			var_dump('@144f',$page);
			
			$this->anchor = &$page;
			
			return true;
			
			
			//$_['site']->widgets['homepage-slideshow']->anchor
			// move assets from $this->page -> $this->anchor
		}
		
		function preview_image(){
			global $_;
			
		}
	
	}
?>
