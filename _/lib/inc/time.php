<?php
	/* juniper/lib/time - date/time/chrono functions
		(juniper + nimbus) (c) 2012+ numonium //c - all rights reserved	*/

	global $_;
	
	_init($_['time']);
	
	/* ~EN: set default timezone so server doesn't freak out */
	date_default_timezone_set('America/New_York');
	
	$_['time']['day']=(intval(date('G')) >= 7 && intval(date('G')) < 18);
	$_['time']['night']=!$_['time']['day'];
	
	foreach($_['time'] as $key=>$t){
		define(strtoupper($key),$t);
	}
		$_['time']['months']=array('January','February','March','April','May','June','July','August','September','October','November','December');

	$_['time']['months12']=array();
	for($i=0; $i<count($_['time']['months']); $i++){
		$_['time']['months12'][$i]=($i<9 ? '0' : '').($i+1);
	}

	$_['time']['days']=array(
		'su'	=>	'Sunday',
		'm' 	=>	'Monday',
		't'		=>	'Tuesday',
		'w'		=>	'Wednesday',
		'th'	=>	'Thursday',
		'f'		=>	'Friday',
		'sa'	=>	'Saturday'
	);
	
	$_['time']['days']['nums']=array();
	for($i=0; $i<31; $i++)
		$_['time']['days']['nums'][$i]=$i+1;
	
	$_['time']['years']=array();
	for($i=1900; $i<=intval(date('Y')); $i++)
		$_['time']['years'][$i-1900]=$i;
		
	for($i=1900; $i<=intval(date('Y'))+3; $i++)
		$_['time']['years+3'][$i-1900]=$i;

	for($i=1900; $i<=intval(date('Y'))+5; $i++)
		$_['time']['years+5'][$i-1900]=$i;
	
	$_['time']['suffix']=array('AM','PM');
	
	$_['time']['hours12']=array();
	$_['time']['hours12'][]=12;
	for($i=1; $i<=11; $i++){
		$_['time']['hours12'][]=$i;
/*		$hours12[$i]=$hour.' '.$hours_sfx;
		if($i==0)
			$hours12[0]='12 AM';
		else if($i==12)
			$hours12[]='12 PM';
		else if($i>12)
			$hours12[]=($i-12).' PM';
		else
			$hours12[]=$i.' AM'; */
	}

	$_['time']['hours24']=array();
	for($i=1; $i<=24; $i++){
		$_['time']['hours24'][$i]=($i<10 ? "0$i" : "$i");
	}
	
	$_['time']['mins']=array();
	for($i=0; $i<60; $i++){
		$_['time']['mins'][$i]=($i<10 ? "0$i" : "$i");
	}
	
	$_['time']['mins15']=array('00', '15', '30', '45');
	
	function getDayNum($day){
		switch(strtolower($day)){
			case 'sunday':
				return 0;
				break;
			case 'monday':
				return 1;
				break;
			case 'tuesday':
				return 2;
				break;
			case 'wednesday':
				return 3;
				break;
			case 'thursday':
				return 4;
				break;
			case 'friday':
				return 5;
				break;
			case 'saturday':
				return 6;
				break;
		}
		return -1;
	}
	
	function getNextDayNum($day){
		if(is_int($day))
			$day=getDayNum($day);
		return ($curr+1)%7;
	}
	
	function getNextDay($day){
		$day=getDayNum($day);
		return $days[array_keys(getNextDayNum($day))];
	}
	
	function getHourNum($time){
		//assumed $time is in HH:MM A/PM format
		$time_ary=explode('_',str_replace(array(':',' '),'_',$time));
		if($time_ary[2]=='AM' || $time_ary[0]==12)
			return $time_ary[0];
		else
			return $time_ary[0]+12;
	}
	
	function getMinNum($time){
		//assumed $time is in HH:MM A/PM format
		$time_ary=explode('_',str_replace(array(':',' '),'_',$time));
		return intval($time_ary[1]);		
	}
	
	function duration($time1,$time2){
//		print strtotime($time2).' '.strtotime($time1).' => '.strtotime($time2)-strtotime($time1).'<br /><br />';
		return strtotime($time2)-strtotime($time1);
	}
	
	function dateCmp($file1,$file2){
		//ARCHIVE_PATH defined in _includes/xFuncs.php
		return (filemtime(ARCHIVE_PATH.$file1) < filemtime(ARCHIVE_PATH.$file2) ? -1 : 1);
	}
	
	function dateSort(&$dir){
		usort($dir,'dateCmp');
	}
	
	function timetodate($time=''){
		if(empty($time) || $time==null)
			return;
		else if(is_numeric($time) && is_string($time))
			$time=intval($time);
			
		if(is_int($time) || (!is_int($itme) && $time=strtotime($time))){
			$date=array(
				'month' => date('F',$time),
				'month0'=> date('m',$time),
				'monthx'=> date('M',$time),
				'month#'=> intval(date('n',$time)),
				'day'	=> date('l',$time),
				'day0'	=> date('d',$time),
				'day#'	=> intval(date('j',$time)),
				'year'	=> date('Y',$time),
				'year#'	=> intval(date('Y',$time)),
				'h'		=> date('h',$time),
				'h#'	=> intval(date('g',$time)),
				'h24'	=> date('H',$time),
				'h24#'	=> intval(date('G',$time)),
				'm'		=> date('i',$time),
				'm#'	=> intval(date('i',$time)),
				's'		=> date('s',$time),
				'u'		=> date('u',$time),
				'suffix'=> date('A',$time),
				'suffixl'=> date('a',$time),
				'time'	=> $time
			);
			return $date;
		}
		return false;
	}
	
	function datetostr($date=null){
		if($date===null || !is_array($date))
			return false;
		$ret=$date['month'].'/'.(!empty($date['day']) ? $date['day'].'/' : '').$date['year'];
		if(!empty($date['hour'])){
			$ret.=' '.$date['hour'].(!empty($date['min']) ? ':'.$date['min'] : '').(!empty($date['suffix']) ? $date['suffix'] : '');
		}
		
		return $ret;
	}
	
	function datetotime($date=null){
		if($date===null)
			return false;
			
		if(_is_array($date)){
			return strtotime(datetostr($date));
		}
		
		return strtotime($date);
	}
?>