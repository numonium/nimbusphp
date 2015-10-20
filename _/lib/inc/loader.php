<?php
	/* juniper/lib/loader - bootstrapper to auto-load classes and assets
		(juniper + nimbus) (c) 2012+ numonium //c - all rights reserved	*/
		
	function __autoload($class){
		global $_;
		
		if($class[0]=='_')
			$class=substr($class,1);
			
		if(strrpos(strtolower($class),'presenter')!==false){
			$class=str_ireplace('presenter','',$class);
			$dirs=array(
				_dir($_['.'].'/'.$_['/']['presenters'].'/'.$class.'.p.php'),
				_dir($_['.'].'/'.$_['/']['presenters'].'/'.strtolower($class).'.p.php')
			);
		}else{
			$dirs=array(
				_dir($_['.'].'/lib/o/'.$class.'.o.php'),
				_dir($_['.'].'/lib/o/'.strtolower($class).'.o.php'),
				_dir($_['.'].'/'.$_['/']['models'].'/'.$class.'.m.php'),
				_dir($_['.'].'/'.$_['/']['models'].'/'.strtolower($class).'.m.php')
			);
		}
				
		foreach($dirs as $dkey=>$dir){
			if(file_exists($dir)){
				require_once($dir);

				return true;
			}
		}

		return false;
	}
	
?>