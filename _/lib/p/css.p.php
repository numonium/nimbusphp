<?php
	/* juniper/lib/presenter/pages/css - css presenters
		juniper + nimbus © 2010+ numonium //c - all rights reserved	
	*/

	global $_;

	class _CSSPresenter extends _PagesPresenter{
		var $model;
		var $view;
	
		function __toString(){
			$ret='';
			if($this->model->selector!=CSS_SELECTOR_INLINE){
				$ret.=$this->model->selector."{\n";
			}
			foreach($this->model->attrs as $key=>$a){
				$ret.=$this->render(array($key => $a));
			}
			if($this->model->selector!=CSS_SELECTOR_INLINE){
				$ret.="}\n";
			}
			
			return $ret;
		}
		
		function render($attr=''){
			global $_;
			
			
#			var_dump('@@@!',$_['css']['fonts'],$_['site']->template->colors);
			
			if(!empty($this->model->file)){
				$str=str_replace(array_map('strtoupper',array_keys(array_merge($_['css']['fonts'],$_['site']->template->colors))),array_merge($_['css']['fonts'],array_map('pound',array_values($_['site']->template->colors))),$this->model->content);
			}else{
				$ret=(is_array($attr) ? $attr : array($attr));
				if($this->model->compatibility && is_array($attr)){
					foreach($attr as $key=>$a){
						switch($key){
							case 'opacity':
								$ret=array_merge($ret,array(
									'-moz-opacity'	=> $a,
									'-webkit-opacity'	=> $a,
									'filter'	=>' progid:DXImageTransform.Microsoft.Alpha(opacity='.(floatval($a)*100).')'));
								break;
							case 'border-radius':
								$ret=array_merge($ret,array(
									'-moz-border-radius'	=> $a,
									'-webkit-border-radius'	=> $a,
									'-ms-border-radius'		=> $a
								));
								break;
							case 'box-shadow':
								$ret=array_merge($ret,array(
									'-moz-box-shadow'	=> $a,
									'-webkit-box-shadow'=> $a,
									'-ms-box-shadow'	=> $a
								));
								break;
						}
					}
				}
				
				$str='';
				if(is_array($ret)){
					foreach($ret as $key=>$a){
						$str.=$key.': '.$a.';'.($this->model->selector!=CSS_SELECTOR_INLINE ? "\n" : ' ');
					}
				}
			}
			
			return $_['env']['contexts']['dev'] ? $str : minify($str);
		}
	
		function view($args='', $set=true){
			global $_;
			
			if(empty($_['build'])){
			
				$_['http']->header('content-type',$_['mime']['css']);
				
			}
			
			echo $this->render();

		}
	}
?>