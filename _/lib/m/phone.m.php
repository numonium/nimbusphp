<?php
	/* juniper/lib/model/phone - model for phone functions
		(juniper + nimbus) (c) 2012+ numonium //c - all rights reserved	
	*/

	global $_;
	
	class _Phone extends _Model {
		var $id;
		var $uuid;
		var $presenter; //binding to particular presenter

		function __construct($args,$force_init=true){
			global $_;
			
			parent::__construct($args,$force_init);
			
			$this->remove_from_db(array('presenter','tbl'));
		}

		function __get($var){
			return parent::__get($var);
		}
		
		public static function text($num,$text,$carrier='',$type='sms'){
			global $_;
			
			if(is_string($carrier)){
				$carrier = array('uuid' => $carrier);
			}
			
			$tbl = $_['db']->getTableName(__CLASS__);
			$tbl_sub = $_['db']->getSubTable(singular($tbl),'carriers');
			
			if($row = $_['db']->getSingle($tbl_sub,$carrier)){
				
					$addr = $num.'@'.(!empty($row['address'][$type]) ? $row['address'][$type]: $row['address']['sms']);
					$mail = mail($addr,'',$text,"From: Testy Test2 <test@numonium.com>\r\n");
#					var_dump('##21a',$addr,$mail);

					return $mail;
				
			}
			
			return false;
		}
		
		public static function carrier_update(){
			global $_;
			
			$tbl = $_['db']->getTableName(__CLASS__);
			$tbl_sub = $_['db']->getSubTable(singular($tbl),'carriers');
			
			if($rows = $_['db']->getAll($tbl_sub,$carrier)){
			
				foreach($rows as $rkey => $row){
					
#					var_dump('#$$2',$_['db']->update($tbl_sub,array('slug' => slug($row['name'])),$_['db']->where(array('uuid' => $row['uuid']))));
#					var_dump('!!!',array('slug' => slug($row['name'])));
					
				}
			
			}
			
		}
	
	}
?>
