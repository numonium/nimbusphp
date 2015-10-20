<?php
	/* juniper/lib/model/file - model for file
		- hopefully someday we'll have a db-based fs
		
		(juniper + nimbus) (c) 2012+ numonium //c - all rights reserved	
	*/

	global $_;
	
	class _File extends _Model {
		var $id;
		var $uuid;
		var $presenter; //binding to particular presenter
		var $site;
		var $company;
		var $user;
		var $data;
		var $size;
		var $type;
		var $path;
		var $perms;
		var $locked;
		var $hidden;
		var $created;
		var $updated;
		var $last; // last-edited-user-id / last-edited-user-uuid
		var $index; // for uploaded files -> original index in $_FILES
		var $data_uri;
		var $tmp; // is temporary?
		
		function __construct($args,$force_init=true){
			global $_;
			
			if(!empty($args['data-uri'])){
				$this->upload__data_uri($args['data-uri']);
				unset($args['data-uri']);
			}
			
			$this->remove_from_db(array('data_uri'));
			
			parent::__construct($args,$force_init);
			
			if(empty($this->site)){
				$this->site = &$_['site'];
			}
			
			if(empty($this->company)){
				$this->company = &$_['site']->company;
			}
			
			if(!empty($this->read) && empty($this->data) && !empty($this->path) && ($file = _file_exists($this->path))){
				$this->contents();
			}
			
		}

		function __get($var){
			return parent::__get($var);
		}
		
		function contents($path=false){
			if(empty($this->data)){
	
				if(empty($path)){
					$path = $this->path;
				}
				
				if($file = _file_exists($path)){
					$this->data = file_get_contents($file);
				}
				
			}
			
			return $this->data;
		}
		
		public static function did_upload($index){
			global $_;
			
			if(empty($index) || empty($_FILES[$index])){
				return false;
			}
			
			foreach($_FILES[$index]['error']['file'] as $file){
				if($file === $_['const']['file']['post']['err']['uploaded']){
					return true;
				}
			}
			
			return false;
		}
		
		public function size($units=''){
			$size = 0;
			if($file = _file_exists($this->path)){
				$size = filesize($file); // in bytes
			}
			
			return ($size ? $size : false);
		}
		
		public function upload__data_uri($uri=false){
			if(empty($uri) && !empty($this->data_uri)){
				$uri = $this->data_uri;
			}
			
			if(empty($uri) || !is_string($uri)){
				return false;
			}
			
			$data = array();
			if(!preg_match("/data\:([^;]+)\;base64,(.*)/i",$uri,$data)){
				return false;
			}
			
			$this->data_uri = $data[0];
			
			if(!empty($data[1]))
				$this->type = new _Mime($data[1]);
				
			if(!empty($data[2])){
				$this->data = base64_decode(str_replace(' ','+',$data[2]));
				$tmp = tempnam(sys_get_temp_dir(), 'juniper');
				if(file_put_contents($tmp,$this->data)){
					$this->path = $tmp;
					$this->tmp = true;
					if(empty($this->name)){
						$this->name = $this->uuid;
					}
				}
			}
			
		}
	}
?>
