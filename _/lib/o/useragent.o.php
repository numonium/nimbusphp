<?php
	/* juniper/lib/o/useragent - description of user agents
		(juniper + nimbus) (c) 2012+ numonium //c - all rights reserved	
	*/

	global $_;
	
	class _UserAgent extends _ {
		var $_all;
		var $vendor;
		var $engine;
		var $pattern;
		var $mobile;
		var $description;
		var $stub;
		var $str;
		
		function __construct($args=''){
			global $_;
			
			$_ua = $_['server']['http-user-agent'];
			
			if(empty($args)){

			}else if(is_string($args)){
				$_ua=$args;
			}else if(_is_array($args)){
				if(isset($args[FETCH_FROM_DB])){
					parent::__construct($args,true);
				}else{
					$this->init($args,'',true);
				}
			}
			
			if(empty($this->str) && !empty($_ua)){
				$this->str = $_ua;
			}
			
			$found = $obj = false;
			
			if(empty($args) && !empty($_['ua-all'])){
				foreach($_['ua-all'] as $ukey => $ua){
					if(preg_match("/".$ua->pattern."/i",$_ua,$matches)){
						$obj = $ua;
						$found = array(
							'browser' => $matches[0],
							'str'	=> $_ua,
							'ver'	=> array(
								'_' => doubleval($matches[1].'.'.$matches[2]),
								'major'	=> intval($matches[1]),
								'minor' => floatval($matches[2])
							)
						);
						
						if(in_array($found['ver']['minor'], array(0,0.0))){
							$found['ver']['v'.$matches[1]] = true;
						}else{
							$str = $matches[1];
							$ver = explode('.',$matches[2]);
							for($i=0; $i<count($ver); $i++){
								$found['ver']['v'.$str.($ver[$i]!='0' ? $ver[$i] : '')] = true;
								$str.=$ver[$i];
							}
						}
						
						$this->init($found,$obj,true);
												
						break;
					}
				}
				
				if($found && $obj){
					$this->init($obj,'',true);
				}
				
			}
			
			if(!$found){
				$mobile = preg_match('!(tablet|pad|mobile|phone|symbian|android|ipad|ios|blackberry|webos)!i',$_ua);
				$found = array(
					'browser' => 'Generic Browser',
					'str'	=> $_ua,
					'ver'	=> array(
						'_'	=> 1.0,
						'major'	=> 1,
						'minor'	=> 0
					),
					'mobile'	=> $mobile
				);
				
				$this->init($found,'',true);
			}
			
			
			$this->stub=$this->slug.(!empty($this->ver['major']) ? '-'.$this->ver['major'] : '');
			
/*
			//~EN: TODO - load list of search engine bot user agents
			if(file_exists('ua_seo.xml')){
				$ua=simplexml_load_file('ua_seo.xml');
				var_dump($ua);
			} 
				*/
				
			#var_dump('###!!',$_ua,$this);

		}
		
		function __get($var){
			switch($var){
				case 'all':
					return (!empty($this->_all) && _is_array($this->_all) ? $this->_all : $this->all());
					break;
			}
		
			return parent::__get($var);
		}
		
		public static function all(){
			global $_;
			
			if(!empty($_['ua-all'])){
				return $_['ua-all'];
			}
						
			$tbl = $_['db']->getTableName(__CLASS__);
			$class = __CLASS__;
			
			if($all = $_['db']->getAll($tbl)){
				
				foreach($all as $akey => &$ua){					
					$ua = new _($ua);
				}
			
//				$ret = $matches = array();
				
				return $all;
			}
			
			return false;
		}
		
		function classes(){
			global $_;
			
			$ret = array(
				'_-context--'.(!empty($this->mobile) ? 'mobile' : 'desktop'),
				'_-ua--'.slug($this->engine),
				'_-ua--'.$this->slug,
			);
			
			if(!empty($this->ver) && !empty($this->ver['major'])){
				$ret[] = '_-ua--'.$this->slug.'--'.$this->ver['major'];
				
				if(is_numeric($this->ver['major'])){
					$ret[] = '_-ua--'.$this->slug.'--gt--'.($this->ver['major']-1);
					$ret[] = '_-ua--'.$this->slug.'--lt--'.($this->ver['major']+1);
				}
			}
			
			return $ret;
		}
	
	}
	
	$_['ua-all'] = _UserAgent::all();
?>