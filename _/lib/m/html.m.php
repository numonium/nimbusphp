<?php
	/* juniper/lib/model/html - defines html attributes and properties (á la W3C)
		(juniper + nimbus) (c) 2012+ numonium //c - all rights reserved	*/
			
	class _HTML extends _Model {
		var $tag;
		var $attrs;
		var $content; //inside <tag>..</tag>
//		var $short; //<tag /> vs <tag>..</tag>	
		var $css;
		var $order; //used for form fields
		var $row;
/*		var $id;
		var $class;
		var $title;
		var $lang; //new Lang()
		var $dir; //$this->lang->dir
		var $accesskey;
		var $tabindex;
		var $style; */
		
		function __construct($args = '', $content = '', $bypassConstructor = false, $fromBypass = false){
			if($bypassConstructor){
				parent::__construct($args,$content);
				
				if(_is_array($args) && isset($args[FETCH_FROM_DB])){
					return;
				}
				
				if(!empty($args['attrs'])){
					$args=$args['attrs'];
				}else{
					$args=array();
				}
								
				$fromBypass=true;
			}else{
				$this->fillAttributes($args);				
			}
			
			if(is_object($content) && get_class($content)=='CSS'){ //passed css obj?
				$this->css=$content;
				//make sure css has inline selected
				$this->css->selector='_inline';
				if(!array_key_exists('style',$this->attrs))
					$this->attrs['style']=$this->css;
				unset($content);
			}
			
			if(is_array($args)){
				$classes=array('lang','style');
				foreach($classes as $c){
					if(isset($args[$c]) && !is_object($args[$c])){
						$c2=ucfirst($c);
						$this->$c=new $c2($args[$c]);
						unset($this->$c);
					}else if(isset($args[$c]) && get_class($args[$c])=='CSS'){
						$this->$c=$args[$c];
						$this->css=$args[$c];
						$this->css->selector='_inline';
					}else if(isset($args[$c])){
						$this->$c=$args[$c];
						unset($this->$c);
					}
				}
				
				if(!$fromBypass){
					parent::__construct($args,true);
				}
#				$this->init($args,'',true);
				
#				if($this->tag=='select' & isset($this->attrs['options#']))
#					var_dump('%%%',$this->tag,$this->attrs['options'],$this->attrs['options#'],'***');
				if($this->tag=='select' && isset($this->attrs) && !empty($this->attrs['options']) && is_array($this->attrs['options'])){
					foreach($this->attrs['options'] as $key=>$o){
						if(!is_object($o)){
							$this->attrs['options'][$key]=new HTML((is_array($o) ? array_merge($o,array('tag' => 'option')) : array('tag' => 'option', 'content' => $o)));
							$this->content.=$this->attrs['options'][$key];
						}
					}
				}else if($this->tag=='select' && isset($this->attrs) && !empty($this->attrs['options#']) && is_array($this->attrs['options#'])){
					foreach($this->attrs['options#'] as $key=>$o){
						if(!is_object($o)){
							$this->attrs['options'][$key]=new HTML((is_array($o) ? array_merge($o,array('tag' => 'option')) : array('tag' => 'option', 'attrs' => array('value' => $key), 'content' => $o)));
							$this->content.=$this->attrs['options'][$key];
							
						}
					}
#					if(is_array($this->attrs['options']))
#						var_dump($this->attrs['options']);
					unset($this->attrs['options#']); 
				}

			}else if($args!=''){
				$this->tag=$args;
			}
			if($content!='')
				$this->content=$content;
			if(!empty($this->tag))
				$this->tag=strtolower($this->tag);
	
			foreach(array('name') as $attr){
				if(!empty($this->$attr) && empty($this->attrs[$attr])){
					$this->attrs[$attr]=&$this->$attr;
				}
			}				
			
//			$this->short=$this->is_short();
		}
		
		function fillAttributes($spec='w3c'){
			$attrs=$this->defaultAttributes($spec);
			if(isset($attrs['_required'])){
				$this->attrs['_required']=$attrs['_required'];
				unset($attrs['_required']);
			}
			if(isset($attrs['_x'])){
				$this->attrs['_x']=$attrs['_x'];
				unset($attrs['_x']);
			}
			
			
			foreach($attrs as $key=>$a){
				$this->attrs[$a]='';
			}
		}
		
		function defaultAttributes($spec='w3c'){
			$default=array('_required' => array(), '_x' => array());
			$attrs=array_merge($default,array('_required' => array(), '_x' => array('options','options#'),'id','class','title','lang','dir','accesskey','tabindex'));
			if(in_array($spec,array('w3c'))){
				switch($this->tag){
					case 'form':
						$attrs['_required']=array_merge($attrs['_required'],array('action','method'));
						break;
					case 'meta':
						$attrs=$default;
						break;
					case 'select':
						$attrs['_required']=array_merge($attrs['_required'],array('options'));
						break;
					case 'textarea':
						$attrs['_required']=array_merge($attrs['_required'],array('rows','cols'));
						break;
					case 'w3c':
					default:
						break;
				}
			}
			return $attrs;
		}
		
		function __get($name){
			if(property_exists($this,$name)){
				return $this->$name;
			}
		
			switch($name){
				case 'short':
					return $this->is_short();
				default:
					return (array_key_exists($name,$this->attrs) ? $this->attrs[$name] : '');
			}
		}
		
		function __set($name,$value){
			if(property_exists($this,$name)){
				$this->$name=$value;
			}else{
				$this->attrs[$name]=$value;
			}
		}
		
		function __isset($name){
			return isset($this->$name) || isset($this->attrs[$name]);
		}
		
		function __toString(){
			$ret=$this->open();
						
			if(is_array($this->content)){
				foreach($this->content as $key=>$c){
					$ret.=$c;
				}
			}else{
				$ret.=$this->content;
			}
			return $ret.$this->close();
		}
		
		function is_short($tag=''){
			if(empty($tag))
				$tag=$this->tag;
				
			return in_array($tag,array('area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'));
		}
		
		function open(){
			$ret= '<'.$this->tag;
			if(count($this->attrs)>0){
				if(isset($this->attrs['_required']) && count($this->attrs['_required'])>0){
					foreach($this->attrs['_required'] as $key=>$attr){
						if(empty($key) || !in_array($key,$this->attrs['_x']) && $key!='options' && $key!='options#') 
							$ret.=' '.$attr.'="'.(!empty($this->attrs[$attr]) ? str_replace('"','\"',$this->attrs[$attr]) : '').'"';
					}
				}
				foreach($this->attrs as $key=>$attr){
					if($key!=='_required' && ((is_string($attr) && trim($attr)!='') || !is_string($attr)) && (empty($this->attrs['_']) || (!empty($this->attrs['_']) && (!_is_array($this->attrs['_x']) || (_is_array($this->attrs['_x']) && !in_array($key,$this->attrs['_x']))))) && !in_array($key,array('options','options#','_x'))){
						if(!($this->tag=='select' && $key=='selected')) {
							if(is_array($attr)){
								$this->attrs=array_merge($this->attrs,array_flatten(array($key => $attr)));
								continue;
							}else if($attr===true){
								$attr='true';
							}
							
						
							$ret.=' '.$key.'="'.($key=='style' ? $this->css : str_replace('"','\"',trim($attr))).'"';
						}
					}
				}
			}
			return $ret.(!$this->short ? '>' : '');
		}
		
		function close(){
			return ($this->short ? ' />' : '</'.$this->tag.'>');
		}
	}