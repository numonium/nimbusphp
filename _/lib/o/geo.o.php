<?php
	/* juniper/lib/geo - descriptions for geographic locations
		(juniper + nimbus) (c) 2012+ numonium //c - all rights reserved	
	*/

	global $_;

	$_['cfg']['load']['convert']['float'][]='geo-lat';
	$_['cfg']['load']['convert']['float'][]='geo-lng';
	
	$_['const']['geo']['gps']['precision'] = 6;

	if(!class_exists('_Geo')){

		class _Geo extends _ {
			var $ip;
			var $ip_info;
			var $ip_private;
			var $ip_public;
			var $host;
			var $host_private; // will contain private ips
			var $host_public; // probably not used
			
			function __construct($data='',$force_init=true){
				global $_;
				
				parent::__construct($data,$force_init);
				
				if(!empty($this->ip)){
					$this->geo_ip_host($this->ip);
				}
			}
			
			// get geographical info from ip address -> will make external request!
			public static function geo_ip($ip=''){
				global $_;
				
				if(empty($ip)){
					if(isset($this) && !empty($this->ip)){
						$ip = $this->ip;
					}else{
				   		return false;
					}					   
				}
				
				//verify the IP address for the  
				ip2long($ip)== -1 || ip2long($ip) === false ? trigger_error("Invalid IP", E_USER_ERROR) : "";
				
				$url = str_replace(array(token('api_key'),token('ip')),array($_['cfg']['api']['ipinfodb']['key'],$ip),$_['cfg']['api']['ipinfodb']['url']);
				
				
				// This notice MUST stay intact for legal use
				$ipDetail=array(); //initialize a blank array
				
				if(!($results = file_get_contents($url))){
					var_dump('!!!',$results);
					die('err[geoip][connect]');
					return false;
				}
				
				$err = explode(';;',$results);
				$ret = array();
				
				if(strtolower($err[0]) != 'ok'){
					die('err[geoip][server-error]');
					return false;
				}
				
				$ret['_'] = $results;
				$ret['status'] = $err[0];
				
				$ret_key = array('ip','country-code','country','state','city','zip','lat','lng','utc');
				$err[1] = explode(';',$err[1]);
				
				foreach($ret_key as $rkkey => $rkval){
					if(!empty($err[1][$rkkey])){
						$ret[$rkval] = $err[1][$rkkey];
						
						if(!in_array($rkval, array('country-code'))){
							$ret[$rkval] = ucwords(strtolower($ret[$rkval]));
						}
					}
				}
				
				return $ret;
				
				//get the XML result from hostip.info
				$xml = file_get_contents("http://api.hostip.info/?ip=".$ip."&position=true");
				
				//get the city name inside the node <gml:name> and </gml:name>
				preg_match("@<Hostip>(\s)*<gml:name>(.*?)</gml:name>@si",$xml,$match);
				
				//assing the city name to the array
				$ipDetail['city'] = (!empty($match[2]) ? $match[2] : false);
				
				//get the country name inside the node <countryName> and </countryName>
				preg_match("@<countryName>(.*?)</countryName>@si",$xml,$matches);
				
				//assign the country name to the $ipDetail array 
				$ipDetail['country']=$matches[1];
				
				//get the country name inside the node <countryName> and </countryName>
				preg_match("@<countryAbbrev>(.*?)</countryAbbrev>@si",$xml,$cc_match);
				$ipDetail['country-code']=$cc_match[1]; //assing the country code to array
				
				$ipDetail['_xml']=$xml;

				return $ipDetail;
			}
			
			// internal function to provide ip identification info -> NOT STATIC
			function geo_ip_host($ip='',$host=''){
				global $_;
				
				if(empty($ip)){
					if(!empty($this->ip)){
						$ip = $this->ip	;
					}else{
						$ip = $_['server']['remote-addr'];
					}
				}
				
				if(empty($this->ip)){
					$this->ip = &$ip;
				}
				
				if(empty($host)){
					$host = (!empty($_['server']['remote-host']) ? $_['server']['remote-host'] : gethostbyaddr($_['server']['remote-addr']));
				}
				
				if(empty($this->host) && !empty($host)){
					$this->host = &$host;
				}

				if(empty($this->ip_public)){
					if($this->is_public_ip($this->ip)){
						$this->ip_public = $this->ip;
						$this->ip = &$this->ip_public;
						
						if(!empty($this->host)){
							$this->host_public = $this->host;
						}
						
					}else if($this->ip_public = $this->get_public_ip($info)){ // will make an external request - be careful!
						if(!empty($this->ip)){
							$this->ip_private = $this->ip;
						}
						
						$this->ip = &$this->ip_public;
						
						if(!empty($info->host)){
							if(!empty($this->host)){
								$this->host_private = $this->host;
							}
							
							$this->host = $this->host_public = $info->host;
						}
					}
				}
				
				if(empty($this->ip_info)){
					$this->ip_info = $this->geo_ip($this->ip);
				}
				
			}
			
			// can supply $info to return all info given by request
			public static function get_public_ip(&$info=array()){
				global $_;
				
				$start = microtime(true);
				
				// the only way to really do this is to connect to a remote host/script
				if(!($info = file_get_contents('http://www.numonium.com/ip'))){
					return false;
				}
				
				$info = json_decode($info);
				
				$end = microtime(true);
				
				return (!empty($info->ip) ? $info->ip : false);
			}
			
			function gps($addr,$api='ms'){
				global $_;
				
				if(isset($addr['lat']) && isset($addr['lng'])){
					$addr['latitude']=$addr['lat'];
					$addr['longitude']=$addr['lng'];
					unset($addr['lat'],$addr['lng']) ;
				}else if(!empty($addr['gps_lat']) && !empty($addr['gps_lng'])){
					$addr['latitude']=$addr['gps_lat'];
					$addr['longitude']=$addr['gps_lng'];
					unset($addr['gps_lat'],$addr['gps_lng']);
				}
				
				if(($api == 'yahoo') || (!empty($addr['latitude']) && !empty($addr['longitude']))){
					$url = str_replace(array("__LAT__","__LNG__","__API_KEY__"),array($addr['latitude'],$addr['longitude'],$_['cfg']['api']['google']['maps']['key']),$_['cfg']['api']['yahoo']['maps']['url']['geocode-reverse']);
					
					@$addr=json_decode(file_get_contents($url));
					
					if($addr){
						$tmp=false;
						$ret=array(
							'_precision'	=> (!empty($addr->Placemark[0]->AddressDetails->Accuracy) ? $addr->Placemark[0]->AddressDetails->Accuracy : false),
							'street'	=> (!empty($addr->Placemark[0]->AddressDetails->Country->AdministrativeArea->SubAdministrativeArea->Locality->Thoroughfare->ThoroughfareName) ? $addr->Placemark[0]->AddressDetails->Country->AdministrativeArea->SubAdministrativeArea->Locality->Thoroughfare->ThoroughfareName : false),
							'city'	=> (!empty($addr->Placemark[0]->AddressDetails->Country->AdministrativeArea->SubAdministrativeArea->Locality->LocalityName) ? $tmp=$addr->Placemark[0]->AddressDetails->Country->AdministrativeArea->SubAdministrativeArea->Locality->LocalityName : false),
							'county'=> (!empty($addr->Placemark[0]->AddressDetails->Country->AdministrativeArea->SubAdministrativeArea->SubAdministrativeAreaName) ? $addr->Placemark[0]->AddressDetails->Country->AdministrativeArea->SubAdministrativeArea->SubAdministrativeAreaName : false),
							'state'	=> (!empty($addr->Placemark[0]->AddressDetails->Country->AdministrativeArea->AdministrativeAreaName) ? $addr->Placemark[0]->AddressDetails->Country->AdministrativeArea->AdministrativeAreaName : false),
							'zip'	=> (!empty($addr->Placemark[0]->AddressDetails->Country->AdministrativeArea->SubAdministrativeArea->Locality->PostalCode->PostalCodeNumber) ? $addr->Placemark[0]->AddressDetails->Country->AdministrativeArea->SubAdministrativeArea->Locality->PostalCode->PostalCodeNumber : false),
							'country_name'	=> (!empty($addr->Placemark[0]->AddressDetails->Country->CountryName) ? $addr->Placemark[0]->AddressDetails->Country->CountryName : false),
							'country'	=> (!empty($addr->Placemark[0]->AddressDetails->Country->CountryNameCode) ? $addr->Placemark[0]->AddressDetails->Country->CountryNameCode : false),
							'lat'	=> round($addr->Placemark[0]->Point->coordinates[1],$_['const']['geo']['gps']['precision']),
							'lng'	=> round($addr->Placemark[0]->Point->coordinates[0],$_['const']['geo']['gps']['precision']),
						);
										
						return $ret;
					}
				}else if($api == 'google'){
					$q = $addr;
					
					if(!empty($q['gps'])){
						unset($q['gps']);
					}
					
					if(!empty($addr['street'])){
						$q['addr'] = $addr['street'];
						unset($q['street']);
					}
					
					if($q['city']!=''){
						$q['addr'] .= (!empty($q['addr']) ? ',' : '').$q['city'];
						unset($q['city']);
					}
		
					if($q['state']!=''){
						$q['addr'].=(!empty($q['addr']) ? ',' : '').$q['state'];
						unset($q['state']);
					}
		
					if($q['zip']!=''){
						$q['addr'].=(!empty($q['addr']) ? ',' : '').$q['zip'];
						unset($q['zip']);
					}
								
					$q = 'addr='.urlencode($q['addr']);
					$url = str_replace(array("__API_KEY__",'__Q__'),array($_['cfg']['api']['google']['geocode']['key'],$q),$_['cfg']['api']['google']['geocode']['url']);
					
					if($xml = simplexml_load_file($url)){
		
						$ret = array(
		//					'_precision'=> sprintf("%s",$xml->Result->attributes()->precision),
							'_warning'	=> (strtolower((string)$xml->status) != 'ok' ? true : false),
							
							'gps'	=> array(
								'lat'		=> (double) $xml->result->geometry->location->lat,
								'lng'		=> (double) $xml->result->geometry->location->lng,
		#						'lat'		=> round((double) $xml->result->geometry->location->lat, $_['const']['geo']['gps']['precision']),
		#						'lng'		=> round((double) $xml->result->geometry->location->lng, $_['const']['geo']['gps']['precision']),
							),
		
							'house'			=> (string) $xml->result->address_component[0]->long_name,
							'street'		=> (string) $xml->result->address_component[2]->short_name,
							'city'			=> (string) $xml->result->address_component[4]->short_name,
							'county'		=> (string) $xml->result->address_component[5]->short_name,
		//					'county-code'	=> (string) $xml->Result->countycode,
							'state'			=> (string) $xml->result->address_component[6]->long_name,
							'state-code'	=> (string) $xml->result->address_component[6]->short_name,
							'country'		=> (string) $xml->result->address_component[7]->long_name,
							'country-code'	=> (string) $xml->result->address_component[7]->short_name,
							'postal'		=> (string) $xml->result->address_component[8]->short_name,
							'zip'			=> (string) $xml->result->address_component[8]->short_name,
							'uzip'			=> (string) $xml->result->address_component[7]->short_name
						);
		
			//			}
							
						return (!empty($ret['gps']['lat']) && !empty($ret['gps']['lng']) ? $ret : false);
					}
				}else if(empty($api) || ($api == 'ms')){
				
		#@					'url'	=> 'http://dev.virtualearth.net/REST/v1/Locations/US/__Q_STATE__/__Q__ZIP__/__Q_CITY__/__Q_ADDR__?o=xml&key=__API_KEY__'
				
					$search = array_map('rawurlencode',array(
						'__Q_COUNTRY__'	=> 'US',
						'__Q_STATE__'	=> (!empty($addr['state']) ? $addr['state'] : false),
						'__Q_ZIP__'		=> (!empty($addr['zip']) ? $addr['zip'] : false),
						'__Q_CITY__'	=> (!empty($addr['city']) ? $addr['city'] : false),
						'__Q_ADDR__'	=> (!empty($addr['street']) ? $addr['street'] : false)
					));
					
					$url = parse_url($_['cfg']['api'][$api]['geocode']['url']);
					$url['_path'] = explode('/',$url['path']);
					
					foreach($url['_path'] as $pkey => $path){
						if(!empty($search[$path])){
							$url['_path'][$pkey] = str_replace('.','',$search[$path]);
						}else if(startsWith($path,'__')){
							unset($url['_path'][$pkey]);
						}
					}
					
					$url['path'] = implode('/',$url['_path']);
					unset($url['_path']);
					
					$url['_'] = str_replace(array('__API_KEY__'),array($_['cfg']['api'][$api]['geocode']['key']),$url['scheme'].'://'.$url['host'].$url['path'].'?'.$url['query']);
								
					if($xml = simplexml_load_file($url['_'])){
		
						$ret = array(
		//					'_precision'=> sprintf("%s",$xml->Result->attributes()->precision),
							'_warning'	=> (strtolower((string)$xml->status) != 'ok' ? true : false),
							
							'gps'	=> array(
								'lat'		=> (double) $xml->ResourceSets->ResourceSet->Resources->Location->Point->Latitude,
								'lng'		=> (double) $xml->ResourceSets->ResourceSet->Resources->Location->Point->Longitude,
		#						'lat'		=> round((double) $xml->result->geometry->location->lat, $_['const']['geo']['gps']['precision']),
		#						'lng'		=> round((double) $xml->result->geometry->location->lng, $_['const']['geo']['gps']['precision']),
							),
		
							'house'			=> array_first(explode(' ',(string)$xml->ResourceSets->ResourceSet->Resources->Location->Address->AddressLine)),
							'street'		=> implode(' ',array_diff_key(explode(' ',(string)$xml->ResourceSets->ResourceSet->Resources->Location->Address->AddressLine),array(0 => ''))),
							'city'			=> (string) $xml->ResourceSets->ResourceSet->Resources->Location->Address->Locality,
							'county'		=> (string) $xml->ResourceSets->ResourceSet->Resources->Location->Address->AdminDistrict2,
		//					'county-code'	=> (string) $xml->Result->countycode,
							'state'			=> (!empty($_['loc']['states'][(string) $xml->ResourceSets->ResourceSet->Resources->Location->Address->AdminDistrict]) ? $_['loc']['states'][(string) $xml->ResourceSets->ResourceSet->Resources->Location->Address->AdminDistrict] : (string) $xml->ResourceSets->ResourceSet->Resources->Location->Address->AdminDistrict),
							'state-code'	=> (string) $xml->ResourceSets->ResourceSet->Resources->Location->Address->AdminDistrict,
							'country'		=> (string) $xml->ResourceSets->ResourceSet->Resources->Location->Address->CountryRegion,
							'country-code'	=> 'US',
							'postal'		=> (string) $xml->ResourceSets->ResourceSet->Resources->Location->Address->PostalCode,
							'zip'			=> (string) $xml->ResourceSets->ResourceSet->Resources->Location->Address->PostalCode,
							'uzip'			=> (string) $xml->ResourceSets->ResourceSet->Resources->Location->Address->PostalCode
						);
							
						return (!empty($ret['gps']['lat']) && !empty($ret['gps']['lng']) ? $ret : false);
					}
				}
				
				return false;
			}
			
			public static function is_private_ip($ip=''){
				global $_;
				
				if(empty($ip)){
					if(empty($this) && !empty(self::$ip)){ // static context
						$ip = self::$ip;
					}else if(!empty($this) && !empty($this->ip)){
						$ip = $this->ip;
					}else{
						return false;
					}
				}
							
			    $pri_addrs = array (
			                      '10.0.0.0|10.255.255.255', // single class A network
			                      '172.16.0.0|172.31.255.255', // 16 contiguous class B network
			                      '192.168.0.0|192.168.255.255', // 256 contiguous class C network
			                      '169.254.0.0|169.254.255.255', // Link-local address also refered to as Automatic Private IP Addressing
			                      '127.0.0.0|127.255.255.255' // localhost
			                     );
			
			    $long_ip = ip2long ($ip);
			    if ($long_ip != -1) {
			
			        foreach ($pri_addrs AS $pri_addr) {
			            list ($start, $end) = explode('|', $pri_addr);
			
			             // IF IS PRIVATE
			             if ($long_ip >= ip2long ($start) && $long_ip <= ip2long ($end)) {
			                 return true;
			             }
			        }
			    }
			
			    return false;
				
			}
			
			public static function is_public_ip($ip=''){
				global $_;
				
				if(empty($this)){ // static
					return !self::is_private_ip($ip);
				}else{ // object
					return !$this->is_private_ip($ip);
				}
			}
				
			public static function reverse($gps,$api='ms'){
				global $_;
				
				if(empty($gps) || !_is_array($gps)){
					return false;
				}
				
				if(empty($gps['lat']) && !empty($gps['latitude'])){
					$gps['lat'] = &$gps['latitude'];
				}
				
				if(empty($gps['lng']) && !empty($gps['longitude'])){
					$gps['lng'] = &$gps['longitude'];
				}
				
				$url = str_replace(array(token('gps_lat'),token('gps_lng'),token('api_key')),array($gps['lat'],$gps['lng'],$_['cfg']['api'][$api]['geocode-reverse']['key']),$_['cfg']['api'][$api]['geocode-reverse']['url']);
				
				if(!($xml = simplexml_load_file($url))){
					return false;
				}
				
				return array(
					'gps'			=> $gps,
					'house'			=> array_first(explode(' ',(string)$xml->ResourceSets->ResourceSet->Resources->Location->Address->AddressLine)),
					'street'		=> implode(' ',array_diff_key(explode(' ',(string)$xml->ResourceSets->ResourceSet->Resources->Location->Address->AddressLine),array(0 => ''))),
					'city'			=> (string) $xml->ResourceSets->ResourceSet->Resources->Location->Address->Locality,
					'county'		=> (string) $xml->ResourceSets->ResourceSet->Resources->Location->Address->AdminDistrict2,
	//					'county-code'	=> (string) $xml->Result->countycode,
					'state'			=> (!empty($_['loc']['states'][(string) $xml->ResourceSets->ResourceSet->Resources->Location->Address->AdminDistrict]) ? $_['loc']['states'][(string) $xml->ResourceSets->ResourceSet->Resources->Location->Address->AdminDistrict] : (string) $xml->ResourceSets->ResourceSet->Resources->Location->Address->AdminDistrict),
					'state-code'	=> (string) $xml->ResourceSets->ResourceSet->Resources->Location->Address->AdminDistrict,
					'country'		=> (string) $xml->ResourceSets->ResourceSet->Resources->Location->Address->CountryRegion,
					'country-code'	=> 'US',
					'postal'		=> (string) $xml->ResourceSets->ResourceSet->Resources->Location->Address->PostalCode,
					'zip'			=> (string) $xml->ResourceSets->ResourceSet->Resources->Location->Address->PostalCode,
					'uzip'			=> (string) $xml->ResourceSets->ResourceSet->Resources->Location->Address->PostalCode
				);
			}
		}
	}
?>