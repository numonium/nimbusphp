<?php
	/* juniper/db - database abstraction libraries (mysql)
		(juniper + nimbus) (c) 2012+ numonium //c - all rights reserved */
	
	class _DB extends _ {
		var $host;
		var $user;
		var $pass;
		var $db;
		var $sql; //sql resource
		var $collapse; //if result returns one record, return the record rather than an array
		var $expand;
	
		function __construct($host,$user='',$pass='',$db=''){
			if(is_array($host) && array_key_exists('host',$host)){
				$this->host=$host['host'];
				$this->user=$host['user'];
				$this->pass=$host['pass'];
				$this->db=$host['db'];
				
				if(isset($host['collapse']))
					$this->collapse=$host['collapse'];
					
				if(isset($host['expand']))
					$this->expand=$host['expand'];
			}else{
				$this->host=$host;
				$this->user=$user;
				$this->pass=$pass;
				$this->db=$db;
			}
			$this->connect();
		}
		
		function connect(){
			global $_;
			
			$dbo=func_get_args();
			if(func_num_args()==1){
				$dbo=$dbo[0];
				$this->host=$dbo['host'];
				$this->user=$dbo['user'];
				$this->pass=$dbo['pass'];
				if($dbo["db"]!=""){
					$this->db=$dbo['db'];
					$this->selectDB($dbo["db"]);
				}
			}else if(func_num_args()>1){
				$this->host=$dbo[0];
				$this->user=$dbo[1];
				$this->pass=$dbo[2];
	//			mysql_connect($dbo[0],$dbo[1],$dbo[2]);
				if($dbo[3]!=""){
					$this->db=$dbo[3];
				}
			}
			
			$this->sql=mysql_connect($this->host,$this->user,$this->pass);
			if($this->db!='')
				$this->selectDB();
		}
		
		function close(){
			mysql_close($this->sql);
			$this->sql=null;
		}
	
		function selectDB($db=''){
			if(empty($db))
				$db=$this->db;
			mysql_select_db($db);
		}
	
		function select($table,$where='',$fields=WILDCARD,$order='',$distinct=false){
			//gotta sanitize user input
	/*		$table=mysql_real_escape_string($table);
			$where=mysql_real_escape_string($where);
			$fields=mysql_real_escape_string($fields);*/

			$this->checkTableName($table);

			if(!$this->tableExists($table))
				return false;
			
			if(!empty($where) && is_array($where)){
				$where = $this->where($where,$table);
				 /*
				$whereq=''; //where query
				if(!empty($where['_join'])){ //join with AND, OR
					$wherej=$where['_join'];
					unset($where['_join']);
				}else{
					$wherej='and';
				}
				$i=0;
				foreach($where as $key=>$w){
					if(!$this->fieldExists($table,$f)){
					$whereq.='`'.$key.'`'."='".$this->escape($w)."'".($i<count($where)-1 && !empty($wherej) ? ' '.$wherej.' ' : '');
					$i++;
				}
				$where=$whereq;
				unset($whereq,$wherej);*/
			}
			
/*			if($table=='users' && LIVE && (strpos('activated',$where)===false)){
				$where='('.$where.') and activated='."'1'";
			}*/
			
			if(is_array($fields)){
				foreach($fields as $fkey=>&$f){
					if(!$this->fieldExists($table,$f)){
						unset($fields[$fkey]);
						continue;
					}
					$fields[$fkey]='`'.$f.'`';
				}
			}else if($fields!=WILDCARD){
				$fields='`'.$fields.'`';
			}
			
			$q = "select ".($distinct!==false ? "distinct " : '').(is_array($fields) ? implode(',',$fields) : $fields)." from ";
			
			if(strpos($table, ',') !== false){
				$q .= $table;
			}else{
				$q .= "`$table`";
			}

			$q .= ($where!='' ? " where $where" : '').($order!='' ? " order by $order" : '');
			
	//		print $q;
			$sql=$this->query($q) or die($this->error()."<br /><br />$q");
			return $sql;
		}
		
		function selectQuery($q){
			$sql=$this->query($q) or die($this->error()."<br /><br />$q");
			return $sql;	
		}
	
		function selectDist($table,$where='',$fields=WILDCARD,$order=''){
			return $this->select($table,$where,$fields,$order,true);
		}
	
		function selectDistinct($table,$where='',$fields=WILDCARD,$order=''){
			return $this->select($table,$where,$fields,$order,true);
		}	
	
		function selectMulti($tables,$where,$fields=WILDCARD,$order=''){
			$this->checkTableName($table);
			
			/* cool thing about $fields:
				all integer indices are applied to all tables
				indices = tableName will only be applied to that table
				not an array? applies string field to all tables */
				
			$sql="select ";
			$i=0;
			foreach($tables as $key=>$table){
				if(is_array($fields)){
					$j=0;
					foreach($fields as $k2=>$field){
						$sql.=(is_int($k2) || $k2==$table ? $table.'.'.$field : '').
							(($i<(count($tables)-1)) || ($i<count($tables) && $j<(count($fields)-1)) ? ', ' : '');
						$j++;
					}
				}else{
					$sql.=$table.'.'.$fields.($i<(count($tables)-1) ? ', ' : '');
				}
				$i++;
			}
			foreach($tables as $tkey=>&$t){
				$tables[$tkey]='`'.$t.'`';
			}
			
			$sql=$this->query($sql." from ".implode(',',$tables).($where!='' ? " where $where".($order!='' ? " order by $order" : '') : '')) or die($this->error());
			return $sql;
		}
		
		function tableExists($table){
			$this->checkTableName($table);
			
			
			if(strpos($table, ',') !== false){
				$table = substr($table, 0, strpos($table, ','));
			}
			
			return ($this->getQuery("show tables like '$table'")!==false);
		}
		
		function fieldExists($table,$field){
			$this->checkTableName($table);
			
			if(strpos($table, ',') !== false){
				$table = substr($table, 0, strpos($table, ','));
			}
		
			return ($this->tableExists($table) && $this->getQuery("show columns from `$table` like '$field'")!==false);
		}
		
		//fetches array from sql result
		function fetch($sql,$type='assoc'){
			global $_;
			
			if(($rows=mysql_num_rows($sql))>0){
				if($this->collapse && $rows==1){
					return call_user_func('mysql_fetch_'.$type,$sql);
				}else{
					$row=array();
					for($i=0; $i<$rows; $i++){
						$row[$i]=call_user_func('mysql_fetch_'.$type,$sql);
						if(_is_array($row[$i])){
							// ~EN: translate a to i
							foreach($row[$i] as $rkey=>&$val){
								if(is_numeric($val) && strpos($val,'.')!==false){
									$val=doubleval($val);
								}else if(is_numeric($val)){
									$val=intval($val);
								}
							}
							if(!empty($this->expand) && $this->expand==true){
								$row[$i]=array_expand($row[$i]);
							}
						}
		//				$row[]=mysql_fetch_assoc($sql);
					}
					return $row;
				}
			}
			return false;
		}
		
		function lastInsertID(){
			$sql=$this->query("select LAST_INSERT_ID()") or die($this->error());
			$ary=mysql_fetch_array($sql);
			return intval($ary[0]);
		}
		
		function describe($table){
			$this->checkTableName($table);
			
			if($this->tableExists($table)){
				return $this->getQuery('describe `'.$table.'`');
			}
		}
		
		function escape($str){
			if($str === ''){
				return false;
			}
			
			if(is_array($str)){
				$ret = array();
				foreach($str as $key => $val){
					$ret[$key] = $this->escape($val);
				}
				
				return $ret;
			}
		
			return mysql_real_escape_string($str);
		}
		
		function exclude($data){
			if(!empty($data['excl_from_db']) && _is_array($data['excl_from_db'])){
				foreach($data['excl_from_db'] as $ekey=>$excl){
					if(!empty($data[$excl])){
						unset($data[$excl]);
					}
				}
				unset($data['excl_from_db']);
			}
			
			return $data;
		}
		
		function get($table,$where='',$fields=WILDCARD,$order='',$distinct=false){
			$this->checkTableName($table);
			
			if(is_array($table)){
	/*			$ret=array();
				foreach($table as $t){
					$sql=dbSelect($t,$where,$fields,$order);
					$ary=dbFetch($sql);
					if(is_array($ary))
						$ret=array_merge($ret,$ary);
				}
				return $ret;*/
				$table=implode(',',$table);
			}

			$sql=$this->select($table,$where,$fields,(!empty($order) || (empty($order) && !$this->fieldExists($table,'id')) ? $order : "id asc") ,$distinct);
			return $this->fetch($sql);
		}
		
		function getAll($table,$where='',$fields=WILDCARD,$order='',$distinct=false){
			$collapse=$this->collapse;
			$this->collapse=false;
			$q=$this->get($table,$where,$fields,$order,$distinct);
			$this->collapse=$collapse;

			return $q;		
		}
		
		function getSingle($table,$where='',$fields=WILDCARD,$order='',$distinct=false){
			$q=$this->getAll($table,$where,$fields,$order,$distinct);
			return $q[0];
		}
		
		function getQuery($q){
			$sql=$this->selectQuery($q);
			return $this->fetch($sql);
		}
	
		function getDist($table,$where='',$fields=WILDCARD,$order=''){
			return $this->get($table,$where,$fields,$order,true);
		}
		
		function getDistinct($table,$where='',$fields=WILDCARD,$order=''){
			return $this->get($table,$where,$fields,$order,true);
		}
		
		function getVal($table,$field,$where=''){
			$val=$this->get($table,$where,$field);
			if($val!==false)
				return $val[0][$field];
			return false;
		}
		
		function getMulti($tables,$where,$fields=WILDCARD,$order=''){
			/* cool thing about $fields:
				all integer indices are applied to all tables
				indices = tableName will only be applied to that table
				not an array? applies string field to all tables */
	
			$sql=$this->selectMulti($tables,$where,$fields,$order);
			
			return $this->fetch($sql);
		}
		
		function hasRows($table,$where='',$fields=WILDCARD,$order='',$distinct=false){
			return ($this->numRows($table,$where,$fields,$order,$distinct)>0);
		}
		
		function numRows($table,$where='',$fields=WILDCARD,$order='',$distinct=false){
			$this->checkTableName($table);
			
			if(func_num_args()==1){
				$sqlq="select * from `$table`";
			}else if(func_num_args()>0){
				if(is_array($fields)){
					foreach($fields as $fkey=>&$f){
						$fields[$fkey]='`'.$f.'`';
					}
				}else if($fields!=WILDCARD){
					$fields='`'.$fields.'`';
				}

				$sqlq="select ".($distinct!==false ? 'distinct ' : '').(is_array($fields) ? implode(',',$fields) : $fields)." from `$table`";

				if(is_array($where)){
					$sqlq.=" where ".$this->where($where,$table);
/*					$i=0;
					foreach($where as $key=>$val){
						if(is_array($val) && $val['_op_before']!="")
							$sqlq.=' '.$val['_op_before'].' ';
						$sqlq.="`".$key."`='".mysql_escape_string($val)."'";
						if(is_array($val) && $val['_op']!="")
							$sqlq.=' '.$val['_op'].' ';
						else if($i<(sizeof($where)-1))
							$sqlq.=" AND ";
						$i++;
					}*/
				}else if($where!=''){
					$sqlq.=" where $where";
				}

				$sqlq.=($order!='' ? " order by $order" : '');

			}else{
				return false;
			}

	//		$sql=mysql_query($sqlq) or die(mysql_error()."\n<br />".$sqlq);

			return $this->numRowsQuery($sqlq);
		}
		
		function numRowsQuery($sqlq){
			$sql=$this->query($sqlq) or die($this->error()."\n<br />".$sqlq);
			return mysql_num_rows($sql);		
		}
		
		function numRowsDist($table,$where='',$fields=WILDCARD,$order=''){ //select DISTINCT
			return $this->numRows($table,$where,$fields,$order,true);
		}
		
		function numRowsDistinct($table,$where='',$fields=WILDCARD,$order=''){ //select DISTINCT
			return $this->numRows($table,$where,$fields,$order,true);
		}	
		
		function numRowsMulti($tables,$where,$fields=WILDCARD,$order=''){
			/* cool thing about $fields:
				all integer indices are applied to all tables
				indices = tableName will only be applied to that table
				not an array? applies string field to all tables */
	
			$sql=$this->selectMulti($tables,$where,$fields,$order);
			
			return mysql_num_rows($sql);
		}	
		
		function insert($table,$data){
			global $_;
			
			$this->checkTableName($table);
			
//			$data=array_map('mysql_real_escape_string',$data);
			$q=array(
				'keys'		=> '',
				'values'	=> ''
			);
			
			$i=0;
			
			$data=$this->exclude($data);

			if(!empty($this->expand) && $this->expand==true){
				$data=array_flatten($data);
			}
						
			$len = count($data);
			foreach($data as $key => &$d){
				if(is_object($d)){
					$deconstructed = false;
					if(!empty($d->id)){
						$data[$key.'-'.'id'] = $d->id;
						$deconstructed = true;
						$len++;
					}
					
					if(!empty($d->uuid)){
						$data[$key.'-'.'uuid'] = $d->uuid;
						$deconstructed = true;
						$len++;
					}
					
					if($deconstructed){
						unset($data[$key]);
						$len--;
						continue;
					}else{
						$data[$key] = serialize($d);
					}
				}else if(is_array($d)){
					$d = serialize($d);
				}
				
				if(!$this->fieldExists($table,$key)){
					unset($data[$key]);
					$len--;
					continue;
				}

				$d = $this->escape($d);
				$q['keys'].="`".$key."`".($i<$len-1 ? ',' : '');
				$q['values'].="'".$d."'".($i<$len-1 ? ',' : '');
				$i++;
			}
			
			$sqlq="insert into `$table` (".trim($q['keys'],',').") values (".trim($q['values'],',').")";
//			$sqlq="insert into $table (".implode(',',array_keys($data)).") values ('".implode("','",$data)."')";
			$sql=$this->query($sqlq) or die($this->error()."\n<br />".$sqlq);
			return $this->lastInsertID();
		}
		
		function insertAll($table,$data){
			foreach($data as $key=>&$d){
				$d['id']=$this->insert($table,$d);
			}
			
			return $data;
		}
		
		function update($table,$data,$where='',$unclean=false){
			$this->checkTableName($table);
			
			$sql="update `$table` set ";
			
			if(is_array($data)){
				$i=0;
				
				if(!empty($this->expand) && $this->expand==true){
					$data=array_flatten($data);
				}
				
				foreach($data as $key=>$val){
	//				$sql.=$key."=".(!$unclean ? "'".cleanData($val)."'" : $val).($i<(sizeof($data)-1) ? ', ' : ' ');
					$sql.='`'.$key."`=".(!$unclean ? "'".mysql_real_escape_string($val)."'" : mysql_real_escape_string($val)).($i<(sizeof($data)-1) ? ', ' : ' ');
					$i++;
				}
			}else{
				$sql.=$data;
			}
			
			$sqlq=$sql.($where!='' ? "where $where" : '');			
			$sql = $this->query($sqlq) or die($this->error()."\n<br />".$sqlq."\n<br />".$sqlq);
			
			return true;
		}
		
		function alter($table,$data){
			$this->checkTableName($table);
			
			$sql="alter table `$table` ";
			$i=0;
			foreach($data as $key=>$val){
				$sql.=$key."=".(is_int($val) ? $val : "'".cleanData($val)."'").($i<(sizeof($data)-1) ? ', ' : ' ');
				$i++;
			}
			$sql=$this->query($sql) or die($this->error());		
		}
		
		function setAutoInc($table,$val){
			$this->alter($table,array("AUTO_INCREMENT"=>$val));	
		}
		
		function delete($table,$where=''){
			$this->checkTableName($table);
			
			if(!empty($where) && _is_array($where)){
				$where = $this->where($where,$table);
			}
			
			return $this->query("delete from `$table`".($where!='' ? " where $where" : '')) or die($this->error());
		}
		
		function truncate($table,$force=false){
			$this->checkTableName($table);
			
			if(is_array($table)){
				foreach($table as $key=>$t){
					$sql[]=$this->truncate($t,$force);
				}
			}else{
				if($force!==false){
					$this->foreign_key_checks(false);
				}
				
				$sql=$this->query('truncate table '.$table);
				
				if($force!==false){
					$this->foreign_key_checks(true);
				}
			}
			return $sql;
		}
		
		function trunc($table,$force=false){
			$this->truncate($table,$force);
		}
		
		//encodes text for best use with mysql like
		function likeText($text,$wildcards='both'){
			return ($wildcards=='both' || $wildcards=='before' ? '%' : '').str_replace(' ','',strtolower(trim($text))).($wildcards=='both' || $wildcards=='after' ? '%' : '');
		}
		
		function checkTableName($table){
			global $_;

			if(!empty($_['cfg']['db']['_table_prefix']) && !startsWith($table,$_['cfg']['db']['_table_prefix'])){
				$table=$_['cfg']['db']['_table_prefix'].$table;
			}
			
			if(!empty($_['cfg']['db']['_table_suffix']) && !startsWith($table,$_['cfg']['db']['_table_suffix'])){
				$table.=$_['cfg']['db']['_table_suffix'];
			}
			
			return $table;
			
		}
		
		function getSubTable($tbl,$child){
			global $_;
			
			if(is_object($tbl)){
				$tbl = $_['db']->getTableName($tbl);
			}
			
			return $tbl.'-'.$child;
		}
	
/*		
		function getTableName($className=''){
			if(is_object($className) && !empty($className->className))
				$className=$className->className;
			else if(is_object($className))
				$className=_get_class($className);
			
			$table = false;
			$_className = $className;			
			
			if($className[0]=='_'){
				$className=substr($className,1);
			}
			
			//manual overrides
			switch(strtolower($className)){

			}
			
			$className = strtolower(plural($className));
			
			if($parentClass = _get_parent_class($_className)){
				return $this->checkTableName($this->getTableName($parentClass).'-'.$className);
			} 
			
			return $this->checkTableName($className);
		}*/
		

		function getTableName($className=''){
			if(is_object($className) && !empty($className->className))
				$className=$className->className;
			else if(is_object($className))
				$className=_get_class($className);
			
			$table = false;
			$_className = $className;			
			
			if($className[0]=='_'){
				$className=substr($className,1);
			}
			
			//manual overrides
			switch(strtolower($className)){

			}
			
			if(empty($table)){	
						
				$className=strtolower(plural($className));
				
				if($parentClass = _get_parent_class($_className)){
					$parentClass = strtolower($parentClass);

					if(in_array($parentClass, array('item'))){
						$table = plural($parentClass).'-'.$className;
					}else{
						$table = $className;
					}
				}else{
					$table = $className;
				}

			}
			
			if(empty($table)){
				$table = $className;
			}
			
			$table = $this->checkTableName($table);
			
			return $table;
		}


		
		function error(){
			return mysql_error();
		}
		
		function err(){
			return $this->error();
		}
		
		function e(){
			return $this->error();
		}
		
		function foreign_key_checks($toggle){
			return $this->query('set foreign_key_checks='.($toggle ? 1 : 0));
		}
		
		function foreign_key_check($toggle){
			return $this->foreign_key_checks($toggle);
		}
		
		function query($sql){
			return mysql_query($sql);
		}
		
		function q($sql){
			return $this->query($sql);
		}
		
		//computes sql "where" statement from array of given args
		function where($args,$table=''){
			if(!empty($args) && is_object($args)){
				$args=get_object_vars($args);
			}
			
			if(empty($args) || !is_array($args) || count($args)==0 || (isset($args[FETCH_FROM_DB]) && count($args)==1)){
				return false;
			}
			
			if(isset($args[FETCH_FROM_DB]))
				unset($args[FETCH_FROM_DB]);

			$i=0;
			$q='';
			
			foreach($args as $key => $val){
				if(!empty($table) && !$this->fieldExists($table,$key)){
					continue;
				}
				if(is_array($val) && $val['_op_before']!="")
					$q.=' '.$val['_op_before'].' ';
				else if($i>0)
					$q.=' and ';

				$q.="`".$key."` ".($val === null ? 'is null' : "='".$this->escape($val)."'");

				if(is_array($val) && $val['_op']!="")
					$q.=' '.$val['_op'].' '; /*
				else if($i<(sizeof($args)-1))
					$q.=" AND ";*/

				$i++;
			}
			
			return $q;
		}
	}
?>