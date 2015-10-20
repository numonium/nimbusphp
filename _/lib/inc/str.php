<?php
	/* juniper/lib/str - string manipulation/normalisation libraries
		juniper + nimbus © 2010+ numonium //c - all rights reserved */

    function _bool($var){
    	$out=false;
	    switch ($var) {
	        case true:
	        case 1:
	        case '1':
#	        case 'true':
#	        case 'on':
#	        case 'yes':
#	        case 'y':
	            $out = true;
	            break;
	        case '0':
	        case 'none':
	        	$out = false;
	        	break;
	    }
    
	    return $out;
    }
	
	// opposite of nl2br    
	function br2nl($string){
	    return preg_replace('/\<br(\s*)?\/?\>/i', "\n", $string);
	}
	
	function classtotable($class){
		return str_replace(' ','_',strtolower(singular(str_replace('_',' ',$class))));
	}
	
	function classtostr($class){
		if(is_object($class)){
			$class = get_class($class);
		}
		
		return ($class[0] == '_' ? substr($class, 1) : $class);
	}
	
	function _get_class($class){
		return classtostr($class);
	}
	
	function _get_parent_class($class){
		$parent = get_parent_class($class);
		if(!empty($parent) || (empty($parent) && ($parent = get_parent_class('_'.$class)))){
			return classtostr($parent);
		}
		
		return false;
	}
	
	function cleanCSV($fname){
		$contents=file_get_contents($fname);
		//consistent line endings
		$contents=str_replace(array("\r","\r\n"),array("\n"),$contents);
		$contents=str_replace(array("\n\n"),array("\n"),$contents);
		$contents=str_replace(array(",,"),array(",NULL,"),$contents);
		$contents=str_replace(array(",\n"),array(",NULL\n"),$contents);
/*		print "<br /><br />\n\n";
		var_dump($contents);
		print "<br /><br />\n\n";		*/
		return file_put_contents($fname,$contents);
	}
	
	function cleanData($data,$search='',$replace='',$callback=''){
		if($search=='')
			$search=array("'",'"');
		if($replace=='')
			$replace=array("\'",'\"');
/*		print '******';
		var_dump($search,$replace,$data);
*/
		if(is_array($data)){
			foreach($data as $key=>$val){
				$data[$key]=(_is_array($val) ? array_map('mysql_real_escape_string',$val) : mysql_real_escape_string($val));
				if($callback!='')
					$data[$key]=call_user_func($callback,$data[$key]);
			}
		}else{
			$ret=mysql_real_escape_string($data);
/*			var_dump($ret);
			print '******';	*/
			return ($callback!='' ? call_user_func($callback,$ret) : $ret);
		}
/*		var_dump($data);
		print '******';*/
		return $data;
	}
	
	/**
	 * Used to strip MIME headers from a contact form field
	 */
	function cleanField($text) {
		$tmp = preg_split('/\r\n|\r|\n/', $text); // split on newlines
		
		// if the input had newlines, looks like an exploit attempt, so fail
		if(sizeof($tmp) > 1)
			return '';
			
		// if input has 
		if(preg_match('/\s*\w+:.*/', $tmp[0]))
			return '';
		/*
		if($emailField) {
			$addresses = explode(',', $data); // split apart multiple addresses
			$data = $addresses[0];
		}
		*/
		return trim($text);
	}
	
	// multiline fields (normally used for message body) can have mime header type notation
	// just strip out the end of message marker
	function cleanMultilineField($text) {
		$tmp = preg_split('/\r\n|\r|\n/', $text);
		$lines = array();
		
		foreach($tmp as $line) {
			if(preg_match('/^\.$/', $line)) // check for single period, which would normally mark the end of the email
				return '';
			else
				$lines[] = $line;
		}
		
		$lines = array_filter($lines);
		return implode("\r\n", $lines);
	}
	
	function cmd_str($cmd=false){
		if(empty($cmd)){
			return false;
		}
		
		switch(strtolower($cmd)){
			case 'del':
				return 'Delete';
			case 'rm':
				return 'Remove';
		}
		
		return ucwords($cmd);
	}
	
	function detect_utf_encoding($content,$is_file=true) {
		global $_;
	
	    $text = ($is_file  ? file_get_contents($content) : $content);
	    $first2 = substr($text, 0, 2);
	    $first3 = substr($text, 0, 3);
	    $first4 = substr($text, 0, 3);
	    	    
	    if ($first3 == $_['charsets']['bom']['utf8']){
	    	
	    	return $_['charsets']['utf8'];
	    	
	    }else if ($first4 == $_['charsets']['bom']['utf32-big-endian']){
	    	
	    	return $_['charsets']['utf32-big-endian'];
	    	
	    }else if ($first4 == $_['charsets']['bom']['utf32-little-endian']){
	    	
	    	return $_['charsets']['utf32-little-endian'];
	    	
	    }else if ($first2 == $_['charsets']['bom']['utf16-big-endian']){
	    	
	    	return $_['charsets']['utf16-big-endian'];
	    	
	    }else if ($first2 == $_['charsets']['bom']['utf16-little-endian']){
	    	
	    	return $_['charsets']['utf16-little-endian'];
	    	
	    }
	    
	    return false;
	}
		
	function err($text){
		return wrap($text,'span','error');
//		return '<span class="error">'.$text.'</span>';
	}

	// ~EN: thank you, Wordpress, for saving me a bunch of time :)    
	function force_balance_tags( $text ) {
		$tagstack = array();
		$stacksize = 0;
		$tagqueue = '';
		$newtext = '';
		$single_tags = array('br', 'hr', 'img', 'input'); // Known single-entity/self-closing tags
		$nestable_tags = array('blockquote', 'div', 'span'); // Tags that can be immediately nested within themselves
	
		// WP bug fix for comments - in case you REALLY meant to type '< !--'
		$text = str_replace('< !--', '<    !--', $text);
		// WP bug fix for LOVE <3 (and other situations with '<' before a number)
		$text = preg_replace('#<([0-9]{1})#', '&lt;$1', $text);
	
		while ( preg_match("/<(\/?[\w:]*)\s*([^>]*)>/", $text, $regex) ) {
			$newtext .= $tagqueue;
	
			$i = strpos($text, $regex[0]);
			$l = strlen($regex[0]);
	
			// clear the shifter
			$tagqueue = '';
			// Pop or Push
			if ( isset($regex[1][0]) && '/' == $regex[1][0] ) { // End Tag
				$tag = strtolower(substr($regex[1],1));
				// if too many closing tags
				if( $stacksize <= 0 ) {
					$tag = '';
					// or close to be safe $tag = '/' . $tag;
				}
				// if stacktop value = tag close value then pop
				else if ( $tagstack[$stacksize - 1] == $tag ) { // found closing tag
					$tag = '</' . $tag . '>'; // Close Tag
					// Pop
					array_pop( $tagstack );
					$stacksize--;
				} else { // closing tag not at top, search for it
					for ( $j = $stacksize-1; $j >= 0; $j-- ) {
						if ( $tagstack[$j] == $tag ) {
						// add tag to tagqueue
							for ( $k = $stacksize-1; $k >= $j; $k--) {
								$tagqueue .= '</' . array_pop( $tagstack ) . '>';
								$stacksize--;
							}
							break;
						}
					}
					$tag = '';
				}
			} else { // Begin Tag
				$tag = strtolower($regex[1]);
	
				// Tag Cleaning
	
				// If self-closing or '', don't do anything.
				if ( substr($regex[2],-1) == '/' || $tag == '' ) {
					// do nothing
				}
				// ElseIf it's a known single-entity tag but it doesn't close itself, do so
				elseif ( in_array($tag, $single_tags) ) {
					$regex[2] .= '/';
				} else {	// Push the tag onto the stack
					// If the top of the stack is the same as the tag we want to push, close previous tag
					if ( $stacksize > 0 && !in_array($tag, $nestable_tags) && $tagstack[$stacksize - 1] == $tag ) {
						$tagqueue = '</' . array_pop ($tagstack) . '>';
						$stacksize--;
					}
					$stacksize = array_push ($tagstack, $tag);
				}
	
				// Attributes
				$attributes = $regex[2];
				if( !empty($attributes) )
					$attributes = ' '.$attributes;
	
				$tag = '<' . $tag . $attributes . '>';
				//If already queuing a close tag, then put this tag on, too
				if ( !empty($tagqueue) ) {
					$tagqueue .= $tag;
					$tag = '';
				}
			}
			$newtext .= substr($text, 0, $i) . $tag;
			$text = substr($text, $i + $l);
		}
	
		// Clear Tag Queue
		$newtext .= $tagqueue;
	
		// Add Remaining text
		$newtext .= $text;
	
		// Empty Stack
		while( $x = array_pop($tagstack) )
			$newtext .= '</' . $x . '>'; // Add remaining tags to close
	
		// WP fix for the bug with HTML comments
		$newtext = str_replace("< !--","<!--",$newtext);
		$newtext = str_replace("<    !--","< !--",$newtext);
	
		return $newtext;
	}

	function formatAvg($avg,$num,$unit='unit',$precision="2"){
		return ($num>0 ? sprintf("%1.".$precision."f",round($avg,$precision)).' | '.$num : 'no').($unit!="" ? ' '.$unit.($num!=1 ? 's' : '') : '');
	}

	function formatDate($when,$now='',$format='F jS, Y'){
		$one_day=86400; //number of seconds in one day
		
		if($now=='')
			$now=time();
		if($now-$when<=$one_day)
			return 'Today';
		else if($now-$when<=2*$one_day)
			return 'Yesterday';

		return date($format,$when);	
	}
	
	function formatPhone($phone,$style=''){
		$ret=array();
		
		if(is_string($phone)){
			for($i=0; $i<strlen($phone); $i++){
				if(is_numeric($phone[$i])){
					$ret[]=intval($phone[$i]);
				}
			}
		}
		
		if(empty($style)){
			$style=false;
		}
		
		$str='';
		
		if(count($ret)==10){ //us phone numbers
			switch($style){
				case '-':
				case '.':
					$str = implode('',array_slice($ret, 0, 3)).$style.implode('',array_slice($ret, 3, 3)).$style.implode('',array_slice($ret, 6));
					break;
				default:
					$str = '('.implode('',array_slice($ret, 0, 3)).') '.implode('',array_slice($ret, 3, 3)).'-'.implode('',array_slice($ret, 6));
					break;
			}
		}
		
		if($str!=''){
			return $str;
		}else if(count($ret)>0){
			return implode('',$ret);
		}
		
		return false;
	}
	
	function formatRating($avg,$num=1){
		return formatAvg($avg,$num,'rating');
	}
	
	function formatSize($size,$precision=2,$sep=' '){
		$base='B'; //"B" for Bytes, "b" for bits
		$units=array($base,'K'.$base,'M'.$base,'G'.$base,'T'.$base,'P'.$base);
		$units_lower=array_map('strtolower',$units);
		
		$size_str=array();
		preg_match("/([0-9]+)[ ]*(".implode("|",$units).'|'.implode('|',$units_lower).")/",$size,$size_str);
		$size=intval($size_str[1]);
		$from=$size_str[2];
		if($from!=''){ //units given are other than bytes
			$size*=pow(1024,intval(array_search((strlen($from)>1 ? $from : $from.$base),$units)));
		}
		
		
		$size=max($size,0);
		$pow=floor(($size ? log($size) : 0)/log(1024));
		$pow=min($pow,count($units)-1);
		
		$size/=pow(1024,$pow);
		
		return round($size,$precision).$sep.$units[$pow];
	}
	
	function formatTime($when,$format='g:iA'){
		return date($format,$when);
	}
	
	function getEnum($active){
		global $_;
		
		switch($active){
			case $_['cfg']['enum']['yes']:
				return 'Yes';
				break;
			case $_['cfg']['enum']['no']:
				return 'No';
				break;			
		}
	}
	
	function get_top_class($obj){
		$class=get_class($obj);
		if($class!==false){
			while(get_parent_class($class)!==false){
				$class=get_parent_class($class);
			}
		}
		
		return $class;
	}
	
	function _htmlentities($str){
		if(empty($str)){
			return $str;
		}
		
		if(is_array($str) && count($str) == 0){
			return $str;
		}
		
		if(_is_array($str)){
			foreach($str as $skey => &$st){
				$st = _htmlentities($st);
			}
			
			return $str;
		}
		
		return htmlentities($str,ENT_COMPAT | ENT_HTML5);
	}
	
	function _htmlspecialchars($str){
		if(empty($str)){
			return $str;
		}
		
		if(is_array($str) && count($str) == 0){
			return $str;
		}
		
		if(_is_array($str)){
			foreach($str as $skey => &$st){
				$st = _htmlspecialchars($st);
			}
			
			return $str;
		}
		
		return htmlspecialchars($str);
	}
	
	function is_html($str){
		return ($str != strip_tags($str));
	}
	
	function _json_encode($json){
	
		$json = json_encode($json);
	
	    return preg_replace_callback(
	        '/(?<=:)"function((?:(?!}").)*}"/',
	        'json_strip_escape',
	        $json
	    );
	}
	 
	function json_strip_escape($string){

	    return str_replace(array('\"','/','"','n','t'),array('"','/','"','',''),substr($string[0],1,-1));
	}
	
	function keyData($data,$callback='strtolower'){
		$search=array(" ");
		$replace=array("_");
		return cleanData($data,$search,$replace,$callback);
	}
	
	function keytoclass($key){
		$ret = '_'.ucfirst($key);
		
		# ~EN (2014): camel-case names separated by dash
		if(strpos($ret, '-') !== false){
			$ret = explode('-', $ret);
			foreach($ret as $rkey => &$r){
				$r = ucfirst($r);
			}
			
			$ret = implode('',$ret);
		}
		
		return $ret;
	}
	
	function minify($str){
		/* ~EN: grr */
		return $str;
		/* remove c-style comments */
		$str = preg_replace('!/\*.*?\*/!s', '', $str);
		/* remove html comments, but leave conditional comments */
		$str = preg_replace('/<!--(?!\s*(?:\[if [^\]]+]|<!|>))(?:(?!-->).)*-->/s','',$str);
		/* remove blank lines */
		$str = preg_replace('/\n\s*\n/', "\n", $str);
	
		return str_replace(array("\n","\t"),'',$str);
	}
	
	function minimise($str){
	 	return minify($str);
	}
	
	function minimize($str){
		return minify($str);
	}
	
	function money($num,$dollar='$'){
		return $dollar.number_format(floatval($num),2);
	}
	
	function pound($val){
		return '#'.$val;
	}
	
	function printChar($num,$ch='+'){
		$ret='';
		for($i=0; $i<$num; $i++)
			$ret.=$ch;
		return $ret;
	}
	
	function printArgs($args,$val=''){
		$ret=''; //return string	
		if($args!='' && is_array($args)){
			$i=0;
			$ret.= (strpos($val,'?')!==false ? '&' : '?');
			$kargs=array(); //arguments with key $key=$val
			$xargs=array(); //extra arguments, not given a name, will be imploded with "|"
			foreach($args as $key2=>$arg){
				if(!is_int($key2)){
					$kargs[]=$key2.'='.$arg;
				}else if($arg!=''){
					$xargs[]=$arg;
				}
			}
			if(count($kargs)>0){
				$ret.=implode('&',$kargs);
				if(count($xargs)>0)
					$ret.= '&';
			}
			if(count($xargs)>0)
				$ret.= implode('|', array_diff($xargs,array('')));
		}else if($args!='' && !is_array($args)){
			$ret.= (strpos($val,'?')!==false ? '?' : '&').$args;
		}
		return $ret;
	}
	
	function printIfExist($val){
		if(isset($val))
			print $val;
	}
	
	// hashes a password
	function _pwd($password,$salt=''){
		global $_;
		
		return sha1(md5($_['cfg']['str']['salt']['password'].$password.$salt));
	}
	
	function rating($num){
		return unit($num,'rating');
	}
	
	function remove_magic_quotes(){
		global $_;
	
		if ( get_magic_quotes_gpc() ) {
			$_['get'] = $_GET = _stripslashes($_GET);
			$_['post'] = $_POST = _stripslashes($_POST);
			$_['cookie'] = $_COOKIE = _stripslashes($_COOKIE);
		}
	}
	
	function size($size,$destUnit=''){ //$size is in bytes
		$base='B'; //"B" for Bytes, "b" for bits
		$units=array($base,'K'.$base,'M'.$base,'G'.$base,'T'.$base,'P'.$base);
		$units_lower=array_map('strtolower',$units);
		$size_str=array();
		preg_match("/([0-9]+)[ ]*(".implode("|",$units).'|'.implode('|',$units_lower).")/",$size,$size_str);
		$size=(!empty($size_str[1]) ? intval($size_str[1]) : $size);
		$from=(empty($size_str[2]) ? $size_str[2] : $base);


		$start=0; $end=0;
		if(!empty($destUnit)){
			foreach(array_merge($units,$units_lower) as $key=>$u){
				if($from==$u)
					$start=$key;
				else if($destUnit==$u)
					$end=$key;
			}
			if(($end-$start)>0){
				for($i=$start; $i<$end; $i++){
					$size=round($size/1024.0,2);
				}
			}
		}else{
			while($size>=1024){
				$start++;
				$size=round($size/1024.0,2);
			}
			$end=$start;
		}
		return (!empty($size) ? $size : 0).' '.(!empty($destUnit) ? applyCase($destUnit,$units[$end]) : $units[$end]);
	}
	
	function slug($str,$replace=array(), $delimiter='-', $charset='ISO-8859-1'){

		if(is_array($str)){

			$str = implode(' ',$str);

			// foreach($str as $skey => &$s){
			// 	$s = slug($s,$replace,$delimiter,$charset);
			// }

			// return $str;

		}

		$_str = iconv($charset, 'UTF-8', $str);

		if(!empty($_str)){
			$str=$_str;
		}
	
		if(!empty($replace)){
			$str = str_replace((array)$replace, ' ', $str);
		}
		
		$_clean = iconv('UTF-8', 'ASCII//TRANSLIT', $str);

		if(!empty($_clean)){
			$clean=$_clean;
		}else{
			$clean=$str;
		}
			
		$clean = preg_replace("/[^a-zA-Z0-9\/_|+ -]/", '', $clean);
		$clean = strtolower(trim($clean, '-'));
		$clean = preg_replace("/[\/_|+ -]+/", $delimiter, $clean);
		
		unset($_str,$_clean);
		
		return $clean;
	}
	
	function slugtoclass($slug){
		return str_replace(' ','',ucwords(str_replace('-',' ',$slug)));
	}
	
	function _stripslashes($value) {
		$value = is_array($value) ? array_map('_stripslashes', $value) : stripslashes($value);
		return $value;
	}
	
	function str_to_num($str){
		if(is_string($str))
			$str=trim($str);
			
		if(!is_numeric($str))
			return false;
			
		if(strpos($str,'.')!==false)
			return doubleval($str);
		else
			return intval($str);
	}
	
	function str_rand($length=10, $scope=array()){
		
		$parts = array(
			'num'	=> "0123456789",
			'lower'	=> 'abcdefghijklmnopqrstuvwxyz',
			'upper'	=> 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
		);
		
		$str = '';
		
		if(!empty($scope)){
			if(is_string($scope) && !empty($parts[$scope])){
				$str = $parts[$scope];
			}else if(is_array($scope)){
				foreach($scope as $skey => $s){
					if($s && !empty($parts[$skey])){
						$str .= $parts[$skey];
					}
				}
			}
		}else{
			$str = implode('',$parts);
		}
		
	    return (empty($str) ? '' : substr(str_shuffle($str), 0, $length));
	}
	
	function success($text){
		return wrap($text,'span','success');
	}
	
	//converts a table name to a class name
	function tabletoclass($tbl){
		return str_replace(' ','',ucwords(singular(str_replace('_',' ',$tbl))));
	}
	
	function tabs($num){
		$ret="";
		for($i=0; $i<$num; $i++){
			$ret.="\t";
		}
		return $ret;
	}
	
	function token($str){
		global $_;
		
		$wrap = $_['cfg']['str']['token']['wrap'];
		
		return $wrap.strtoupper(str_replace(' ','_',$str)).$wrap;
	}
	
	function transDate($date, $format='Y-m-d, g:iA'){
		if($format=='rfc3339'){
			$format='Y-m-dTG:i:s.uP';
		}else if($format=='std')
			$format='Y-m-d, g:iA';
		else if($format=='ary')
			return getdate(strtotime($date));
		return date($format,(is_int($date) ? $date : strtotime($date)));
	}
	
    function _trim($str,$len='',$type=''){ //this version trims HTML, not native PHP trim()
    	if(
    		(!empty($str) && (empty($len) || (!empty($len) && strlen($str) <= $len))) ||
    		empty($str) || !strlen($str) ||
    		(is_array($str) && count($str)==0)
    	){
    		return $str;
    	}
    	
    	if(empty($type)){
	    	$type = (is_string($str) && is_html($str) ? 'html' : 'plain'); // regular php trim
    	}
    		
    	if(_is_array($str)){
	    	foreach($str as $skey => &$st){
    			$st = _trim($st,$len,$type);
	    	}
	    	
	    	return $str;
    	}
    	
    	if($type=='html'){
    		return trim_html($str,$len);
    	}
    	
    	// $len -> charlist
	    return trim($str,$len);

#	    return trim_html($str,$len); (strlen($str)>$len ? trim_html($str,$len) : $str);
    }
    
    function trim_html($html,$len=''){
    	if(empty($len) || !strlen($html))
    		return $html;

	    $printedLength = 0;
	    $position = 0;
	    $tags = array();
	
		ob_start();
	
	    while ($printedLength < $len && preg_match('{</?([a-z]+)[^>]*>|&#?[a-zA-Z0-9]+;}', $html, $match, PREG_OFFSET_CAPTURE, $position))
	    {
	        list($tag, $tagPosition) = $match[0];
	
	        // Print text leading up to the tag.
	        $str = substr($html, $position, $tagPosition - $position);
	        if ($printedLength + strlen($str) > $len)
	        {
	            print(substr($str, 0, $len - $printedLength));
	            $printedLength = $len;
	            break;
	        }
	
	        print($str);
	        $printedLength += strlen($str);
	
	        if ($tag[0] == '&')
	        {
	            // Handle the entity.
	            print($tag);
	            $printedLength++;
	        }
	        else
	        {
	            // Handle the tag.
	            $tagName = $match[1][0];
	            if ($tag[1] == '/')
	            {
	                // This is a closing tag.
	
	                $openingTag = array_pop($tags);
	                assert($openingTag == $tagName); // check that tags are properly nested.
	
	                print($tag);
	            }
	            else if ($tag[strlen($tag) - 2] == '/')
	            {
	                // Self-closing tag.
	                print($tag);
	            }
	            else
	            {
	                // Opening tag.
	                print($tag);
	                $tags[] = $tagName;
	            }
	        }
	
	        // Continue after the tag.
	        $position = $tagPosition + strlen($tag);
	    }
	
	    // Print any remaining text.
	    if ($printedLength < $len && $position < strlen($html))
	        print(substr($html, $position, $len - $printedLength));
	
		//~EN: add ellipses before closing html
		echo ELLIPSES;
		
	    // Close any open tags.
	    while (!empty($tags))
	        printf('</%s>', array_pop($tags));
	        
	    return ob_get_clean();
    }
	
	function uncleanData($data,$search='',$replace='',$callback=''){
		if($search=='')
			$search=array("\'",'\"','\&quot;');
		if($replace=='')
			$replace=array("'",'"','&quot;');
			
		return cleanData($data,$search,$replace,$callback);
	}
	
	function unkeyData($data,$callback='ucwords'){
		$search=array("_");
		$replace=array(" ");
		return cleanData($data,$search,$replace,$callback);
	}
	
	function unit($num,$unit='unit'){
		return $num.' '.plural($unit,$num);
	}
	
	function uuid_to_class($uuid){
		if(empty($uuid)){
			return false;
		}
		
		$type = new _Type(array(FETCH_FROM_DB => true, 'uuid' => $uuid));

		return ($type->found && !empty($type->className) && class_exists($type->className) ? $type->className : false);

	}
	
	function wrap($text,$tag,$class){
		return "<$tag class=\"$class\">$text</$tag>";
	}

?>
