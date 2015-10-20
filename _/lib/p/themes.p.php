<?php
	/* juniper/lib/presenter/themes - presenter for themes (swatches)
		(juniper + nimbus) © 2012+ numonium //c - all rights reserved	
	*/

	global $_;
	
	class _ThemesPresenter extends _Presenter {
		var $model;
		var $view;
		
		public static function all(){
			global $_;
			
			//dummy element
			$m=new _Theme();
			$tbl=$_['db']->getTableName($m);
			
			$ret=array();
			
			if($rows=$_['db']->getAll($tbl)){
				
				foreach($rows as $rkey=>&$row){
					$rows[$rkey]=new _Theme($row);
					
					//get templates for theme
					if($templates=$rows[$rkey]->templates){
						foreach($templates as $tkey=>$template){
							if(empty($ret[$template->slug])){
								$ret[$template->slug]=array();
							}
							$ret[$template->slug][]=$rows[$rkey];
						}
					}
				}
				
				return $ret;
			}
			
			return false;
		}
	}
?>
