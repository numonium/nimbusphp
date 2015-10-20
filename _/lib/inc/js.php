<?php
	/* juniper/lib/js - javascript helper functions
		(juniper + nimbus) (c) 2012+ numonium //c - all rights reserved */
		
	function js(){
		$args=func_get_args();
		
		if(!is_array($args))
			$args=array($args);
			
		if(count($args)==1 && is_array($args[0]))
			$args=$args[0];

		echo '<script type="text/javascript">'.implode("\n",$args).'</script>';
	}
	
	function js_include($file){
		js_require($file);
	}
	
	function js_require($file){
		global $_;
		
		if(is_array($file) && isset($file[0])){
			$file=$file[0];
		}else if(is_array($file) && isset($file['_'])){
			$_['vars']['js'][]=$file['_'];
			return;
		}
		
		if(!in_array($file[0],array('/','.')) && !endsWith($_['site']['dirs']['js'],'/'))
			$file='/'.$file;
		else if(in_array($file[0],array('/','.')) && endsWith($_['site']['dirs']['js'],'/'))
			$file=substr($file,0,-1);

		$_['vars']['js_include'][]=$_['site']['dirs']['js'].$file;
			
//		$_['vars']['js_include'][]=($file[0]=='/' ? (endsWith($_['site']['dirs']['js'],'/') ? substr($_['site']['dirs']['js'],0,-1) : (endsWith($_['site']['dirs']['js'],'/') ? $_['site']['dirs']['js'] : $_['site']['dirs']['js'].'/')) : $_['site']['dirs']['js']).$file;
	}
	
	function js_include_once($file){
		js_require_once($file);
	}
	
	function js_load($uri=''){
		global $_;
		
		$ext = '.js';
		
		if(!empty($uri) && is_object($uri)){
			$_dir = dirname($uri->uri);
			
			if(!empty($_['site']->template->dir['/'])){
				$_dir = _dir($_['site']->template->dir['/'].'/'.$_dir);
			}
			
			$_dir .= '/'.basename($uri->uri,'.'.$_['mime']['js']->ext);
			
		}else{
			
			if(!empty($_REQUEST['dir'])){
		
				$dir = (!empty($_REQUEST['dir']) ? $_REQUEST['dir'] : '_');
			#	$_dir = dirname(__FILE__).'/'.$dir;
				$_dir = $_SERVER['DOCUMENT_ROOT'].'/js/'.$dir;
			}else if(!empty($_['site']->template->dir['/'])){
				$_dir = _dir($_['site']->template->dir['/'].dirname($uri).'/'.basename($uri,$ext));
			}
					
	
			
			if(empty($_)){
				require_once($_SERVER['DOCUMENT_ROOT'].'/_/_.php');
			}
			
		}
		
		$_['http']->header('content-type',$_['mime']['js']->type);
			
		ob_start();
	/*
		?>
		<script type="text/javascript" src="/js/jquery-1.10.1.min.js"></script>
		<script type="text/javascript"><?php */
			
			if(!($files = _scandir($_dir))){ ?>
			
				// err[no-files] <?php
				
	#			$_['http']->header('Connection','close');
				exit;
				
			}
			
			$len = count($files); $total = 0;		
			foreach($files as $fkey => $file){
				if(pathinfo($file,PATHINFO_EXTENSION) != $_['mime']['js']->ext){
					continue;
				}
				
				$total++;
				
				$path = _dir($_dir.'/'.$file); ?>
			
				// # (<?php echo $fkey.' / '.$len; ?>) <?php echo $file; ?> {<?php
				
				echo "\n\n".file_get_contents($path); ?>
				
				// } <?php echo $file ?> # (<?php echo $fkey.' / '.$len; ?>) <?php
				
				echo "\n\n";
				
				unset($path);
		
			}
			
			/* ?>
			
		</script><?php */
	
		return trim(ob_get_clean());	
	}
	
	function js_require_once($file){
		global $_;
		if(is_array($file) && count($file)==1 && isset($file['_']) && !in_array($file['_'],(is_array($_['vars']['js']) ? $_['vars']['js'] : array($_['vars']['js'])))){
			js_require($file);
		}else if(!is_array($file) && isset($_['lib']['js'][$file]) && is_array($_['lib']['js'][$file])){
			foreach($_['lib']['js'][$file] as $key=>$f){

				if(!is_int($key) && $key=='_'){
//					var_dump("@@@",$file,$_['lib']['js'][$file],'!!!',$key,$f);
					$f=array($key => $f);
				}
				
				if(!is_array($f) || (is_array($f) && count($f)==1 && isset($f['_']))){
					js_require_once($f);
				}else if(is_array($f)){
					foreach($f as $fkey=> $f2){
						if($fkey=='_'){
							js_require_once($f);
						}else{
							js_require_once($f2);
						}
					}
				}
			}
		}else if(is_array($file)){
			foreach($file as $key=>$f){
				js_require_once($f);
			}
		}else if(isset($_['lib']['js'][$file])){
			js_require_once($_['lib']['js'][$file]);
		}else{
			if(!in_array($file[0],array('/','.')) && !endsWith($_['site']['dirs']['js'],'/'))
				$file='/'.$file;
			else if(in_array($file[0],array('/','.')) && endsWith($_['site']['dirs']['js'],'/'))
				$file=substr($file,0,-1);
				
/*			if(!in_array(($file[0]=='/' ? (substr($_['site']['dirs']['js'],-1)=='/' ? substr($_['site']['dirs']['js'],0,-1) : $_['site']['dirs']['js']) : $_['site']['dirs']['js']).$file,(is_array($_['vars'][(is_array($file) && isset($file['_']) ? 'js' : 'js_include')]) ? $_['vars']['js_include'] : array($_['vars'][(is_array($file) && isset($file['_']) ? 'js' : 'js_include')])))){*/

			if(!in_array($_['site']['dirs']['js'].$file,$_['vars']['js_include'])){
				js_require($file);
			}
		}
	}
?>