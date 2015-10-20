<?php
	/* juniper/lib/presenter/templates - presenter for templates (markup)
		(juniper + nimbus) © 2012+ numonium //c - all rights reserved	
	*/

	global $_;
	
	class _TemplatesPresenter extends _Presenter {
		var $model;
		var $view;
		
		public static function all(){
			global $_;
			
			//dummy element
			$m=new _Template();

			$tbl=$_['db']->getTableName($m);
			
			$ret=array();
			
			if($rows = $_['db']->getAll($tbl,"hidden='0' and reserved='0' and `parent-id`='0'")){

				
				foreach($rows as $rkey=>&$row){
					if($row['reserved'] || $row['hidden']){ //is reserved template?
						continue;
					}
					
					$rows[$rkey]=new _Template($row);
					if(!empty($rows[$rkey]->children) && _is_array($rows[$rkey]->children)){
						foreach($rows[$rkey]->children as $rckey=>$child){
							if(!empty($child->sidebar['position'])){
								$rows[$rkey]->sidebar[$child->sidebar['position']]=true;
								unset($rows[$rkey]->sidebar['position']);
							}
						}
					}
					
					$ret[]=$rows[$rkey];
/*					
					//get templates for theme
					if($templates=$rows[$rkey]->templates){
						foreach($templates as $tkey=>$template){
							if(empty($ret[$template->slug])){
								$ret[$template->slug]=array();
							}
							$ret[$template->slug][]=$rows[$rkey];
						}
					}*/
				}
				
				return $ret;
			}
			
			return false;
		}
	}
?>
