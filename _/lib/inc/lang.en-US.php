<?php
	#	lang.php:		Language tools
	#	lang.en.php:	English (US) Language Tools
	#	~EN: 11 May 2010
	
	global $_;
	
	define('LANG_CAP_LENGTH',4); //prepositions under this length will be capitalised
	define('ELLIPSES','...');

	_init($_['lang']);
	$_['lang']['charset']='UTF-8';

	define('CHARSET',$_['lang']['charset']);
	
	//language articles
	$_['lang']['arts']=array('a','an','the');
	
	//language conjunctions
	$_['lang']['conj']=array('and','or','not');
	
	//language prepositions
	$_['lang']['preps']=array('aboard','about','above','across','after','against','along','amid','among','anti','around','as','at','before','behind','below','beneath','beside','besides','between','beyond','but','by','concerning','considering','despite','down','during','except','excepting','excluding','following','for','from','in','inside','into','like','minus','near','of','off','on','onto','opposite','outside','over','past','per','plus','regarding','round','save','since','than','through','to','toward','towards','under','underneath','unlike','until','up','upon','versus','via','with','within','without');
	
	function an($word,$applyCase=true){ //use "a" vs "an"
		if(empty($word))
			return false;
			
		$_word = $word;
		$word = strtolower($word);
		
		if(in_array($word, array('a','an'))){
			$_word;
		}
		
		$ret = false;
		
		if($word == strtolower(plural($_word))){ //is plural word
			$ret = 'some'; //use "some" for plural words
		}
		
		if(!$ret){
		
			switch($word[0]){
				case 'a':
				case 'e':
				case 'i':
				case 'o':
				case 'u':
					$ret = 'an';
					break;
			}
			
		}
		
		if(!$ret && ($word[0] == 'h')){ //apply "an" to unsounded "h"
			switch($word){
				case 'honor':
				case 'honest':
				case 'heir':
				case 'herb':
				case 'hors d\'oeuvre':
				case 'hour':
				case 'homage':
				case 'hola':
				case 'heiress':
				case 'hombre':
				case 'honorific':
				case 'honorable':
				case 'honestly':
					$ret = 'an';
					break;				
				default:
					$ret = 'a';
					break;
			}
		}
		
		if(!$ret){
			$ret = 'a';
		}
		
		return ($applyCase ? applyCase($_word,$ret) : $ret);
	}
	
	function filterByWordLength($word, $length=LANG_CAP_LENGTH){
		return (strlen($word) <= $length);
	}
	
	function capWord($word){ //capitalise word properly
		/* RULES:
			* Not an article, conjunction, or preposition <= 4 in length
		*/
		global $_;
		
		$lword=strtolower($word); //lowercase word
		if(!in_array($lword, $_['lang']['arts']) && !in_array($lword, $_['lang']['conj']) && !in_array($lword, filterByWordLength($_['lang']['preps'])))
			return ucfirst($lword);

		//should be lowercase
		return $lword;
	}
	
	function capTitle($title){ //capitalise title PROPERLY
		/* RULES:
			* First and last words are caps
			* Not an article, conjunction, or preposition <= 4 in length
		*/
		$words=explode(" ",$title);
		
		//first and last words are caps
		$words[0]=ucfirst($words[0]);
		$words[count($words)-1]=ucfirst($words[count($words)-1]);
		
		for($i=1; $i<count($words)-1; $i++){
			$words[$i]=capWord($words[$i]);
		}
		
		return implode(" ",$words);
	}
	
	function startsWith($word,$start){
		return substr($word,0,strlen($start))==$start;
	}
	
	function startsWithCap($word){
		global $_;
		
		return (ereg_replace($_['const']['regex']['letter-cap-first'][0],$word)>0);
	}
	
	function endsWith($word,$end){
		return (strtolower(substr($word,strlen($word)-strlen($end)))==strtolower($end));
	}
	
	function applyCase($from,$to){
		global $_;

		$case=array();
		$ret='';
		
		$length=(strlen($from)>strlen($to) ? strlen($from) : strlen($to));
		
		$f=str_split($from);
		$t=str_split($to);
		
		//iterate through $from and detect case and position -> apply to $to
		for($i=0; $i<$length; $i++){
			if(isset($f[$i]) && ereg($_['const']['regex']['letter-caps-first'][0],$f[$i])){
				$ret.=strtoupper($t[$i]);
			}else if(isset($f[$i]) && ereg($_['const']['regex']['letter-lower-first'][0],$f[$i]) && isset($t[$i])){
				$ret.=strtolower($t[$i]);
			}else if(isset($t[$i])){
				$ret.=$t[$i];
			}
		}
		
		return $ret;
	}
	
	function fixCase($str,$mode=MB_CASE_TITLE){
		return str_ireplace(array('&nbsp;'),array('&nbsp;'),mb_convert_case($str,$mode));
	}
	
	function possessive($noun,$poss='s'){
		$str=$noun."'";
		if($noun[strlen($noun)-1]!=$poss)
			$str.=$poss;
		return $str;
	}
	
	function plural($unit,$num=0){
		if(strtolower(substr($unit,-1))=='s' || strtoupper($unit) == $unit){
			return $unit;
		}
		
		if(strpos(' ',trim($unit))!==false){
			$unit=explode(' ',trim($unit));
			$ret=array();
			foreach($unit as $key=>$u){
				$ret[]=plural($u);
			}
			return implode(' ',$ret);
		}
		
		switch(strtolower($unit)){
			case 'a':
				return applyCaps($unit,'some');
				break;
			case 'admin':
			case 'seo':
				return $unit;
				break;
			case 'beach':
				return applyCaps($units,'beaches');
				break;
			case 'css':
			case 'js':
				return $unit;
				break;
			case 'goose':
				return applyCaps($unit,'geese');
				break;
			case 'index':
				return applyCaps($unit,'indices');
				break;
			case 'medium':
			case 'media':
				return applyCaps($unit,'media');
				break;
			case 'moose':
				return $unit;
				break;
			case 'person':
				return applyCaps($unit,'people');
				break;
			case 'radius':
				return applyCaps($unit,'radii');
				break;
		}
		
		$changes=array(
			'y' => 'ie',
			'f'	=> 've'
		);
		
		foreach($changes as $key=>$change){
			if(strtolower($unit[strlen($unit)-strlen($key)])==$key)
				$unit=substr($unit,0,strlen($unit)-strlen($key)).$change;
		}
		return $unit.($num!=1 ? 's' : '');
	}
	
	function singular($word){
		switch(strtolower($word)){
			case 'news':
				return $word;
				break;
			case 'media':
				return applyCaps($word,'medium');
				break;
			case 'css':
			case 'js':
				return $word;
				break;
		}
		
		$changes=array(
			'ii' => 'ius',
			'ies' => 'y',
			'ves' => 'f',
			'es'	=> '',
			's'	=> ''
		);
		foreach($changes as $key=>$change){
			if(strrpos($word,$key)==strlen($word)-strlen($key)){
				return substr($word,0,strrpos($word,$key)).$change;
			}
		}
		return $word;
	}
	
	function units($num,$unit='item'){
		if(intval(round($num))==1)
			return applyCase($unit,singular($unit));
		else
			return applyCase($unit,plural($unit));
	}

?>