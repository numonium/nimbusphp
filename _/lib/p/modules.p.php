<?php
	/* juniper/lib/presenter/modules - presenter for modules
		(juniper + nimbus) © 2012+ numonium //c - all rights reserved	
	*/

	global $_;
	
	class _ModulesPresenter extends _Presenter {
	
		public static function all(){
			global $_;
			
			$ret=array();
			$mod=false;
			
			foreach(_scandir(_dir($_['.'].$_['/']['mod'])) as $dkey=>$dir){
				if(is_dir(_dir($_['.'].$_['/']['mod'].'/'.$dir))){
					$mod=new _Module($dir);
				}
				$ret[$dir]=$mod;
				unset($mod);
			}
			
			return (count($ret) > 0 ? $ret : false);
		}
	}
?>
