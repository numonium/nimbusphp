<?php
	/* juniper/lib/model/widget/gallery - model for gallery widget (photo gallery for now, generic abstract class later)
		(juniper + nimbus) (c) 2012+ numonium //c - all rights reserved	
	*/

	global $_;
	
	class _Gallery extends _Model{ // TODO - subclass of _Widget
		var $dir;
		var $images;
		var $site;
		var $user;
		var $company;
		var $page; //reference to current page relationship
		
		function __construct($args=false,$force_init=true){
			global $_;

			if(!empty($_['cfg']['gallery'])){
				$this->cfg = $_['cfg']['gallery'];
			}
			
			if(empty($args)){
				$args = array(
					'name' => $this->cfg['_']['name']
				);
			}
			
			if(!empty($args) && is_array($args) ){
				if(!empty($args['name'])){
					$args['name']=trim($args['name']);
				}
				if(empty($this->page) && !empty($args['page'])){
					$this->set_page($args['page']);
					unset($args['page']);
				}
			}
			
			$this->dir = array(
				'.' => false,
				'/' => false,
				'lg'	=> false,
				'thumb'	=> false
			);
			
			parent::__construct($args,$force_init);

			$this->add_to_db('dir');
			$this->remove_from_db(array('dir-.','page'));
			$this->images = array();
			
			if(empty($this->dir['.']) && !empty($this->dir['_'])){
				$this->dir['.'] = $this->dir['_'];
				$this->dir['_'] = &$this->dir['.'];
			}
						
			if(!empty($this->site) && is_array($this->site) && !empty($this->site['uuid'])){
				if($this->site['uuid'] == $_['site']->uuid){
					$this->site = &$_['site'];
				}else{
					$this->site = new _Site(array( FETCH_FROM_DB => true, 'uuid' => $this->site['uuid']));	
				}
			}
			
			if(empty($this->site)){
				$this->site = &$_['site'];
			}
			
			if(!empty($this->dir['.']) && is_dir(_dir($this->site->dir['/'].'/'.$this->dir['.']))){
			
				$this->dir['/'] = _dir($this->site->dir['/'].'/'.$this->dir['.']);
				
				// pull images from database, then we can delete everything, upload aggregated array
				$this->images = $this->getImages();
			}

						
			if(is_array($args) && !empty($args[FETCH_FROM_DB]) /*(empty($args[FETCH_FROM_DB]) || (!empty($args[FETCH_FROM_DB]) && $args[FETCH_FROM_DB]===true))*/ ){
					
				if(empty($this->style)){
					$this->style = 'grid';
				}
				if(empty($this->created))
					$this->created = time();
					
				if($this->style=='grid' && !empty($pics_page) && empty($rows_page) && empty($cols_page) && floatval(intval(sqrt($this->size['img_per_page'])))==sqrt($this->size['img_per_page'])){
					$this->size['rows']=intval(sqrt($this->size['img_per_page']));
					$this->size['cols']=intval(sqrt($this->size['img_per_page']));
				}
				
				$this->cemented = $this->found = true;
				
			}else{
				if(empty($this->cemented)){
					$this->dir['.'] = _dir($this->cfg['dir']['_'].'/'.$this->slug.'/');
					$this->dir['/'] = _dir($this->site->dir['/'].'/'.$this->dir['.']);
					$this->dir['thumb'] = _dir('/'.$this->cfg['dir']['thumb']);
					$this->dir['lg'] = _dir('/'.$this->cfg['dir']['lg']);
				}
				
				if($photos=$_['db']->getAll('images',array('gallery-uuid' => $this->uuid))){
					$i=0;

					foreach($photos as $key=>$photo){
						$this->images[$i]=new _Image(array(
							'id'	=> $photo['id'],
							'file' => _dir($this->site->dir['/'].'/'.$this->dir['.'].'/'.$photo['file']),
						));
						$this->images[$i]->caption=$photo['caption'];
						$i++;
					}
				}
			}
			
			if(empty($this->dir['_']) && !empty($this->dir['.'])){
				$this->dir['_'] = &$this->dir['.'];
			}

			if(empty($this->company)){
				$this->company = &$this->site->company;
			}
						
			if(empty($this->html)){
				$this->html=new _HTML($this->wrapper['tag']);
			}
			
			if(empty($this->user)){
				$this->user = &$_['user'];
			}

		}
		
		function __get($name){
			switch($name){
				case 'thumbnail':
					return $this->thumbnail();
				case 'thumbnailPath':
				case 'thumbnail_path':
					return $this->thumbnailPath();
			}
		}
		
		function __toString(){
			if(!empty($this->html))
				return (string) $this->html;
			
			return false;
		}
		
		function cement($force=false){
			global $_;
			
			// first, check to see if site has gallery
			if(!$this->cemented || $force){
				
				if($dir = _is_dir($this->dir['/'])){
					// negotiate dir path à la sites
				}else{ // new directory
					
					// if, for some reason, there's no base, let's make it
					if(!($base = _is_dir(_dir($this->site->dir['/'].'/'.$this->cfg['dir']['_'])))){
						mkdir(_dir($this->site->dir['/'].'/'.$this->cfg['dir']['_']),0755);
					}
					
					$dirs = array(
						'/'		=> $this->dir['/'],
						'lg'	=> _dir($this->dir['/'].'/'.$this->dir['lg']),
						'thumb'	=> _dir($this->dir['/'].'/'.$this->dir['thumb'])
					);
					
					foreach($dirs as $dkey => $dir){					
						if(!mkdir($dir,0755)){
							die('err[gallery][cement] - error making dir: '._dir($this->dir['/']));
						}
					}
					
				}
				
				return true;
			}
			
			return (!empty($this->cemented));
		}
		
		function getImages($dirName=''){
			global $_;
			
			if(empty($dirName)){
				$dirName = $this->dir['.'];
			}
			
			if(empty($this->dir[$dirName]) || !is_dir($this->dir[$dirName])){
				$dirName='/';
			}
			
			$ret = array();
			if($images = $_['db']->getAll('images',"`gallery-uuid`='".$this->uuid."'")){
				foreach($images as $key => &$img){
					$ret[]=new _Image(array(
						FETCH_FROM_DB => true,
						'id'	=> $img['id'],
						'file'	=> _dir($this->dir['/'].$img['file']),
//						'thumb'	=> _dir($this->dir['/'].$this->dir['thumb'].'/'.$img['file'])
					));
				}
				
			}else if($dir = _scandir($this->dir[$dirName])){
				$i=0;
				foreach($dir as $d){
					if(is_dir(_dir($this->dir[$dirName].'/'.$d)))
						continue;
						
					$ret[$i]=new _Image(array(
						'file'	=> _dir($this->dir[$dirName].$d),
//						'thumb'	=> _dir($this->dir[$dirName].$this->dir['thumb'].'/'.$d)
					));
					
					$i++;
				}
				
			}
			
			return $ret;

		}
		
		function hasImages(){
			return (count($this->images)>0);
		}
		
		//move gallery to new location
		function move($args){
			global $_;
			
			if(!is_array($args)){
				$args = array('name' => $args);
			}
			
			if(!empty($args['name']) && empty($args['slug'])){
				$args['slug'] = slug($args['name']);
			}
			
			$_moved = false;
			
			if(!empty($this->dir['.'])){
				$tmp = explode('/',$this->dir['.']);
				foreach($tmp as $tkey => &$tmp_dir){
					if($tmp_dir == $this->slug){
						$tmp_dir = $args['slug'];
					}
				}
				
				$args['dir']['_'] = implode('/',$tmp);				
				unset($tmp_dir);
			}
			
			if(!empty($this->dir['lg'])){
				$tmp = explode('/',$this->dir['lg']);
				foreach($tmp as $tkey => &$tmp_dir){
					if($tmp_dir == $this->slug){
						$tmp_dir = $args['slug'];
					}
				}
				
				$args['dir']['lg'] = implode('/',$tmp);
				unset($tmp_dir);
			}
			
			if(!empty($this->dir['thumb'])){
				$tmp = explode('/',$this->dir['thumb']);
				foreach($tmp as $tkey => &$tmp_dir){
					if($tmp_dir == $this->slug){
						$tmp_dir = $args['slug'];
					}
				}
				
				$args['dir']['thumb'] = implode('/',$tmp);
				unset($tmp_dir);
			}
			
			if(!empty($args['dir']['_']) && !is_dir(_dir($this->site->dir['/'].'/'.$args['dir']['_'])) && ($_moved = rename(_dir($this->site->dir['/'].'/'.$this->dir['.']), _dir($this->site->dir['/'].'/'.$args['dir']['_'])))){
				// move gallery dir to new location
					
				if(!empty($this->images) && _is_array($this->images)){
					//~EN: think about moving pictures -> don't think this is necessary
				}
				
				foreach($args as $akey => $arg){
					$this->$akey = $arg;
				}
				
				$this->save();
			}
		}
		
		function printImages($dir='',$width='',$list=false){
			global $_;
			
			if(empty($dir)){
#				$dir='/site'.$this->dir['.'];
				$dir = '.';
			}
			
			$_dir = _dir('/site'.$this->dir['.'].$this->dir[$dir]);
			
			if($images = $this->getImages($dir)){
				
			
			}
			
			foreach($this->getImages($dir) as $key=>$image){
				if(!empty($list)){ ?>
				
					<li class="_-gallery--slide"><?php
					
				}
				
				print new _HTML(array(
					'tag' => 'img',
					'attrs' => array(
						'src'	=> _dir($_dir.'/'.basename($image->src)),
/*						'width' => ($image->wider() && $image->width > $_['cfg']['gallery']['homepage_gallery_width'] ? $_['cfg']['gallery']['homepage_gallery_width'] : $image->width),
						'height' => ($image->taller() && $image->height > $_['cfg']['gallery']['homepage_gallery_height'] ? $_['cfg']['gallery']['homepage_gallery_height'] : '')*/
					)
				));
				
				if(!empty($list)){ ?>
				
					</li><?php
					
				}
			}
		}
		
		function set_dir($cement=false){
			global $_;
			
		}
		
		function save($images=false){
			global $_;

			$tbl = $_['db']->getTableName($this);						
			
			if(!$this->cement()){ // error in cementing handled above
				die('err[gallery][save] error from cement return');	
			}
			
			if(empty($this->dir['.']) && !empty($this->dir['_'])){
				unset($this->dir['.']);
			}

			if(!parent::save()){
				var_dump('err[gallery][parent][save]');
				return false;
			}
			
			if(empty($images) || !_is_array($images)){
				return true;
			}
			
			$success = 0;
			foreach($images as $ikey => $img){
				if(empty($img['db']['uuid'])){
					$img['db']['uuid'] = &$img['_']->uuid;
				}

				if(empty($img['db']['gallery-id'])){
					$img['db']['gallery-id'] = $this->id;
				}	
								
				if(
					$img['_']->save(_dir($this->dir['/'].'/'.$img['db']['file'])) &&
					$img['lg']->save(_dir($this->dir['/'].'/'.$this->dir['lg'].'/'.$img['db']['file'])) &&
					$img['thumb']->save(_dir($this->dir['/'].'/'.$this->dir['thumb'].'/'.$img['db']['file']))
				){
					$_['db']->insert($_['db']->getTableName($img['_']),$img['db']);
					$success++;
				}
			}
			
			return $success;

		}

		function set_page(&$page){
			$this->page = $page;
		}
		
		function slideshow($html_id='',$dir=''){
			global $_;
			
			if(!empty($html_id))
				$this->html_id=$html_id; ?>

			<ul id="<?php echo (in_array($html_id[0],array('#','.')) ? substr($html_id,1) : $html_id).$this->cfg['stub']['img']; ?>" class="_-gallery--slides"><?php
				
				$this->printImages((empty($dir) ? '.' : $dir),($dir=='lg' ? $_['cfg']['img']['pics']['main']['width'] : ''),true); ?>
				
			</ul><?php

			$this->slideshow_start($html_id);
			
		}
		
		function slideshow_start($html_id='',$_options=''){
			global $_;
			
			if(empty($html_id) && !empty($this->html->id))
				$html_id=$this->html->id;
				
			$html_id.=$this->cfg['stub']['img'];
			
			$options=array(
				'speed'	=> 2000,
				'fx'	=> 'fade',
				'timeout' => 5000
			);
			
			if(_is_array($_options)){
				$options=array_merge($options,$_options);
			}
				
			if(!empty($html_id)){
				ob_start(); ?>

					(function($){
						$(window).load(function(){
							$('<?php echo $html_id; ?>').css('visibility','visible');
							$('<?php echo $html_id; ?>').cycle({<?php
							
								$i=0;
								foreach($options as $key=>$o){
									print $key.':'.(is_string($o) ? "'".str_replace("'","\'",$o)."'" : $o).($i<count($options)-1 ? ",\n" : '');
									$i++;
								} ?>
								
							});
						});
					})(jQuery);<?php

						$js = ob_get_clean();

				$this->page->add_js(array(
					'gallery' => '/js/jquery-cycle.js',
					'+'	=> $js				
				));
			}
		}
		
		function thumbnail(){
			if(!$this->hasImages())
				return false;
				
			return $this->images[0]->thumb;
		}
		
		function thumbnailPath($dir=''){
			if(!$this->hasImages())
				return false;
				
			if(empty($dir)){
				$dir='lg';
			}
			
			$dir.='_dir';
				
			return _dir($this->$dir.'/'.basename($this->images[0]->src));
		}
	}
	
	_cfg('gallery', array(
		'_'	=> array(
			'name'	=> date('F j, Y @ g:i A')
		),
		'dir'	=> array(
			'_'		=> '/img/galleries',
			'lg'	=> 'lg',
			'thumb'	=> 'thumb'
		),
		'stub'	=> array(
			'lg'		=> '--lg',
			'thumb'		=> '--thumb',
			'img'	=> '--img'
		),
		'tag'	=> array(
			'_'	=> 'div',
			'img' => 'div'
		),
		'homepage_gallery_width' => 710,
		'homepage_gallery_height' => 436
	));
?>