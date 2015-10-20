<?php
	/* juniper/lib/m/validator - validation for data types (or form data)
		(juniper + nimbus) (c) 2012+ numonium //c - all rights reserved	
	*/
	
	class _Validator extends _Model {
		var $data;
		var $validation;
		var $_valid;
		var $map;
		
		static $errors = array(
			'bool'				=> 'This must be true',
			'credit_card'		=> 'Please enter a valid credit card',
			'date'				=> 'Please enter a valid date',
			'email'				=> 'Please enter a valid email address',
			'password'			=> 'Please enter a stronger password',
			'phone'				=> 'Please enter a valid phone number',
			'required'			=> 'This field is required',
			'ssn'				=> 'Please enter a valid Social Security number',
			'user_available'	=> 'A user already exists with the credentials you provided',
			'user'				=> 'There is no user with this information',
			'zip'				=> 'Please enter a valid zip code'
		);
		
		function __construct($args='',$force_init=true){
			parent::__construct($args,$force_init);
			
			$this->_valid=true; //no original sin
			
/*			if(func_num_args()>0){
				$this->data=func_get_arg(0);
			}*/
		}
		
		public static function bool($str){
			return _bool($str);
		}
		
		// see if IP is domestic traffic or not - $loose would allow "US + Canada" for "US"
		public static function domestic($ip='',$loose=true){
			global $_;
			
			$geo = false;
			
			if(empty($_['geo'])){
				$_['geo'] = new _Geo();
			}
			
			if(empty($str)){
				$geo = $_['geo'];
			}else{
				$geo = new _Geo(array('ip' => $ip));
			}
			
			if(empty($geo)){
				return false;
			}
			
			if(empty($geo->ip) || empty($geo->ip_info)){
				$geo->geo_ip_host(); // prepare geo ip identification -> external requests
			}
			
			
			if((empty($geo->ip_info['country-code']) || ($geo->ip_info['country-code'] == '-')) && (!filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE))){ # ~EN (2015): is local ip
				$geo->ip_info['country-code'] = '_'; # whitelist	
			}
						
			$allow = array('_','US');
			if(!empty($loose)){
				$allow[] = 'CA';
			}
			
			return (!empty($geo->ip_info) && in_array($geo->ip_info['country-code'],$allow));

		}
		
		public static function email($email=''){
			if(empty($email) && !empty($this) && !empty($this->data['email'])){
				$email=$this->data['email'];
			}else if(empty($email)){
				return false;
			}
		
			return _bool(preg_match('/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/i', $email));
		}
		
		public static function sanitize_email($email=''){
			if(empty($email) && !empty($this) && !empty($this->data['email'])){
				$email=$this->data['email'];
			}else if(empty($email)){
				return false;
			}

		     return _bool(preg_replace( '((?:\n|\r|\t|%0A|%0D|%08|%09)+)i' , '', $email ));
		}
		
		public static function numeric($num=''){
			if(empty($num) && !empty($this) && !empty($this->data['num'])){
				$num=$this->data['num'];
			}else if(empty($num)){
				return false;
			}
			
			return is_numeric($num);
		}
		
		public static function sanitize_numeric($num=''){
			if(empty($num) && !empty($this) && !empty($this->data['num'])){
				$num=$this->data['num'];
			}else if(empty($num)){
				return false;
			}
			
		    #letters and space only
		    return _bool(preg_match('/[^0-9]/', '', $num));
		}
		
		public static function alpha($str='',$only_alpha=false){ //defaults to alphanumeric
			if(empty($str) && !empty($this) && !empty($this->data['str'])){
				$str=$this->data['str'];
			}else if(empty($str)){
				return false;
			}
			
			return (!$only_alpha ? ctype_alnum($str) : ctype_alnum($str));
		}
		
		public static function sanitize_alpha($str='',$only_alpha=false){ //defaults to alphanumeric
			if(empty($str) && !empty($this) && !empty($this->data['str'])){
				$str=$this->data['str'];
			}else if(empty($str)){
				return false;
			}
			
			return _bool(preg_replace('/[^a-zA-Z'.(!$only_alpha ? '0-9' : '').']/', '', $str));
		}
		
		public static function password($data=''){
			/* ~EN: actually make this determine if a password is strong enough */
			return true;
		}
		
		public static function pw_confirm($data='',&$form=''){
			global $_;
			
			/* ~EN (2014): would love to make this actually work, but don't have the time to route through the necessary form obj
							which should be passing through already... grr	*/
			
			if(empty($data)){
				return false;
			}
			
			return true;
		}
		
		public static function url($url=''){
			if(empty($url) && !empty($this) && !empty($this->data['url'])){
				$url=$this->data['url'];
			}else if(empty($url)){
				return false;
			}
			
			return _bool(preg_match('/^(http(s?):\/\/|ftp:\/\/{1})((\w+\.){1,})\w{2,}$/i', $url));
		}
		
		public static function url_exists($url=''){
			if(empty($url) && !empty($this) && !empty($this->data['url'])){
				$url=$this->data['url'];
			}else if(empty($url)){
				return false;
			}
			
			$url = @parse_url($url);
		
			if (!$url)
			{
				return false;
			}
		
			$url = array_map('trim', $url);
			$url['port'] = (!isset($url['port'])) ? 80 : (int)$url['port'];
			$path = (isset($url['path'])) ? $url['path'] : '';
		
			if ($path == '')
			{
				$path = '/';
			}
		
			$path .= (isset($url['query'])) ? '?$url[query]' : '';
		
			if (isset($url['host']) AND $url['host'] != @gethostbyname($url['host']))
			{
				if (PHP_VERSION >= 5)
				{
					$headers = @get_headers('$url[scheme]://$url[host]:$url[port]$path');
				}
				else
				{
					$fp = fsockopen($url['host'], $url['port'], $errno, $errstr, 30);
		
					if (!$fp)
					{
						return false;
					}
					fputs($fp, 'HEAD $path HTTP/1.1\r\nHost: $url[host]\r\n\r\n');
					$headers = fread($fp, 4096);
					fclose($fp);
				}
				$headers = (is_array($headers)) ? implode('\n', $headers) : $headers;
				return _bool(preg_match('#^HTTP/.*\s+[(200|301|302)]+\s#i', $headers));
			}
			return false;
		}
		
		public static function user($data){
			return _User::exists(array('email' => $data));
		}
		
		public static function user_available($data){
			return !_User::exists(array('email' => $data));
		}
		
				
		public static function sanitize_url($url=''){
			if(empty($url) && !empty($this) && !empty($this->data['url'])){
				$url=$this->data['url'];
			}else if(empty($url)){
				return false;
			}
			
			if(function_exists('filter_var')){
				return filter_var($url, FILTER_SANITIZE_URL);
			}
			
			return true; // we can't do this on systems < PHP 5.2
		}
		
		public static function ip($IP=''){
			if(empty($IP) && !empty($this) && !empty($this->data['ip'])){
				$IP=$this->data['ip'];
			}else if(empty($IP) && !empty($this->data['IP'])){
				$IP=$this->data['IP'];
			}else if(empty($IP)){
				return false;
			}
			
			if(function_exists('filter_var')){
				return filter_var($IP, FILTER_VALIDATE_IP);
			}
			
			return _bool(preg_match('/^(([1-9]?[0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]).){3}([1-9]?[0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/',$IP));
		}
		
		public static function proxy(){ //is user behind proxy?
			return ($_SERVER['HTTP_X_FORWARDED_FOR']
			   || $_SERVER['HTTP_X_FORWARDED']
			   || $_SERVER['HTTP_FORWARDED_FOR']
			   || $_SERVER['HTTP_VIA']
			   || in_array($_SERVER['REMOTE_PORT'], array(8080,80,6588,8000,3128,553,554))
			   || @fsockopen($_SERVER['REMOTE_ADDR'], 80, $errno, $errstr, 30));
		}
		
		public static function phone($phone=''){
			if(empty($phone) && !empty($this) && !empty($this->data['phone'])){
				$phone=$this->data['phone'];
			}else if(empty($phone)){
				return false;
			}
		
			return _bool(preg_match('/\(?\d{3}\)?[-\s.]?\d{3}[-\s.]\d{4}/x', $phone));
		}
		
		public static function required($data){
			return !empty($data);
		}
		
		public static function zip($zip=''){
			if(empty($zip) && !empty($this) && !empty($this->data['zip'])){
				$zip=$this->data['zip'];
			}else if(empty($zip)){
				return false;
			}
			
			return _bool(preg_match('/^([0-9]{5})(-*[0-9]{4})?$/i',$zip));
		}
		
		public static function ssn($ssn=''){
			if(empty($ssn) && !empty($this) && !empty($this->data['ssn'])){
				$ssn=$this->data['ssn'];
			}else if(empty($ssn)){
				return false;
			}
			return _bool(preg_match('/^[\d]{3}-*[\d]{2}-*[\d]{4}$/',$ssn));
		}
		
		public static function credit_card($credit_card=''){
			if(empty($credit_card) && !empty($this) && !empty($this->data['credit_card'])){
				$credit_card=$this->data['credit_card'];
			}else if(empty($credit_card) && !empty($this->data['cc'])){
				$credit_card=$this->data['nn'];
			}else if(empty($credit_card) && !empty($this->data['ccnum'])){
				$credit_card=$this->data['ccnum'];
			}else if(empty($credit_card) && !empty($this->data['cc_num'])){
				$credit_card=$this->data['cc_num'];
			}else if(empty($credit_card)){
				return false;
			}
			
			return _bool(preg_match('/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6011[0-9]{12}|3(?:0[0-5]|[68][0-9])[0-9]{11}|3[47][0-9]{13})$/', $credit_card));
		}
		
		public static function date($date='',$format='mdy'){
			if(empty($date) && !empty($this) && !empty($this->data['date'])){
				$date=$this->data['date'];
			}else if(empty($date)){
				return false;
			}
			
			$ret=false;
			switch(strtolower($format)){
				case 'ydm':
					$ret=_bool(preg_match('#^([0-9]?[0-9]?[0-9]{2}[- /.](0?[1-9]|1[012])[- /.](0?[1-9]|[12][0-9]|3[01]))*$#', $date));
				case 'mdy':
				default:
					$ret=_bool(preg_match('/^((0?[1-9]|1[012])[- /.](0?[1-9]|[12][0-9]|3[01])[- /.][0-9]?[0-9]?[0-9]{2})*$/', $date));
					break;
			}
			
			return $ret;
		}
		
		public static function color($color='',$format='hex'){
			if(empty($color) && !empty($this) && !empty($this->data['color'])){
				$color=$this->data['color'];
			}else if(empty($color)){
				return false;
			}
			
			$ret=false;
			switch(strtolower($format)){
				case 'hex':
				default:
					$ret=_bool(preg_match('/^#(?:(?:[a-f0-9]{3}){1,2})$/i', $color));
					break;
			}
			
			return $ret;
		}
		
		function process_map(&$map=''){
			if(empty($map) && !empty($this->map)){
				$map=&$this->map;
			}
			
			foreach($map as $mkey=>&$field){
				$this->validate($field);
#				var_dump('@$$$',$field);
			}
		}
		
		function sanitize_sql($sql=''){
			if(empty($sql) && !empty($this) && !empty($this->data['sql'])){
				$sql=$this->data['sql'];
			}else if(empty($sql)){
				return false;
			}
			
			return is_array($str) ? array_map('sanitize_sql', $sql) : str_replace('\\', '\\\\', htmlspecialchars((get_magic_quotes_gpc() ? stripslashes($sql) : $ql), ENT_QUOTES));
		}
		
		function sanitize($str='',$term='sanitize'){
			if(empty($str) && !empty($this) && _is_array($this->data)){
				foreach($this->data as $key=>&$data){
					if(method_exists($this,(!in_array($term,array('validate')) ? $term.'_' : '').$key)){ //to automatically sanitise $data['email'] as email
						$var=$this->{(!in_array($term,array('validate')) ? $term.'_' : '').$key}($data);
						if($term=='validate'){
							$this->validation[$key]=$var;
						}else{
							$data=$var;
						}
						unset($var);
					}else{
						$data=$this->$term($data);
					}
				}
			}else if($term=='sanitize'){
				return is_array($str) ? array_map('_clean', $str) : str_replace('\\', '\\\\', strip_tags(trim(htmlspecialchars((get_magic_quotes_gpc() ? stripslashes($str) : $str), ENT_QUOTES))));
			}
		}
		
		function validate($str='',&$form,&$results=array()){
			if(empty($str) && !empty($this) && _is_array($this->data)){
				$this->sanitize('','validate');
			}else if(!empty($str) && _is_array($str)){ // was given a map to process
				
				if(empty($form)){ // we need a form or array to compare data
					if(is_object($form)){
						$data = $form->data;
					}else if(_is_array($form)){
						$data = $form;
					}else{
						return false;
					}
				}
				
				// process map - iterate through map
				foreach($str as $skey => &$field){
					$result = $field;
					$result['v'] = array();
					
					if(empty($field['field']) && !empty($field['coords'])){
						$field['field'] = (is_object($form) ? $form->field($field['coords']) : array_pick($data,$field['coords']));
					}
					
					if(!empty($field['v'])){
						if(is_string($field['v'])){
							$field['v'] = explode(',',$field['v']);
						}
						
						foreach($field['v'] as $vkey => $validator){
							if(method_exists($this,$validator)){
							
								# ~EN (2014): realised a little too late that we should pass a reference to the form if called statically
								#				... even though this isn't a static call, PHP says it is :-\
								if(in_array($field['field'], array('pw_confirm'))){
									$var = $this->{$validator}($field['field'],$form);
								}else{						
									$var = $this->{$validator}($field['field']);
								}
								
								if($var===false){
									$this->_valid=false;
									$result['err'][] = $validator;
									
									if(!empty($field['coords'])){
										$results['_err'][implode('--',$field['coords'])] = &$result;
									}else{								
										$results['_err'][] = &$result;
									}
								}
								
								$result['v'][$validator] = $var;
								
							}
						}
					}
					
					$results[] = &$result;
					unset($result);
				}
				
				return (empty($results['_err']) || !count($results['_err']));				

#				return $this->sanitize(&$str,'validate');
			}
			
			return false;
		}
		
		function valid($data=''){
			if(empty($data) && !empty($this) && _is_array($this->data)){
				$this->validate();
			}else if(_is_array($data)){
				
			}
		}
	}
	
	if(!class_exists('Validator')){
		class Validator extends _Validator{
		
		}
	}
?>