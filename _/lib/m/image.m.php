<?php
	/* juniper/lib/model/image - model for images (abstract class)
		(juniper + nimbus) (c) 2012+ numonium //c - all rights reserved	

		* NOTE - commented code refers to optimisations that need to be made
	*/

	global $_;
	
	if(!class_exists('_Image')){
		class _Image extends _Model {
			var $src;
			var $thumb;
			var $is_thumb;
			var $type;
			var $mime;
			var $upload = false; # ~EN (2015): if image was uploaded
	
			function __construct($args=''){
				global $_;
	
				$this->remove_from_db(array('placeholder_width','placeholder_height','placeholder_ratio','src','thumb','thumb_width','thumb_height','thumb_ratio'));			
				$class=get_class($this);
	
				if(is_array($args)){
					// LEGACY - 'src' -> 'file'
					if(empty($args['file']) && !empty($args['src'])){
						$args['file']=$args['src'];
						unset($args['src']);
					}
				
					if(isset($args['thumb']) && is_object($args['thumb']) && get_class($args['thumb'])==$class){
						$this->thumb=$args['thumb'];
						unset($args['thumb']);
					}else if(!empty($args['thumb']) && (is_file($args['thumb']) || is_file($_['doc-root'].$args['thumb']))){
						$this->thumb=new $class(array('file' => $args['thumb']));
						unset($args['thumb']);
					}
					
					parent::__construct($args,true);
					$this->load($args);
					
				}else if(func_num_args()==1){
					parent::__construct(array('file' => $args),true);
				}
				
				if(empty($this->cfg)){
					$this->cfg=$_['cfg']['img'];
				}
				
				if(!isset($this->placeholder_width)){
					$this->placeholder_width=$this->cfg['placeholder']['width'];
				}
				
				if(!isset($this->placeholder_height)){
					$this->placeholder_height=$this->cfg['placeholder']['height'];
				}
				if(!isset($this->matte)){
					$this->matte=$this->cfg['matte'];
				}
				
				if(empty($this->src) && !empty($this->file)){
					$this->src = &$this->file;
				}
				
				if(empty($this->uuid)){
					$this->uuid=uuid(get_class($this));
				}
				
				if(!empty($this->type)){
					$this->mime = new _Mime($this->type);
				}
	
			}
			
			function __get($var){
				if($var=='thumb'){
					var_dump('qqq',(!isset($this->$var) || empty($this->$var)));
					//we cannot init a blank picture object upon construction, due to an infinite loop
					$this->$var = $this->thumbnail();
					return $this->$var;
				}else if($var=='wider'){
					return $this->wider();
				}else if($var=='taller'){
					return $this->taller();
				}else if($var == 'data'){
					return $this->data();
				}
				
				//forward this to parent->__get()
				return parent::__get($var);
			}
			
			function __set($var,$val){
				//if someone changes the width or height, update image aspect ratio
				if($var=='width' || ($var=='height' && $val>0)){
					$this->$var=$val;
					$this->ratio=(intval($this->height)>0 ? floatval($this->width)/$this->height : 0);
				}else if($var=='height'){
					$this->$var=0;
					$this->ratio=0;
				}else if($var == 'data'){
					$this->$var($val);
				}else{
					$this->$var=$val;
				}
			}
			
			function __toString(){
				global $_;
				
				return (strpos($_['doc-root'],$this->file)!==false ? substr($this->file,strpos($_['doc-root'],$this->file)) : $this->file);
			}
			
			function data($data='',$src=''){
				
				if(!empty($data)){
					$this->_data = $data;
				}
				
				if(empty($src)){
					if(empty($this->src)){
						return (!empty($this->_data) ? $this->_data : null);
					}else{
						$src = $this->src;
					}
				}
				
				if(!empty($this->_data)){
					return $this->_data;
				}
				
				switch(strtolower(is_object($this->type) ? $this->type->type : $this->type)){
					case MIME_JPEG:
						return imagecreatefromjpeg($src);
						break;
					case MIME_GIF:
						return imagecreatefromgif($src);
						break;
					case MIME_PNG:
						return imagecreatefrompng($src);
						break;
					case MIME_BMP:
					case MIME_X_BMP:
					case MIME_X_WINDOWS_BMP:
						return imagecreatefromwbmp($src);
						break;
				}
				
				return null;
			}
			
			static function data_uri($img){
				if(is_string($img) && ($img[0] == '/') && file_exists($img)){
					$data = base64_encode(file_get_contents($img));
					return 'data: '.mime_content_type($img).';base64,'.$data;
				}
				
				return '';
			}
			
			function load($args=''){
				global $_;
				
				if(_is_array($args)){
					if(isset($args[FETCH_FROM_DB])){
						parent::load($args);
					}
					
					# ~EN (2015): convert data uri to file
					if(!empty($args['data-uri'])){
						$args['file'] = tempnam(sys_get_temp_dir(),'_-img--');
						$matches = array();
						
						if(preg_match('/^data\:([^;]+)\;/i',$args['data-uri'],$matches) && !empty($matches[1])){ // ~EN (2015): extract mime type
							$args['type'] = $matches[1];
						}
						
						# ~EN (2015): extract img data from data uri "data:image/jpeg;base64,{data}" -> parse @ ,
						$img_data = substr($args['data-uri'], strpos($args['data-uri'], ',')+1);
						
						file_put_contents($args['file'], base64_decode($img_data));
						
						unset($this->{'data-uri'},$img_data,$args['data-uri']); # ~EN (2015): maybe save memory?
					}
					
					if(isset($args['src']) && !isset($args['file'])){
						$args['file']=$args['src'];
						unset($args['src']);
					}
					
					if(isset($args['file'])){					
						if(
							($src = _file_exists($args['file'])) ||
							($src = _file_exists(_dir($_['doc-root'].'/'.$args['file'])))
						){
							$type = getimagesize($src);
						}else{
							return false;
						}
						
						if(!$type){
							$type = new _Mime(end(explode('.',$args['file'])));
							$args['type']=$type;
						}
	
						if(empty($args['type']))
							$args['type']=new _Mime($type['mime']);
						
						/* ~EN (2015): OPT / opt disable / memory *
						switch(strtolower(is_object($args['type']) ? $args['type']->type : $args['type'])){
							case MIME_JPEG:
								$args['data']=imagecreatefromjpeg($src);
								break;
							case MIME_GIF:
								$args['data']=imagecreatefromgif($src);
								break;
							case MIME_PNG:
								$args['data']=imagecreatefrompng($src);
								break;
							case MIME_BMP:
							case MIME_X_BMP:
							case MIME_X_WINDOWS_BMP:
								$args['data']=imagecreatefromwbmp($src);
								break;
						}	*/
											
						//to allow for dynamically changing aspect ratio, we don't declare $width and $height
						$this->init($args,null,true);
						
						if(empty($this->width) && !empty($this->height)){
							$this->ratio=floatval($type[0])/$type[1];
							$this->width=round($this->height*$this->ratio);
						}else if(!empty($this->width) && empty($this->height)){
							$this->ratio=floatval($type[0])/$type[1];
							$this->height=round($this->width/$this->ratio);
						}else if(empty($args['width']) && empty($args['height'])){
							$ratio=floatval($type[0])/$type[1];
							$this->width=$type[0];
							$this->height=$type[1];
							$this->ratio=$ratio;
							unset($ratio);
						}
						
						//for some reason, dimensions are coming back as floats with no decimal
						if(!is_int($this->width))
							$this->width=intval($this->width);
							
						if(!is_int($this->height))
							$this->height=intval($this->height);
						
						//if(empty($args['width']) && empty($args['height']))
						//	$this->ratio=floatval($type[0])/$type[1];
						
						//if given size differs from actual file dimensions, resize to given
						if((intval($this->width)!=$type[0]) || ($this->height!=$type[1])){
							//reset width/height to original pic dimensions to resize down to given dimensions
							$width=$this->width;
							$this->width=intval($type[0]);
							
							$height=$this->height;
							$this->height=intval($type[1]);
							
							$this->resize(($this->width!=$width ? $width : $this->width),(($this->height!=$type[1]) ? $type[1] : $this->height));
						}else{						
	/*						if(!isset($this->width))
								$this->width=$type[0];
		
							if(!isset($this->height))
								$this->height=$type[1];*/
						}
	
					}else{
						$this->init($args,true);
					}
				}else if(!empty($args)){
					$this->file=$args;
				}
			}
			
			function render($img=NULL,$file=''){
				if($img===NULL || !$img){
					$img=$this->data;
				}
							
				if(!empty($img) && !empty($this->type)){
					switch(strtolower($this->type)){
						case MIME_JPEG:
								if(!empty($file))
									return imagejpeg($img,$file);
								else
									return imagejpeg($img);
							break;
						case MIME_GIF:
							if(!empty($file))
								return imagegif($img,$file);
							else
								return imagegif($img);
							break;
						case MIME_PNG:
							if(!empty($file))
								return imagepng($img,$file);
							else
								return imagepng($img);
							break;
						case MIME_BMP:
						case MIME_X-BMP:
						case MIME_X-WINDOWS-BMP:
							if(!empty($file))
								return imagewbmp($img,$file);
							else
								return imagewbmp($img);
							break;
					}
				}else{
					
					echo $this->placeholder();
					return true;
				}
			}
			
			function ret(){
				ob_start();
				$this->render();
				$ret=ob_get_contents();
				ob_end_clean();
				return $ret;
			}
			
			//can pass str to file path or var to fill with image result
			function save($file='',$mode=0755){
				global $_;
				
				if(_is_array($file)){
					$err=array();
					foreach($file as $key=>$f){
						if(!$this->save($f))
							$err[]=$key;
					}
					return (count($err)>0);
				}
				
				if($file==FETCH_FROM_DB){
					return parent::save();
				}
				
				if(empty($file) && !empty($this->file))
					$file=$this->file;
	
				$this->render($this->data,$file);
				
				if(!is_writable($file) && is_writable($_['doc-root'].($file[0]=='/' ? substr($file,1) : $file))){
					$file=$_['doc-root'].($file[0]=='/' ? substr($file,1) : $file);
				}
				
				if(is_writable($file)){
					$ret=$this->render(false,$file);
					if($ret){
						$this->file=$file;
						if(!empty($mode)){
							chmod($file,$mode);
						}	
					}
					return $ret;
				}else{
					var_dump('@err[img][save][writeable]',$file,$mode);
					die();
					return parent::save();
				}
			}
			
			function thumbnail($width='',$height=''){
	
				$class=get_class($this);
				
				$thumb=new $class(array('is_thumb' => true));
				$obj=get_object_vars($this);
				
				unset($obj['is_thumb']);
				
				if(empty($obj['thumb_width']) && empty($obj['thumb_height']) && !empty($width) && intval($width)>0){
					$obj['thumb_width']=intval($width);
				}
				
				if(empty($obj['thumb_width']) && empty($obj['thumb_height']) && !empty($height) && intval($height)>0){
					$obj['thumb_height']=intval($height);
				}
				
				$size = array('width' => 0, 'height' => 0);			
				foreach($obj as $key => $o){
					if($key=='width' && isset($obj['thumb_width'])){
						$size['width']=intval($obj['thumb_width']);
						$size['height']=intval(round($size['width']/floatval($obj['ratio'])));
						unset($obj['thumb_width']);
					}else if($key=='width' && intval($o)==$this->cfg['pics']['main']['width']){
						$size['width']=$this->cfg['pics']['gmaps']['width'];
					}else if($key=='width' && intval($obj['height'])==$this->cfg['pics']['main']['height']){
						$size['width']=intval(round($this->cfg['pics']['gmaps']['height']*floatval($obj['ratio'])));
					}else if($key=='width' && intval($o)<=$this->cfg['pics']['gmaps']['width'] && intval($o)>$this->cfg['pics']['gmaps-thumb']['width']){
						$size['width']=$this->cfg['pics']['gmaps-thumb']['width'];
					}else if($key=='width' && intval($obj['height'])==$this->cfg['pics']['gmaps']['height']){
						$size['width']=intval(round($this->cfg['pics']['gmaps-thumb']['height']*floatval($obj['ratio'])));
					}
					
					if($key=='height' && isset($obj['thumb_height'])){
						$size['height']=intval($obj['thumb_height']);
						$size['width']=intval(round($size['height']*floatval($obj['ratio'])));
						unset($obj['thumb_height']);
					}else if($key=='height' && intval($obj['width'])==$this->cfg['pics']['main']['width']){
						$size['height']=intval(round($this->cfg['pics']['gmaps']['width']/floatval($obj['ratio'])));
					}else if($key=='height' && intval($o)==$this->cfg['pics']['main']['height']){
						$size['height']=$this->cfg['pics']['gmaps']['height'];
					}else if($key=='height' && intval($obj['width'])==$this->cfg['pics']['gmaps']['width']){
						$size['height']=intval(round($this->cfg['pics']['gmaps-thumb']['width']/floatval($obj['ratio'])));
					}else if($key=='height' && intval($o)<=$this->cfg['pics']['gmaps']['height'] && intval($o)>$this->cfg['pics']['gmaps-thumb']['height']){
						$size['height']=$this->cfg['pics']['gmaps-thumb']['height'];
					}
					
					$thumb->$key=$o;
				}
				
				if(isset($thumb->thumb_width))
					unset($thumb->thumb_width);
					
				if(isset($thumb->thumb_height))
					unset($thumb->thumb_height);
							
				if($size['width']>0 && $size['height']>0){
					$thumb->resize(intval(round($size['width'])),intval(round($size['height'])),WILDCARD);
				}
				
				return $thumb;
			}
			
			function placeholder($args=''){
				if(is_array($args)){
					if(!empty($args['content'])){
						$content=$args['content'];
						unset($content);
					}
					if(isset($args['css'])){
						$css=(is_object($css) ? $css : new CSS($css));
					}
				}
				
				if(!isset($content)){
					$content=(!empty($this->width) ? $this->width : $this->placeholder_width).'px x '
						.(!empty($this->height) ? $this->height : $this->placeholder_height).'px';
				}
				
				if(!isset($css)){
					$css=new CSS(array(
						'float'	 => 'left',
						'width'	 => (!empty($this->width) ? $this->width : $this->placeholder_width).'px',
						'margin' => '0 5px 0 0',
						'height' => (!empty($this->height) ? $this->height : $this->placeholder_height).'px',
						'border' => 'solid 1px #666',
						'text-align' => 'center'
					));
				}
				
				return new HTML(array(
					'tag'	=> 'div',
					'content'=> $content,
					'style'	=> $css
				));

			}
			
			function wider(){
				return ($this->width>$this->height);
			}
			
			function taller(){
				return ($this->height>$this->width);
			}
			
			//ratio= width/height, height=ratio/width, width=height*ratio
			function _width($height){
				return intval($this->ratio*intval($height));
			}
			
			function _height($width){
				return intval($this->ratio/intval($width));
			}
			
			function resize($width='',$height='',$thumb_width='',$thumb_height=''){
				if(empty($width)){
					$width=$this->cfg['pics']['max']['width'];
				}
				
				if(empty($height)){
					$height=$this->cfg['pics']['max']['height'];
				}
				
				if(empty($thumb_width)){
					$thumb_width=$this->cfg['pics']['thumb']['width'];
				}
				
				if(empty($thumb_height)){
					$thumb_height=$this->cfg['pics']['thumb']['height'];
				}
				
				$img=array('ratio' => $this->ratio);

				if($this->is_thumb!==true){
	/*				$thumb=$this->thumb; //even if no thumb exists, one will be created
				
					//just in case no thumb has been specified, let's use the given width and height
					$thumb=array(
						'width' => ($this->thumb->width>0 ? $this->thumb->width : $thumb_width),
						'height' => ($this->thumb->height>0 ? $this->thumb->height : $thumb_height),
						'ratio' => ($this->thumb->ratio>0.0 ? $this->thumb->ratio : floatval($width)/$height)
					);*/
				}

		
				//conform to sizeof()
				
				if($this->width > $this->height){ //wider			
					if($this->width > $width){
						$img['width']=$width;
						$img['height']=intval(round($width/$img['ratio']));
						
	/*					if($img['width']==$this->cfg['pics']['max']['width'] && $img['height']>$this->cfg['pics']['max']['height']){
							$img['height']=$this->cfg['pics']['max']['height'];
							$img['width']=intval(round($img['height']*$img['ratio']));
						}*/
						
	/*					if($this->is_thumb!==true){
							$thumb['width']=$thumb_width;
							$thumb['height']=intval(round($thumb_width/$thumb['ratio']));
						}*/
					}else if($this->height > $height){
						$img['width']=intval(round($height*$img['ratio']));
						$img['height']=$height;
		
	/*					if($this->is_thumb!==true){					
							$thumb['width']=intval(round($thumb_height*$thumb['ratio']));
							$thumb['height']=$thumb_height;
						}*/
					}else{
						$img['width']=$this->width;
						$img['height']=$this->height;
						
	//					$thumb['width']=$thumb[0];
	//					$thumb['height']=$thumb[1];
					}
					
					if($img['height']>$height){
						$img['width']=intval(round($height*$img['ratio']));
						$img['height']=$height;
						
	/*					if($this->is_thumb!==true){
							$thumb['width']=intval(round($thumb_height*$thumb['ratio']));
							$thumb['height']=$thumb_height;
						}*/
					}
				}else{ //taller
					if($this->height > $height){
						$img['width']=intval(round($height*$img['ratio']));
						$img['height']=$height;
		
	/*					if($this->is_thumb!==true){
							$thumb['width']=intval(round($thumb_height*$thumb['ratio']));
							$thumb['height']=$thumb_height;
						}*/
					}else if($this->width > $width){
						$img['width']=$width;
						$img['height']=intval(round($width/$img['ratio']));
						
						if($img['width']==$this->cfg['pics']['max']['width'] && $img['height']>$this->cfg['pics']['max']['height']){
							$img['height']=$this->cfg['pics']['max']['height'];
							$img['width']=intval(round($img['height']*$img['ratio']));
						}
		
	/*					if($this->is_thumb!==true){
							$thumb['width']=$thumb_width;
							$thumb['height']=intval(round($thumb_width/$thumb['ratio']));
						}*/
					}else{
						$img['width']=$this->width;
						$img['height']=$this->height;
						
	//					$thumb['width']=$thumb[0];
	//					$thumb['height']=$thumb[1];
					}	
					
					if($img['width']>$width){
						$img['width']=$width;
						$img['height']=intval(round($width/$img['ratio']));
	
	/*					if($this->is_thumb!==true){
							$thumb['width']=$thumb_width;
							$thumb['height']=intval(round($thumb_width/$thumb['ratio']));
						}*/
					}		
				}
				
				//make new image
	
				$img['data']=imagecreatetruecolor($img['width'],$img['height']);
	/*			if($this->is_thumb!==true){
					$thumb['data']=imagecreatetruecolor($thumb['width'],$thumb['height']);
				}*/
	
				//get rgb for default matte
				$matte=$this->rgb();
				
				imagefill($img['data'],0,0,imagecolorallocate($img['data'],$matte['r'],$matte['g'],$matte['b'])); //fill with white
	/*			if($this->is_thumb!==true){
					imagefill($thumb['data'],0,0,imagecolorallocate($thumb['data'],$matte['r'],$matte['g'],$matte['b'])); //fill with white
				}*/
			
				$ret=imagecopyresampled($img['data'],$this->data,0,0,0,0,$img['width'],$img['height'],$this->width,$this->height);
				
				$this->width=$img['width'];
				$this->height=$img['height'];
				$this->data=$img['data'];
				
	/*			if($this->is_thumb!==true && $this->thumb->data!=null){
					$ret=imagecopyresampled($thumb['data'],$this->thumb->data,0,0,0,0,$thumb['width'],$thumb['height'],$this->thumb->width,$this->thumb->height);
				}else if($this->is_thumb!==true){
					$ret=imagecopyresampled($thumb['data'],$this->data,0,0,0,0,$thumb['width'],$thumb['height'],$this->width,$this->height);			
				}
				
				if($this->is_thumb!==true && _is_array($thumb) && $thumb['data']!==null){
					$this->thumb->width=$thumb['width'];
					$this->thumb->height=$thumb['height'];
					$this->thumb->data=$thumb['data'];
				}*/
				
				return $ret;
			}
			
			function rgb($color=''){
				if(empty($color))
					$color=$this->matte;
					
				if($color[0]=="#")
					return $this->rgb_hex($color);
				return $this->rgb_int($color);
			}
			
			function rgb_int($int){
				$color=array(
					'r' => ($int >> 16) & 0xFF,
					'g' => ($int >> 8) & 0xFF,
					'b' => $int & 0xFF
				);
				
				return $color;
			}
			
			function rgb_hex($hex){
				if($hex[0]=='#')
					$hex=substr($hex,1);
				if(strlen($hex)==6){
					list($r,$g,$b) = array($hex[0].$hex[1],$hex[2].$hex[3],$hex[4].$hex[5]);
				}else if(strlen($hex)==3){
					list($r,$g,$b) = array($hex[0].$hex[0],$hex[1].$hex[1],$hex[2].$hex[2]);
				}else
					return false;
				
				return array('r' => hexdec($r), 'g' => hexdec($g), 'b' => hexdec($b));
			}
		
		}
	}
	
	_cfg('img',array(
		'matte'			=> '#fff',
		'pics'			=> array(
			'gmaps'		=> array(	// GMAPS_PIC_WIDTH
				'width'		=> 300,
				'height'	=> 315,
			),
			'gmaps-thumb'	=> array( // GMAPS_THUMB_PIC_WIDTH
				'width'		=> 125,
				'height'	=> 110
			),
			'main'		=> array(	// MAIN_PIC_WIDTH
				'width'		=> 640,
				'height'	=> 480
			),
			'max'		=> array(	// PIC_MAX_WIDTH
				'width'		=> 640,
				'height'	=> 480
			),
			'thumb'		=> array(	// THUMB_MAX_WIDTH
				'width'		=> 320,
				'height'	=> 240
			)
		),
		'placeholder'	=> array(	// PIC_PLACEHOLDER_HEIGHT
			'width'		=> 75,
			'height'	=> 75
		),
	));
	
?>
