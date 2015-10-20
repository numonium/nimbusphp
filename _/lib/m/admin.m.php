<?php
	/* juniper/lib/model/admin - administration tools
		(juniper + nimbus) (c) 2012+ numonium //c - all rights reserved	
	*/

	global $_;
	
	class _Admin extends _Model {
		var $id;
		var $_cmd;
		var $model;
		var $str; //names for cmd, model, presenter
		var $presenter;
		var $view;
		var $uuid;
		var $url;
		var $site;
		var $router;
		var $route = array();
		var $user;
		var $page;
		var $objs = array(); # ~EN (2015): array of objects
		var $obj_length = -1;

		function __construct($args=false,$force_init=true){
			global $_;
			
			$this->_cmd = array(
				'add' 	=> false,
				'edit'	=> false,
				'del'	=> false,
				'view'	=> false,
				'_'		=> false
			);
			
			$this->str = array(
				'cmd'	=> false,
				'model'	=> false,
				'model-slug' => false,
				'presenter'	=> false,
				'view'	=> false
			);
			
			if(_is_array($args)){	
			
				if(!empty($args['cmd'])){
					$this->cmd($args['cmd'],true);
					unset($args['cmd']);
				}
				
				if(!empty($args['str'])){
					$this->str = array_merge($this->str, _array($args['str']));
					unset($args['str']);
				}
				
			}
			
			parent::__construct($args,$force_init);
			
			if(!empty($this->str['model'])){
				$this->str['model-slug'] = slug($this->str['model']);
			}
			
			$this->route = array('admin' => true);
			
			if(!empty($this->url->pieces[1])){
				$this->route['m'] = $this->url->pieces[1];
				
				require_once($this->route['m'].'.'.basename(__FILE__));
				
				$this->model = '_Admin'.keytoclass($this->route['m']);
				$this->model = new $this->model();				
			}
			
			if(!empty($this->url->pieces[2])){
				
#				if(get_class($this) == '_Admin'){
					$this->cmd($this->url->pieces[2],true);
#				}
				
				$this->view = $this->route['v'] = $this->url->pieces[2];
			}else{
				$this->view = $this->route['v'] = 'view';
			}
		}

		function __get($var){
			return parent::__get($var);
		}
		
		function add(){
			global $_;
			
			return $this->edit();
		}
		
		function cmd($cmd=false,$args=false){
			if(!$cmd){
				return $this->_cmd['_'];
			}
			
			if(!empty($args)){
				$this->_cmd[$cmd] = $args;
				$this->_cmd['_'] = $cmd;
				$this->str['cmd'] = $this->str[$cmd] = cmd_str($cmd);
			}
			
			return $this->str['cmd'];
		}
		
		function is_empty(){
			global $_;
			
			if(!empty($this->slug)){
				return ($_['db']->numRows($this->slug) == 0);
			}
			
			return true;
		}
		
		# ~EN (2014): generates tasks at bottom of page based on view + permissions
		function nav(){}
	
	}
?>
