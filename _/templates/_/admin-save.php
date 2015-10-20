<?php
	/* juniper/admin/save - functions to save data from admin area into site
		(juniper + numbus) (c) 2012+ numonium //c - all rights reserved */
	global $_;
	
	if(!_User::logged_in()){
		$_['url']->redirect('/admin');
	}
	
	if(!empty($_['post']['uuid'])){
		$_form = new _Form(array(
			FETCH_FROM_DB	=> true,
			'uuid'			=> $_['post']['uuid']
		));
	}
	
	if(isset($_['request']['img']) && !empty($_FILES['file']) && $_FILES['file']['error'][0]==0){
		
		$img = new _Image(array(
			'type'		=> $_FILES['file']['type'],
			'src'		=> $_FILES['file']['tmp_name'],
			'width'		=> (_is_array($_['request']['img']) && !empty($_['request']['img']['w']) ? intval($_['request']['img']['w']) : ''),
			'height'	=> (_is_array($_['request']['img']) && !empty($_['request']['img']['h']) ? intval($_['request']['img']['h']) : ''),
			'caption'	=> (_is_array($_['request']['img']) && !empty($_['request']['img']['caption']) ? $_['request']['img']['caption'] : ''),
			'link'	=> (_is_array($_['request']['img']) && !empty($_['request']['img']['link']) ? $_['request']['img']['link'] : '')
		));
		
		if(!empty($_['request']['img']['align'])){
			
			switch($_['request']['img']['align']){
				case 'l':
					$img->align = 'left';
					break;
				case 'c':
					$img->align = 'center';
					break;
				case 'r':
					$img->align = 'right';
					break;
			}
			
		}
		
		$ret = array();
		
		$ret['post'] = $_['request'];
		
		foreach(array('width','height','align','link','caption') as $attr){
			if(!empty($img->$attr)){
				$ret['img'][$attr] = $img->$attr;
			}
		}
				
		if($dir = _is_dir($this->site->dir['/'].$this->site->dir['img'].$_['/']['uploads'])){
			$mime = new _Mime($img->type);
			$uuid = uuid($img);

			$file = $uuid.'.'.$mime->ext;
			$thumb = $uuid.'--thumb.'.$mime->ext;
			
			$ret['file'] = $ret['filelink'] = _dir('/site'.$this->site->dir['img'].$_['/']['uploads'].'/'.$file);
			$ret['img']['thumb']['file'] = $ret['img']['thumb']['filelink'] = $thumb;

			$file =  _dir($dir.'/'.$file);
			$thumb = _dir($dir.'/'.$thumb);
			
			$img->save($file);
			
			$img->thumb->resize($img->cfg['pics']['thumb']['width']);
			
			$ret['obj'] = get_object_vars($img);
			
			$ret['img']['thumb']['width'] = $img->thumb->width;
			$ret['img']['thumb']['height'] = $img->thumb->height;
			
			$img->thumb->save($thumb);
//			$img->thumb->resize(array('width' => save($thumb);
			
			echo json_encode($ret);		
		}
		
#		var_dump('@@',$file, $file_relative );		


#		echo json_encode(array('_files' => $_FILES, 'img' => $img));
		
		exit;
	
//		var_dump('@@@',$_GET,$_['request'],$_['post']);
//		die('333');
	}
	
	$dom = new simple_html_dom();
	
	if(empty($_['post']['uuid'])){
		$_['url']->redirect($_['server']['http-referer']);
	}
	
	if($_['post']['uuid'] == $_form->uuid){
		
		if(!empty($_['post']['page']['content'])){
			$dom->load($_['post']['page']['content']);
			
			//look for page title
			if(count($dom->find('h1')) > 0){
			
				//there's a small chance of a \n (or <br />) at the end of an h1, so let's nick that off just in case :)
				$_['post']['page']['title'] = trim(br2nl($dom->find('h1',0)->innertext));
				$dom->find('h1',0)->innertext = nl2br($_['post']['page']['title']);
				$_['post']['page']['title'] = strip_tags($_['post']['page']['title']);
				
//				$dom->find('h1',0)->outertext = ''; //remove element from content
			}
			
			//~EN: admin mode moves a[href] -> a[loc], so let's undo that transformation
			foreach($dom->find('a') as $ekey => $ele){
				if(!empty($ele->loc)){
					$ele->href = $ele->loc;
					unset($ele->loc);
				}
			}
			
			$_['post']['page']['content'] = array(
				'plain'	=> trim($dom->plaintext),
				'_'		=> trim($dom->save())
			);
			
			//get page href
			$href = false;
			
			$uri = ($_['server']['http-referer'][0] == '/' ? $_['server']['http-referer'] : str_replace('http'.(isset($_['server']['https']) ? 's' : '').'://'.$_['server']['http-host'],'',$_['server']['http-referer']));
			
			if($_['server']['http-referer']=='/'){
				$href = '/';
			}
						
			if($page = (new _Page(array(FETCH_FROM_DB => true, '_debug' => true, 'site-id' => $_['site']->id, 'href' => $uri)))){
			
			var_dump('$2$$',$uri,$page->id);
			
				if(!empty($_['post']['page']) && _is_array($_['post']['page'])){
					
					foreach($_['post']['page'] as $pkey => $p){
						$page->$pkey = $p;
					}
					
				}
								
				if($page->save()){
					$_['url']->redirect($_['server']['http-referer']);
				}
				
			}
		}

		
	}
	
	
	var_dump('@@@ post',$_['post'],'###',$_form);

	die('444');
?>