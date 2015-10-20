<?php
	/* juniper/lib/o/router - determines correct route for given URL
		(juniper + nimbus) (c) 2012+ numonium //c - all rights reserved	
		
		Complies with RFC 2616: http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
	*/
	
	class _HTTP extends _Protocol{
		var $id;
		var $ver;
		var $response;
		var $headers_used;
		
		function __construct($ver=''){
			global $_;
			
			$this->id='http';
			
			$this->headers_used = array();
			
			if($ver=='')
				$this->ver=$_['server']['server-protocol']; #typically HTTP/1.1 but just in case
			else
				$this->ver=$ver;
		
			$this->response[100]=$this->ver." 100 Continue";
			$this->response[101]=$this->ver." 101 Switching Protocols";
			$this->response[200]=$this->ver." 200 OK";
			$this->response[201]=$this->ver." 201 Created";
			$this->response[202]=$this->ver." 202 Accepted";
			$this->response[205]=$this->ver." 205 Reset Content";
			$this->response[206]=$this->ver." 206 Partial Content";
			$this->response[300]=$this->ver." 300 Multiple Choices";
			$this->response[301]=$this->ver." 301 Moved Permanently";
			$this->response[302]=$this->ver." 302 Found";
			$this->response[303]=$this->ver." 303 See Other";
			$this->response[304]=$this->ver." 304 Not Modified";
			$this->response[305]=$this->ver." 305 Use Proxy";
			$this->response[306]=$this->ver." 306 Your Choice";
			$this->response[307]=$this->ver." 307 Temporary Redirect";
			$this->response[400]=$this->ver." 400 Bad Request";
			$this->response[401]=$this->ver." 401 Unauthorized";
			$this->response[402]=$this->ver." 402 Payment Required";
			$this->response[403]=$this->ver." 403 Forbidden";
			$this->response[404]=$this->ver." 404 Not Found";
			$this->response[405]=$this->ver." 405 Method Not Allowed";
			$this->response[406]=$this->ver." 406 Not Acceptable";
			$this->response[407]=$this->ver." 407 Proxy Authentication Required";
			$this->response[408]=$this->ver." 408 Request Timeout";
			$this->response[409]=$this->ver." 409 Conflict";
			$this->response[410]=$this->ver." 410 Gone";
			$this->response[411]=$this->ver." 411 Length Required";
			$this->response[412]=$this->ver." 412 Precondition Failed";
			$this->response[413]=$this->ver." 413 Request Entity Too Large";
			$this->response[414]=$this->ver." 414 Request-URI Too Long";
			$this->response[415]=$this->ver." 415 Unsupported Media Type";
			$this->response[416]=$this->ver." 416 Request Range Not Satisfiable";
			$this->response[417]=$this->ver." 417 Expectation Failed";
			$this->response[500]=$this->ver." 500 Internal Server Error";
			$this->response[501]=$this->ver." 501 Not Implemented";
			$this->response[502]=$this->ver." 502 Bad Gateway";
			$this->response[503]=$this->ver." 503 Service Unavailable";
			$this->response[504]=$this->ver." 504 Gateway Timeout";
			$this->response[505]=$this->ver." 505 HTTP Version Not Supported";
		}
		
		function debug_header($response,$val=''){
			global $_;
			
			if(!isset($_['tmp']['header'][$response])){
				$_['tmp']['header'][$response] = 0;
			}
			
			if(empty($val)){
			
				switch(strtolower($response)){
					case 'mem':
					case 'memory':
						$val = 	number_format(memory_get_peak_usage() / 1024 / 1024, 2).' MB';
						break;
					case 'time':
						if(!isset($_['tmp']['header'][$response.'-delta'])){
							$_['tmp']['header'][$response.'-delta'] = 0;
						}
						$val = $_['tmp']['header'][$response.'-delta'] = (microtime(true) - $_['tmp']['header'][$response.'-delta']);
						break;
				}
				
			}
			
			@header('_-debug-'.$response.'-'.($_['tmp']['header'][$response]++).': '.$val);
			
		}
		
		function header($response,$val=''){
			global $_;
			
			switch(strtolower($response)){
				case 'cache-control':
					header('Cache-Control: '.$val);
					break;
				case 'connection':
					header('Connection: '.$val);
					break;
				case 'content-length':
					header('Content-Length: '.$val);
					break;
				case 'content-transfer-encoding':
					header('Content-Transfer-Encoding: '.$val);
					break;
				case 'content-type':
					header("Content-type: ".$val);
					break;
				case 'mem':
				case 'memory':
				case 'time':
					return $this->debug_header($response);
					break;
				case is_int($response):
					if(!empty($this->response[$response])){
						header($this->response[$response]);
					}
					break;
			}
			
			if(!empty($this->headers_used[$response])){
			
				if(is_array($this->headers_used[$response])){
					$this->headers_used[$response][] = $val;
				}else{
					$this->headers_used = array($this->headers_used, $val);
				}
			
			}else{
				$this->headers_used[$response] = array($val);
			}
		}
		
		function headers($responses=''){
			if(_is_array($responses)){
				foreach($responses as $rkey=>$res){
					$this->header($rkey,$res);
				}
				return true;
			}
			return false;
		}
		
		function is_ssl(){
			global $_;
			
			return (!empty($_['server']['https']) && $_['server']['https'] != 'off');
		}
		
		function is_tls(){
			return $this->is_ssl();
		}
		
		function is_https(){
			return $this->is_ssl();
		}
		
		function curl_exec($args,&$mime=''){
			$this->curl_init();
			
			if(!($curl_args = $this->curl_prepare($args))){
				return false;
			}
			
			curl_setopt_array($this->curl, $curl_args);
			
			$ret = curl_exec($this->curl);
			
			if(empty($ret)){
				$ret = curl_error($this->curl);
			}
			
			if(isset($mime)){
				$mime = curl_getinfo($this->curl, CURLINFO_CONTENT_TYPE);
			}
					
			curl_close($this->curl);
			
			return $ret;
		}
		
		function curl_init(){
			if(empty($this->curl))
				$this->curl = curl_init();
		}
		
		function curl_prepare($args){
			global $_;
			
			if(empty($args)){
				return false;
			}
			
			$ret = array();
			
			if(!empty($args['cookie']) || !empty($args['cookies'])){
				$ret[CURLOPT_COOKIESESSION] = true;
			}
			
			if(isset($args['cookie-jar'])){
				if(!empty($args['cookie-jar']) && is_string($args['cookie-jar'])){
					$ret[CURLOPT_COOKIEJAR] = $args['cookie-jar'];
				}else{
					$ret[CURLOPT_COOKIEJAR] = tempnam(sys_get_temp_dir(),'_-tmp--');
				}
				$ret[CURLOPT_COOKIEJAR] = tempnam(sys_get_temp_dir(),'_-tmp--');
			}
			
			if(!empty($args['method'])){
				if(strtolower($args['method']) == 'post'){
					$ret[CURLOPT_POST] = true;
				}else{
					$ret[CURLOPT_HTTPGET] = true;
				}
			}
			
			if(!empty($args['url'])){
				$ret[CURLOPT_URL] = $args['url'];
			}
			
			if(!empty($args['header'])){ # ~EN (2014): whether or not to include http headers in response
				$ret[CURLOPT_HEADER] = $args['header'];
			}
			
			if(!empty($args['headers'])){
				$ret[CURLOPT_HTTPHEADER] = array();
				
				foreach($args['headers'] as $hkey => $header){
					$ret[CURLOPT_HTTPHEADER][] = $hkey.': '.$header;
				}
			}
			
			if(!empty($args['post'])){
				$ret[CURLOPT_POSTFIELDS] = $args['post'];
			}
			
			if(isset($args['follow-location'])){
				$ret[CURLOPT_FOLLOWLOCATION] = $args['follow-location'];
			}
			
			if(isset($args['return-transfer'])){
				$ret[CURLOPT_RETURNTRANSFER] = $args['return-transfer'];
			}
			
			if(!empty($args['ssl'])){
				curl_setopt($this->curl, CURLOPT_SSLVERSION, 3); 
			}
			
			if(!empty($args['cert'])){
				curl_setopt($this->curl, CURLOPT_SSLCERT, getcwd() . "/client.pem"); 
				curl_setopt($this->curl, CURLOPT_SSLKEY, getcwd() . "/keyout.pem"); 
				curl_setopt($this->curl, CURLOPT_CAINFO, getcwd() . "/ca.pem"); 
			}
			
			if(isset($args['ssl-verify-peer'])){
				$ret[CURLOPT_SSL_VERIFYPEER] = $args['ssl-verify-peer'];
			}
			
			if(isset($args['ssl-verify-host'])){
				$ret[CURLOPT_SSL_VERIFYHOST] = $args['ssl-verify-host'];
			}
			
			if(isset($args['verbose'])){
				$ret[CURLOPT_VERBOSE] = $args['verbose'];
			}
			
			if(isset($args['header-out'])){
				$ret[CURLOPT_HEADER_OUT] = $args['header-out'];
			}
			
			if(isset($args['ua'])){
				if(!empty($args['ua'])){
					if(is_string($args['ua'])){
						$ret[CURLOPT_USERAGENT] = $args['ua'];
					}else{
						$ret[CURLOPT_USERAGENT] = $_SERVER['HTTP_USER_AGENT'];
					}				
				}else{
					$ret[CURLOPT_USERAGENT] = $_SERVER['HTTP_USER_AGENT'];
				}
			}
			
			return (!empty($ret) ? $ret : false);
		}
		
		# ~EN (2014): process reponse returned by remote server via curl
		function curl_response($curl,$args,$data='',$context='local'){
			return array(
				'curl'	=> $curl,
				'args'	=> $args,
				'data'	=> $data,
				'context'	=> $context
			);

/*			if(!empty($curl['code'])){
				if($curl['code'] == 200){ // HTTP 200 "OK"
					return array(
						'curl'	=> $curl,
						'args'	=> $args,
						'data'	=> $data,
						'context'	=> $context
					);
				}else if($curl['code'] >= 401 && $curl['code'] <= 403){
					$this->go('login');
				}
			}
			
			return false;*/
		}
		
		# ~EN: determines if the response from the cURL query is valid, status.error == false
		# "$res" - return result from $this->curl_response()
		function curl_response_valid($res){
			global $_;
			
			if(empty($res)){
				return false;
			}else if(_is_array($res) && !empty($res['curl']) && !empty($res['curl']['ret'])){
				$res = $res['curl']['ret'];
			}else if(is_object($res) && !empty($res->curl) && !empty($res->curl->ret)){
				$res = $res->curl->ret;
			}
			
			$json = json_decode($res,true);
						
			return (!empty($json['status']) && !empty($json['status']['code']) && (strtolower($json['status']['code']) == 'success'));
		}
		
		function file_upload($name,$base=''){
			if(empty($base)){
				$base = $_FILES;
			}
			
			if(empty($name) || empty($base)){
				return false;
			}else if(is_object($name)){
				$name = (array) $name;
			}
			
			$ret = false;
			if(is_array($name)){
				/* ~EN (2014): PHP annoyingly re-arranges HTTP POST file names when the input type is a file.
						<input type="file" name="q[ticker][file]" /> -> $_FILES['q']['name/type/tmp_name/error/size/etc.']['ticker']['file']	*/
					
				$ret = array();
				foreach($base as $fkey => $file){
					$ret[$fkey] = array_pick($file,$name);
				}
				
				return (!empty($ret) && (isset($ret['error']) && ($ret['error'] == false)) && !empty($ret['size']) ? $ret : false);
						
			}else if(!empty($base[$name])){			
				/* ~EN (2014): normal PHP file upload
						<input type="file" name="filename" /> -> $_FILES['filename']['name/type/tmp_name/error/size/etc.']	*/

				return $base[$name];
				
/*				$ret = array();
				foreach($base as $fkey => $file){
					if(isset($file[$name])){
						$ret[$fkey] = $file[$name];
					}
				}*/
			}
			
			return $ret;
			
		}
				
		function go($args){
			//process http curl requests here
			
			$this->curl_init();
			
			if(!empty($args['url'])){
				curl_setopt($this->curl, CURLOPT_URL, $args['url']);
			}
			
			if(!empty($args['port'])){
				curl_setopt($this->curl, CURLOPT_PORT , $args['port']); 
			}
			
			if(!empty($args['fields'])){
				curl_setopt($this->curl, CURLOPT_POSTFIELDS, http_build_query($args['fields'])); 
			}
			
			if(!empty($args['ssl'])){
				curl_setopt($this->curl, CURLOPT_SSLVERSION, 3); 
			}
			
			if(!empty($args['cert'])){
				curl_setopt($this->curl, CURLOPT_SSLCERT, getcwd() . "/client.pem"); 
				curl_setopt($this->curl, CURLOPT_SSLKEY, getcwd() . "/keyout.pem"); 
				curl_setopt($this->curl, CURLOPT_CAINFO, getcwd() . "/ca.pem"); 
			}
			
			if(!empty($args['post']) || (!empty($args['method']) && $args['method'] == 'post')){
				curl_setopt($this->curl, CURLOPT_POST, true); 	
			}
			
			curl_setopt($this->curl, CURLOPT_HEADER, true);
			curl_setopt($this->curl, CURLOPT_NOBODY, true);
			curl_setopt($this->curl, CURLOPT_VERBOSE, true); 
			curl_setopt($this->curl, CURLOPT_SSL_VERIFYPEER, true); 
			curl_setopt($this->curl, CURLOPT_RETURNTRANSFER, true);

			curl_setopt ($this->curl, CURLOPT_COOKIEFILE, '.-cookie');			
			curl_setopt ($this->curl, CURLOPT_COOKIEJAR, '.-cookie');
			
			$ret = curl_exec($this->curl);
			
/*			preg_match('/^Set-Cookie: (.*?);/m', $ret, $m);
			
			$headers = parse_url($m[1]);
			
			if(!empty($headers['path'])){
				$headers['_path']=explode('=',$headers['path']);
				
				$_COOKIE[$headers['_path'][0]] = $headers['_path'][1];
			}
						
#			var_dump('@@@',$_COOKIE,parse_url($m[1]));*/
			
			
			curl_close($this->curl);
			
			return $ret;

		}
		
		function json($obj){
			global $_;
			
			if(!headers_sent()){
				$this->header('content-type',$_['mime']['json']);
			}
			
			echo json_encode($obj);
		}
		
		function post($args){
			global $_;
			
			$args['post'] = true;
			$args['method'] = 'post';
			
			return $this->go($args);
		}
	}	
	
	define('HTTP_OK',200);
	define('HTTP_REDIRECT',301);
	define('HTTP_REDIRECT_TEMP',307);
	define('HTTP_BAD',400);
	define('HTTP_NOT_FOUND',404);
?>